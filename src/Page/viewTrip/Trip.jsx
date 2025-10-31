import React, { useEffect, useRef, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../../Firebase/FirebaseConfig';
import { toast } from 'sonner';
import InfoSec from '../../components/custom/InfoSec';
import Hotel from '../../components/custom/Hotel';
import VisitingPlaces from '../../components/custom/VisitingPlaces';

const Trip = () => {
    const { tripid } = useParams();
    const fetched = useRef(false);
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        if (tripid && !fetched.current) {
            fetched.current = true;
            getTripData();
        }
    }, [tripid]);

    const getTripData = async () => {
        try {
            const docRef = doc(db, 'AI Trips', tripid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setTrip(docSnap.data());
            } else {
                toast.error("Trip not found");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading trip");
        }
    }

    return (
        <div className='min-h-screen bg-slate-50'>
            {/* The wrapper here ensures consistent padding across different screen sizes 
               consistent with the "SAAS" look (plenty of whitespace).
            */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20'>
                
                {/* Information Header */}
                <InfoSec trip={trip} />

                {/* Hotels Section */}
                <Hotel trip={trip} />

                {/* Itinerary Section */}
                <VisitingPlaces trip={trip}/>
                
            </div>
        </div>
    )
}

export default Trip;