import React, { useEffect, useState } from 'react';
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

const PlanTrip = () => {
    const [formData, setFormData] = useState({});
    const [openDialog, setOpenDialog] = useState(false);

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };    

    useEffect(() => {
    }, [formData])


    // Login..
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
            localStorage.setItem('user', JSON.stringify(response.data));
            toast.success("Trip successfully generated! 🎉");
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
    };
    

    // Generating Trip..
    const generateTrip = async () => {
        if(!formData?.["Traveling with: "] ||
            !formData?.["No of Days: "] ||
            !formData?.budget ){
            toast.error("Please fill all the details correctly.");
            return;
        }
        toast.success("Generating Trip, please wait 🙏");

        const FINAL_PROMPT = AI_PROMPT
        .replace('{location}', formData?.['Selected Location'] || "Unknown Location")
        .replace('{totalDays}', formData?.["No of Days: "])
        .replace('{traveler}', formData?.["Traveling with: "])
        .replace('{budget}', formData?.budget)

        const result = await chatSession.sendMessage(FINAL_PROMPT);
        console.log(result.response.text())

        const user = localStorage.getItem('user');

        if(!user){
            toast.error("No user Found!!");
            setOpenDialog(true);
            return;
        }
    }

    return (
        <div className='w-full min-h-screen px-6 py-6 bg-gray-100 flex flex-col items-center'>
            {/* Header Section */}
            <div className='text-center max-w-2xl'>
                <h1 className='text-4xl font-bold text-gray-800 mb-2'>Tell us your preferences ⛺</h1>
                <p className='text-lg text-gray-600'>Provide basic details, and our trip planner will create a customized itinerary for you.</p>
            </div>

            {/* Destination Search */}
            <div className='mt-8 w-full max-w-lg'>
                <h2 className='mb-3 text-lg font-semibold text-gray-700'>Where do you want to go?</h2>
                <LocationSearch onChange={(value) => handleInputChange('Selected Location', value)} />
            </div>

            {/* Trip Duration */}
            <div className='mt-6 w-full max-w-lg'>
                <h2 className='mb-3 text-lg font-semibold text-gray-700'>How many days?</h2>
                <input 
                    type="number" 
                    placeholder='Ex. 3' 
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => handleInputChange('No of Days: ', e.target.value)}
                />
            </div>

            {/* Budget Selection */}
            <div className='mt-6 w-full max-w-lg'>
                <h2 className='mb-3 text-lg font-semibold text-gray-700'>Select your budget</h2>
                <div className='flex flex-wrap gap-4'>
                    {SelectBudget.map((item, index) => (
                        <div 
                            key={index} 
                            className={`flex flex-col items-center justify-center w-32 h-28 border-2 rounded-md p-2 
                                cursor-pointer transition-all duration-300 
                                hover:shadow-md hover:border-gray-500
                                ${formData?.budget === item.budget ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-300'}`}                            
                            onClick={() => handleInputChange('budget', item.budget)}
                        >
                            <div className="text-red-500">{item.icon}</div>
                            <h3 className='text-sm font-semibold mt-2'>{item.budget}</h3>
                            <p className='text-xs text-gray-600'>{item.amount}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Member Selection */}
            <div className='mt-6 w-full max-w-lg'>
                <h2 className='mb-3 text-lg font-semibold text-gray-700'>
                    Who do you plan on traveling for your next journey?
                </h2>
                <div className='flex flex-wrap gap-4'>
                    {SelectMembers.map((item, index) => (
                        <div 
                            key={index} 
                            className={`flex flex-col items-center justify-center w-32 h-28 border-2 rounded-md p-2 
                                cursor-pointer transition-all duration-300 
                                hover:shadow-md hover:border-gray-500
                                ${formData?.["Traveling with: "] === item.people ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-300'}`}
                            onClick={() => handleInputChange("Traveling with: ", item.people)}
                        >
                            <div className="text-red-500">{item.icon}</div>
                            <h3 className='text-sm font-semibold mt-2'>{item.people}</h3>
                            <p className='text-xs text-gray-600'>{item.amount}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Generate Button */}
            <div className='mt-6 w-full max-w-lg flex justify-end'>
                <Button onClick={generateTrip}>Generate Trip</Button>
            </div>

            {/* Dialog Box */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogContent>
                    <DialogTitle>
                        <img src="./Logo.svg" alt="Logo" />
                    </DialogTitle>
                    <DialogContentText>
                        <h1>Continue Google</h1>
                        <p>Sign in to the App with google authentication securely</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
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