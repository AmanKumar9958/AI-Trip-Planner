import React, { useState, useContext } from 'react';
import LocationSearch from '../components/custom/LocationSearch';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { AI_PROMPT, SelectBudget, SelectMembers } from '../Options/options'; // Ensure path is correct
import { generateAIResponse } from '../AI/Modal';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../Context/AuthContext';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../Firebase/FirebaseConfig';
import { useNavigate } from 'react-router';

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

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

    const navigate = useNavigate();

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
            setOpenDialog(false); // Close dialog on success
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
    };

    const generateTrip = async () => {
        if (!user) {
            setOpenDialog(true);
            return;
        }

        if (!formData?.["TravelingWith"] || !formData?.["TotalDays"] || !formData?.budget || !formData?.Location) {
            toast.error("Please fill all the details correctly.");
            return;
        }

        toast.success("Generating Trip, please wait 🙏");
        setLoading(true);
        try {
            const FINAL_PROMPT = AI_PROMPT
                .replace('{location}', formData?.['Location'] || "Unknown Location")
                .replace('{totalDays}', formData?.["TotalDays"])
                .replace('{traveler}', formData?.["TravelingWith"])
                .replace('{budget}', formData?.budget);

            const text = await generateAIResponse(FINAL_PROMPT);
            const json = safeParseJSON(text);
            await saveTripData(json);
            toast.success("Trip generated successfully 🎉");
        } catch (err) {
            console.error("Error generating trip:", err);
            toast.error("Failed to generate trip. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const saveTripData = async (TripData) => {
        const docID = Date.now().toString();
        const users = JSON.parse(localStorage.getItem('user'));
        const normalized = normalizeTripData(TripData);

        await setDoc(doc(db, "AI Trips", docID), {
            userSelection: { 
                ...formData,
                TotalDays: Number(formData?.TotalDays) || 0,
            },
            tripData: normalized,
            userEmailID: users.email,
            id: docID,
        });
        navigate('/trip/' + docID)
    }

    function safeParseJSON(text) {
        try {
            return JSON.parse(text);
        } catch {
            const cleaned = text.replace(/^```(json)?/gi, '').replace(/```$/g, '').trim();
            try { return JSON.parse(cleaned); } 
            catch {
                const start = cleaned.indexOf('{');
                const end = cleaned.lastIndexOf('}');
                if (start !== -1 && end !== -1 && end > start) {
                    return JSON.parse(cleaned.slice(start, end + 1));
                }
                throw new Error('AI did not return valid JSON');
            }
        }
    }

    function normalizeTripData(data) {
        let payload = data;
        if (typeof payload === 'string') {
            try { payload = JSON.parse(payload); } catch { payload = {}; }
        }
        const root = payload && typeof payload === 'object' ? payload : {};
        const inner = root && root.tripData && typeof root.tripData === 'object' ? root.tripData : root;

        const pickArray = (obj, candidates) => {
            if (!obj || typeof obj !== 'object') return [];
            const lcMap = Object.fromEntries(Object.keys(obj).map(k => [k.toLowerCase(), k]));
            for (const cand of candidates) {
                const hit = lcMap[cand.toLowerCase()];
                if (hit && Array.isArray(obj[hit])) return obj[hit];
            }
            return [];
        };

        const hotels = pickArray(inner, ['HotelOptions', 'Hotels', 'HotelList', 'hotels', 'hotelOptions']);
        const itinerary = pickArray(inner, ['Itinerary', 'DailyPlan', 'Plan', 'itinerary']);

        const normHotels = hotels.map(h => ({
            HotelName: h.HotelName || h.name || h.title || '',
            HotelAddress: h.HotelAddress || h.address || '',
            PriceRange: h.PriceRange || '',
            Rating: h.Rating || '',
            Description: h.Description || ''
        }));

        const normItinerary = itinerary.map(p => ({
            Day: p.Day || p.day || '',
            PlaceName: p.PlaceName || p.name || '',
            PlaceDetails: p.PlaceDetails || p.details || '',
            TicketPricing: p.TicketPricing || '',
            TravelTime: p.TravelTime || '',
            BestTimeToVisit: p.BestTimeToVisit || ''
        }));

        return { tripData: { HotelOptions: normHotels, Itinerary: normItinerary } };
    }


    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4 selection:bg-primary/20">
            {/* Playful Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
            
            {/* Animated Blobs */}
            <motion.div 
                className="absolute top-10 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
                className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2], y: [0, -30, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-3xl"
            >
                {/* Header Card */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <div className="inline-block relative">
                        <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4 drop-shadow-sm tracking-tight">
                            Tell us your <span className="text-primary relative inline-block">
                                Preferences
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        Just a few clicks and our AI will build your dream itinerary! 🚀
                    </p>
                </motion.div>

                {/* Main Form Container */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-9 space-y-8"
                >
                    
                    {/* Destination Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold text-base">1</span>
                            <h2 className="text-xl font-bold text-foreground">Where to? 🗺️</h2>
                        </div>
                        <div className="relative group">
                            <LocationSearch onChange={(value) => handleInputChange('Location', value)} />
                        </div>
                    </div>

                    {/* Duration Section */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold text-base">2</span>
                            <h2 className="text-xl font-bold text-foreground">How many days? 🗓️</h2>
                        </div>
                        <input 
                            type="number" 
                            min="1"
                            placeholder="Ex. 3 days" 
                            className="w-full p-4 bg-white border-2 border-border rounded-xl text-foreground text-lg font-medium placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm"
                            onChange={(e) => handleInputChange('TotalDays', e.target.value)}
                        />
                    </div>

                    {/* Budget Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold text-base">3</span>
                            <h2 className="text-xl font-bold text-foreground">What's the budget? 💰</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {SelectBudget.map((item, index) => (
                                <motion.div 
                                    key={index} 
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleInputChange('budget', item.budget)}
                                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-2 relative overflow-hidden group
                                    ${formData?.budget === item.budget 
                                        ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' 
                                        : 'border-transparent bg-white shadow-md hover:border-primary/30 hover:shadow-lg'}`}
                                >
                                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300 transform block">
                                        {item.icon}
                                    </span>
                                    <h3 className="font-bold text-lg text-foreground">{item.budget}</h3>
                                    <p className="text-xs text-muted-foreground">{item.amount}</p>
                                    
                                    {/* Selection Checkmark */}
                                    {formData?.budget === item.budget && (
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-3 right-3 text-primary"
                                        >
                                            <svg className="w-5 h-5 border-2 border-primary rounded-full p-0.5 bg-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Companions Section */}
                    <div className="space-y-4">
                         <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold text-base">4</span>
                            <h2 className="text-xl font-bold text-foreground">Who's joining? 👥</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {SelectMembers.map((item, index) => (
                                <motion.div 
                                    key={index} 
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleInputChange("TravelingWith", item.people)}
                                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-2 relative overflow-hidden
                                    ${formData?.["TravelingWith"] === item.people 
                                        ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' 
                                        : 'border-transparent bg-white shadow-md hover:border-primary/30 hover:shadow-lg'}`}
                                >
                                    <span className="text-3xl mb-2 group-hover:rotate-12 transition-transform duration-300 block">
                                        {item.icon}
                                    </span>
                                    <h3 className="font-bold text-base text-foreground">{item.people}</h3>
                                    <p className="text-xs text-muted-foreground">{item.amount}</p>
                                      {/* Selection Checkmark */}
                                      {formData?.["TravelingWith"] === item.people && (
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-3 right-3 text-primary"
                                        >
                                            <svg className="w-5 h-5 border-2 border-primary rounded-full p-0.5 bg-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 flex justify-end">
                        <Button 
                            disabled={loading}
                            onClick={generateTrip}
                            className="w-full md:w-auto h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground text-lg rounded-full font-black shadow-lg shadow-primary/30 transform transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border-b-4 border-primary/50 hover:border-primary/60"
                        >
                            {loading ? (
                                <AiOutlineLoading3Quarters className='animate-spin h-6 w-6' />
                            ) : (
                                <>
                                    <span>Generate My Trip</span> 
                                    <span className="text-xl">🪄</span>
                                </>
                            )}
                        </Button>
                    </div>

                </motion.div>
            </motion.div>

            {/* Authentication Dialog */}
             <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    style: { 
                        borderRadius: 24, 
                        padding: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }
                }}
            >
                <DialogTitle className="text-center pt-8">
                    <div className="font-black text-3xl text-primary mb-2">
                        Sign In Needed!
                    </div>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className="text-center text-muted-foreground mb-8 text-lg">
                        To save your amazing itinerary securely, we need you to sign in with Google. It's quick! ⚡
                    </DialogContentText>
                    <div className="flex flex-col gap-4 px-4 pb-4">
                         <Button 
                            onClick={() => login()}
                            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-700 hover:bg-slate-50 py-6 rounded-2xl shadow-sm font-bold text-lg transition-all hover:scale-[1.02]"
                        >
                            <FcGoogle className="text-3xl" /> 
                            Sign in with Google
                        </Button>
                        <button 
                            onClick={() => setOpenDialog(false)} 
                            className="w-full py-3 text-slate-400 hover:text-slate-600 font-semibold text-sm transition-colors"
                        >
                            Maybe Later
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default PlanTrip;