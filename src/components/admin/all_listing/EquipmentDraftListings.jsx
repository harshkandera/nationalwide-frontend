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

export default function DataTableDemo() {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
            {formatPrice(amount, { currency: "EUR" })}
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

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());

  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { data: Listings, error, isLoading, isError } = useDraftListingsQuery();
  const [updateStatus , { isLoading: loading }] = useUpdateStatusMutation();
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
    getPaginationRowModel: getPaginationRowModel(),
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
              Filter <ChevronDownIcon className=" h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => {
                      table.getColumn("status")?.setFilterValue("draft");
                    }}
                  >
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      table.getColumn("status")?.setFilterValue("live");
                    }}
                  >
                    Live
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      table.getColumn("status")?.setFilterValue("past");
                    }}
                  >
                    Past
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
