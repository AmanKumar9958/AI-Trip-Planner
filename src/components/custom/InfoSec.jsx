import React from 'react'
import { FaRegCalendarAlt, FaUserFriends, FaMapMarkerAlt } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import ShareButton from './ShareButton';

const InfoSec = ({trip}) => {
    if (!trip || !trip.userSelection) {
        return <div className="h-[300px] bg-slate-100 rounded-xl animate-pulse"></div>;
    }
    return (
        <div className="w-full">
            {/* Hero Image Section */}
            <div className="relative w-full h-[250px] sm:h-[400px] overflow-hidden rounded-3xl shadow-lg group">
                <img 
                    src={'/BG_Image_2.png'}
                    alt="Destination"
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 text-white">
                     <h2 className='font-bold text-3xl sm:text-5xl flex items-center gap-3 drop-shadow-lg'>
                        <FaMapMarkerAlt className="text-indigo-400" /> 
                        {trip.userSelection.Location}
                    </h2>
                </div>
            </div>

            {/* Details Bar */}
            <div className='mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                
                {/* Pills */}
                <div className='flex flex-wrap gap-3'>
                    <div className='flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full border border-slate-200 text-sm font-semibold'>
                        <FaRegCalendarAlt className="text-indigo-500" />
                        <span>{trip.userSelection.TotalDays} Days</span>
                    </div>
                    <div className='flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full border border-slate-200 text-sm font-semibold'>
                        <GiWallet className="text-indigo-500" />
                        <span>{trip.userSelection.budget} Budget</span>
                    </div>
                    <div className='flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full border border-slate-200 text-sm font-semibold'>
                        <FaUserFriends className="text-indigo-500" />
                        <span>{trip.userSelection.TravelingWith}</span>
                    </div>
                </div>

                {/* Action */}
                <div className='flex items-center gap-2'>
                    <ShareButton />
                </div>
            </div>
        </div>
    )
}

export default InfoSec