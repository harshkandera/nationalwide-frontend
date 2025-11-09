import { Suspense } from 'react';
import MaxWidthWrapper from '../../component/MaxWidthWrapper';
import Navbar from '../../component/Navbar';
import Sidebar, { SidebarItem } from '../../component/Sidebar';
import { LayoutDashboard, BarChart3, Boxes, Package, Receipt, } from 'lucide-react';
import { TfiHelpAlt } from "react-icons/tfi";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../component/ui/button'
import { useLocation , useNavigate} from 'react-router-dom';
import ErrorBoundry from '../../ErrorBoundry';
import { RiSettings2Line, RiAuctionLine, RiMoneyPoundBoxFill } from "react-icons/ri";
import { BookMarked } from 'lucide-react';
import { IoIosLogOut } from "react-icons/io";
import { setToken } from '../../slices/authSlice'
import { setIstoken, setUser } from '../../slices/profileSlice'

const checkPathname = (location, link) => {
  return location.pathname === link;
};



const Dashboard = ({ children }) => {

  const { user } = useSelector((state) => state.profile)

  const location = useLocation();

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
    { icon: <LayoutDashboard size={20} />, text: 'Dashboard', link: '/dashboard' },
    { icon: <RiAuctionLine size={20} />, text: 'My Auctions', link: '/dashboard/auctions' },
    { icon: <BookMarked size={20} />, text: 'Saved', link: '/dashboard/saved', alert: true },
    { icon: <RiSettings2Line size={20} />, text: 'Settings', link: '/dashboard/settings' },
    // { icon: <TfiHelpAlt size={20} />, text: 'Help', link: '/dashboard/help' },
    { icon: <IoIosLogOut size={20} />, text: 'Log out', action: handleLogout },
  ];

  return (
    <div className="min-h-screen font-inter max-w-screen">
      {/* Navbar */}

      <MaxWidthWrapper>
        <Navbar className='shadow' />
      </MaxWidthWrapper>


      <div className="flex">

        {/* Sidebar */}
        <div className="sticky top-0  h-screen hidden sm:block">
          <Sidebar>
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                text={item.text}
                link={item.link}
                active={checkPathname(location, item.link)}
                alert={item.alert}
                onClick={item.action}
              />
            ))}
          </Sidebar>
        </div>

        {/* Main Content */}

        <ErrorBoundry>
          <div className="flex-1 flex-col pt-24  rounded-xl  p-4 px-12 ">
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </div>
        </ErrorBoundry>



      </div>
    </div>
  );
};

export default Dashboard;


