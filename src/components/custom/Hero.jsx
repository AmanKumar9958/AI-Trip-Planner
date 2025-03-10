import React from 'react';
import { Button } from '../ui/button';

const Hero = () => {
    return (
        <div className="max-w-full min-h-screen flex flex-col items-center justify-center p-6">
            {/* Heading */}
            <div className="text-center">
                <h1 className="text-red-500 text-5xl font-bold">
                    Discover Your Next Adventure with AI:
                </h1>
                <h1 className="text-5xl font-bold">
                    Personalized Itineraries At Your Fingertips
                </h1>
            </div>

            {/* Description */}
            <div className="mt-6 text-center max-w-2xl">
                <p className="text-lg font-semibold">
                    Your personalized trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
                </p>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
                <Button className="px-6 py-3 text-lg">Get Started</Button>
            </div>

            {/* Image with Fixed Size */}
            <div className="mt-8">
                <img 
                    src="https://plus.unsplash.com/premium_photo-1738854511313-799f13b4d3ff?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Travel AI" 
                    className="rounded-lg shadow-md w-[40vw] h-[50vh] object-cover"
                />
            </div>
        </div>
    );
};

export default Hero;
