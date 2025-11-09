import React, { useEffect } from "react";
import Dashboard from "./Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../component/ui/button";
import { Link } from "react-router-dom";
import Img10 from "../../assests/img10.png";
import Img11 from "../../assests/img11.png";
import Img12 from "../../assests/img12.png";
import { useUserDashBoardDataQuery } from "../../slices/apiSlices/carListingApiSlice";
import { Separator } from "../../component/ui/separator";
import { format } from "date-fns";
import { formatPrice } from "../../lib/utils";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { RiAuctionLine } from "react-icons/ri";
import AdminCharts from "../../component/AdminCharts";

function truncateString(str, num) {
  return str.length <= num ? str : str.substring(0, num) + "...";
}
const UserDashboard = () => {
  const { user } = useSelector((state) => state.profile);
  const { data } = useUserDashBoardDataQuery({ userId: user?.id });

  const formatDate = (date) => format(new Date(date), "d MMM yyyy");
  const formatTime = (date) => format(new Date(date), "h:mm a");

  const navigate = useNavigate();
  useEffect(() => {
    console.log(data);
  }, [data]);

  const upcomingAuctions = [
    {
      name: "Tata Indica DLG 2009",
      images: [
        {
          fileurl:
            "https://res.cloudinary.com/dgty4nzfo/image/upload/v1726338640/CarsImages/1726338638405.jpg",
        },
      ],
      startTime: "2024-09-11T17:59:00.000Z",
      price: 2822,
    },
    {
      name: "Tata Indica DLG 2009",
      images: [
        {
          fileurl:
            "https://res.cloudinary.com/dgty4nzfo/image/upload/v1726338640/CarsImages/1726338638405.jpg",
        },
      ],
      startTime: "2024-09-11T17:59:00.000Z",
      price: 2822,
    },
    {
      name: "Tata Indica DLG 2009",
      images: [
        {
          fileurl:
            "https://res.cloudinary.com/dgty4nzfo/image/upload/v1726338640/CarsImages/1726338638405.jpg",
        },
      ],
      startTime: "2024-09-11T17:59:00.000Z",
      price: 2822,
    },
  ];

  const activeAuctions = [
    {
      name: "Tata Indica DLG 2009",
      images: [
        {
          fileurl:
            "https://res.cloudinary.com/dgty4nzfo/image/upload/v1726338640/CarsImages/1726338638405.jpg",
        },
      ],
      endTime: "2024-09-11T17:59:00.000Z",
      highestBid: 3000,
      totalBids: 5,
    },
    {
      name: "Tata Indica DLG 2009",
      images: [
        {
          fileurl:
            "https://res.cloudinary.com/dgty4nzfo/image/upload/v1726338640/CarsImages/1726338638405.jpg",
        },
      ],
      endTime: "2024-09-11T17:59:00.000Z",
      highestBid: 3000,
      totalBids: 5,
    },
  ];

  return (
    <Dashboard>
      <header className="relative ">
        <div className="flex h-16 p-2 justify-between items-center">
          <div className="ml-4 text-3xl font-inter font-bold flex lg:ml-0">
            <Link href="/">Dashboard</Link>
          </div>
        </div>
      </header>

      <div className="w-full max-h-fit bg-richblue-100 rounded-xl  ">
        <div className="p-6 flex flex-col space-y-2">
          <div className="text-white text-2xl font-semibold">
            Hi {user?.username}.
          </div>
          <div className="text-sm text-white/70">
            Welcome to our car auction hub, where finding your perfect vehicle
            is a thrilling journey! Dive into a vast selection of cars, place
            your bids, and make your dream ride a reality.
          </div>
          <div>
            <Button variant="white">Browse auctions</Button>
          </div>
        </div>
      </div>

      {/* Bids Information Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 mt-10 gap-2">
        {/* Winning Bids */}
        <AdminCharts
          title="Winning Bids"
          description="Displaying total winning bids"
          totalLabel="Winning Bids"
          chartData={[
            {
              active: data?.data?.winningBids.length || 0,
              nonActive: 0,
            },
          ]}
          chartConfig={{
            active: { label: "Winning Bids", color: "hsl(var(--chart-1))" },
          }}
          dataKeys={["active"]}
        />

        {/* Active Bids */}
        <AdminCharts
          title="Active Bids"
          description="Displaying active bids"
          totalLabel="Active Bids"
          chartData={[
            {
              active: data?.data?.activeBids?.length || 0,
              nonActive: 0,
            },
          ]}
          chartConfig={{
            active: { label: "Active Bids", color: "hsl(var(--chart-2))" },
          }}
          dataKeys={["active"]}
        />

        {/* Total Bids */}
        <AdminCharts
          title="Total Bids"
          description="Displaying total bids"
          totalLabel="Total Bids"
          chartData={[
            {
              active: data?.data?.totalBids || 0,
              nonActive: 0,
            },
          ]}
          chartConfig={{
            active: { label: "Total Bids", color: "hsl(var(--chart-1))" },
          }}
          dataKeys={["active"]}
        />
      </div>

      <Separator className="w-full mt-4" />

      {/* Recent Notifications */}
      <div>
        <div className="flex w-full mt-4 flex-col text-indigo-500 text-sm pr-6">
          Recent Notifications
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 items-center">
          {data?.data?.notifications?.length > 0 ? (
            data.data.notifications.map((notify) => (
              <Link to={notify.link} key={notify._id}>
                <div className="flex flex-col justify-center p-2 m-2 items-center border rounded-md">
                  <div className="grid grid-cols-12 gap-2 justify-center items-center mt-2">
                    <div className="h-16 w-16 col-span-2 rounded-md overflow-hidden">
                      <img
                         src={notify.image}
                        alt="Car image"
                        className="object-cover object-center"
                      />
                    </div>

                    <div className="text-sm text-muted-foreground col-span-8 font-inter">
                      <div className="font-semibold text-black text-base">{`New Bid on ${notify.title}`}</div>
                      {notify.body ? (
                        notify.body
                      ) : (
                        <span>
                          New highest bid placed on{" "}
                          <span className="font-semibold text-black">
                            {notify.title}
                          </span>{" "}
                          for {formatPrice(notify.bidAmount)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center w-full border rounded-md p-4">
              No notifications available.
            </div>
          )}
        </div>
      </div>

      {/* Winning Bids List */}
      <Separator className="w-full mt-6" />
      <div className="my-8">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="text-lg m-2 font-bold font-inter">Winning Bids</div>
          {/* <Link to={``}>
            <Button variant="btn" className="p-0 h-8 w-8 font-bold text-xl">
              <GoArrowUpRight />
            </Button>
          </Link> */}
        </div>

        <div className="overflow-x-auto border rounded-lg">
          {data?.data?.winningBids?.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-2 text-start">Name</th>
                  <th className="px-4 py-2 text-start">End Time</th>
                  <th className="px-4 py-2 text-start">Highest Bid</th>
                </tr>
              </thead>
              <tbody>
                {data.data.winningBids.map((car) => {
                  const auction = car?.car_id;
                  return (
                    <tr
                      key={auction._id}
                      className="border-b hover:bg-slate-100 cursor-pointer"
                      onClick={() =>
                        navigate(`/dashboard/auctions/${auction._id}`)
                      }
                    >
                      {/* Image Section */}
                      <td className="px-4 py-2 gap-2 flex items-center text-start">
                        <div>
                          <img
                            src={
                              auction.images?.[0]?.fileurl ||
                              "fallback-image-url.jpg"
                            }
                            className="w-16 h-16 object-cover rounded-md"
                            alt={auction.name}
                          />
                        </div>
                        <div>{truncateString(auction.name, 40)}</div>
                      </td>

                      {/* End Time */}
                      <td className="px-4 py-2 text-start">
                        {formatDate(auction.endTime)} <br />
                        <span className="text-muted-foreground text-xs">
                          {formatTime(auction.endTime)}
                        </span>
                      </td>

                      {/* Highest Bid */}
                      <td className="px-4 py-2 text-start">
                        <div className="">
                          {formatPrice(auction.highestBid)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center border rounded-md p-4">
              No winning bids available.
            </div>
          )}
        </div>
      </div>

      {/* active bids List */}
      <Separator className="w-full mt-6" />

      <div className="my-10">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="text-xl m-2 font-semibold font-inter">
            Active Auctions
          </div>
          <div className="text-xl text-muted-foreground flex items-center">
            {/* <Link to={``}>
              <Button variant="btn" className="p-0 h-8 w-8 font-bold text-xl">
                <GoArrowUpRight />
              </Button>
            </Link> */}
          </div>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          {data?.data?.activeBids?.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-2 text-start">Name</th>
                  <th className="px-4 py-2 text-start">End Time</th>
                  <th className="px-4 py-2 text-start">Highest Bid</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.activeBids.map((auction) => (
                  <tr
                    key={auction._id}
                    className="border-b hover:bg-slate-100 cursor-pointer"
                    onClick={() =>
                      navigate(`/dashboard/auctions/${auction?.car_id?._id}`)
                    }
                  >
                    <td className="px-4 py-2 gap-2 flex items-center text-start">
                      <div>
                        <img
                          src={
                            auction?.car_id?.images[0]?.fileurl ||
                            "default-image-url"
                          }
                          className="w-16 h-16 object-cover rounded-md"
                          alt="Auction Image"
                        />
                      </div>
                      <div>{truncateString(auction.car_id?.name, 40)}</div>
                    </td>
                    <td className="px-4 py-2 text-start">
                      {formatDate(auction.car_id?.endTime)} <br />
                      <span className="text-muted-foreground text-xs">
                        {formatTime(auction.car_id?.endTime)}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-start">
                      {formatPrice(auction.car_id?.highestBid)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center border rounded-md p-4">
              No Active Auctions available.
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Auctions List */}
      <Separator className="w-full mt-6" />
      <div className="my-8 mb-20">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="text-lg m-2 font-bold font-inter">
            Upcoming Auctions
          </div>
          {/* <Link to={``}>
            <Button variant="btn" className="p-0 h-8 w-8 font-bold text-xl">
              <GoArrowUpRight />
            </Button>
          </Link> */}
        </div>

        <div className="overflow-x-auto border rounded-lg">
          {data?.data?.upcomingAuctions.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-2 text-start">Name</th>
                  <th className="px-4 py-2 text-start">Start Date</th>
                  <th className="px-4 py-2 text-start">Starting Bid</th>
                </tr>
              </thead>
              <tbody>
                {data.data.upcomingAuctions.map((auction) => (
                  <tr
                    key={auction._id}
                    className="border-b hover:bg-slate-100 cursor-pointer"
                    onClick={() =>
                      navigate(`/browse_auctions/car_details/${auction._id}`)
                    }
                  >
                    {/* Image Section */}
                    <td className="px-4 py-2 gap-2 flex items-center text-start">
                      <div>
                        <img
                          src={
                            auction.images[0]?.fileurl || "default-image-url"
                          }
                          className="w-16 h-16 object-cover rounded-md"
                          alt="Auction Image"
                        />
                      </div>
                      <div>{truncateString(auction.name, 40)}</div>
                    </td>

                    {/* Start Date */}
                    <td className="px-4 py-2 text-start">
                      {formatDate(auction.startTime)} <br />
                      <span className="text-muted-foreground text-xs">
                        {formatTime(auction.startTime)}
                      </span>
                    </td>

                    {/* Starting Bid */}
                    <td className="px-4 py-2 text-start">
                      <div className="">{formatPrice(auction.price)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center border rounded-md p-4">
              No upcoming auctions available.
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default UserDashboard;
