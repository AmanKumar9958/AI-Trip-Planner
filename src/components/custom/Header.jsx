import React from 'react'
import { Button } from '../ui/button'

const Header = () => {
    return (
        <div className='flex items-center justify-between px-8 py-4'>
            <img src="./Logo.svg" alt="Trip Planner" />
            <Button>SignUp</Button>
        </div>
    )
}

export default Header