import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className='flex items-center justify-between px-8 py-4'>
            <Link to={'/'}>
                <img src="./Logo.svg" alt="Trip Planner" />
            </Link>
            <Link to={'/signup'}>
                <Button>SignUp</Button>
            </Link>
        </div>
    )
}

export default Header