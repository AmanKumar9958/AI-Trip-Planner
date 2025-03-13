import React, { useEffect, useState } from 'react';
import LocationSearch from '../components/custom/LocationSearch';
import { GiMoneyStack } from "react-icons/gi";
import { FaGlassCheers } from "react-icons/fa";
import { IoIosAirplane } from "react-icons/io";
import { FaHouseChimney } from "react-icons/fa6";
import { GiThreeFriends } from "react-icons/gi";
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const PlanTrip = () => {
    const budget = [
        { icon: <GiMoneyStack size={30} />, budget: "Low", amount: "₹3,000 - ₹5,000" },
        { icon: <GiMoneyStack size={30} />, budget: "Medium", amount: "₹5,000 - ₹10,000" },
        { icon: <GiMoneyStack size={30} />, budget: "High", amount: "₹10,000 - ₹15,000" }
    ];

    const members = [
        { icon: <IoIosAirplane size={30} />, people: "Just Me", },
        { icon: <FaGlassCheers size={30} />, people: "A Couple", },
        { icon: <FaHouseChimney size={30} />, people: "Family", },
        { icon: <GiThreeFriends size={30} />, people: "Friends", }
    ]

    const [formData, setFormData] = useState({});

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };    

    useEffect(() => {

    }, [formData])

    const generateTrip = () => {
        if(!formData?.["Traveling with: "] ||
            !formData?.["No of Days: "] ||
            !formData?.budget ){
            // alert("Enter Trip days less than 10")
            toast.error("Please fill all the details correctly.");
            return;
        }
        toast.success("Trip successfully generated! 🎉");
        console.log(formData);
    }

    return (
        <div className='w-full min-h-screen px-6 py-6 bg-gray-100 flex flex-col items-center'>
            {/* Header Section */}
            <div className='text-center max-w-2xl'>
                <h1 className='text-4xl font-bold text-gray-800 mb-2'>Tell us your preferences ⛺</h1>
                <p className='text-lg text-gray-600'>Provide basic details, and our trip planner will create a customized itinerary for you.</p>
            </div>

            {/* Destination Search */}
            <div className='mt-8 w-full max-w-lg'>
                <h2 className='mb-3 text-lg font-semibold text-gray-700'>Where do you want to go?</h2>
                <LocationSearch onChange={(value) => handleInputChange('Selected Location', value)} />
            </div>

            {/* Trip Duration */}
            <div className='mt-6 w-full max-w-lg'>
                <h2 className='mb-3 text-lg font-semibold text-gray-700'>How many days?</h2>
                <input 
                    type="number" 
                    placeholder='Ex. 3' 
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => handleInputChange('No of Days: ', e.target.value)}
                />
            </div>

            {/* Budget Selection */}
            <div className='mt-6 w-full max-w-lg'>
                <h2 className='mb-3 text-lg font-semibold text-gray-700'>Select your budget</h2>
                <div className='flex flex-wrap gap-4'>
                    {budget.map((item, index) => (
                        <div 
                            key={index} 
                            className={`flex flex-col items-center justify-center w-32 h-28 border-2 rounded-md p-2 
                                    cursor-pointer transition-all duration-300 
                                    hover:shadow-md hover:border-gray-500
                                    ${formData?.budget === item.budget ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-300'}`}
                            onClick={() => handleInputChange('budget', item.budget)}
                        >
                            <div className="text-red-500">{item.icon}</div>
                            <h3 className='text-sm font-semibold mt-2'>{item.budget}</h3>
                            <p className='text-xs text-gray-600'>{item.amount}</p>
                        </div>
                    ))}
                </div>
            </div>



            {/* Member Selection */}
            <div className='mt-6 w-full max-w-lg'>
                <h2 className='mb-3 text-lg font-semibold text-gray-700'>
                    Who do you plan on traveling for your next journey?
                </h2>
                <div className='flex flex-wrap gap-4'>
                    {members.map((item, index) => (
                        <div 
                            key={index} 
                            className={`flex flex-col items-center justify-center w-32 h-28 border-2 rounded-md p-2 
                                cursor-pointer transition-all duration-300 
                                hover:shadow-md hover:border-gray-500
                                ${formData?.["Traveling with: "] === item.people ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-300'}`}
                            onClick={() => handleInputChange("Traveling with: ", item.people)}
                        >
                            <div className="text-red-500">{item.icon}</div>
                            <h3 className='text-sm font-semibold mt-2'>{item.people}</h3>
                            <p className='text-xs text-gray-600'>{item.amount}</p>
                        </div>
                    ))}
                </div>
            </div>


            {/* Generate Button */}
            <div className='mt-6 w-full max-w-lg flex justify-end'>
                <Button onClick={generateTrip}>Generate Trip</Button>
            </div>
        </div>
    );
}

export default PlanTrip;
