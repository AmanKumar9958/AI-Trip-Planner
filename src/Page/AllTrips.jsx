import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../Firebase/FirebaseConfig';
import { FiMapPin, FiCalendar, FiUsers, FiDollarSign } from 'react-icons/fi';
import PropTypes from 'prop-types';

const TripCard = ({ trip, onClick }) => (
    <div 
        className="bg-gray-900 p-6 rounded-xl border border-gray-700 transition-all 
                hover:border-green-400 hover:transform hover:scale-[1.02] 
                cursor-pointer group relative overflow-hidden"
        onClick={onClick}
    >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 
                        group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <FiMapPin className="text-green-400" />
            {trip.userSelection?.Location || "Unnamed Trip"}
        </h3>
        <span className="text-xs bg-gray-700 px-3 py-1 rounded-full">
            {trip.userSelection?.TotalDays || '?'} days
        </span>
        </div>

        <div className="space-y-3 text-gray-300">        
        <div className="flex items-center gap-2">
            <FiUsers className="text-green-400" />
            <span>{trip.userSelection?.TravelingWith || 'Solo traveler'}</span>
        </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-sm text-gray-400 truncate">Trip ID: {trip.id}</p>
        </div>
    </div>
    );

    TripCard.propTypes = {
    trip: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
    };

    const AllTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrips = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "AI Trips"));
            const tripList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
            }));
            setTrips(tripList);
        } catch (err) {
            console.error("Error fetching trips:", err);
            setError('Failed to load trips. Please try again later.');
        } finally {
            setLoading(false);
        }
        };

        fetchTrips();
    }, []);

    const handleTripClick = (tripId) => {
        navigate(`/trip/${tripId}`);
    };

    return (
        <div className="relative w-full min-h-screen px-6 py-6 bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center overflow-hidden">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-5xl font-extrabold mb-4">
                Your Travel Adventures
            </h1>
            <p className="text-gray-400 text-lg">
                {trips.length > 0 
                ? `Showing ${trips.length} planned journeys`
                : 'Start planning your next adventure'}
            </p>
            </div>

            {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-gray-900 p-6 rounded-xl animate-pulse">
                    <div className="h-6 bg-gray-800 rounded w-3/4 mb-4" />
                    <div className="space-y-3">
                    <div className="h-4 bg-gray-800 rounded w-full" />
                    <div className="h-4 bg-gray-800 rounded w-2/3" />
                    <div className="h-4 bg-gray-800 rounded w-1/2" />
                    </div>
                </div>
                ))}
            </div>
            ) : error ? (
            <div className="text-center py-12">
                <div className="text-red-400 mb-4 text-xl">⚠️ {error}</div>
                <button 
                onClick={() => window.location.reload()}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                Retry
                </button>
            </div>
            ) : trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                <TripCard
                    key={trip.id}
                    trip={trip}
                    onClick={() => handleTripClick(trip.id)}
                />
                ))}
            </div>
            ) : (
            <div className="text-center py-12">
                <div className="text-gray-400 text-xl mb-4">
                No trips found. Let's plan your first adventure!
                </div>
                <button
                onClick={() => navigate('/')}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl text-lg"
                >
                Start Planning
                </button>
            </div>
            )}
        </div>
        </div>
    );
};

export default AllTrips;