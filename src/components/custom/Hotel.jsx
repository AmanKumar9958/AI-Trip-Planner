import React from 'react';
import { FaHotel, FaMapLocationDot, FaStar } from "react-icons/fa6";

const Hotel = ({ trip }) => {
    if (!trip || !trip.userSelection) {
        return <p>Loading Hotels details...</p>;
    }

    const openGoogleMaps = (hotelName, hotelAddress) => {
        const query = encodeURIComponent(`${hotelName}, ${hotelAddress}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    };

    return (
        <div className='flex gap-4 flex-wrap mt-4'>
            {Array.isArray(trip.tripData?.tripData?.HotelOptions) && trip.tripData.tripData.HotelOptions.length > 0 ? (
                trip.tripData.tripData.HotelOptions.map((item, index) => (
                    <div 
                        key={index} 
                        className='flex flex-col border border-gray-300 p-4 rounded-lg w-[300px] shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer m-auto'
                        onClick={() => openGoogleMaps(item.HotelName, item.HotelAddress)}
                    >
                        <div className="mt-3 m-auto">
                            <p className='font-bold text-lg'>{item.HotelName}</p>
                            <p className='text-sm text-gray-600 flex items-center gap-2'>
                                <FaMapLocationDot className='text-blue-500' />
                                {item.HotelAddress}
                            </p>
                            <p className='text-green-600 font-semibold'>₹{item.PriceRange}</p>
                            <p className='text-yellow-500 flex items-center gap-1'>
                                <FaStar /> {item.Rating}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p>No hotels available</p>
            )}
        </div>
    )
}

export default Hotel;
