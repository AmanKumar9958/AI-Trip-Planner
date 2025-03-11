import React from 'react'
import { Button } from '../components/ui/button'
import { Link } from 'react-router'

const App = () => {
    return (
        <div className='text-red-400 bg-black w-full min-h-screen flex flex-col gap-5 justify-center items-center text-7xl font-bold'>
            Please Login
            <Button className={'cursor-pointer'}>Click Me!! </Button>
            <Link to={'/'}>
                <Button className={'cursor-pointer'}>Go to home page</Button>
            </Link>
        </div>
    )
}

export default App