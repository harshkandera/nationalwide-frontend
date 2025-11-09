import React from 'react';
import Dashboard from './Dashboard';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { Button } from '../../component/ui/button';

const Help = () => {
    const navigate = useNavigate();

    const goBack = () => { 
        navigate(-1); 
    };

    return (
        <Dashboard>
            <header className="relative">
                <div className="flex h-16 p-2 justify-between items-center">
                    <div className="ml-4 text-3xl font-inter font-bold flex lg:ml-0">
                        Help
                    </div>
                </div>
            </header>

            <div className='w-full h-20 mt-4 bg-richblue-100 rounded-xl'>
                <div className='p-6 flex gap-2 items-center'>
                    <Button
                        variant='secondary'
                        onClick={goBack}
                        className='font-bold p-0 text-foreground-muted h-10 w-10 rounded-md'
                        aria-label="Go Back"
                    >
                        <IoIosArrowBack className='text-lg text-muted-foreground' />
                    </Button>

                    <div className='text-xl font-bold font-inter text-white'>
                        How can we help you?
                    </div>
                </div>
            </div>
        </Dashboard>
    );
};

export default Help;
