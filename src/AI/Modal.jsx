import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "../lib/logger";

const apiKey = import.meta.env.VITE_GEMINI_API;
const genAI = new GoogleGenerativeAI(apiKey);

// Allow overriding model via env; default to a broadly supported model on v1beta
// If env not set, fall back to gemini-1.0-pro which is widely available.
const requestedModel = (import.meta.env.VITE_GEMINI_MODEL || "").trim();
const aliasMap = {
    // Map deprecated or account-inaccessible aliases to broadly supported ones (updated for 2026 model availability)
    "gemini-1.5-flash": "gemini-flash-latest",
    "gemini-1.5-pro": "gemini-flash-latest",
    "gemini-1.0-pro": "gemini-flash-latest",
    "gemini-pro": "gemini-flash-latest",
    "gemini-2.0-flash": "gemini-flash-latest" // Fallback if 2.0 is rate limited
};
let modelId = requestedModel || "gemini-1.0-pro";
if (aliasMap[modelId]) {
    logger.warn(`[AI] Mapping requested model '${modelId}' to '${aliasMap[modelId]}' for compatibility.`);
    modelId = aliasMap[modelId];
}
if (!requestedModel) {
    logger.warn(`[AI] Using default model '${modelId}'. Set VITE_GEMINI_MODEL in .env to change.`);
}
logger.info(`[AI] Generative model in use: ${modelId}`);
const model = genAI.getGenerativeModel({ model: modelId });

// Helper: try generating with fallback models to avoid 404s on specific accounts/regions
const candidatesBase = [modelId, "gemini-flash-latest", "gemini-2.0-flash", "gemini-2.5-flash"];
const candidates = Array.from(new Set(candidatesBase));

function is404Like(err) {
    const msg = (err && (err.message || err.toString())) || "";
    return msg.includes(" 404 ") || msg.includes("not found") || msg.includes("Not Found");
}

export async function generateAIResponse(prompt, config = {}) {
    const genCfg = { ...generationConfig, ...config };
    let lastError;
    for (const m of candidates) {
        try {
            // For gemini-1.0-pro, strip responseMimeType as it may not be supported or cause errors
            if (m.includes("1.0")) {
                delete genCfg.responseMimeType;
            }
            const mdl = genAI.getGenerativeModel({ model: m });
            const res = await mdl.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }]}],
                generationConfig: genCfg,
            });
            return res.response?.text?.() ?? "";
        } catch (err) {
            lastError = err;
            if (is404Like(err)) {
                logger.warn(`[AI] Model '${m}' returned 404/not-found. Trying next candidate...`);
                // Try REST v1 endpoint before moving to next candidate
                try {
                    const text = await generateViaRestV1(m, prompt, genCfg);
                    if (text) return text;
                } catch (restErr) {
                    if (is404Like(restErr)) {
                        logger.warn(`[AI] REST v1 with model '${m}' also 404. Moving to next candidate...`);
                    } else {
                        throw restErr;
                    }
                }
                continue;
            }
            throw err;
        }
    }
    // As a final attempt, query available models from the API and try a suitable one
    try {
        const available = await listModelsViaRest();
        const preferred = pickPreferredModel(available);
        if (preferred) {
            logger.info(`[AI] Trying preferred available model from list: ${preferred}`);
            try {
                // Try SDK first for the discovered model
                const mdl = genAI.getGenerativeModel({ model: preferred });
                const res = await mdl.generateContent({
                    contents: [{ role: "user", parts: [{ text: prompt }]}],
                    generationConfig: genCfg,
                });
                return res.response?.text?.() ?? "";
            } catch (sdkErr) {
                if (is404Like(sdkErr)) logger.warn(`[AI] Preferred model not found via SDK, trying REST v1: ${preferred}`);
                // Try REST v1 for the discovered model
                const text = await generateViaRestV1(preferred, prompt, genCfg);
                if (text) return text;
            }
        } else {
            logger.warn('[AI] No suitable models found in ListModels response.');
        }
    } catch (listErr) {
        lastError = listErr;
    }
    throw lastError || new Error("All AI model candidates and discovery attempts failed");
}

