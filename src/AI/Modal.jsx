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
