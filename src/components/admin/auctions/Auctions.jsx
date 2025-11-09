import React from "react";
import MaxWidthWrapper from "../../../component/MaxWidthWrapper";
import { Icons } from "../../../assests/Icons";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Separator } from "../../../component/ui/separator";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../component/ui/table";
import { useEffect, useState } from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { Button, buttonVariants } from "../../../component/ui/button";
import { Checkbox } from "../../../component/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "../../../component/ui/dropdown-menu";
import { Badge } from "../../../component/ui/badge";
import { Input } from "../../../component/ui/input";
import { useSelector, useDispatch } from "react-redux";
import Dashboard from "../Dashboard";
import { IoIosArrowBack } from "react-icons/io";
import { useGetAuctionsQuery } from "../../../slices/apiSlices/carListingApiSlice";
import { toast } from "../../../component/ui/use-toast";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { format } from "date-fns";
import { formatPrice } from "../../../lib/utils";
import {
  setAllAuctionCategory,
  setAllAuctionStatus,
} from "../../../slices/adminFilter";

const AllAuctions = () => {
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const { allAuctionCategory, 
    allAuctionStatus
   } = useSelector(
    (state) => state.adminFilter
  );
  const limit = 30;
  const {
    data: cars,
    isLoading,
    isError,
    error,
  } = useGetAuctionsQuery({
    status: allAuctionStatus,
    page,
    limit,
    category: allAuctionCategory,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [selectedTimeType, setSelectedTimeType] = useState("endTime");
  const dispatch = useDispatch();

  const handleNextPage = () => {
    if (cars?.pages && page < cars.pages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const formatDate = (date) => {
    if (!date) return "NAN";
    const formattedDate = format(new Date(date), "d MMM yyyy");
    return formattedDate;
  };

  const formatTime = (date) => {
    if (!date) return;
    const formattedTime = format(new Date(date), "h:mm a");
    return formattedTime;
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const location = useLocation();
  const { params } = useParams();

  const timeTypes = ["startTime", "endTime", "created"];

  const handleHeaderClick = () => {
    const currentIndex = timeTypes.indexOf(selectedTimeType);
    const nextIndex = (currentIndex + 1) % timeTypes.length;
    setSelectedTimeType(timeTypes[nextIndex]);
  };

  useEffect(() => {
    if (cars) {
      const formattedData = cars?.auctions?.map((item) => ({
        id: item?._id,
        name: item?.name,
        images: item?.images,
        startTime: item?.startTime,
        endTime: item?.endTime,
        totalBids: item?.totalBids,
        status: item?.status,
        highestBid: item?.highestBid,
        created: item?.created_at,
        startingBid: item?.price,
        make: item?.vehicleFeatures?.vehicleInformation?.make,
        model: item?.vehicleFeatures?.vehicleInformation?.model,
        year: item?.vehicleFeatures?.vehicleInformation?.registration_year,
      }));
      setData(formattedData);
    }
  }, [cars]);

  const handleRowSelectionChange = (id, isSelected) => {
    setSelectedRowIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (isSelected) {
        newSelectedIds.add(id);
      } else {
        newSelectedIds.delete(id);
      }
      return newSelectedIds;
    });

    console.log(selectedRowIds);
  };

  const columns = [
    {
      accessorKey: "images",
      header: () => {
        return (
          <div className="flex-1 text-sm text-muted-foreground">
            {cars?.total} out of {cars?.totalAuctions}
          </div>
        );
      },
      cell: ({ row }) => {
        const images = row.getValue("images");
        const currentIndex = currentImageIndex[row.original.id] || 0;
        const currentImage = images[currentIndex]?.fileurl;

        return (
          <div className="capitalize">
            <div
              className="h-20 w-28 bg-gray-400 rounded-md cursor-pointer"
              onClick={() => {
                setCurrentImageIndex((prev) => ({
                  ...prev,
                  [row.original.id]: (currentIndex + 1) % images.length, // Cycle through images
                }));
              }}
            >
              <img
                src={currentImage}
                alt={`Image`}
                className="h-20 w-28 object-cover rounded-md"
              />
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize font-semibold">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "make",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Make
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize font-semibold">{row.getValue("make")}</div>
      ),
    },
    {
      accessorKey: "model",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Model
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize font-semibold">{row.getValue("model")}</div>
      ),
    },
    {
      accessorKey: "year",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize font-semibold">{row.getValue("year")}</div>
      ),
    },
    {
      accessorKey: selectedTimeType,
      header: () => {
        return (
          <Button
            variant="ghost"
            onClick={handleHeaderClick}
            className="cursor-pointer"
          >
            Date ({selectedTimeType})
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        // Get raw date values instead of formatted strings
        const startTime = row.getValue("startTime");
        const endTime = row.getValue("endTime");
        const createdTime = row.getValue("created");

        let displayedTime;
        switch (selectedTimeType) {
          case "startTime":
            displayedTime = startTime;
            break;
          case "endTime":
            displayedTime = endTime;
            break;
          case "created":
            displayedTime = createdTime;
            break;
          default:
            displayedTime = startTime; // Fallback
        }

        return (
          <div className="flex flex-col">
            <div className="font-semibold">{formatDate(displayedTime)}</div>
            <div className="text-muted-foreground text-xs">
              {formatTime(displayedTime)}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "startingBid",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Starting Bid
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-semibold">
            {formatPrice(row.getValue("startingBid"))}
          </div>
        </div>
      ),
    },

    {
      accessorKey: "highestBid",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bid
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-semibold">
            {formatPrice(row.getValue("highestBid"))}
          </div>
          <div className="text-muted-foreground text-xs">
            ({row.original.totalBids}) bids
          </div>
        </div>
      ),
    },
  ];

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Dashboard>
      <div className="bg-white font-inter  max-w-screen mx-auto ">
        <header className="relative bg-white ">
          <div className="flex h-10 p-2 justify-between items-center">
            <div className="ml-4 text-3xl font-bold font-inter flex lg:ml-0">
              <Link href="/">All Auctions</Link>
            </div>
          </div>
        </header>

        <div className="w-full h-20 mt-4 bg-richblue-100 rounded-xl  ">
          <div className="p-6 flex gap-2 items-center">
            <Button
              variant="secondary"
              onClick={goBack}
              className="font-bold p-0 text-foreground-muted h-10 w-10 rounded-md"
            >
              <IoIosArrowBack className="text-lg text-muted-foreground" />
            </Button>

            <div className="text-xl font-bold font-inter text-white">
              See All Auctions here!
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-center gap-4 flex-wrap py-4">
            <Input
              placeholder="Filter car name..."
              value={table.getColumn("name")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Filter <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* Status Filter Submenu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        
                        <DropdownMenuItem onClick={() => dispatch(setAllAuctionStatus("live"))}>
                          <Checkbox
                            className="mr-2"
                            checked={allAuctionStatus === "live"}
                            readOnly
                          />
                          Live
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => dispatch(setAllAuctionStatus("upcoming"))}>
                          <Checkbox
                            className="mr-2"
                            checked={allAuctionStatus === "upcoming"}
                            readOnly
                          />
                          Upcoming
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => dispatch(setAllAuctionStatus("past"))}>
                          <Checkbox
                            className="mr-2"
                            checked={allAuctionStatus === "past"}
                            readOnly
                          />
                          Expired
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => dispatch(setAllAuctionStatus("active"))}>
                          <Checkbox
                            className="mr-2"
                            checked={allAuctionStatus === "active"}
                            readOnly
                          />
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => dispatch(setAllAuctionStatus("all"))}>
                          <Checkbox
                            className="mr-2"
                            checked={allAuctionStatus === "all"}
                            readOnly
                          />
                          All
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  {/* Category Filter Submenu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() =>
                            dispatch(setAllAuctionCategory("cars"))
                          }
                        >
                          <Checkbox
                            className="mr-2"
                            checked={allAuctionCategory === "cars"}
                            readOnly
                          />
                          Cars
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            dispatch(setAllAuctionCategory("construction"))
                          }
                        >
                          <Checkbox
                            className="mr-2"
                            checked={allAuctionCategory === "construction"}
                            readOnly
                          />
                          Construction Equipment
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="w-full  max-w-full overflow-x-auto sm:max-w-4xl md:max-w-5xl ">
            <Table className="min-w-full border-none">
              <TableHeader className="border-none">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="border-none">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody className="border-none">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-none cursor-pointer"
                      onClick={() =>
                        navigate(`/admin/all_auctions/${row.original.id}`)
                      }
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="border-none">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {isLoading ? (
                        <div>Loading auctions...</div>
                      ) : isError ? (
                        <div className="text-red-500">
                          Error fetching auctions: {error.message}
                        </div>
                      ) : data.length === 0 ? (
                        <div>No results found</div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center mb-16 justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Page {cars?.page} of {cars?.pages} page(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={page <= 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page >= cars?.pages || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default AllAuctions;
