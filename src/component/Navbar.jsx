import React ,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants, Button } from './ui/button'
import { Icons } from '../assests/Icons'
import { useLocation } from "react-router-dom"
import Navitems from './Navitems'
import { FaChevronDown } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { setToken } from '../slices/authSlice'
import { setIstoken, setUser } from '../slices/profileSlice'
import { RxDashboard } from "react-icons/rx";
import { TfiHelpAlt } from "react-icons/tfi";
import { cn } from "../lib/utils"
import Cart from './Cart'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import ProfileBanner from '../component/banners/ProfileBanner'

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../component/ui/sheet"
// Reusable component for user image
import Sidebar, { SidebarItem } from './MobSidebar'
import { LayoutDashboard, BarChart3, Package, Receipt } from 'lucide-react';
import { FaList } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import { RiSettings2Line, RiAuctionLine, RiMoneyPoundBoxFill } from "react-icons/ri";
import { BookMarked } from 'lucide-react';
import { IoHomeOutline } from "react-icons/io5";
import { CgBrowser } from "react-icons/cg";
import { IoPeopleOutline } from "react-icons/io5";
import { MdOutlineContactPhone } from "react-icons/md";





const UserImage = ({ user, size = "8" }) => (
    user?.image
        ? <img src={user.image} alt="User Avatar" className={`w-${size} h-${size} mr-2 rounded-full object-cover`} />
        : <Icons.photo className={`w-${size} h-${size} mr-2`} />
);




