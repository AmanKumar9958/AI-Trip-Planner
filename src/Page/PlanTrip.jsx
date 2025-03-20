import React, { useEffect, useState, useContext } from 'react';
import LocationSearch from '../components/custom/LocationSearch';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { AI_PROMPT, SelectBudget, SelectMembers } from '../Options/options';
import { chatSession } from '../AI/Modal';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../Context/AuthContext';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// Floating travel icons
const floatingIcons = ["⛵", "🏔️", "🗺️", "🌍", "🏕️", "✈️", "🎒"];

const PlanTrip = () => {
    const [formData, setFormData] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const { user, loginUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const login = useGoogleLogin({
        onSuccess: (response) => {
            getUser(response);
        },
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
            loginUser(response.data);
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
    };

    const generateTrip = async () => {
        if (!formData?.["Traveling with: "] ||
            !formData?.["No of Days: "] ||
            !formData?.budget) {
            toast.error("Please fill all the details correctly.", {
                style: { backgroundColor: "#FF4C4C", color: "white" },
            });
            return;
        }
        toast.success("Generating Trip, please wait 🙏");
        setLoading(true);

        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.['Selected Location'] || "Unknown Location")
            .replace('{totalDays}', formData?.["No of Days: "])
            .replace('{traveler}', formData?.["Traveling with: "])
            .replace('{budget}', formData?.budget);

        const result = await chatSession.sendMessage(FINAL_PROMPT);
        console.log(result.response.text());
        toast.success("Trip generated successfully 🎉", {
            style: { backgroundColor: "#4CAF50", color: "white" },
        });

        setLoading(false);

        if (!user) {
            toast.error("No user Found!!");
            setOpenDialog(true);
            return;
        }
    };

    return (
        <div className="relative w-full min-h-screen px-6 py-6 bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center overflow-hidden">
            
            {/* Floating Travel Icons */}
            {floatingIcons.map((icon, index) => (
                <motion.span
                    key={index}
                    className="absolute text-4xl opacity-50"
                    style={{
                        top: `${Math.random() * 100}vh`,
                        left: `${Math.random() * 100}vw`,
                    }}
                    animate={{
                        y: [-10, 10, -10],
                        rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2
                    }}
                >
                    {icon}
                </motion.span>
            ))}

            {/* Header Section */}
            <div className="text-center max-w-2xl relative z-10">
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-5xl font-extrabold mb-4"
                >
                    Tell us your preferences
                </motion.h1>
                <p className="text-lg text-gray-200 font-semibold">
                    Provide basic details, and our AI trip planner will create a customized itinerary for you.
                </p>
            </div>

            {/* Destination Search */}
            <div className="mt-10 w-full max-w-lg">
                <h2 className="mb-3 text-lg font-semibold text-white">Where do you want to go?</h2>
                <LocationSearch onChange={(value) => handleInputChange('Selected Location', value)} />
            </div>

            {/* Trip Duration */}
            <div className="mt-6 w-full max-w-lg">
                <h2 className="mb-3 text-lg font-semibold text-white">How many days?</h2>
                <input 
                    type="number" 
                    placeholder="Ex. 3" 
                    className="w-full p-3 bg-gray-800/40 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                    onChange={(e) => handleInputChange('No of Days: ', e.target.value)}
                />
            </div>

            {/* Budget Selection */}
            <div className="mt-6 w-full max-w-lg">
                <h2 className="mb-3 text-lg font-semibold text-white">Select your budget</h2>
                <div className="flex flex-wrap gap-4">
                    {SelectBudget.map((item, index) => (
                        <div 
                            key={index} 
                            className={`flex flex-col items-center justify-center w-32 h-28 border-2 rounded-lg p-2 
                                cursor-pointer transition-all duration-300 
                                hover:shadow-lg hover:border-blue-400 
                                ${formData?.budget === item.budget ? 'border-blue-500 shadow-xl scale-105 bg-gray-800/50' : 'border-gray-600 bg-gray-800/40'}`}                            
                            onClick={() => handleInputChange('budget', item.budget)}
                        >
                            <div className="text-blue-400 text-2xl">{item.icon}</div>
                            <h3 className="text-sm font-semibold mt-2 text-cyan-300">{item.budget}</h3>
                            <p className="text-xs text-gray-300">{item.amount}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Member Selection */}
            <div className="mt-6 w-full max-w-lg">
                <h2 className="mb-3 text-lg font-semibold text-white">
                    Who do you plan to travel with?
                </h2>
                <div className="flex flex-wrap gap-4">
                    {SelectMembers.map((item, index) => (
                        <div 
                            key={index} 
                            className={`flex flex-col items-center justify-center w-32 h-28 border-2 rounded-lg p-2 
                                cursor-pointer transition-all duration-300 
                                hover:shadow-lg hover:border-blue-400 
                                ${formData?.["Traveling with: "] === item.people ? 'border-blue-500 shadow-xl scale-105 bg-gray-800/50' : 'border-gray-600 bg-gray-800/40'}`}                            
                            onClick={() => handleInputChange("Traveling with: ", item.people)}
                        >
                            <div className="text-blue-400 text-2xl">{item.icon}</div>
                            <h3 className="text-sm font-semibold mt-2 text-cyan-300">{item.people}</h3>
                            <p className="text-xs text-gray-300">{item.amount}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Generate Button */}
            <div className="mt-10 w-full max-w-lg flex justify-center items-center">
                <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button 
                        disable={loading}
                        onClick={generateTrip}
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-black text-md px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 shadow-lg relative"
                    >
                        {loading ? <AiOutlineLoading3Quarters className='animate-spin h-10 w-10' /> : "Generate Trip ✈️"}
                    </Button>
                </motion.div>
            </div>

            {/* Dialog Box */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogContent className='bg-gradient-to-r from-[#141e30] to-[#243b55]'>
                    <DialogTitle>
                        <h1 className="text-3xl font-bold text-white">
                            Trip<span className="text-cyan-400">Planner</span>
                        </h1>
                    </DialogTitle>
                    <DialogContentText>
                        <h1 className='text-white'>Continue with Google</h1>
                        <p className='text-white'>Sign in to the App with Google authentication securely</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions className='bg-gradient-to-r from-[#141e30] to-[#243b55]'>
                    <Button onClick={() => setOpenDialog(false)} className="bg-red-600 hover:bg-red-500 text-white">Cancel</Button>
                    <Button onClick={() => {
                        login();
                        setOpenDialog(false);
                    }}>
                        <FcGoogle />Sign in with Google
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default PlanTrip;