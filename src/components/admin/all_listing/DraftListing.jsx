import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
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
import { Input } from "../../../component/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../component/ui/table";
import {
  useDraftListingsQuery,
  useUpdateStatusMutation,
  useDeleteCarsMutation,
  useEditBiddingDateMutation,
} from "../../../slices/apiSlices/carListingApiSlice";
import { format } from "date-fns";
import { formatPrice } from "../../../lib/utils";
import { Link } from "react-router-dom";
import { Badge } from "../../../component/ui/badge";
import { toast } from "../../../component/ui/use-toast";
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
import { useSelector, useDispatch } from "react-redux";
import { setCategory } from "../../../slices/adminFilter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../component/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../../../component/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const BiddingDateSchema = z.object({
  startTime: z
    .string()
    .min(1, "Start Time is required")
    .refine(
      (value) => {
        const today = new Date();
        const startTimeDate = new Date(value);
        return startTimeDate >= today;
      },
      { message: "Start Time cannot be in the past" }
    ),
  endTime: z
    .string()
    .min(1, "End Time is required")
    .refine(
      (value, ctx) => {
        const startTime = ctx?.parent?.startTime
          ? new Date(ctx.parent.startTime)
          : null;
        const endTimeDate = new Date(value);
        return startTime ? endTimeDate > startTime : true;
      },
      { message: "End Time must be after Start Time" }
    ),
  status: z.boolean().optional(),
});

