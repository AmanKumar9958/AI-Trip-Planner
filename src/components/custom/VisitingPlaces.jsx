import React from 'react';
import { FaMapMarkerAlt, FaClock, FaTicketAlt } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";

const VisitingPlaces = ({ trip }) => {
    if (!trip || !trip.tripData) {
        return <div className='p-8 text-center text-muted-foreground italic'>Loading Your Daily Trip Plan...</div>;
    }

    const root = trip.tripData.tripData || trip.tripData;
    const itinerary = root.Itinerary;

    if (!itinerary || !Array.isArray(itinerary)) {
        return <div className='p-8 text-center text-muted-foreground'>No detailed itinerary available.</div>;
    }

    const groupByDay = (itinerary) => {
        return itinerary.reduce((acc, place) => {
            acc[place.Day] = acc[place.Day] || [];
            acc[place.Day].push(place);
            return acc;
        }, {});
    };

    const groupedItinerary = groupByDay(itinerary);

    const openGoogleMaps = (placeName) => {
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;
        window.open(mapUrl, '_blank');
    };

    return (
        <div className='mt-16 mb-20'>
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary/20 p-2 rounded-lg">
                     <span className="text-2xl">🗺️</span>
                </div>
                <h2 className='font-bold text-2xl text-foreground'>Places to Visit</h2>
            </div>

            <div className='space-y-12'>
                {Object.keys(groupedItinerary).map((day, index) => (
                    <div key={index} className='relative'>
                        
                        {/* Day Header */}
                        <div className="sticky top-24 z-10 bg-background/95 backdrop-blur-sm py-4 mb-6 border-b border-border">
                             <h3 className='font-bold text-xl md:text-2xl text-primary capitalize'>{day}</h3>
                        </div>
                       
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
                            {groupedItinerary[day].map((place, placeIndex) => (
                                <div 
                                    key={placeIndex} 
                                    className='group relative bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer flex flex-col gap-3'
                                    onClick={() => openGoogleMaps(place.PlaceName)}
                                >
                                    {/* Top Row: Name & Time */}
                                    <div className="flex justify-between items-start">
                                        <h4 className='font-bold text-lg text-foreground group-hover:text-primary transition-colors'>
                                            {place.PlaceName}
                                        </h4>
                                        <span className='text-xs font-semibold bg-muted text-muted-foreground px-2 py-1 rounded-md whitespace-nowrap'>
                                            {place.TravelTime || 'Day Visit'}
                                        </span>
                                    </div>

                                    {/* Details */}
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        {place.PlaceDetails}
                                    </p>

                                    {/* Footer Info */}
                                    <div className="mt-auto pt-4 flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <FaClock className='text-secondary-foreground' /> 
                                            <span>Best Time: {place.BestTimeToVisit || 'Anytime'}</span>
                                        </div>
                                        {place.TicketPricing && (
                                            <div className="flex items-center gap-1.5">
                                                <FaTicketAlt className='text-emerald-500' /> 
                                                <span>{place.TicketPricing}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Map Icon Overlay */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-10 translate-x-2 group-hover:translate-x-0 transition-all">
                                        <FaMapMarkerAlt className="text-6xl text-primary" />
                                    </div>
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