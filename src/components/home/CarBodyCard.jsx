import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const Timer = ({ timeLeft }) => {
    if (timeLeft.expired) {
        return (
            <div className="grid grid-cols-7 w-[200px]">
                <div className="flex flex-col justify-center items-center">
                    <div className="text-lg font-bold">0</div>
                    <div className='text-muted-foreground'>days</div>
                </div>
                <div className="text-xl flex justify-center font-bold">:</div>
                <div className="flex flex-col justify-center items-center">
                    <div className="text-lg font-bold">0</div>
                    <div className='text-muted-foreground'>hours</div>
                </div>
                <div className="text-xl flex justify-center font-bold">:</div>
                <div className="flex flex-col justify-center items-center">
                    <div className="text-lg font-bold">0</div>
                    <div className='text-muted-foreground'>min</div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-7 w-[200px]">
            <div className="flex flex-col justify-center items-center">
                <div className="text-lg font-bold">{timeLeft.days}</div>
                <div className='text-muted-foreground'>days</div>
            </div>
            <div className="text-xl flex justify-center font-bold">:</div>
            <div className="flex flex-col justify-center items-center">
                <div className="text-lg font-bold">{timeLeft.hours}</div>
                <div className='text-muted-foreground'>hours</div>
            </div>
            <div className="text-xl flex justify-center font-bold">:</div>
            <div className="flex flex-col justify-center items-center">
                <div className="text-lg font-bold">{timeLeft.minutes}</div>
                <div className='text-muted-foreground'>min</div>
            </div>
        </div>
    );
};

const CarBodyCard = ({ car, endTime }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(endTime));
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    function calculateTimeLeft(endTime) {
        const difference = new Date(endTime) - new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = { expired: true };
        }

        return timeLeft;
    }

    return (
        <div className='grid grid-cols-2 rounded-lg px-2 justify-between items-center w-full shadow-lg border'>
            <div className=''>
                <Swiper
                    pagination={{ clickable: true }}
                    mousewheel={true}
                    keyboard={true}
                    modules={[Pagination, Mousewheel, Keyboard]}
                    className="mySwiper flex justify-center items-center"
                >
                    {car.images?.map((card, index) => (
                        <SwiperSlide key={index} className="flex justify-center items-center">
                            <div className="flex justify-center items-center h-48">
                                <img
                                    src={card}
                                    alt={`car-${index}`}
                                    className="h-30 object-cover rounded-md"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className='grid grid-rows-8'>
                <div className='font-semibold'>
                    {car.name}
                </div>
                <div className='text-muted-foreground max-w-prose text-sm'>
                    {car.description}
                </div>
                <div className='text-lg font-semibold'>
                    {car.price}
                </div>
                <div className='text-sm text-muted-foreground'>
                    {car.mileage}
                </div>
                <div>
                    <Timer timeLeft={timeLeft} />
                </div>
            </div>
        </div>
    );
};

export default CarBodyCard;
