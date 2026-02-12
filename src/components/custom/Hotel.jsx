import React from 'react';
import { FaMapLocationDot, FaStar } from "react-icons/fa6";

const Hotel = ({ trip }) => {
    if (!trip || !trip.userSelection) {
        return <div className="p-4 text-slate-500 animate-pulse">Loading Hotels details...</div>;
    }
    const root = (trip?.tripData && (trip.tripData.tripData || trip.tripData)) || {};
    
    const openGoogleMaps = (hotelName, hotelAddress) => {
        const query = encodeURIComponent(`${hotelName}, ${hotelAddress}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    };

    return (
        <div className='mt-12'>
            {/* Title Section */}
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary/20 p-2 rounded-lg">
                     <span className="text-2xl">🏨</span>
                </div>
                <h2 className='font-bold text-2xl text-foreground'>Hotel Recommendations</h2>
            </div>

            {/* Hotel Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {Array.isArray(root.HotelOptions) && root.HotelOptions.length > 0 ? (
                    root.HotelOptions.map((item, index) => (
                        <div 
                            key={index} 
                            onClick={() => openGoogleMaps(item.HotelName, item.HotelAddress)}
                            className='group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full'
                        >
                            {/* Placeholder Image Div - since logic shouldn't change, we use a colored block or generic image */}
                            <div className="h-40 bg-muted flex items-center justify-center relative overflow-hidden">
                                <span className="text-4xl opacity-20">🏨</span>
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>

                            <div className="p-5 flex flex-col grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className='font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors'>
                                        {item.HotelName}
                                    </h3>
                                    <div className='flex items-center gap-1 bg-secondary/20 px-2 py-1 rounded text-xs font-bold text-secondary-foreground border border-secondary/30'>
                                        <FaStar className="w-3 h-3" /> {item.Rating}
                                    </div>
                                </div>
                                
                                <p className='text-sm text-slate-500 mb-4 flex items-start gap-2 line-clamp-2'>
                                    <FaMapLocationDot className='text-indigo-500 mt-1 shrink-0' />
                                    {item.HotelAddress}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-xs text-slate-400 font-medium">Price Range</span>
                                    <span className='text-indigo-600 font-bold text-lg'>₹{item.PriceRange}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No hotels available for this location.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Hotel;