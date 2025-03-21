export const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { 
                    text: `Generate a Travel Plan for Location: Jaipur, India, for 3 days for a Couple with a Cheap budget. 
                    1️⃣ Give me a Hotels list with: 
                        - Hotel Name  
                        - Hotel Address  
                        - Price  
                        - 🌍 Geo Coordinates (Latitude, Longitude)  
                        - ⭐ Rating  
                        - 📜 Description  
                        - 🏨 **Hotel Image URL from a real source** (Official website, Wikipedia, Wikimedia, Unsplash, or other reliable image sources)  
                    
                    2️⃣ Suggest an **Itinerary** for 3 days with:  
                        - 📍 Place Name  
                        - 📝 Place Details  
                        - 🏞️ **Place Image URL from a real source** (Official website, Wikipedia, Wikimedia, Unsplash, or other reliable image sources)  
                        - 🌍 Geo Coordinates  
                        - 🎟️ Ticket Pricing  
                        - ⏳ Travel Time to Location  
                        - 📅 Best Time to Visit  

                    **Return the response in valid JSON format.**`
                }
            ],
        },
    ],
});
