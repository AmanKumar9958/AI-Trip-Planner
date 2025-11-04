import { GiMoneyStack } from "react-icons/gi";
import { FaGlassCheers } from "react-icons/fa";
import { IoIosAirplane } from "react-icons/io";
import { FaHouseChimney } from "react-icons/fa6";
import { GiThreeFriends } from "react-icons/gi";


export const SelectBudget = [
    { icon: <GiMoneyStack size={30} />, budget: "Low", amount: "₹3,000 - ₹5,000" },
    { icon: <GiMoneyStack size={30} />, budget: "Medium", amount: "₹5,000 - ₹10,000" },
    { icon: <GiMoneyStack size={30} />, budget: "High", amount: "₹10,000 - ₹15,000" }
];


export const SelectMembers = [
    { icon: <IoIosAirplane size={30} />, people: "Just Me", },
    { icon: <FaGlassCheers size={30} />, people: "A Couple", },
    { icon: <FaHouseChimney size={30} />, people: "Family", },
    { icon: <GiThreeFriends size={30} />, people: "Friends", }
];

export const AI_PROMPT = `
Generate a detailed travel itinerary for a trip to "{location}" for "{totalDays}" days, traveling with "{traveler}", with a budget of "{budget}".

Return output ONLY as strict JSON with EXACT key names and types as below. Do not include markdown code fences or any extra text.

{
    "tripData": {
        "HotelOptions": [
            {
                "HotelName": "string",
                "HotelAddress": "string",
                "PriceRange": 0,
                "HotelImageURL": "string",
                "GeoCoordinates": "string",
                "Rating": 0,
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
            }
        ]
    }
}

Rules:
- Provide exactly {totalDays} days in Itinerary (Day 1 .. Day {totalDays}).
- Keep all key names exactly as shown.
- Provide at least 3 entries in HotelOptions, with realistic values.
- Do not include any text outside the JSON object.
`;

