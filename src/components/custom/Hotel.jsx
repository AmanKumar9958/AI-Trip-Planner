import React from 'react';
import { FaHotel, FaMapLocationDot, FaStar } from "react-icons/fa6";

const Hotel = ({ trip }) => {
    if (!trip || !trip.userSelection) {
        return <p>Loading Hotels details...</p>;
    }

    // Function to open Google Maps
    const openGoogleMaps = (HotelName, HotelAddress) => {
        const query = encodeURIComponent(`${HotelName}, ${HotelAddress}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    };

    return (
        <div className='mt-10'>
            <h2 className='font-bold text-2xl flex items-center gap-2'>
                <FaHotel /> Hotel Recommendation
            </h2>

            <div className='flex gap-4 flex-wrap mt-4'>
                {trip.tripData.HotelOptions.map((item, index) => (
                    <div 
                        key={index} 
                        className='flex flex-col border border-gray-300 p-4 rounded-lg w-[300px] shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer'
                        onClick={() => openGoogleMaps(item.HotelName, item.HotelAddress)} // Pass GeoCoordinates array
                    >
                        <img 
                            src={item.HotelImageURL}
                            alt={item.HotelName}
                            className='w-full h-[200px] object-cover rounded-lg'
                        />
                        <div className="mt-3">
                            <p className='font-bold text-lg'>{item.HotelName}</p>
                            <p className='text-sm text-gray-600 flex items-center gap-2'>
                                <FaMapLocationDot className='text-blue-500' />
                                {item.HotelAddress}
                            </p>
                            <p className='text-green-600 font-semibold'>{item.Price}</p>
                            <p className='text-yellow-500 flex items-center gap-1'>
                                <FaStar /> {item.Rating}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Hotel;
