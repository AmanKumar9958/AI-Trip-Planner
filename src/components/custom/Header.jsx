import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const Header = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const logout = () => {
        localStorage.removeItem('user');
        window.location.reload();
    }

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
                <Link to={'/signup'}>
                    <Button>Sign Up</Button>
                </Link>
            )}
        </div>
    );
}

export default Header;
