import React from 'react'
import MaxWidthWrapper from '../../../component/MaxWidthWrapper';
import Navbar from '../../../component/Navbar';
import Footer, { FooterCard } from '../../../components/home/Footer'
import Culture from './Culture';
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import FAQ from './Faq'
import PressKit from './PressKit';
import Customers from './Customers'
import Careers from './Careers'
import Privacy from './Privacy'
import Terms from './Terms'
const FooterData = () => {

    const location = useLocation();
    const { params } = useParams();

    console.log(params)
    return (<>
        <div className='max-w-screen overflow-hidden'>
            <MaxWidthWrapper>
                <Navbar />
            </MaxWidthWrapper>



            <div className='mt-16'>
              {params === 'chooseUs' && <Culture /> }
              {params === 'faq' && <FAQ /> }
              {params === 'presskit' && <PressKit /> }
              {params === 'stories' && <Customers /> }
              {params === 'careers' && <Careers /> }
              {params === 'privacy' && <Privacy /> }
              {params === 'terms' && < Terms /> }

            </div>


        </div>
        <FooterCard />
        <Footer />
    </>
    )
}

export default FooterData;