import React, { useContext } from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthContext } from "../../Context/AuthContext";

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
            const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userInfo.access_token}`, {
                headers: {
                    Authorization: `Bearer ${userInfo.access_token}`,
                    Accept: 'application/json'
                }
            });
            loginUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-full min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e]"
        >
            <div className="text-center">
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-6xl font-extrabold mb-4"
                >
                    Explore The World with AI
                </motion.h1>
                <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold text-white mb-8"
                >
                    Your Personalized Itinerary Awaits
                </motion.h2>
            </div>

            <motion.p 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-center max-w-2xl text-lg text-gray-300 mb-12"
            >
                AI-powered travel planner that tailors trips based on your interests, budget, and travel style.
            </motion.p>

            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 120 }}
            >
                {user ? (
                    <Link to={'/plantrip'}>
                        <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg">
                            Start Planning Now →
                        </Button>
                    </Link>
                ) : (
                    <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg" onClick={login}>
                        Start Planning Now →
                    </Button>
                )}
            </motion.div>

            <motion.div className="mt-16 opacity-100 scale-100">
                <img 
                    src="https://images.unsplash.com/photo-1557652696-0fd8a35b0d62?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Travel AI"
                    className="rounded-xl shadow-lg w-full max-w-[50vw] h-auto object-cover sm:max-w-[70vw] sm:h-[30vh]"
                />
            </motion.div>

        </motion.div>
    );
};

export default Hero;