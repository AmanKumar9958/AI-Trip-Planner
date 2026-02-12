import React, { useContext } from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthContext } from "../../Context/AuthContext";

const floatingVariants = {
    initial: { y: 0 },
    animate: { y: [0, -15, 0], transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } }
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
        <div className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
            
            {/* Background Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
            </div>

            {/* Floating Travel Icons - Subtle */}
            <Motion.span className="absolute top-20 left-[10%] text-4xl opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer" variants={floatingVariants} initial="initial" animate="animate">✈️</Motion.span>
            <Motion.span className="absolute top-32 right-[15%] text-3xl opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer" variants={floatingVariants} initial="initial" animate="animate">🌍</Motion.span>
            <Motion.span className="absolute bottom-32 left-[15%] text-3xl opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer" variants={floatingVariants} initial="initial" animate="animate">🏕️</Motion.span>
            <Motion.span className="absolute bottom-20 right-[10%] text-4xl opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer" variants={floatingVariants} initial="initial" animate="animate">🎒</Motion.span>

            {/* Main Content */}
            <Motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8 }} 
                className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto"
            >
                <div className="mb-6 inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold tracking-wide uppercase">
                    AI Trip Planner
                </div>

                <Motion.h1 
                    className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight"
                >
                    Explore The World <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                        Smartly with AI
                    </span>
                </Motion.h1>

                <Motion.p 
                    className="max-w-2xl text-lg md:text-xl text-slate-600 mb-10 leading-relaxed"
                >
                    Experience the future of travel planning. Curate personalized itineraries tailored to your interests, budget, and style in seconds.
                </Motion.p>

                <Motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {user ? (
                        <Link to={'/plantrip'}>
                            <Button className="h-14 px-10 rounded-full text-lg font-bold shadow-xl shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700 text-white transition-all">
                                Start Planning Now →
                            </Button>
                        </Link>
                    ) : (
                        <Button 
                            className="h-14 px-10 rounded-full text-lg font-bold shadow-xl shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
                            onClick={login}
                        >
                            Start Planning Now →
                        </Button>
                    )}
                </Motion.div>
            </Motion.div>
        </div>
    );
};

export default Hero;