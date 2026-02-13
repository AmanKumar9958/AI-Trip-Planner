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
        <div className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-background">
            
            {/* 1. Dynamic Background Patterns */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Polka Dots */}
                <div className="absolute inset-0 opacity-[0.03]" 
                    style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                </div>
                
                {/* Vibrant Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            {/* 2. Floating Sticker Icons (More of them, more vibrant) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {[
                    { icon: '✈️', top: '15%', left: '10%', delay: 0, size: 'text-6xl' },
                    { icon: '🌍', top: '25%', right: '15%', delay: 2, size: 'text-5xl' },
                    { icon: '📷', bottom: '20%', left: '15%', delay: 4, size: 'text-5xl' },
                    { icon: '🍕', bottom: '15%', right: '10%', delay: 1, size: 'text-6xl' },
                    { icon: '🏔️', top: '40%', left: '5%', delay: 3, size: 'text-4xl' },
                    { icon: '🏝️', top: '10%', right: '35%', delay: 5, size: 'text-5xl' },
                ].map((item, index) => (
                    <Motion.div
                        key={index}
                        className={`absolute ${item.size} drop-shadow-lg filter`}
                        style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
                        initial={{ y: 0, rotate: 0 }}
                        animate={{ 
                            y: [0, -20, 0], 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                            duration: 5 + item.delay, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: item.delay 
                        }}
                    >
                        {item.icon}
                    </Motion.div>
                ))}
            </div>

            {/* 3. Main Hero Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <Motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.8, type: 'spring' }} 
                    className="flex flex-col items-center"
                >
                    {/* Badge */}
                    <div className="mb-6 mt-10 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border-2 border-primary/20 shadow-sm text-primary font-bold tracking-wide uppercase text-sm transform hover:scale-105 transition-transform">
                        <span className="text-xl">✨</span> #1 AI Trip Planner
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-foreground leading-[1.1] mb-8 tracking-tight drop-shadow-sm">
                        Discover Your <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent animate-gradient-x">
                            Next Adventure
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="max-w-2xl text-lg md:text-2xl text-muted-foreground mb-10 leading-relaxed font-medium">
                        Build, personalize, and optimize your itineraries in seconds. 
                        The world is big, let <span className="text-secondary-foreground font-bold bg-secondary/20 px-1 rounded-md">AI</span> handle the details.
                    </p>

                    {/* CTA Buttons */}
                    <Motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {user ? (
                            <Link to={'/plantrip'}>
                                <Button className="h-16 px-12 rounded-full text-xl font-bold shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground border-4 border-white/20 transition-all flex items-center gap-3">
                                    Start Your Journey 🚀
                                </Button>
                            </Link>
                        ) : (
                            <Button 
                                className="h-16 px-12 rounded-full text-xl font-bold shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground border-4 border-white/20 transition-all flex items-center gap-3"
                                onClick={login}
                            >
                                Start Your Journey 🚀
                            </Button>
                        )}
                    </Motion.div>
                    
                    {/* User Social Proof / Trust Indicators (Mock) */}
                    <div className="mt-12 flex items-center gap-4 opacity-80 mix-blend-multiply">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold overflow-hidden ${i % 2 === 0 ? 'bg-primary/20' : 'bg-secondary/20'}`}>
                                    👦
                                </div>
                            ))}
                        </div>
                        <div className="text-sm font-semibold text-muted-foreground">
                            Loved by 100+ Travelers
                        </div>
                    </div>

                </Motion.div>
            </div>

            {/* 4. Features Section */}
            <div className="relative z-10 container mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-foreground mb-4">Why TripGenius? 🤔</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We make travel planning as easy as peeling a sticker!
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { 
                            icon: "🧠", 
                            title: "Smart AI Planning", 
                            desc: "Our AI creates perfectly timed itineraries based on your interests and budget.",
                            color: "bg-blue-50 border-blue-100"
                        },
                        { 
                            icon: "🏨", 
                            title: "Curated Hotels", 
                            desc: "Get hotel recommendations that fit your vibe and wallet perfectly.",
                            color: "bg-orange-50 border-orange-100"
                        },
                        { 
                            icon: "📍", 
                            title: "Hidden Gems", 
                            desc: "Discover local favorites and secret spots that tourists usually miss.",
                            color: "bg-green-50 border-green-100"
                        }
                    ].map((feature, index) => (
                        <Motion.div 
                            key={index}
                            whileHover={{ y: -10 }}
                            className={`p-8 rounded-3xl border-2 ${feature.color} shadow-sm hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden group`}
                        >
                            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300 inline-block">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                {feature.desc}
                            </p>
                            {/* Decorative Blob */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-current opacity-5 rounded-full blur-2xl"></div>
                        </Motion.div>
                    ))}
                </div>
            </div>

            {/* 5. How It Works */}
            <div className="relative z-10 px-4 py-24 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-foreground">How It Works 🛠️</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 transform -translate-y-1/2 z-0"></div>

                        {[
                            { step: "1", title: "Share Preferences", desc: "Tell us where, when, and your budget." },
                            { step: "2", title: "AI Magic", desc: "Our algorithm builds your custom plan." },
                            { step: "3", title: "Go Explore", desc: "Pack your bags and enjoy the trip!" }
                        ].map((item, index) => (
                            <div key={index} className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-lg mb-6 border-4 border-white">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;