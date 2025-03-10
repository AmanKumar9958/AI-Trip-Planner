import React from 'react'
import { Button } from '../components/ui/button'

const App = () => {
    return (
        <div className='text-red-400 bg-black w-full min-h-screen flex flex-col gap-5 justify-center items-center text-7xl font-bold'>
            Please Signup
            <Button className={'cursor-pointer'}>Click Me!! </Button>
        </div>
    )
}

export default App