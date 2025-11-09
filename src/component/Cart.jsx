import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { formatPrice } from "../lib/utils";
import { Link } from 'react-router-dom';
import { MdNotificationsNone } from "react-icons/md";
import Img4 from '../assests/img4.png';
import { buttonVariants } from "./ui/button";
import { FiExternalLink } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { useGetUserNotificationsQuery } from "../slices/apiSlices/carListingApiSlice";

const Cart = () => {

    const { notifications, unreadCount } = useSelector((state) => state.socket);
    
    const { user } = useSelector((state) => state.profile);
    const { data, isLoading } = useGetUserNotificationsQuery(user?.id);
    const [allNotifications, setAllNotifications] = useState([]);

    useEffect(() => {
        // Combine socket notifications with API notifications
        if (data) {
            const apiNotifications = data.data || [];
            setAllNotifications([...notifications, ...apiNotifications]);
        } else {
            setAllNotifications(notifications); // fallback to socket notifications if no API data
        }
    }, [data, notifications]);

    if (isLoading) {
        return <div>Loading notifications...</div>;
    }

    return (
        <Sheet>
            <SheetTrigger className="group font-inter relative -m-2 flex items-center p-2">
                <MdNotificationsNone
                    aria-hidden='true'
                    className="h-6 w-6 flex-shrink-0 text-gray-600 group-hover:text-gray-500"
                />
                <span className="ml-2 absolute top-1 right-1 text-xs bg-richblue-100 w-4 h-4 border-2 border-white flex justify-center items-center rounded-md font-medium text-white group-hover:text-white/90">
                    {unreadCount}
                </span>
            </SheetTrigger>

            <SheetContent side='right' className="flex w-96 flex-col overflow-y-auto notifications-container font-inter pr-4 sm:max-w-lg">
                <SheetHeader className="space-y-2.5 pr-6">
                    <SheetTitle>Notifications ({unreadCount})</SheetTitle>
                </SheetHeader>

                {allNotifications.length > 0 ? (
                    <div className="space-y-4 pr-6">
                        <div className="flex w-full flex-col text-indigo-500 text-sm pr-6">
                            Recent Notifications
                        </div>
                        <Separator />
                        <div className="space-y-1.5 pb-10 flex flex-col  max-h-60"> {/* Added max-height for scrolling */}
                            {allNotifications.map((notify) => (
                                <Link to={`/browse_auctions/car_details/${notify.carId}`} key={notify._id}>
                                    <div className="flex flex-col justify-center p-2 items-center border rounded-md">
                                        <div className="grid grid-cols-8 gap-2 justify-center mt-2">
                                            <div className="h-16 w-16 col-span-2 rounded-md overflow-hidden">
                                                <img
                                                    src={notify.image}
                                                    alt="Car image"
                                                    className="object-cover object-center"
                                                />
                                            </div>
                                            <div className="text-sm text-muted-foreground col-span-6 font-inter">
                                            <div className="font-semibold text-black">{`New Bid on ${notify.title}`}</div>

                                                {
                                                    notify.body ? <>{notify.body}</> : <>New highest bid placed on {notify.title} for <strong>{formatPrice(notify.bidAmount)}</strong></>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <Separator />
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center space-y-1">
                        <div className="flex justify-center items-center mb-4 h-48 w-48 text-muted-foreground">
                            <img src={Img4} alt="empty notifications" />
                        </div>
                        <div className="text-xl font-semibold">No Notification Found</div>
                        <Link to='/browse_auctions' className={buttonVariants({
                            variant: 'link',
                            size: 'sm',
                            className: 'text-sm text-muted-foreground underline cursor-pointer'
                        })}>
                            Browse auctions to get started <FiExternalLink className="ml-2" />
                        </Link>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default Cart;




// <SheetFooter>
// <SheetTrigger asChild>
//     <Link href="/cart" className={buttonVariants({
//         variant: 'outline',
//         className: 'w-full'
//     })} >
//         Mark as Read
//     </Link>
// </SheetTrigger>
// </SheetFooter>