// Dropdown for user menu
const Dropdown = ({ user, handleLogout }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size='sm' variant="outline" className='rounded-full pl-0 font-inter font-normal'>
                <UserImage user={user} />
                <FaChevronDown className='text-gray-500' />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 font-inter rounded-lg font-normal">
            <DropdownMenuLabel className="font-inter text-sm font-medium items-center flex">
                <UserImage user={user} size="10" />
                {user?.username || 'N/A'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <Link to={user?.accountType === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                    <DropdownMenuItem className="font-inter font-normal">
                        <RxDashboard className='mx-2 text-lg' /> Dashboard
                    </DropdownMenuItem>
                </Link> 
                <Link to='/footer/faq'>
                <DropdownMenuItem className="font-inter font-normal">
                    <TfiHelpAlt className='mx-2 text-lg' /> Help
                </DropdownMenuItem>
                </Link>
                
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='font-inter font-normal' onClick={handleLogout}>
                <IoIosLogOut className='mx-2 text-lg' /> Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

function Navbar({ className }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { istoken, user } = useSelector((state) => state.profile) || {};
    const location = useLocation();

    const handleLogout = () => {
        dispatch(setToken(null));
        dispatch(setIstoken(false));
        dispatch(setUser(null));
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setTimeout(() => {
            localStorage.removeItem('persist:root');
        }, 2000);
        navigate('/sign-in');
    };

    const checkPathname = (link) => {
        return location.pathname === link;
    };




    const sidebarItems = [
        { icon: <IoHomeOutline size={20} />, text: 'Home', link: '/' },
        { icon: <CgBrowser size={20} />, text: 'Browse Auctions', link: '/browse_auctions' },
        { icon: <IoPeopleOutline size={20} />, text: 'About Us', link: '/about_us'},
        { icon: <MdOutlineContactPhone size={20} />, text: 'Contact Us', link: '/contact_us' },
    ];

    const sidebarItemsUsers2 = [
        { icon: <IoHomeOutline size={20} />, text: 'Home', link: '/' },
        { icon: <CgBrowser size={20} />, text: 'Browse Auctions', link: '/browse_auctions' },
        { icon: <IoPeopleOutline size={20} />, text: 'About Us', link: '/about_us'},
        { icon: <MdOutlineContactPhone size={20} />, text: 'Contact Us', link: '/contact_us' },

        { icon: <LayoutDashboard size={20} />, text: 'Dashboard', link: '/dashboard' },
        { icon: <RiAuctionLine size={20} />, text: 'Auctions', link: '/dashboard/auctions' },
        { icon: <BookMarked size={20} />, text: 'Saved', link: '/dashboard/saved', alert: true },
        { icon: <RiSettings2Line size={20} />, text: 'Settings', link: '/dashboard/settings' },
        // { icon: <TfiHelpAlt size={20} />, text: 'Help', link: '/dashboard/help' },
        { icon: <IoIosLogOut size={20} />, text: 'Log out', action: handleLogout },
    ];




    const sidebarItemsAdmins2 = [
        { icon: <IoHomeOutline size={20} />, text: 'Home', link: '/' },
        { icon: <CgBrowser size={20} />, text: 'Browse Auctions', link: '/browse_auctions' },
        { icon: <IoPeopleOutline size={20} />, text: 'About Us', link: '/about_us'},
        { icon: <MdOutlineContactPhone size={20} />, text: 'Contact Us', link: '/contact_us' },

        { icon: <LayoutDashboard size={20} />, text: 'Dashboard', link: '/admin/dashboard' },
        { icon: <RiAuctionLine size={20} />, text: 'Auctions', link: '/admin/auctions' },
        { icon: <FaList size={20} />, text: 'New Listing', link: '/admin/new_listing/details', alert: true },
        { icon: <RiMoneyPoundBoxFill size={20} />, text: 'All Listings', link: '/admin/all_listings' },
        { icon: <FaRegUserCircle size={20} />, text: 'Users', link: '/admin/users' },
        { icon: <BarChart3 size={20} />, text: 'Statistics', link: '/admin/statistics' },
        { icon: <RiSettings2Line size={20} />, text: 'Settings', link: '/admin/settings' },
        { icon: <TfiHelpAlt size={20} />, text: 'Help', link: '/admin/help' },
        { icon: <IoIosLogOut size={20} />, text: 'Log out', action: handleLogout },
    ];

    const nav = [
        { name: "Home", pathname: "/", location: location.pathname },
        { name: "Browse Auctions", pathname: "/browse_auctions", location: location.pathname },
        {name:"Testimonials",pathname:"/testimonials",location:location.pathname},
        {name:"How it Works?",pathname:"/how_it_works",location:location.pathname},
        // { name: "About Us", pathname: "/about_us", location: location.pathname },
        { name: "Contact Us", pathname: "/contact_us", location: location.pathname },
        { name: "Dashboard", pathname: user?.accountType === 'Admin' ? '/admin/dashboard' : '/dashboard', location: location.pathname },
    ];

    return (
        <div className={cn('bg-white fixed z-50 top-0 inset-x-0 h-16', className)}>
            <header className='relative bg-white'>
                <MaxWidthWrapper>
                    <Sheet>
                        <div className='flex h-16 items-center'>



                            <div className='ml-4 flex gap-2 lg:ml-0'>
                                <SheetTrigger>

                                    {/* <UserImage user={user} size="10" /> */}
                                    <label className="hamburger sm:hidden block">
                                        <svg viewBox="0 0 32 32">
                                            <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                                            <path className="line" d="M7 16 27 16"></path>
                                        </svg>
                                    </label>

                                </SheetTrigger>

                                <Link to='/'>
                                    <Icons.logo className='h-32 w-24' />
                                </Link>
                            </div>

                            <div className='ml-auto flex items-center'>
                                <div className='hidden z-50 lg:ml-8 lg:block lg:self-stretch'>
                                    <div className='flex space-x-8 justify-center items-center'>
                                        {istoken
                                            ? nav.map(item => <Navitems key={item.name} {...item}>{item.name}</Navitems>)
                                            : nav.filter(item => item.name !== "Dashboard").map(item => (
                                                <Navitems key={item.name} {...item}>{item.name}</Navitems>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className='ml-auto flex items-center'>
                                <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>



                                    {istoken ? null : (
                                        <>
                                            <Link to='/sign-in' className={buttonVariants({ variant: 'outline2', size: 'sm' })}>Log in</Link>
                                            <span className='h-6 w-px bg-gray-200' aria-hidden='true' />
                                            <Link to='/sendotp' className={buttonVariants({ variant: 'btn', size: 'sm' })}>Sign up</Link>
                                        </>
                                    )}

                                    {istoken && <Dropdown user={user} handleLogout={handleLogout} />}

                                    {istoken ? <> <span className='h-6 w-px bg-gray-200' aria-hidden='true' />
                                        <div className='ml-4 flow-root lg:ml-4'>
                                            <Cart />
                                        </div></> : null

                                    }
                                    
                                </div>


                                <div className='flex flex-1 items-center justify-end space-x-2 sm:hidden'>

                                    {istoken ? null : (
                                        <>
                                            <Link to='/sign-in' className={buttonVariants({ variant: 'outline2', size: 'sm' })}>Log in</Link>
                                            <span className='h-6 w-px bg-gray-200' aria-hidden='true' />
                                            <Link to='/sendotp' className={buttonVariants({ variant: 'btn', size: 'sm' })}>Sign up</Link>
                                        </>
                                    )}

                                    { istoken && <Dropdown user={user} handleLogout={handleLogout} />}

                                    {istoken ? <> <span className='h-6 w-px bg-gray-200' aria-hidden='true' />
                                        <div className='ml-4 flow-root lg:ml-4'>
                                            <Cart />
                                        </div></> : null

                                    }


                                </div>

                                <SheetContent side='left'>

                                    {istoken ? <Sidebar>
                                        {(user?.accountType === 'Admin' ? sidebarItemsAdmins2 : sidebarItemsUsers2 ).map((item, index) => (
                                            <SidebarItem
                                                key={index}
                                                icon={item.icon}
                                                text={item.text}
                                                link={item.link}
                                                active={checkPathname(item.link)}
                                                alert={item.alert}
                                                action={item.action}
                                            />
                                        ))}
                                    </Sidebar> : <Sidebar>
                                        {(sidebarItems).map((item, index) => (
                                            <SidebarItem
                                                key={index}
                                                icon={item.icon}
                                                text={item.text}
                                                link={item.link}
                                                active={checkPathname(item.link)}
                                                alert={item.alert}
                                                action={item.action}
                                            />
                                        ))}
                                    </Sidebar>  }

                                </SheetContent>

                            </div>
                        </div>
                    </Sheet>
                </MaxWidthWrapper>
            </header>
            
           {location.pathname === '/' && user?.isProfileCompleted === false && <ProfileBanner /> } 

        </div>
    );
}

export default Navbar;







// export const LanguageSwitcher = () => {
//     const { t, i18n } = useTranslation();
  
//     const languages = [
//       { code: "bg", name: "Bulgarian" },
//       { code: "cs", name: "Czech" },
//       { code: "de", name: "German" },
//       { code: "el", name: "ελληνικά" },
//       { code: "en", name: "English" },
//       { code: "es", name: "Spanish" },
//       { code: "fi", name: "Finnish" },
//       { code: "fr", name: "French" },
//       { code: "fr-be", name: "French (Belgium)" },
//       { code: "fr-fr", name: "French (France)" },
//       { code: "hr", name: "Croatian" },
//       { code: "hu", name: "Hungarian" },
//       { code: "it", name: "Italian" },
//       { code: "lt", name: "Lietuvių" },
//       { code: "nl", name: "Dutch" },
//       { code: "nl-be", name: "Dutch (Belgium)" },
//       { code: "nl-nl", name: "Dutch (The Netherlands)" },
//       { code: "pl", name: "Polish" },
//       { code: "pt", name: "Portuguese" },
//       { code: "ro", name: "Romanian" },
//       { code: "ru", name: "Russian" },
//       { code: "sk", name: "Slovak" },
//       { code: "sl", name: "Slovenian" },
//       { code: "tr", name: "Türkçe" }
//     ];
  
//     const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

//     const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  
//     const handleLanguageChange = (language) => {
//       setSelectedLanguage(language);
//       i18n.changeLanguage(language.code);
//     };
  
//     return (
//       <Listbox value={selectedLanguage} onChange={handleLanguageChange}>
//         <div className="relative">
//           <Listbox.Button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
//             <span>{selectedLanguage.name}</span>
//             <ChevronDown className="w-5 h-5 text-gray-400" />
//           </Listbox.Button>
//           <Transition
//             as={React.Fragment}
//             leave="transition ease-in duration-100"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <Listbox.Options className="absolute z-10 w-full py-1 mt-2 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//               {languages.map((language) => (
//                 <Listbox.Option
//                   key={language.code}
//                   value={language}
//                   className={({ active }) =>
//                     `cursor-default select-none relative py-2 pl-10 pr-4 ${
//                       active ? 'bg-indigo-600 text-white' : 'text-gray-900'
//                     }`
//                   }
//                 >
//                   {({ selected }) => (
//                     <>
//                       <span
//                         className={`block truncate ${
//                           selected ? 'font-medium' : 'font-normal'
//                         }`}
//                       >
//                         {language.name}
//                       </span>
//                       {selected ? (
//                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
//                           <Check className="w-5 h-5" />
//                         </span>
//                       ) : null}
//                     </>
//                   )}
//                 </Listbox.Option>
//               ))}
//             </Listbox.Options>
//           </Transition>
//         </div>
//       </Listbox>
//     );
//   };
