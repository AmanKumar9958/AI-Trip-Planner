import React from 'react';
import { FaHotel, FaMapLocationDot, FaStar } from "react-icons/fa6";

const Hotel = ({ trip }) => {
    if (!trip || !trip.userSelection) {
        return <p>Loading Hotels details...</p>;
    }
    const root = (trip?.tripData && (trip.tripData.tripData || trip.tripData)) || {};
    const openGoogleMaps = (hotelName, hotelAddress) => {
        const query = encodeURIComponent(`${hotelName}, ${hotelAddress}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    };

    return (
        <div className='mt-6'>
            {/* Title Section */}
            <h2 className='font-bold text-2xl flex items-center  gap-2 mb-6'>
                <FaHotel className='text-blue-500' />
                Hotel Recommendation
            </h2>

            {/* Hotel List */}
            <div className='flex flex-wrap justify-center gap-6'>
                {Array.isArray(root.HotelOptions) && root.HotelOptions.length > 0 ? (
                    root.HotelOptions.map((item, index) => (
                        <div 
                            key={index} 
                            className='flex flex-col border border-gray-300 p-5 rounded-lg w-[300px] shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer'
                            onClick={() => openGoogleMaps(item.HotelName, item.HotelAddress)}
                        >
                            <div className="text-center">
                                <p className='font-bold text-lg'>{item.HotelName}</p>
                                <p className='text-sm text-gray-600 flex items-center justify-center gap-2 mt-1'>
                                    <FaMapLocationDot className='text-blue-500' />
                                    {item.HotelAddress}
                                </p>
                                <p className='text-green-600 font-semibold mt-2'>₹{item.PriceRange}</p>
                                <p className='text-yellow-500 flex items-center justify-center gap-1 mt-1'>
                                    <FaStar /> {item.Rating}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No hotels available</p>
                )}
            </div>
        </div>
    );
}

export default Hotel;
