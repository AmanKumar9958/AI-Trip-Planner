import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';
import { FiMapPin, FiUsers, FiClock, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'sonner';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmingId, setConfirmingId] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getTrips = useCallback(async () => {
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
        } catch {
            setError('Failed to fetch trips. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        getTrips();
    }, [getTrips]);

    const deleteTrip = (tripId, e) => {
        if (e) e.stopPropagation();
        setConfirmingId(tripId);
    };

    const confirmDelete = async (tripId, e) => {
        if (e) e.stopPropagation();
        try {
            await deleteDoc(doc(db, 'AI Trips', tripId));
            setTrips((prev) => prev.filter((t) => t.id !== tripId));
            setConfirmingId(null);
            toast.success('Trip deleted successfully');
        } catch {
            toast.error('Failed to delete trip');
        }
    };

    return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8">
                    My Travel <span className="text-primary">Adventures</span>
                </h1>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, idx) => (
                            <div key={idx} className="h-64 bg-muted rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                        <FiAlertCircle className="mx-auto h-10 w-10 text-destructive mb-4" />
                        <p className="text-muted-foreground mb-4 text-lg">{error}</p>
                        <button onClick={getTrips} className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90">
                            Retry
                        </button>
                    </div>
                ) : trips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trips.map((trip) => (
                            <div 
                                key={trip.id}
                                className="group relative bg-card rounded-2xl shadow-sm hover:shadow-xl border border-border overflow-hidden transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                onClick={() => navigate(`/trip/${trip.id}`)}
                            >
                                {/* Decorative Gradient Header */}
                                <div className="h-32 bg-primary/20 relative flex items-center justify-center">
                                    <span className="text-6xl opacity-20 select-none">✈️</span>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-foreground truncate mb-1">
                                        {trip.userSelection?.Location || "Unknown Destination"}
                                    </h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-4">
                                        Created {new Date().toLocaleDateString()}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-foreground">
                                        <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
                                            <FiClock className="text-primary" />
                                            {trip.userSelection?.TotalDays} Days
                                        </div>
                                        <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
                                            <FiUsers className="text-primary" />
                                            {trip.userSelection?.TravelingWith}
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Action */}
                                <button
                                    onClick={(e) => deleteTrip(trip.id, e)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-sm hover:bg-card text-white hover:text-destructive rounded-full transition-all"
                                >
                                    <FiTrash2 className="w-5 h-5" />
                                </button>

                                {/* Delete Confirmation Overlay */}
                                {confirmingId === trip.id && (
                                    <div 
                                        className="absolute inset-0 bg-card/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <p className="font-semibold text-foreground mb-4">Delete this trip?</p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={(e) => confirmDelete(trip.id, e)}
                                                className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg text-sm font-medium"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setConfirmingId(null); }}
                                                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border">
                        <div className="text-6xl mb-6">🎒</div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No trips yet</h3>
                        <p className="text-muted-foreground mb-8">Time to dust off your passport and start planning!</p>
                        <button
                            onClick={() => navigate('/plantrip')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg shadow-primary/20 transition-all"
                        >
                            Create New Trip
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTrips;