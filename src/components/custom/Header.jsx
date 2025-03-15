import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Header = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    // Logout..
    const logout = () => {
        localStorage.removeItem('user');
        window.location.reload();
    }

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

    return (
        <div className='flex items-center justify-between px-8 py-4 bg-white shadow-md'>
            <Link to={'/'}>
                <img src="./Logo.svg" alt="Trip Planner" className="h-10" />
            </Link>
            
            {user ? (
                <div className='flex gap-5'>
                    <div className="flex items-center gap-3">
                        <img 
                            src={user.picture} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full border border-gray-300 shadow-md"
                        />
                        <span className="text-lg font-semibold text-gray-700">{user.name}</span>
                    </div>
                    <div>
                        <Button onClick={logout}>Logout</Button>
                    </div>
                </div>
            ) : (
                    <Button onClick={login}>Sign Up</Button>
            )}
        </div>
    );
}

export default Header;
