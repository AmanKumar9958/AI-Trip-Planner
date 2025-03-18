import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTravelPhotos } from '../../Images/unsplash';

const UnsplashImage = () => {
    const [photos, setPhotos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchPhotos = async () => {
        try {
            const data = await getTravelPhotos(15);
            if(data.length > 0) {
            setPhotos(data);
            localStorage.setItem('cachedTravelPhotos', JSON.stringify(data));
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
            // Fallback to cached photos
            const cached = localStorage.getItem('cachedTravelPhotos');
            if(cached) setPhotos(JSON.parse(cached));
        }
        };

        fetchPhotos();
    }, []);

    useEffect(() => {
        if (photos.length > 0) {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % photos.length);
        }, 5000);
        return () => clearInterval(interval);
        }
    }, [photos]);

    if (!photos.length) return null;

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.img
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            src={photos[currentIndex]?.urls?.regular}
            alt={photos[currentIndex]?.alt_description || 'Travel image'}
            className="w-full h-full object-cover absolute inset-0"
        />
        
        {/* Attribution */}
        <div className="absolute bottom-4 right-4 text-white text-sm bg-black/50 px-3 py-1 rounded-lg z-10">
            Photo by{' '}
            <a
            href={`${photos[currentIndex]?.user?.links?.html}?utm_source=TripPlanner&utm_medium=referral`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
            >
            {photos[currentIndex]?.user?.name}
            </a>{' '}
            on{' '}
            <a
            href="https://unsplash.com/?utm_source=TripPlanner&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
            >
            Unsplash
            </a>
        </div>
        </div>
    );
};

export default UnsplashImage;