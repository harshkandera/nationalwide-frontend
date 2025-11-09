"use client";
import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { CommandLoading } from "cmdk";
import { useSearchAddress } from "./use-search-address";

const SearchAddress = ({ onSelectLocation ,defaultValue }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const {
    query,
    results,
    loading,
    handleSearch,
    selectedItem,
    setSelectedItem,
  } = useSearchAddress();

  // Helper function to find selected item in results
  const findSelectedItem = (type, currentValue) => {
    return results[type]?.find(item => item.label === currentValue) || null;
  };

  // Helper function to handle item selection
  const handleItemSelect = (type, currentValue) => {
    const item = findSelectedItem(type, currentValue);
    setValue(currentValue === value ? "" : currentValue);
    setSelectedItem(item);
    onSelectLocation(item);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between truncate"
        >
          <p className="truncate">
            
            {selectedItem
              ? `${selectedItem.label} (${selectedItem.raw.entityType})`
              : "Select place..."}

          </p>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search the place..."
            onValueChange={handleSearch}
            className="w-full"
          />
          <CommandList>
            {loading ? (
              <CommandLoading>
                <CommandEmpty>Type to search</CommandEmpty>
              </CommandLoading>
            ) : Object.keys(results).length > 0 ? (
              Object.entries(results).map(([type, items]) => (
                <CommandGroup
                  key={type}
                  heading={type.charAt(0).toUpperCase() + type.slice(1)}
                >
                  {items && items.map((item, index) => (
                    <CommandItem
                      key={`${type}-${index}`}
                      value={item.label}
                      onSelect={(currentValue) => handleItemSelect(type, currentValue)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.label ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchAddress;