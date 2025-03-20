import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // use react-router-dom instead of react-router
import { db } from '../../Firebase/FirebaseConfig';
import { toast } from 'sonner';

const ViewTrip = () => {
    const { tripid } = useParams();
    const fetched = useRef(false); // Prevent duplicate calls

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
        } else {
            console.log("No such document!");
            toast.error("No trip found!");
        }
    };

    return <div>ViewTrip: {tripid}</div>;
};

export default ViewTrip;