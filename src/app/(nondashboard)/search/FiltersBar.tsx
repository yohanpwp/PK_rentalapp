"use client";
import { FilterState, setFilters } from "@/state";
import { useAppSelector } from "@/state/redux";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { cleanParams, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const FiltersBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const isFilltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const [searchInput, setSearchInput] = useState("");

  const updateURL = debounce((newFilters: FilterState) => {
    const cleanFilters = cleanParams(newFilters);
    const updatedSearchParams = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : value.toString()
      );
    });
    router.push(`${pathname}?${updatedSearchParams.toString()}`);
  });

  const handleFilterChange = (
    key: string,
    value: any,
    isMin: boolean | null
  ) => {
    let newValue = value;

    if (key === "priceRange" || key == "squareFeet") {
      const currentArrayRange = [...filters[key]];
      if (isMin !== null) {
        const index = isMin ? 0 : 1;
        currentArrayRange[index] = value === "any" ? null : value;
      }
      newValue = currentArrayRange;
    } else if (key === "coordinates") {
      newValue = value === "any" ? [0, 0] : value.map(Number);
    } else {
      newValue = value === "any" ? "any" : value;
    }

    const newFilters = { ...filters, [key]: newValue };
    dispatch(setFilters(newFilters));
    updateURL(newFilters);
  };

  return <div className="flex justify-between items-center w-full py-5">
    {/* <Filters /> */}
    <div className="flex justify-between items-center gap-4 p-2">
        {/* All Filters */}
        <Button
        variant={'outline'}
        className={cn(
            'gap-2 rounded-xl border-primary-400 hover:bg-primary-500 hover:text-primary-100',
            isFilltersFullOpen && 'bg-primary-700 text-primary-100'
        )}
        >
            <Filter className="w-4 h-4" />
            <span>All Filters</span>
        </Button>
    </div>
  </div>;
};

export default FiltersBar;
