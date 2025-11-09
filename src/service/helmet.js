import React from 'react';
import { Helmet } from 'react-helmet-async';


const SEO = ({ title, description, image, url,keywords }) => {
  return (
    <Helmet>
      {/* Standard SEO Tags */}
      <title>{title}</title>
      <meta name='canonical' content={url} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook / Instagram / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

SEO.defaultProps = {
  title: "Bid-Drive.com | Car Bidding Platform | Find Your Dream Car",
  description: "Bid-Drive: the ultimate car auction platform to find, bid on, and win premium cars at great prices. Live bidding on classic and latest models.",
  image: "https://res.cloudinary.com/dgty4nzfo/image/upload/v1730487391/ProfileImages/lvzs88ic6sjaze0dnwnf.png",
  url: "https://bid-drive.com",
keywords:'car auctions, online car bidding, bid on cars, car auction platform, live car auctions, buy cars online, classic car auctions, used car bidding, new car auctions, premium cars, auto auctions, vehicle auctions'
};

export default SEO;


