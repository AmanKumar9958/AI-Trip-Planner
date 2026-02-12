import React, { useState, useContext } from 'react';
import LocationSearch from '../components/custom/LocationSearch';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { AI_PROMPT, SelectBudget, SelectMembers } from '../Options/options'; // Ensure path is correct
import { generateAIResponse } from '../AI/Modal';
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
import { doc, setDoc } from "firebase/firestore";
import { db } from '../Firebase/FirebaseConfig';
import { useNavigate } from 'react-router';

const MotionSpan = motion.span;

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
        <div className="relative w-full min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                {floatingIcons.map((icon, index) => (
                    <MotionSpan
                        key={index}
                        className="absolute text-4xl opacity-10 grayscale"
                        style={{
                            top: `${Math.random() * 100}vh`,
                            left: `${Math.random() * 100}vw`,
                        }}
                        animate={{
                            y: [-20, 20, -20],
                            rotate: [0, 15, -15, 0],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {icon}
                    </MotionSpan>
                ))}
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
                        Tell us your <span className="text-primary">Preferences</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Provide us with a few basic details, and our AI will curate the perfect itinerary tailored just for you.
                    </p>
                </div>

                <div className="bg-card rounded-3xl shadow-xl border border-border p-8 md:p-10 space-y-10">
                    
                    {/* Destination Search */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">What is your destination of choice?</h2>
                        <LocationSearch onChange={(value) => handleInputChange('Location', value)} />
                    </div>

                    {/* Trip Duration */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">How many days are you planning?</h2>
                        <input 
                            type="number" 
                            min="1"
                            placeholder="Ex. 3" 
                            className="w-full p-4 bg-card border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground text-lg shadow-sm"
                            onChange={(e) => handleInputChange('TotalDays', e.target.value)}
                        />
                    </div>

                    {/* Budget Selection */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">What is your Budget?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {SelectBudget.map((item, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => handleInputChange('budget', item.budget)}
                                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center gap-2
                                    ${formData?.budget === item.budget 
                                        ? 'border-primary bg-primary/10 shadow-md transform scale-[1.02]' 
                                        : 'border-border bg-card hover:border-primary/50'}`}
                                >
                                    <div className="text-3xl mb-1">{item.icon}</div>
                                    <h3 className="font-bold text-foreground">{item.budget}</h3>
                                    <p className="text-xs text-muted-foreground font-medium">{item.amount}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Member Selection */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Who are you traveling with?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {SelectMembers.map((item, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => handleInputChange("TravelingWith", item.people)}
                                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center gap-2
                                    ${formData?.["TravelingWith"] === item.people 
                                        ? 'border-primary bg-primary/10 shadow-md transform scale-[1.02]' 
                                        : 'border-border bg-card hover:border-primary/50'}`}
                                >
                                    <div className="text-3xl mb-1">{item.icon}</div>
                                    <h3 className="font-bold text-foreground">{item.people}</h3>
                                    <p className="text-xs text-muted-foreground font-medium">{item.amount}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="pt-8 flex justify-end">
                        <Button 
                            disabled={loading}
                            onClick={generateTrip}
                            className="w-full md:w-auto h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground text-lg rounded-full font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <AiOutlineLoading3Quarters className='animate-spin h-6 w-6' />
                            ) : (
                                <><span>Generate Trip</span> ✈️</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Authentication Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    style: { borderRadius: 20, padding: 10 }
                }}
            >
                <DialogTitle className="text-center">
                    <div className="font-bold text-2xl text-foreground">
                        Sign In Required
                    </div>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className="text-center text-muted-foreground mb-4">
                        Please sign in with Google to securely save and access your trip plans.
                    </DialogContentText>
                    <div className="flex flex-col gap-3 mt-4">
                         <Button 
                            onClick={() => login()}
                            className="w-full flex items-center justify-center gap-3 bg-card border border-border text-foreground hover:bg-muted py-3 rounded-xl shadow-sm font-semibold text-md h-12"
                        >
                            <FcGoogle className="text-2xl" /> 
                            Sign in with Google
                        </Button>
                        <Button 
                            onClick={() => setOpenDialog(false)} 
                            variant="ghost" 
                            className="text-slate-400 hover:text-slate-600"
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
                <DialogActions></DialogActions> {/* Kept empty to use custom layout in Content */}
            </Dialog>
        </div>
    );
}

export default PlanTrip;