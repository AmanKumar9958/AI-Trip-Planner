import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';
import { FiMapPin, FiUsers, FiClock } from 'react-icons/fi';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getTrips();
    }, []);

    const getTrips = async () => {
        setLoading(true);
        setError(null);
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            navigate('/plantrip');
            return;
        }

        try {
            const q = query(collection(db, 'AI Trips'), where('userEmailID', '==', user.email));
            const querySnapshot = await getDocs(q);
            const tripData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTrips(tripData);
        } catch (err) {
            setError('Failed to fetch trips. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-6 py-6 bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center">
            <div className="max-w-6xl w-full">
                <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-5xl font-extrabold text-center mb-6">
                    My Travel Adventures
                </h1>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, idx) => (
                            <div key={idx} className="bg-gray-900 p-6 rounded-xl animate-pulse">
                                <div className="h-6 bg-gray-800 rounded w-3/4 mb-4" />
                                <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                                <div className="h-4 bg-gray-800 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-400 mb-4 text-xl">⚠️ {error}</p>
                        <button onClick={getTrips} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">
                            Retry
                        </button>
                    </div>
                ) : trips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.map((trip) => (
                            <div 
                                key={trip.id}
                                className="bg-gray-900 p-6 rounded-xl border border-gray-700 transition-all 
                                hover:border-green-400 hover:scale-105 cursor-pointer group relative"
                                onClick={() => navigate(`/trip/${trip.id}`)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 
                                    group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                                    <FiMapPin className="text-green-400" />
                                    {trip.userSelection?.Location || "Unnamed Trip"}
                                </h3>
                                <p className="text-gray-400 flex items-center gap-2 mt-2">
                                    <FiUsers className="text-green-400" />
                                    {trip.userSelection?.TravelingWith || "Solo traveler"}
                                </p>
                                <p className="text-gray-400 flex items-center gap-2 mt-2">
                                    <FiClock className="text-green-400" />
                                    {typeof trip.userSelection?.TotalDays === 'number' && trip.userSelection.TotalDays > 0
                                        ? `${trip.userSelection.TotalDays} Days`
                                        : 'Unknown Duration'}
                                </p>
                                <p className="text-gray-500 text-sm mt-3">Trip ID: {trip.id}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-xl mb-4">
                            No trips found. Let's plan your first adventure!
                        </p>
                        <button
                            onClick={() => navigate('/plantrip')}
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

export default MyTrips;
