import React from 'react';
import { FaMap, FaClock } from "react-icons/fa6";
import { IoTicketSharp } from "react-icons/io5";

const VisitingPlaces = ({ trip }) => {
    // Check if trip data exists and is correctly structured
    if (!trip || !trip.tripData || !trip.tripData.tripData) {
        return <p className='text-gray-600 text-center mt-5'>Loading Your Daily Trip Plan...</p>;
    }

    const itinerary = trip.tripData.tripData.Itinerary;

    if (!itinerary || !Array.isArray(itinerary)) {
        return <p className='text-gray-600 text-center mt-5'>No trip data available.</p>;
    }

    // Grouping places by Day
    const groupByDay = (itinerary) => {
        return itinerary.reduce((acc, place) => {
            acc[place.Day] = acc[place.Day] || [];
            acc[place.Day].push(place);
            return acc;
        }, {});
    };

    const groupedItinerary = groupByDay(itinerary);

    const openGoogleMaps = (placeName) => {
        const mapUrl = `https://www.google.com/maps?q=${placeName}`;
        window.open(mapUrl, '_blank');
    };

    return (
        <div className='mt-10'>
            <h2 className='font-bold text-2xl flex items-center gap-2 mb-4'>
                <FaMap className='text-blue-500' /> Your Itinerary
            </h2>

            <div className='space-y-6 cursor-default'>
                {Object.keys(groupedItinerary).map((day, index) => (
                    <div key={index} className='bg-gray-100 p-4 rounded-lg shadow-md'>
                        <p className='font-bold text-lg text-blue-600'>{day}</p>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2'>
                            {groupedItinerary[day].map((place, placeIndex) => (
                                <div 
                                    key={placeIndex} 
                                    className='border rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer'
                                    onClick={() => openGoogleMaps(place.PlaceName)}
                                >
                                    {/* Place Name */}
                                    <p className='font-semibold text-xl text-gray-800'>{place.PlaceName}</p>

                                    {/* Place Details */}
                                    <p className='text-gray-600 mt-2'>{place.PlaceDetails}</p>

                                    {/* Best Time to Visit */}
                                    <p className='text-gray-600 mt-2 flex items-center gap-2'>
                                        <FaClock className='text-gray-500' /> Best Time: {place.BestTimeToVisit || 'N/A'}
                                    </p>

                                    {/* Ticket Pricing (if available) */}
                                    {place.TicketPricing && (
                                        <p className='text-gray-600 mt-2 flex items-center gap-2'>
                                            <IoTicketSharp className='text-gray-500' /> {place.TicketPricing}
                                        </p>
                                    )}

                                    {/* Travel Time (if available) */}
                                    {place.TravelTime && (
                                        <p className='text-gray-600 mt-2 flex items-center gap-2'>
                                            <FaClock className='text-gray-500' /> {place.TravelTime}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VisitingPlaces;