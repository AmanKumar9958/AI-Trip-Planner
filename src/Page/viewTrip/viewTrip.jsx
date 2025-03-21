import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom'; // use react-router-dom instead of react-router
import { db } from '../../Firebase/FirebaseConfig';
import { toast } from 'sonner';
import InfoSec from '../../components/custom/InfoSec';
import Hotel from '../../components/custom/Hotel';

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
            console.log("Document data:", docSnap.data());
            setTrip(docSnap.data());
            toast.success("Trip found!");
        } else {
            console.log("No such document!");
            toast.error("No trip found!");
        }
    };

    return (
        <div className='p-10 md:px-14 lg:px-40 xl:px-56'>
            {/* Information Section */}
            <InfoSec trip={trip} />

            {/* Recommended Hotels */}
            <Hotel trip={trip} />

            {/* Daily Plan */}

            {/* Footer */}
        </div>
    );
};

export default ViewTrip;