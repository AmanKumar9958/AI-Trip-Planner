import React, { useEffect, useRef, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom'; // use react-router-dom instead of react-router
import { db } from '../../Firebase/FirebaseConfig';
import { toast } from 'sonner';
import InfoSec from '../../components/custom/InfoSec';
import Hotel from '../../components/custom/Hotel';
import VisitingPlaces from '../../components/custom/VisitingPlaces';

const ViewTrip = () => {
    const { tripid } = useParams();
    const fetched = useRef(false); // Prevent duplicate calls
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        if (tripid && !fetched.current) {
            fetched.current = true;
            getTripData();
        }
    }, [tripid]);

    const getTripData = async () => {
        const docRef = doc(db, 'AI Trips', tripid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setTrip(docSnap.data());
            toast.success("Trip found!");
        } else {
            toast.error("No Trip Found", {
                style: { backgroundColor: "#FF4C4C", color: "white" },
            });
        }
    }
    return (
        <div className='p-10 md:px-14 lg:px-40 xl:px-56'>
            {/* Information Section */}
            <InfoSec trip={trip} />

            {/* Recommended Hotels */}
            <Hotel trip={trip} />

            {/* Daily Plan */}
            <VisitingPlaces trip={trip}/>
        </div>
    )
}

export default ViewTrip