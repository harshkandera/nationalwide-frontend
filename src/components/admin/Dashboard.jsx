import React from 'react';
import MaxWidthWrapper from '../../component/MaxWidthWrapper';
import Navbar from '../../component/Navbar';
import Sidebar, { SidebarItem } from '../../component/Sidebar';
import { LayoutDashboard } from 'lucide-react';
import { FaList } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import { RiSettings2Line, RiAuctionLine, RiMoneyPoundBoxFill } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { setToken } from '../../slices/authSlice'
import { setIstoken, setUser } from '../../slices/profileSlice'
import { useDispatch } from 'react-redux';
import ErrorBoundry from '../../ErrorBoundry';
import { useLocation , useNavigate} from 'react-router-dom';

const checkPathname = (location, text) => {
  const formattedText = text.toLowerCase().replace(/\s+/g, '_');  
  return location.pathname.includes(formattedText);
};



const Dashboard = ({ children }) => {
  const location = useLocation();  // To dynamically set the active class based on the route

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from Redux state
    dispatch(setToken(null));
    dispatch(setIstoken(false));
    dispatch(setUser(null))
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setTimeout(() => {
        localStorage.removeItem('persist:root');

    }, 2000);
    navigate('/sign-in');
};

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, text: 'Dashboard', link: '/admin/dashboard' },
    { icon: <RiAuctionLine size={20} />, text: 'Auctions', link: '/admin/all_auctions' },
    { icon: <FaList size={20} />, text: 'New Listing', link: '/admin/new_listing/details', alert: true },
    { icon: <RiMoneyPoundBoxFill size={20} />, text: 'All Listings', link: '/admin/all_listings' },
    { icon: <FaRegUserCircle size={20} />, text: 'Users', link: '/admin/all_users' },
    // { icon: <BarChart3 size={20} />, text: 'Statistics', link: '/admin/statistics' },
    { icon: <RiSettings2Line size={20} />, text: 'Settings', link: '/admin/settings' },
    // { icon: <TfiHelpAlt size={20} />, text: 'Help', link: '/admin/help' },
    { icon: <IoIosLogOut size={20} />, text: 'Log out', action: handleLogout },
  ];

  return (
    <div className="min-h-screen font-inter">
      {/* Navbar */}

      <MaxWidthWrapper>
        <Navbar className='shadow' />
      </MaxWidthWrapper>


        <div className="flex">
          
          {/* Sidebar */}
          <div className="sticky top-0 pl-2 h-screen">
            <Sidebar>
              {sidebarItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  icon={item.icon}
                  text={item.text}
                  link={item.link}
                  active={checkPathname(location,item.text)} 
                  alert={item.alert}
                  onClick={item.action}
                />
              ))}
            </Sidebar>
          </div>

          {/* Main Content */}

          <ErrorBoundry>
           <div className="flex-1 flex-col pt-24  rounded-xl  p-4 px-12 ">
            {children}
          </div>
          </ErrorBoundry>



        </div>
    </div>
  );
};

export default Dashboard;



