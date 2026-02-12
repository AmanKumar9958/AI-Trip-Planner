import React from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Fixed import from 'react-router' to 'react-router-dom'
import { FaPlaneDeparture, FaClipboardList } from "react-icons/fa";

const ViewTripButton = ({ mobile }) => {

    return (
        <div className={`w-full ${mobile ? '' : 'max-w-lg'}`}>
            <motion.div>
                <div className={`flex ${mobile ? 'flex-col space-y-3' : 'gap-4'} items-center`}>
                    
                    <Link to="/MyTrips" className={mobile ? 'w-full' : ''}>
                        <div className={`group flex items-center justify-center gap-2 border border-border px-4 py-2 rounded-full hover:border-primary hover:text-primary transition-all duration-300 ${mobile ? 'w-full bg-muted' : 'bg-transparent'}`}>
                             <FaClipboardList className="text-muted-foreground group-hover:text-primary" />
                             <span className="font-medium text-foreground group-hover:text-primary">My Trips</span>
                        </div>
                    </Link>

                    <Link to="/plantrip" className={mobile ? 'w-full' : ''}>
                        <div className={`group flex items-center justify-center gap-2 border border-border px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 ${mobile ? 'w-full' : 'bg-transparent'}`}>
                            <span className='font-bold text-lg leading-none'>+</span> 
                            <span className="font-medium">Create Trip</span>
                        </div>
                    </Link>

                </div>
            </motion.div>
        </div>
    )
}

export default ViewTripButton