async function generateViaRestV1(modelName, prompt, genCfg) {
    // Try v1beta first as it supports more models
    let url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    
    // Strip responseMimeType which REST v1/v1beta may reject from generationConfig or support differently
    const { responseMimeType: _omitResponseMimeType, ...restGenCfg } = genCfg || {};
    const body = {
        contents: [{ role: "user", parts: [{ text: prompt }]}],
        generationConfig: restGenCfg,
    };
    
    let resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    // If v1beta fails with 404, try v1
    if (resp.status === 404) {
        url = `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(apiKey)}`;
        resp = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    }

    if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        const err = new Error(`REST error ${resp.status}: ${text}`);
        if (resp.status === 404) err.message = `404 ${text}`;
        throw err;
    }
    const data = await resp.json();
    const candidate = data?.candidates?.[0];
    const partText = candidate?.content?.parts?.[0]?.text || "";
    return partText;
}

async function listModelsViaRest() {
    // Try v1beta for listing models
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`;
    const resp = await fetch(url);
    if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`ListModels error ${resp.status}: ${text}`);
    }
    const data = await resp.json();
    return Array.isArray(data?.models) ? data.models : [];
}

function pickPreferredModel(models) {
    // Prefer models that support generateContent and look like Gemini models
    const supports = (m) => Array.isArray(m?.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent');
    const name = (m) => m?.name || '';
    const gemini = models.filter((m) => supports(m) && /^models\//.test(name(m)) && name(m).includes('gemini'));
    // Ranking: 1) 1.5 pro/flash latest, 2) 1.0 pro/flash, 3) any gemini with generateContent
    const rank = (n) => {
        const s = n.toLowerCase();
        if (s.includes('1.5') && s.includes('pro')) return 1;
        if (s.includes('1.5') && s.includes('flash')) return 2;
        if (s.includes('1.0') && s.includes('pro')) return 3;
        if (s.includes('1.0') && s.includes('flash')) return 4;
        return 10;
    };
    gemini.sort((a, b) => rank(name(a)) - rank(name(b)));
    const picked = name(gemini[0]);
    // API returns names like 'models/gemini-1.5-pro'; strip 'models/' prefix for SDK
    if (picked && picked.startsWith('models/')) return picked.slice(7);
    return picked || null;
}

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};
export const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { 
                    text: `Generate a detailed travel itinerary for a trip to **{location}** for **{totalDays}** days, traveling with **{traveler}**, with a budget of **{budget}**.

                    The output must be in **strict JSON format** with the **exact key names** as follows:

                    ### **JSON Output Format (DO NOT CHANGE KEY NAMES)**:
                    \`\`\`json
                    {
                        "tripData": {
                            "HotelOptions": [
                                {
                                    "HotelName": "string",
                                    "HotelAddress": "string",
                                    "PriceRange": "number",
                                    "HotelImageURL": "string",
                                    "GeoCoordinates": "string",
                                    "Rating": "number",
                                    "Description": "string"
                                }
                            ],
                            "Itinerary": [
                                {
                                    "Day": "Day 1",
                                    "PlaceName": "string",
                                    "PlaceDetails": "string",
                                    "PlaceImageURL": "string",
                                    "GeoCoordinates": "string",
                                    "TicketPricing": "string",
                                    "TravelTime": "string",
                                    "BestTimeToVisit": "string"
                                },
                                {
                                    "Day": "Day 2",
                                    "PlaceName": "string",
                                    "PlaceDetails": "string",
                                    "PlaceImageURL": "string",
                                    "GeoCoordinates": "string",
                                    "TicketPricing": "string",
                                    "TravelTime": "string",
                                    "BestTimeToVisit": "string"
                                },
                                ...
                                {
                                    "Day": "Day {totalDays}",
                                    "PlaceName": "string",
                                    "PlaceDetails": "string",
                                    "PlaceImageURL": "string",
                                    "GeoCoordinates": "string",
                                    "TicketPricing": "string",
                                    "TravelTime": "string",
                                    "BestTimeToVisit": "string"
                                }
                            ]
                        }
                    }
                    \`\`\`
                    
                    - **Ensure that the itinerary includes exactly {totalDays} days. Do not skip any days.**
                    - **Maintain consistency in format and structure.**
                    - **Do not leave any day empty or missing.**
                    - **Ensure all key names remain unchanged.**
                    - **If a day has multiple activities, list them under the same "Day".**`
                },
            ],
        },
    ],
});
