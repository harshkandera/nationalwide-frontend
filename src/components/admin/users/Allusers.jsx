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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../component/ui/alert-dialog";
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
import {
  useGetUsersQuery,
  useDeleteUsersMutation,
  useChangeRoleMutation,
} from "../../../slices/apiSlices/carListingApiSlice";
import { toast } from "../../../component/ui/use-toast";

const AllUser = () => {
  const [isAuthorizeDialogOpen, setAuthorizeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const { data: users, isLoading, error, isError } = useGetUsersQuery();

  const [deleteUsers] = useDeleteUsersMutation();

  const [changeRole] = useChangeRoleMutation();

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const location = useLocation();
  const { params } = useParams();

  useEffect(() => {
    setUserData(users);
  }, [users]);

  useEffect(() => {
    setData([]);

    userData?.forEach((item) => {
      setData((prev) => [
        ...prev,
        {
          id: item?._id,
          role: item?.accountType,
          email: item?.email,
          username: item?.username,
          image: item?.image,
          phone: item?.phone,
          totalBids: item?.biddingHistoryCount,
          activeBids: item?.activeBidsCount,
        },
      ]);
    });
  }, [userData]);

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

  const UsersDeleteHandler = async () => {
    try {
      console.log(selectedRowIds);

      const selectedRowIdsArray = Array.from(selectedRowIds);

      console.log(selectedRowIdsArray);

      if (selectedRowIdsArray.length === 0) {
        return toast({
          title: "Select User to Delete",

          variant: "destructive",
        });
      }

      const response = await deleteUsers({
        userIds: selectedRowIdsArray,
      }).unwrap();

      // setUserData(response?.data?.remainingUsers)

      toast({
        title: "User Deleted Successfully",
      });
    } catch (err) {
      toast({
        title: "Failed to Delete Users",
        description:
          err.message ||
          data.message ||
          "An error occurred while Deleting the users . Please try again later.",
        variant: "destructive",
      });

      console.error(err);
    }
  };

  const RoleChangeHandler = async ({ userId, newRole }) => {
    // const selectedRowIdsArray = Array.from(selectedRowIds);

    try {
      if (!userId || !newRole) {
        return toast({
          title: "userId and New Role is Required",

          variant: "destructive",
        });
      }

      const response = await changeRole({ userId, newRole }).unwrap();

      // setUserData(response?.data?.users)

      toast({
        title: "User's role changed Successfully",
      });
    } catch (err) {
      toast({
        title: "Failed to Change Role",
        description:
          err.message ||
          data.message ||
          "An error occurred while Changing the role of users . Please try again later.",
        variant: "destructive",
      });

      console.error(err);
    }
  };

  const UserImage = ({ image, size = "10" }) =>
    image ? (
      <img
        src={image}
        alt="User Avatar"
        className={`w-${size} h-${size} mr-2 rounded-full object-cover`}
      />
    ) : (
      <Icons.photo className={`w-${size} h-${size} mr-2`} />
    );

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              const allIds = table
                .getRowModel()
                .rows.map((row) => row.original.id);
              setSelectedRowIds(new Set(allIds));
            } else {
              setSelectedRowIds(new Set());
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            handleRowSelectionChange(row.original.id, value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "image",
      header: "",
      cell: ({ row }) => (
        <div className="capitalize">
          <UserImage image={row.getValue("image")} />{" "}
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        // <div className="capitalize">{row.getValue("verified")}</div>
        <Badge
          variant={row.getValue("role") === "User" ? "default" : "destructive"}
          size="sm"
        >
          {row.getValue("role")}
        </Badge>
      ),
    },

    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },

    {
      accessorKey: "phone",
      header: () => "Phone no.",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("phone")}</div>
      ),
    },

    {
      accessorKey: "activeBids",
      header: () => "Active Bids",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("activeBids")}</div>
      ),
    },
    {
      accessorKey: "totalBids",
      header: () => "Total Bids",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("totalBids")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const userId = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <Link to={`/admin/all_users/${userId?.id}`}>
                <DropdownMenuItem>View User</DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Change role</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedRowIds(new Set([userId?.id.toString()]));
                        RoleChangeHandler({
                          userId: userId?.id,
                          newRole: "Admin",
                        });
                      }}
                    >
                      Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedRowIds(new Set([userId?.id.toString()]));
                        RoleChangeHandler({
                          userId: userId?.id,
                          newRole: "User",
                        });
                      }}
                    >
                      User
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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
              <Link href="/">All Users</Link>
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
              See All Users here!
            </div>
          </div>
        </div>

        <div className="w-full mb-20">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter emails..."
              value={table.getColumn("email")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />

            {selectedRowIds.size > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Actions <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <AlertDialog
              open={isAuthorizeDialogOpen}
              onOpenChange={setAuthorizeDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="hidden">
                  Open Authorize Dialog
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will authorize the
                    selected entries.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="ghost">Cancel</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant="filled">Continue</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="hidden">
                  Open Delete Dialog
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the selected entries.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="ghost">Cancel</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      variant="destructive"
                      className={buttonVariants({ variant: "destructive" })}
                      onClick={UsersDeleteHandler}
                    >
                      {" "}
                      Delete{" "}
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDownIcon className="h-4 w-4" />
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
                  Filter <ChevronDownIcon className=" h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    const activeBidsColumn = table.getColumn("activeBids");
                    if (activeBidsColumn) {
                      console.log(
                        "activeBids column found. Applying filter..."
                      );
                      activeBidsColumn.setFilterValue((prevValue) => {
                        console.log("Previous filter value:", prevValue);
                        // Set the filter for active users with more than 0 bids
                        return "> 0";
                      });
                    } else {
                      console.error("activeBids column not found!");
                    }
                  }}
                >
                  Active Users
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>verified user</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => {
                          table.getColumn("role")?.setFilterValue("Admin");
                        }}
                      >
                        Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          table.getColumn("role")?.setFilterValue("User");
                        }}
                      >
                        User
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
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
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div>Loading users...</div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="text-red-500">
                        Error fetching auctions:{" "}
                        {error?.message || "An error occurred"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border cursor-pointer"
                     
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
                      <div>No results found</div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
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

export default AllUser;
