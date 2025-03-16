import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from "react-icons/fc";
import { HiMenu, HiX } from "react-icons/hi"; // Icons for the hamburger menu

const Header = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [menuOpen, setMenuOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    const login = useGoogleLogin({
        onSuccess: (response) => getUser(response),
        onError: (error) => console.log("Login Error:", error)
    });

    const getUser = (userInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userInfo.access_token}`, {
            headers: {
                Authorization: `Bearer ${userInfo.access_token}`,
                Accept: 'application/json'
            }
        })
        .then((response) => {
            localStorage.setItem('user', JSON.stringify(response.data));
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
    };

    return (
        <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className='flex items-center justify-between px-8 py-4 bg-gradient-to-r from-[#141e30] to-[#243b55] shadow-md'
        >
            {/* Logo */}
            <Link to={'/'} className="text-3xl font-bold text-white">
                Trip<span className="text-cyan-400">Planner</span>
            </Link>

            {/* Desktop Navigation & Auth Buttons */}
            {user ? (
                <div className='hidden md:flex gap-5 items-center'>
                    <div className="flex items-center gap-3">
                        <img 
                            src={user.picture} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full border-2 border-cyan-400 shadow-md"
                        />
                        <span className="text-lg font-semibold text-cyan-400">{user.name}</span>
                    </div>
                    <Button 
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full"
                    >
                        Logout
                    </Button>
                </div>
            ) : (
                // ✅ Fix Sign-In Button Alignment
                <Button 
                    onClick={login}
                    className="hidden md:flex md:items-center md:justify-center bg-cyan-400 text-black hover:scale-105 px-6 py-2 rounded-full gap-2 shadow-lg"
                >
                    <FcGoogle className="text-xl" />
                    Sign In
                </Button>
            )}

            {/* Hamburger Menu Button (Mobile Only) */}
            <button className="md:hidden text-white text-3xl z-50" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <HiX /> : <HiMenu />}
            </button>

            {/* Mobile Menu (Sliding in with Animation) */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 120 }}
                        className="fixed top-0 right-0 h-screen w-64 bg-[#141e30] shadow-lg flex flex-col items-center pt-16 gap-6 md:hidden z-40"
                    >
                        {/* Close Button */}
                        <button 
                            className="absolute top-4 right-4 text-white text-3xl"
                            onClick={() => setMenuOpen(false)}
                        >
                        </button>

                        {/* Mobile User Section */}
                        {user ? (
                            <div className="flex flex-col items-center gap-3">
                                <img 
                                    src={user.picture} 
                                    alt={user.name} 
                                    className="w-12 h-12 rounded-full border-2 border-cyan-400 shadow-md"
                                />
                                <span className="text-lg font-semibold text-cyan-400">{user.name}</span>
                                <Button 
                                    onClick={logout}
                                    className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            // ✅ Show Sign-In button only inside mobile menu
                            <Button 
                                onClick={login}
                                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:scale-105 px-6 py-2 rounded-full flex items-center gap-2 shadow-lg"
                            >
                                <FcGoogle className="text-xl" />
                                Sign In
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Header;
