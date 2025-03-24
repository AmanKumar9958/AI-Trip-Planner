import React from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router';

const ViewTripButton = () => {

    return (
        <div className="mt-10 w-full max-w-lg flex justify-center items-center">
            <motion.div>
                <div className='flex justify-between items-center w-full gap-3'>
                    <div>
                        <Link to="/MyTrips">
                            <p className="text-black border-1 border-black px-2 py-2 rounded-xl font-semibold hover:scale-105 transition duration-200">
                                My Trips ✈️
                            </p>
                        </Link>
                    </div>
                    <div>
                        <Link to="/plantrip">
                            <p className="text-black border-1 border-black px-2 py-2 rounded-xl font-semibold hover:scale-105 transition duration-200">
                                <span className='font-bold text-lg'>+</span> Create Trip
                            </p>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default ViewTripButton