import React, { useEffect } from 'react';
import "./App.css";
import { Routes, Route ,useParams ,useLocation} from "react-router-dom";
import ReactGA from 'react-ga4'; 

// public routes *************
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Page from "./pages/Page";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BrowseAuctions from "./pages/BrowseAuctions";
import FooterData from './components/home/FooterData'
import Profile from "./pages/Profile"
import HowItWorks from './pages/HowItWorks'

// protected routes **************
import ProtectedRoute from "./components/user/ProtectedRoute";
import ProtectedRouteAdmin from "./components/admin/ProtectedRouteAdmin";

// user routes **************
import UserDashboard from "./components/user/UserDashboard";
import Saved from "./components/user/Saved";
import Settings from "./components/user/Settings";
import Auctions from "./components/user/Auctions/Auctions";
import AuctionCar from "./components/user/Auctions/AuctionCar";
import Help from './components/user/Help'


// admin routes **************
import AdminDashboard from "./components/admin/AdminDashboard";
import NewListing from "./components/admin/new_listing/index";
import AllListing from "./components/admin/all_listing/index";
import CompleteListing from "./components/admin/all_listing/CompleteListing";
import AllUsers from './components/admin/users/Allusers'
import User from "./components/admin/users/User"
import UserBid from "./components/admin/users/UserBid"
import AdminSettings from './components/admin/Settings'

import AllAuctions from './components/admin/auctions/Auctions'
import AuctionsCar from "./components/admin/auctions/AuctionCar"
// public routes
import CarDetails from "./components/home/CarDetails";

import WhatsAppButton from './component/Whatsapp';
import Testimonials from './pages/Testimonials';

// const useSalesIQ = (url, widgetCode) => {
  
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.setAttribute('type', 'text/javascript');

//     let code = `var $zoho=$zoho || {};
//     $zoho.salesiq = $zoho.salesiq || {widgetcode: "${widgetCode}", values:{}, ready:function(){}};
//     var d=document;s=d.createElement("script");
//     s.type="text/javascript";
//     s.id="zsiqscript";s.defer=true;
//     s.src="${url}";t=d.getElementsByTagName("script")[0];
//     t.parentNode.insertBefore(s,t);
//     document.body.appendChild(s);`;

//     script.appendChild(document.createTextNode(code));
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, [url, widgetCode]);
// };


function App() {
  
  const trackingId = "G-86VVLBMF92"; 
  ReactGA.initialize(trackingId,{ debug: true });


const { pathname, search } = useLocation();

useEffect(() => {
  ReactGA.send("pageview", {
    page_path: pathname + search,
  });
}, [pathname, search]);

  
  // useSalesIQ('https://salesiq.zohopublic.eu/widget?wc=siq5c22e70d35ed314472a18cd09981ec812c90be87d081cd4863ada9f10e2d2959', 'your_widget_code');


  return (
    <div className="w-screen ">
      <ScrollToTop />
      <Routes>
        
        {/* public routes */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/sign-up" element={<Signup />} /> */}
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sendotp" element={<Signin />} />
        <Route path="/change_password" element={<Signup />} />
        <Route path="/forgot_password" element={<Signin />} />
        <Route path="/about_us" element={<About />} />
        <Route path="/contact_us" element={<Contact />} />
        <Route path="/browse_auctions" element={<BrowseAuctions />} />
        <Route path="/how_it_works" element={<HowItWorks />} />
        <Route path='/testimonials' element={<Testimonials />} />

        <Route path="/footer/:params" element={<FooterData/>} />

        <Route
          path="/browse_auctions/car_details/:id"
          element={<CarDetails />}
        />

        {/* admin-route */}
        <Route element={<ProtectedRouteAdmin />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/new_listing/:params" element={<NewListing />} />
          <Route path="/admin/all_listings" element={<AllListing />} />
          <Route path="/admin/all_users" element={<AllUsers />} />
          <Route path="/admin/all_users/:id" element={<User />} />
          <Route path="/admin/all_users/:id/:carId" element={<UserBid />} />
          <Route path="/admin/all_auctions" element={<AllAuctions />} />
          <Route path="/admin/all_auctions/:id" element={< AuctionsCar/>} />
          <Route path="/admin/settings" element={< AdminSettings />} />

          <Route
            path="/admin/all_listings/draft/:params/:id"
            element={<CompleteListing />}
          />

        </Route>

        {/* user-route  */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/saved" element={<Saved />} />
          <Route path="/dashboard/Settings" element={<Settings />} />
          <Route path="/dashboard/Auctions" element={<Auctions />} />
          <Route path="/dashboard/Auctions/:id" element={<AuctionCar />} />
          <Route path="/dashboard/help" element={< Help />} />

        </Route>

        <Route path="/profile/:email" element={< Profile />} />

        <Route path="*" element={<Page />} />
        
      </Routes>
     < WhatsAppButton/>
    </div>
  );
}

export default App;


export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const params = useParams(); 

  useEffect(() => {
    window.scrollTo(0, 0);  
  }, [pathname, params]);

  return null;
};