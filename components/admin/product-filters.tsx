"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProductFiltersProps {
  onSearch: (query: string) => void;
  onSort: (field: string, order: "asc" | "desc") => void;
  onFilter: (filters: any) => void;
  isLoading?: boolean;
}

const SORT_OPTIONS = [
  { value: "created_at-desc", label: "Newest First" },
  { value: "created_at-asc", label: "Oldest First" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "stock-asc", label: "Stock: Low to High" },
  { value: "stock-desc", label: "Stock: High to Low" },
];

const CATEGORY_OPTIONS = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Other",
];

export function ProductFilters({
  onSearch,
  onSort,
  onFilter,
  isLoading,
}: ProductFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("created_at-desc");
  const [category, setCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      onSearch(value);
    },
    [onSearch],
  );

  const handleSort = (value: string) => {
    setSortValue(value);
    const [field, order] = value.split("-") as [string, "asc" | "desc"];
    onSort(field, order);
  };

  const handleFilterChange = () => {
    onFilter({
      category: category || null,
      stock: stockFilter || null,
    });
  };

  const handleReset = () => {
    setSearchQuery("");
    setSortValue("created_at-desc");
    setCategory("");
    setStockFilter("");
    onSearch("");
    onSort("created_at", "desc");
    onFilter({});
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={isLoading}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          title="Toggle filters"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Sort Dropdown */}
      <Select value={sortValue} onValueChange={handleSort} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4 space-y-4">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select
              value={category}
              onValueChange={setCategory}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {CATEGORY_OPTIONS.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Stock Status
            </label>
            <Select
              value={stockFilter}
              onValueChange={setStockFilter}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Stock Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Stock Levels</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock (&lt; 5)</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Apply Filters Button */}
          <div className="flex gap-2">
            <Button onClick={handleFilterChange} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
