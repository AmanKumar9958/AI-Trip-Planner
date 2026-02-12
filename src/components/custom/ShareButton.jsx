import React from 'react';
import { FaShareAlt } from "react-icons/fa";
import { Button } from '../ui/button'; // Assuming you have shadcn button, otherwise standard button tag

const ShareButton = () => {
    const handleShare = async () => {
        if (navigator.share) {
        try {
            await navigator.share({
            title: 'My Trip Plan',
            text: 'Check out this awesome trip itinerary created with AI Trip Genius!',
            url: window.location.href,
            });
            console.log('Content shared successfully');
        } catch (error) {
            console.error('Error sharing:', error);
        }
        } else {
        alert('Web Share API not supported in your browser. Copy the URL manually!');
        }
    };

    return (
        <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium shadow-md hover:bg-primary/90 hover:shadow-lg transition-all active:scale-95"
        >
            <FaShareAlt />
            Share
        </button>
    );
};

export default ShareButton;