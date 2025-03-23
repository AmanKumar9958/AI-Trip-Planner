import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

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
                    text: `Generate a detailed travel itinerary for a trip to **{location}** for **{totalDays}**, traveling with **{traveler}**, with a budget of **{budget}**.

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
                                    "Day": "string",
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
                    
                    - **Ensure that the JSON follows this exact structure.**
                    - **Do not change key names (e.g., 'HotelOptions' should not become 'hotels').**
                    - **Ensure consistency across all responses.**`
                },
            ],
        },
    ],
});
