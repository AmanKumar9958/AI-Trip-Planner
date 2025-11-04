import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from "react-icons/fc";
import { HiMenu, HiX } from "react-icons/hi";
import { AuthContext } from '../../Context/AuthContext';
import ViewTripButton from './ViewTripButton';
import Avatar from './Avatar';

const Header = () => {
    const { user, loginUser, logoutUser } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const login = useGoogleLogin({
        onSuccess: (response) => fetchUserData(response),
        onError: (error) => console.error("Login Error:", error),
    });

    const fetchUserData = async (userInfo) => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userInfo.access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.access_token}`,
                        Accept: 'application/json',
                    },
                }
            );
            loginUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    return (
        <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center space-x-2 group"
                    >
                        <span className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            Trip
                            <span className="text-indigo-600 group-hover:text-gray-900 transition-colors">
                                Genius
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center gap-4">
                        {user ? (
                            <div className="flex justify-center items-center gap-4">
                                <div className="h-10 flex items-center -mt-10">
                                    <ViewTripButton />
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors h-10">
                                    <Avatar src={user.picture} name={user.name} size={44} className="ring-2 ring-indigo-100 shadow-sm" />
                                    <span className="text-md font-medium text-gray-700">{user.name}</span>
                                </div>
                                <Button 
                                    onClick={logoutUser} 
                                    className="h-10 text-sm font-medium text-white hover:text-red-500 border-2 border-red-500 hover:bg-white px-4 py-2 rounded-lg transition-colors bg-red-500"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Button 
                                onClick={login} 
                                className="flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-lg shadow-sm transition-all h-10"
                            >
                                <FcGoogle className="text-lg" />
                                <span className="text-sm font-medium">Sign in with Google</span>
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? (
                            <HiX className="w-6 h-6" />
                        ) : (
                            <HiMenu className="w-6 h-6" />
                        )}
                    </button>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg md:hidden"
                            >
                                <div className="px-4 py-5 space-y-4">
                                    {user ? (
                                        <>
                                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                                <Avatar src={user.picture} name={user.name} size={40} className="ring-2 ring-indigo-100" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <ViewTripButton mobile />
                                            <Button 
                                                onClick={logoutUser}
                                                className="w-full text-sm font-medium bg-red-500 px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Logout
                                            </Button>
                                        </>
                                    ) : (
                                        <Button 
                                            onClick={login}
                                            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg shadow-sm h-10"
                                        >
                                            <FcGoogle className="text-lg" />
                                            <span className="text-sm font-medium">Sign in with Google</span>
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;