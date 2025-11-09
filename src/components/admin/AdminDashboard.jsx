import { useState, useEffect } from 'react';
import Dashboard from "./Dashboard";
import { useSelector ,useDispatch} from "react-redux";
import { Button } from "../../component/ui/button";
import { Link } from "react-router-dom";
import AdminCharts from "../../component/AdminCharts";
import { useGetAdminDashboardDataQuery } from "../../slices/apiSlices/carListingApiSlice";
import { Separator } from "../../component/ui/separator";
import { format } from "date-fns";
import { formatPrice } from "../../lib/utils";
import { CiCalendar, CiUser } from "react-icons/ci";
import { RiAuctionLine } from "react-icons/ri";
import { Icons } from "../../assests/Icons";
import { Progress } from "../../component/ui/progress";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../component/ui/dropdown-menu";
import { setAdminFilterData } from "../../slices/adminFilter";

function truncateString(str, num) {
  return str.length <= num ? str : str.substring(0, num) + "...";
}

const UserImage = (image, size = "8") =>
  image ? (
    <img
      src={image}
      alt="User Avatar"
      className={`w-${size} h-${size} mr-2 rounded-full object-cover`}
    />
  ) : (
    <Icons.photo className={`w-${size} h-${size} mr-2`} />
  );

const AdminDashboard = () => {

 

  const { user } = useSelector((state) => state.profile);
  const {adminFilter} = useSelector((state) => state.adminFilter)
  const { data = {}, isLoading, error } = useGetAdminDashboardDataQuery(adminFilter) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formatDate = (date) => format(new Date(date), "d MMM yyyy");
  const formatTime = (date) => format(new Date(date), "h:mm a");


  const options = [
{
  value:10,
  label:10,
},
{
  value:20,
  label:20,
},
{
  value:30,
  label:30,
}
,
{
  value:"All",
  label:"All",
}
  ]


  const handleFilterChange = ( value , checked , label) => {
   dispatch(setAdminFilterData({[label]:value}))
  };






  return (
    <Dashboard>
      <header className="relative">
        <div className="flex h-16 p-2 justify-between items-center">
          <div className="ml-4 text-3xl font-inter font-bold flex lg:ml-0">
            <Link to="/">Dashboard</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full h-48 bg-richblue-100 rounded-xl">
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
            <Link to="/browse_auctions">
              <Button variant="white">Browse auctions</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && <div className="text-center">Loading data...</div>}
      {error && (
        <div className="text-red-500">
          Something went wrong. Please try again.
        </div>
      )}

      {/* Render content when data is loaded */}

      {!isLoading && !error && (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 mt-10 gap-2">
            {/* Auction Status Chart */}
            <AdminCharts
              title="Auction Status Chart"
              description="Displaying auction statistics"
              totalLabel="Total Auctions"
              chartData={[
                {
                  active: data?.data?.totalActiveAuctions,
                  nonActive: data?.data?.totalNonActiveAuctions,
                },
              ]}
              chartConfig={{
                active: {
                  label: "Active Auctions",
                  color: "hsl(var(--chart-1))",
                },
                nonActive: {
                  label: "Non-Active Auctions",
                  color: "hsl(var(--chart-2))",
                },
              }}
              dataKeys={["active", "nonActive"]}
            />

            {/* Total Bids Placed By Users */}
            <AdminCharts
              title="Total Bids Placed By Users"
              description="Displaying total bids statistics"
              totalLabel="Total Bids"
              chartData={[
                {
                  active: data?.data?.totalActiveBids,
                  nonActive: data?.data?.totalBidsPlaced,
                },
                
              ]}
              chartConfig={{
                active: { label: "Active Bids", color: "hsl(var(--chart-1))" },
                nonActive: {
                  label: "Non-Active Bids",
                  color: "hsl(var(--chart-2))",
                }
              }}
              dataKeys={["active", "nonActive"]}
            />

            {/* User's Status Chart */}
            <AdminCharts
              title="User's Status Chart"
              description="Displaying user statistics"
              totalLabel="Total Users"
              chartData={[
                {
                  active: data?.data?.totalActiveUsers,
                  nonActive: data?.data?.totalNonActiveUsers,
                },
              ]}
              chartConfig={{
                active: { label: "Active Users", color: "hsl(var(--chart-1))" },
                nonActive: {
                  label: "Non-Active Users",
                  color: "hsl(var(--chart-2))",
                },
              }}
              dataKeys={["active", "nonActive"]}
            />
          </div>
          <Separator className="w-full mt-6" />

          {/* Recent Winners Section */}
          <div className="my-10">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="text-xl m-2 font-semibold font-inter">
                Recent Auction Winners
              </div>
              <div className="text-xl text-muted-foreground flex items-center">
                
       

            <FilterDropdown options={options} onChange={handleFilterChange} currentValue={adminFilter?.recentWinnersLimit} currentLable={"recentWinnersLimit"} />


                <p className="text-sm">Recent Winners</p>
                <RiAuctionLine className="ml-2 font-semibold" />
              </div>
            </div>

            <div className="overflow-x-auto border rounded-lg">
              {data?.data?.RecentWinners.length > 0 ? (
                <table className="min-w-full table-auto">
                  <thead className="border-b">
                    <tr>
                      <th className="px-4 py-2 text-start">Car Name</th>
                      <th className="px-4 py-2 text-start">Winner</th>
                      <th className="px-4 py-2 text-start">Winning Bid</th>
                      <th className="px-4 py-2 text-start">End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.RecentWinners.map((winner) => (
                      <tr
                        key={winner._id}
                        className="border-b hover:bg-slate-100 cursor-pointer"
                        onClick={() =>
                          navigate(`/admin/all_auctions/${winner._id}`)
                        }
                      >
                        <td className="px-4 py-2 gap-2 flex items-center text-start">
                          <div>
                            <img
                              src={
                                winner.images[0]?.fileurl || "default-image-url"
                              }
                              className="w-16 h-16 object-cover rounded-md"
                              alt="Auction Image"
                            />
                          </div>
                          <div>{truncateString(winner.name, 40)}</div>
                        </td>
                        <td className="px-4 py-2 text-start">
                          {winner.highestBidder.username} <br />
                          <span className="text-muted-foreground text-xs">
                            {winner.highestBidder.email}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-start">
                          {formatPrice(winner.highestBid)}
                        </td>
                        <td className="px-4 py-2 text-start">
                          {formatDate(winner.endTime)} <br />
                          <span className="text-muted-foreground text-xs">
                            {formatTime(winner.endTime)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center border rounded-md p-4">
                  No recent winners available.
                </div>
              )}
            </div>
          </div>
          <Separator className="w-full mt-6" />

          {/* Draft Listings Section */}
          <div className="my-10">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="text-xl m-2 font-semibold font-inter">
                Draft Listings
              </div>
              <div className="text-xl text-muted-foreground flex items-center">
                
              <FilterDropdown options={options} currentValue={adminFilter?.draftListingsLimit} onChange={handleFilterChange} currentLable={"draftListingsLimit"} />

                <p className="text-sm">Recent Drafts</p>
              </div>
            </div>

            <div className="overflow-x-auto border rounded-lg">
              {data?.data?.DraftListings.length > 0 ? (
                <table className="min-w-full table-auto">
                  <thead className="border-b">
                    <tr>
                      <th className="px-4 py-2 text-start">Car Name</th>
                      <th className="px-4 py-2 text-start">Steps Completed</th>
                      <th className="px-4 py-2 text-start">Start At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.DraftListings.map((listing) => {
                      const stepsCompleted = [
                        listing.step1,
                        listing.step2,
                        listing.step3,
                      ].filter(Boolean).length;

                      // Calculate progress percentage (1 step = 33.33%)
                      const progressValue = (stepsCompleted / 3) * 100;

                      return (
                        <tr
                          key={listing._id}
                          className="border-b hover:bg-slate-100 cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/admin/all_listings/draft/vehicle/${listing._id}`
                            )
                          }
                        >
                          <td className="px-4 py-2 text-start">
                            {truncateString(listing.name, 40)}
                          </td>
                          <td className="px-4 py-2 text-start">
                            <div className="w-52 my-2">
                              <Progress value={progressValue} className="h-2" />
                            </div>
                            <span className="flex items-center gap-2">
                              {stepsCompleted} out of 3 steps completed
                              {stepsCompleted === 3 && (
                                <FaCheckCircle className="text-richblue-100" />
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-start">
                            {formatDate(listing.startTime)} <br />
                            <span className="text-muted-foreground text-xs">
                              {formatTime(listing.startTime)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center border rounded-md p-4">
                  No draft listings available.
                </div>
              )}
            </div>
          </div>

          <Separator className="w-full mt-6" />

          {/* Upcoming Auctions and New Users */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Upcoming Auctions */}
            <div className="mt-10">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="text-xl m-2 font-semibold">
                  Upcoming Auctions
                </div>
                <div className="text-xl text-muted-foreground flex items-center">

                <FilterDropdown options={options} currentValue={adminFilter?.upcomingAuctionsLimit} onChange={handleFilterChange} currentLable={"upcomingAuctionsLimit"} />

                  <p className="text-sm">Recent Auctions</p>
                  <CiCalendar className="ml-2" />
                </div>
              </div>

              <div className="overflow-x-auto border rounded-lg">
                {data?.data?.upcomingAuctions.length > 0 ? (
                  <table className="min-w-full table-auto">
                    <thead className="border-b">
                      <tr>
                        <th className="px-4 text-start py-2">Listing Name</th>
                        <th className="px-4 text-start py-2">Starting Bid</th>
                        <th className="px-4 text-start py-2">Start Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.data?.upcomingAuctions.map((auction) => (
                        <tr
                          key={auction._id}
                          className="text-center border-b hover:bg-slate-100 cursor-pointer"
                          onClick={() =>
                            navigate(`/admin/all_auctions/${auction._id}`)
                          }
                        >
                          <td className="px-4 py-2 gap-2 flex items-center text-start">
                            <div>
                              <img
                                src={
                                  auction.images[0]?.fileurl ||
                                  "default-image-url"
                                }
                                className="w-16 h-16 object-cover rounded-md"
                                alt="Auction Image"
                              />
                            </div>
                            <div>{truncateString(auction.name, 20)}</div>
                          </td>
                          <td className="px-4 py-2 text-start">
                            {formatPrice(auction.price)}
                          </td>
                          <td className="px-4 py-2 text-start">
                            {formatDate(auction.startTime)} <br />
                            <span className="text-muted-foreground text-xs">
                              {formatTime(auction.startTime)}
                            </span>
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

            {/* New Users */}
            <div className="mt-10">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="text-xl m-2 font-semibold">New Users</div>
                <div className="text-xl text-muted-foreground flex items-center">

                <FilterDropdown options={options} currentValue={adminFilter?.newUsersLimit} onChange={handleFilterChange} currentLable={"newUsersLimit"} />

                  <p className="text-sm">Recent Users</p>
                  <CiUser className="ml-2" />
                </div>
              </div>

              <div className="overflow-x-auto border rounded-lg">
                {data?.data?.newUsers.length > 0 ? (
                  <table className="min-w-full table-auto">
                    <thead className="border-b">
                      <tr>
                        <th className="px-4 py-2 text-start">Username</th>
                        <th className="px-4 py-2 text-start">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.data?.newUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b hover:bg-slate-100 cursor-pointer"
                          onClick={() =>
                            navigate(`/admin/all_users/${user._id}`)
                          }
                        >
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              {UserImage(user?.image)}
                              <div>
                                <span>{user?.username}</span>
                                <br />
                                <span className="text-muted-foreground text-xs">
                                  {user?.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-start">
                            {formatDate(user?.createdAt)} <br />
                            <span className="text-muted-foreground text-xs">
                              {formatTime(user?.createdAt)}
                            </span>
                          </td>
                        
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center border rounded-md p-4">
                    No new users registered.
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="w-full mt-6" />

          {/* Recent Bids on Cars Section */}
          <div className="my-10 mb-20">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="text-xl m-2 font-semibold font-inter">
                Recent Bids on Cars
              </div>
              <div className="text-xl text-muted-foreground flex items-center">
              <FilterDropdown options={options}  currentValue={adminFilter?.recentBidsLimit} onChange={handleFilterChange} currentLable={"recentBidsLimit"} />

                <p className="text-sm">Recent Bids</p>
                <RiAuctionLine className="ml-2 font-semibold" />
              </div>
            </div>

            <div className="overflow-x-auto border rounded-lg">
              {data?.data?.recentBidsOnCar.length > 0 ? (
                <table className="min-w-full table-auto">
                  <thead className="border-b">
                    <tr>
                      <th className="px-4 py-2 text-start">Car Name</th>
                      <th className="px-4 py-2 text-start">End Time</th>
                      <th className="px-4 py-2 text-start">Highest Bid</th>
                      <th className="px-4 py-2 text-start">Highest Bidder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.recentBidsOnCar.map((bid) => (
                      <tr
                        key={bid._id}
                        className="border-b hover:bg-slate-100 cursor-pointer"
                        onClick={() =>
                          navigate(`/admin/all_auctions/${bid._id}`)
                        }
                      >
                        <td className="px-4 py-2 gap-2 flex items-center text-start">
                          <div>
                            <img
                              src={
                                bid.images[0]?.fileurl || "default-image-url"
                              }
                              className="w-16 h-16 object-cover rounded-md"
                              alt="Auction Image"
                            />
                          </div>
                          <div>{truncateString(bid.name, 40)}</div>
                        </td>

                        <td className="px-4 py-2 text-start">
                          {formatDate(bid.endTime)} <br />
                          <span className="text-muted-foreground text-xs">
                            {formatTime(bid.endTime)}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-start">
                          {formatPrice(bid.highestBid)}
                        </td>
                        <td className="px-4 py-2 text-start">
                          {bid.highestBidder?.username} <br />
                          <span className="text-muted-foreground text-xs">
                            {bid.highestBidder?.email}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center border rounded-md p-4">
                  No recent bids available.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Dashboard>
  );
};

export default AdminDashboard;






export const FilterDropdown = ({ options = [], onChange , currentValue , currentLable }) => {
  const [selectedValue, setSelectedValue] = useState(currentValue);

  const label = 'Filter';

  useEffect(() => {
    setSelectedValue(currentValue);
  }, [currentValue]);

  const handleSelectionChange = (value, checked) => {
    const newValue = checked ? value : null;
    setSelectedValue(newValue);

    if (onChange) {
      onChange(newValue, checked,currentLable );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="mr-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-richblue-50 cursor-pointer">
          <Icons.filter2 className="w-6 h-6 text-richblue-100" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedValue === option.value}
            onCheckedChange={(checked) => handleSelectionChange(option.value, checked)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
