import React from 'react'
import LocationSearch from '../components/custom/LocationSearch'
import { GiMoneyStack } from "react-icons/gi";

const PlanTrip = () => {
    const data = [
        {
            icon: <GiMoneyStack />,
            budget: "Low",
            amount: "3000-5000"
        },
        {
            icon: <GiMoneyStack />,
            budget: "Medium",
            amount: "5000-10000",
        },
        {
            icon: <GiMoneyStack />,
            budget: "High",
            amount: "10000-15000"
        }
    ]

    return (
        <div className='w-full border-2 border-red-500 min-h-screen px-8 pt-4'>
            <div>
                <h1 className='text-4xl font-bold mb-2'>Tell us your preferences</h1>
                <p className='text-lg font-semibold'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your prefrences</p>
            </div>
            <div className='mt-5'>
                <h1 className='mb-3 text-lg'>What is the choice of destination?</h1>
                <LocationSearch />
            </div>
            <div className='mt-5'>
                <h1 className='mb-3 text-lg'>What is the choice of destination?</h1>
                <input type="number" placeholder='Ex.3' className="w-[20vw] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className='mt-5'>
                <h1 className='mb-3 text-lg'>What is your budget?</h1>
                
            </div>
        </div>
    )
}

export default PlanTrip