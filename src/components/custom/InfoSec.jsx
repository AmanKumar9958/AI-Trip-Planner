import React from 'react'
import { FaRegCalendarAlt } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaLuggageCart } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const InfoSec = ({trip}) => {
    if (!trip || !trip.userSelection) {
        return <p>Loading trip details...</p>;
    }
    return (
        <div>
            {/* Image */}
            <img src="https://media.istockphoto.com/id/1466478193/photo/uninhabited-island.jpg?s=612x612&w=is&k=20&c=EtW44Bb-Lx5cpEgtS51jrADOstfVODKi8noKbPAyYBQ="
            alt="Island"
            className='w-full h-[340px] object-cover rounded-xl'
            />

            {/* Trip Information */}
            <div className='flex gap-4 flex-col mt-4'>
                <div className='flex items-center justify-between py-2'>
                    <h2 className='font-bold text-2xl flex items-center gap-2'><FaLocationDot /> {trip.userSelection.Location}</h2>
                    {/* Share Button */}
                    <div className='flex justify-end'>
                        <button className='bg-blue-500 text-white px-4 py-2 rounded-md'><FaShareAlt /></button>
                    </div>
                </div>
                <div className='flex flex-wrap gap-4 space-x-20'>
                    <p className='text-lg font-semibold rounded-2xl bg-gray-900 px-4 py-1 text-white flex items-center gap-2'><FaRegCalendarAlt />{trip.userSelection.TotalDays}</p>
                    <p className='text-lg font-semibold rounded-2xl bg-gray-900 px-4 py-1 text-white flex items-center gap-2'><GiTakeMyMoney />{trip.userSelection.budget}</p>
                    <p className='text-lg font-semibold rounded-2xl bg-gray-900 px-4 py-1 text-white flex items-center gap-2'><FaLuggageCart />{trip.userSelection.TravelingWith}</p>
                </div>
            </div>
        </div>
    )
}

export default InfoSec