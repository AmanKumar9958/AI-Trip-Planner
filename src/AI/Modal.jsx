const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
    } = require("@google/generative-ai");
    
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
                {text: "Generate Travel Plan for Location: Jaipur, India, for 3 days for Couple with a Cheap budget, Give me a Hotels options list with Hotel Name, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with place name, place details, place image url, Geo coordinates, ticket pricing, Time to travel each of the location for 3 days plan with best time to visit in JSON format"},
            ],
            },
            {
            role: "model",
            parts: [
                {text: "I cannot directly access and display images or real-time pricing for hotels.  Hotel prices fluctuate constantly.  Also, I don't have access to a live image database.  Therefore, I will provide the JSON structure with placeholder URLs and prices that you will need to update with current information from booking sites like Booking.com, Expedia, or MakeMyTrip.  You can also use Google Maps to find geocoordinates and images.\n\n```json\n{\n  \"tripDetails\": {\n    \"location\": \"Jaipur, India\",\n    \"duration\": \"3 Days\",\n    \"travelers\": \"Couple\",\n    \"budget\": \"Cheap\"\n  },\n  \"hotels\": [\n    {\n      \"name\": \"Hotel Name 1\",\n      \"address\": \"Hotel Address 1, Jaipur, India\",\n      \"price\": \"Placeholder Price (e.g., ₹1000/night)\",\n      \"imageUrl\": \"Placeholder Image URL 1\",\n      \"geoCoordinates\": \"[Latitude, Longitude]\",\n      \"rating\": \"3.5\",\n      \"description\": \"Placeholder Description 1 (e.g., Budget-friendly hotel near railway station)\"\n    },\n    {\n      \"name\": \"Hotel Name 2\",\n      \"address\": \"Hotel Address 2, Jaipur, India\",\n      \"price\": \"Placeholder Price (e.g., ₹1200/night)\",\n      \"imageUrl\": \"Placeholder Image URL 2\",\n      \"geoCoordinates\": \"[Latitude, Longitude]\",\n      \"rating\": \"4.0\",\n      \"description\": \"Placeholder Description 2 (e.g., Clean and simple hotel in the city center)\"\n    },\n    {\n      \"name\": \"Hotel Name 3\",\n      \"address\": \"Hotel Address 3, Jaipur, India\",\n      \"price\": \"Placeholder Price (e.g., ₹800/night)\",\n      \"imageUrl\": \"Placeholder Image URL 3\",\n      \"geoCoordinates\": \"[Latitude, Longitude]\",\n      \"rating\": \"3.0\",\n      \"description\": \"Placeholder Description 3 (e.g., Basic guesthouse with dorm options)\"\n    }\n  ],\n  \"itinerary\": {\n    \"day1\": [\n      {\n        \"placeName\": \"Amer Fort\",\n        \"placeDetails\": \"Majestic fort with stunning views\",\n        \"imageUrl\": \"Placeholder Image URL Amer Fort\",\n        \"geoCoordinates\": \"[Latitude, Longitude]\",\n        \"ticketPricing\": \"Placeholder Price (e.g., ₹100 per person)\",\n        \"travelTime\": \"1 hour\"\n      },\n      {\n        \"placeName\": \"Jaigarh Fort\",\n        \"placeDetails\": \"Fort known for its cannons\",\n        \"imageUrl\": \"Placeholder Image URL Jaigarh Fort\",\n        \"geoCoordinates\": \"[Latitude, Longitude]\",\n        \"ticketPricing\": \"Placeholder Price (e.g., ₹75 per person)\",\n        \"travelTime\": \"30 minutes\"\n      }\n    ],\n    \"day2\": [\n      {\n        \"placeName\": \"City Palace\",\n        \"placeDetails\": \"Royal palace with intricate architecture\",\n        \"imageUrl\": \"Placeholder Image URL City Palace\",\n        \"geoCoordinates\": \"[Latitude, Longitude]\",\n        \"ticketPricing\": \"Placeholder Price (e.g., ₹200 per person)\",\n        \"travelTime\": \"1 hour\"\n      },\n      {\n        \"placeName\": \"Hawa Mahal\",\n        \"placeDetails\": \"Palace of Winds\",\n        \"imageUrl\": \"Placeholder Image URL Hawa Mahal\",\n        \"geoCoordinates\": \"[Latitude, Longitude]\",\n        \"ticketPricing\": \"Placeholder Price (e.g., ₹50 per person)\",\n        \"travelTime\": \"15 minutes\"\n      },\n      {\n        \"placeName\": \"Jantar Mantar\",\n        \"placeDetails\": \"Observatory with astronomical instruments\",\n        \"imageUrl\": \"Placeholder Image URL Jantar Mantar\",\n        \"geoCoordinates\": \"[Latitude, Longitude]\",\n        \"ticketPricing\": \"Placeholder Price (e.g., ₹40 per person)\",\n        \"travelTime\": \"30 minutes\"\n      }\n    ],\n    \"day3\": [\n      {\n        \"placeName\": \"Albert Hall Museum\",\n        \"placeDetails\": \"Museum with a wide collection of artifacts\",\n        \"imageUrl\": \"Placeholder Image URL Albert Hall Museum\",\n        \"geoCoordinates\": \"[Latitude, Longitude]\",\n        \"ticketPricing\": \"Placeholder Price (e.g., ₹60 per person)\",\n        \"travelTime\": \"1 hour\"\n      },\n      {\n        \"placeName\": \"Local Market (Bapu Bazaar)\",\n        \"placeDetails\": \"Shopping for handicrafts and textiles\",\n        \"imageUrl\": \"Placeholder Image URL Bapu Bazaar\",\n        \"geoCoordinates\": \"[Latitude, Longitude]\",\n        \"ticketPricing\": \"N/A\",\n        \"travelTime\": \"Variable\"\n      }\n    ]\n  },\n  \"bestTimetoVisit\": \"October to March (pleasant weather)\"\n}\n```\n\nRemember to replace the placeholder values with actual data before using this plan.  Consider using public transport (auto-rickshaws, buses) to keep costs low.  Negotiate prices beforehand with auto-rickshaw drivers.  Enjoy your trip!\n"},
            ],
            },
        ],
        });