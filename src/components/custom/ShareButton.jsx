import React from 'react';
import { FaShareAlt } from "react-icons/fa";

const ShareButton = () => {
    const handleShare = async () => {
        if (navigator.share) {
        try {
            await navigator.share({
            title: 'My App',
            text: 'Check out this awesome app!',
            url: window.location.href,
            });
            console.log('Content shared successfully');
        } catch (error) {
            console.error('Error sharing:', error);
        }
        } else {
        alert('Web Share API not supported in your browser.');
        }
    };

    return (
        <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={handleShare}><FaShareAlt /></button>
    );
};

export default ShareButton;