export default function DataTableDemo() {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(BiddingDateSchema),
    defaultValues: {
      startTime: "",
      endTime: "",
      status: false,
    },
  });

  const formatDate = (date) => {
    const formattedDate = format(new Date(date), "d MMM yyyy");
    return formattedDate;
  };

  const formatTime = (date) => {
    const formattedTime = format(new Date(date), "h:mm a");
    return formattedTime;
  };

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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          size="sm"
          className={`capitalize rounded-full text-xs font-normal ${
            row.getValue("status") === "draft"
              ? " bg-red-500 hover:bg-red-500"
              : row.getValue("status") === "live"
              ? "bg-richblue-100 hover:bg-richblue-100"
              : " bg-green-500 hover:bg-green-500 "
          }`}
        >
          {row.getValue("status")}
        </Badge>
      ),
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
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        return (
          <div className="text-right font-medium">
            {formatPrice(amount, { currency: "USD" })}
          </div>
        );
      },
    },

    {
      accessorKey: "created",
      header: () => <div className="text-right">Created At</div>,
      cell: ({ row }) => {
        const date = row.getValue("created");

        return (
          <div className="flex flex-col">
            <div className="font-semibold">{formatDate(date)}</div>
            <div className="text-muted-foreground text-xs">
              {formatTime(date)}
            </div>
          </div>
        );
      },
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const carId = row.original;
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

              <DropdownMenuSeparator />

              <Link to={`/admin/all_listings/draft/vehicle/${carId?.id}`}>
                <DropdownMenuItem>Set Car Details</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const { category } = useSelector((state) => state.adminFilter);
  const dispatch = useDispatch();
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const {
    data: Listings,
    error,
    isLoading,
    isError,
  } = useDraftListingsQuery(category);
  const [updateStatus, { isLoading: loading }] = useUpdateStatusMutation();
  const [editBiddingDate, { isLoading: editBiddingDateLoading }] =
    useEditBiddingDateMutation();
  const [data, setData] = useState([]);
  const [deleteCars] = useDeleteCarsMutation();

  useEffect(() => {
    setData([]);

    Listings?.draftListings?.forEach((item) => {
      setData((prev) => [
        ...prev,
        {
          id: item._id,
          status: item.status,
          amount: item.price,
          created: item.created_at,
          name: item.name,
        },
      ]);
    });
  }, [Listings]);

  const EditDateBiddingHandler = async (data) => {
    try {
      if (
        data.endTime &&
        data.startTime &&
        new Date(data.endTime) <= new Date(data.startTime)
      ) {
        form.setError("endTime", {
          type: "manual",
          message: "End Time must be later than Start Time",
        });
        return;
      }

      const selectedRowIdsArray = Array.from(selectedRowIds);

      if (selectedRowIdsArray.length === 0) {
        return toast({
          title: "Select to make changes.",
          variant: "destructive",
        });
      }
      const formData = {
        carIds: selectedRowIdsArray,
        data,
      };

      const response = await editBiddingDate(formData).unwrap();

      toast({
        title: `Listing Date Changed Successfully`,
      });
    } catch (err) {
      toast({
        title: "Failed to Change Date of Listings",
        description:
          err.data.message ||
          data.message ||
          "An error occurred while changing Date of the Listing. Please try again later.",
        variant: "destructive",
      });

      console.error(err);
    }
  };

  const DeleteCarsHandler = async () => {
    try {
      const selectedRowIdsArray = Array.from(selectedRowIds);
      if (selectedRowIdsArray.length === 0) {
        return toast({
          title: "Select to make changes.",
          variant: "destructive",
        });
      }
      const formData = {
        carIds: selectedRowIdsArray,
      };

      const response = await deleteCars(formData).unwrap();

      toast({
        title: `Listing Deleted Successfully`,
      });
    } catch (err) {
      toast({
        title: "Failed to delete Listing",
        description:
          err.data.message ||
          data.message ||
          "An error occurred while Deleting the Listing. Please try again later.",
        variant: "destructive",
      });

      console.error(err);
    }
  };

  const RoleChangeHandler = async (status) => {
    try {
      const selectedRowIdsArray = Array.from(selectedRowIds);

      if (selectedRowIdsArray.length === 0) {
        return toast({
          title: "Select to make changes.",
          variant: "destructive",
        });
      }

      const formData = {
        carIds: selectedRowIdsArray,
        status: status,
      };

      const response = await updateStatus(formData).unwrap();

      toast({
        title: `Changed status To ${status} Successfully`,
      });
    } catch (err) {
      toast({
        title: "Failed to change status",
        description:
          err.data.message ||
          data.message ||
          "An error occurred while changing the status. Please try again later.",
        variant: "destructive",
      });

      console.error(err);
    }
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
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
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Listings By name..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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

        {selectedRowIds.size > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Edit Date
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Bidding Date</DialogTitle>
                <DialogDescription>
                  Make Changes to Starting and Ending Bidding Date
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(EditDateBiddingHandler)}
                    className="flex flex-col gap-4 font-normal text-base justify-center items-center"
                  >
                    <div className="grid grid-cols-4 items-center gap-4">
                      {/* Start Time Field */}
                      <FormField
                        name="startTime"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                min={new Date().toISOString().slice(0, -8)}
                                className="border-[1px] ring-0 rounded-md p-6 w-96 focus:outline-0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      {/* End Time Field */}
                      <FormField
                        name="endTime"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                className="border-[1px] ring-0 rounded-md p-6 w-96 focus:outline-0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid  items-start w-full gap-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Change Status</FormLabel>
                              <FormDescription>
                                Change status to live for all selected listing
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        disabled={editBiddingDateLoading}
                        className="w-full"
                      >
                        {editBiddingDateLoading ? (
                          <span className="loader"></span>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        )}
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
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => {
                        RoleChangeHandler("draft");
                      }}
                    >
                      Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        RoleChangeHandler("live");
                      }}
                    >
                      Live
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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
                This action cannot be undone. This will permanently delete the
                selected entries.
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
                  onClick={DeleteCarsHandler}
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
              Filter <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Status Filter */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => {
                      table.getColumn("status")?.setFilterValue("draft");
                    }}
                  >
                    <Checkbox
                      className="mr-2"
                      checked={
                        table.getColumn("status")?.getFilterValue() === "draft"
                      }
                      readOnly
                    />
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      table.getColumn("status")?.setFilterValue("live");
                    }}
                  >
                    <Checkbox
                      className="mr-2"
                      checked={
                        table.getColumn("status")?.getFilterValue() === "live"
                      }
                      readOnly
                    />
                    Live
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      table.getColumn("status")?.setFilterValue("past");
                    }}
                  >
                    <Checkbox
                      className="mr-2"
                      checked={
                        table.getColumn("status")?.getFilterValue() === "past"
                      }
                      readOnly
                    />
                    Past
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      table.getColumn("status")?.setFilterValue(""); // Clear filter to show all
                    }}
                  >
                    <Checkbox
                      className="mr-2"
                      checked={!table.getColumn("status")?.getFilterValue()}
                      readOnly
                    />
                    All
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            {/* Category Filter */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => {
                      dispatch(setCategory("cars"));
                    }}
                  >
                    <Checkbox
                      className="mr-2"
                      checked={category === "cars"}
                      readOnly
                    />
                    Cars
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      dispatch(setCategory("construction"));
                    }}
                  >
                    <Checkbox
                      className="mr-2"
                      checked={category === "construction"}
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-red-500"
                >
                  Error: {error?.message || "Failed to load data"}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center mb-16 justify-end space-x-2 py-4">
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
  );
}
