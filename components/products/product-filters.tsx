"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X } from "lucide-react";

interface ProductFiltersProps {
  categories: string[];
  brands: string[];
  currentCategory?: string;
  currentBrand?: string;
  currentSort?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

export function ProductFilters({
  categories,
  brands,
  currentCategory,
  currentBrand,
  currentSort,
  currentMinPrice,
  currentMaxPrice,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams],
  );

  const updateFilter = (name: string, value: string | null) => {
    const queryString = createQueryString(name, value);
    router.push(`/products${queryString ? `?${queryString}` : ""}`);
  };

  const clearAllFilters = () => {
    router.push("/products");
  };

  const hasActiveFilters =
    currentCategory || currentBrand || currentMinPrice || currentMaxPrice;

  return (
    <div className="space-y-6">
      {/* Sort */}
      <div className="space-y-2">
        <Label>Sort by</Label>
        <Select
          value={currentSort || "newest"}
          onValueChange={(value) =>
            updateFilter("sort", value === "newest" ? null : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Active Filters</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-auto p-0 text-xs"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentCategory && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateFilter("category", null)}
                className="h-7 gap-1 text-xs"
              >
                {currentCategory}
                <X className="h-3 w-3" />
              </Button>
            )}
            {currentBrand && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateFilter("brand", null)}
                className="h-7 gap-1 text-xs"
              >
                {currentBrand}
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      <Accordion
        type="multiple"
        defaultValue={["category", "brand", "price"]}
        className="w-full"
      >
        {/* Categories */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-medium">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    updateFilter(
                      "category",
                      currentCategory === category ? null : category,
                    )
                  }
                  className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                    currentCategory === category
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm font-medium">
            Brand
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() =>
                    updateFilter("brand", currentBrand === brand ? null : brand)
                  }
                  className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                    currentBrand === brand
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Min</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={currentMinPrice || ""}
                  onChange={(e) =>
                    updateFilter("minPrice", e.target.value || null)
                  }
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={currentMaxPrice || ""}
                  onChange={(e) =>
                    updateFilter("maxPrice", e.target.value || null)
                  }
                  className="h-8"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
