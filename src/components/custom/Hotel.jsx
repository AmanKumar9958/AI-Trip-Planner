import React from 'react'
import { FaHotel } from "react-icons/fa6";

const Hotel = ({trip}) => {
    if (!trip || !trip.userSelection) {
        return <p>Loading Hotels details...</p>;
    }
    return (
        <div className='mt-10'>
            <h2 className='font-bold text-2xl flex items-center gap-2'><FaHotel /> Hotel Recommendation</h2>

            <div>
                {trip.tripData.HotelOptions.map((item, index) => (
                    <div key={index} className='flex flex-col flex-wrap gap-4 mt-4'>
                        <img src={item.HotelImageURL}
                        alt={item.HotelName}
                        className='w-[30vw] h-[300px] object-cover rounded-xl border-2 border-red-500'
                        />
                        <div>
                            {item.HotelName}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Hotel