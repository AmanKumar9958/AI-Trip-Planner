import React, { useContext } from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthContext } from "../../Context/AuthContext";

const floatingVariants = {
    initial: { y: 0 },
    animate: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } }
};

const Hero = () => {
    const { user, loginUser } = useContext(AuthContext);

    const login = useGoogleLogin({
        onSuccess: async (response) => {
            await getUser(response);
        },
        onError: (error) => console.log("Login Error:", error)
    });

    const getUser = async (userInfo) => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userInfo.access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.access_token}`,
                        Accept: 'application/json'
                    }
                }
            );
            loginUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-cyan-500">
            
            {/* Floating Travel Icons */}
            <motion.span className="absolute top-10 left-20 text-5xl" variants={floatingVariants} initial="initial" animate="animate">✈️</motion.span>
            <motion.span className="absolute top-20 right-32 text-4xl" variants={floatingVariants} initial="initial" animate="animate">🌍</motion.span>
            <motion.span className="absolute bottom-10 left-32 text-4xl" variants={floatingVariants} initial="initial" animate="animate">🏕️</motion.span>
            <motion.span className="absolute bottom-20 right-20 text-5xl" variants={floatingVariants} initial="initial" animate="animate">🎒</motion.span>
            <motion.span className="absolute top-1/2 left-1/3 text-4xl" variants={floatingVariants} initial="initial" animate="animate">🚢</motion.span>

            {/* Main Content */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 1 }} 
                className="relative z-10 flex flex-col items-center text-center px-6"
            >
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.2 }} 
                    className="text-white text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg"
                >
                    Explore The World with AI
                </motion.h1>

                <motion.h2 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.4 }} 
                    className="text-2xl md:text-4xl font-semibold text-white mb-6"
                >
                    Your Personalized Itinerary Awaits
                </motion.h2>

                <motion.p 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.6 }} 
                    className="max-w-2xl text-lg text-white mb-10"
                >
                    AI-powered travel planner that tailors trips based on your interests, budget, and travel style.
                </motion.p>

                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ delay: 0.8, type: 'spring', stiffness: 120 }}
                >
                    {user ? (
                        <Link to={'/plantrip'}>
                            <Button className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg transform hover:scale-105 hover:bg-gray-100">
                                Start Planning Now →
                            </Button>
                        </Link>
                    ) : (
                        <Button 
                            className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg transform hover:scale-105 hover:bg-gray-100"
                            onClick={login}
                        >
                            Start Planning Now →
                        </Button>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Hero;
