import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from "react-icons/fc";
import { HiMenu, HiX } from "react-icons/hi";
import { AuthContext } from '../../Context/AuthContext';
import ViewTripButton from './ViewTripButton';
import Avatar from './Avatar';

const MotionHeader = motion.header;
const MotionDiv = motion.div;

const Header = () => {
    const { user, loginUser, logoutUser } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (response) => fetchUserData(response),
        onError: (error) => console.error("Login Error:", error),
    });

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

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
        <MotionHeader 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center gap-2 group"
                    >
                        <div className="rounded-lg p-1.5 transition-colors">
                            <span className="text-white font-bold text-xl">
                                <img src="Favicon.svg" alt="Logo" />
                            </span>
                        </div>
                        <span className="text-3xl font-bold text-foreground tracking-tight">
                            Trip<span className="text-primary">Genius</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    <ViewTripButton />
                                </div>
                                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                                <div className="flex items-center gap-3">
                                    <Avatar src={user.picture} name={user.name} size={40} className="ring-2 ring-indigo-100 shadow-sm" />
                                    <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                                </div>
                                <Button 
                                    onClick={handleLogout} 
                                    className="h-10 px-5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 rounded-full transition-all duration-200"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Button 
                                onClick={login} 
                                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                            >
                                <FcGoogle className="text-xl" />
                                <span className="text-sm font-medium">Sign in with Google</span>
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <HiX className="w-7 h-7" /> : <HiMenu className="w-7 h-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <MotionDiv
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                                        <Avatar src={user.picture} name={user.name} size={48} className="ring-2 ring-indigo-50" />
                                        <div>
                                            <p className="font-semibold text-slate-900">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-center py-2">
                                         <ViewTripButton mobile />
                                    </div>
                                    <Button 
                                        onClick={handleLogout}
                                        className="w-full text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 py-3 rounded-xl transition-colors"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Button 
                                    onClick={login}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl shadow-sm"
                                >
                                    <FcGoogle className="text-xl" />
                                    <span className="text-sm font-medium">Sign in with Google</span>
                                </Button>
                            )}
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </MotionHeader>
    );
};

export default Header;