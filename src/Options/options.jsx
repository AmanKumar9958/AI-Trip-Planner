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

export const AI_PROMPT = 'Generate Travel Plan for Location: {location} for {totalDays} days for {traveler} with a {budget} budget, Give me a Hotels options list with Hotel Name, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with place name, place details, place image url, Geo coordinates, ticket pricing, Time to travel each of the location for 3 days plan with best time to visit in JSON format'

