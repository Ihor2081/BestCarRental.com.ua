"use client";

import { useState } from "react";

interface SortProps {
  onSortChange: (sortOption: SortOption) => void;
}

export type SortOption = "recommended" | "price_asc" | "price_desc";

export default function Sort({ onSortChange }: SortProps) {
  const [selected, setSelected] = useState<SortOption>("recommended");

  const handleChange = (value: SortOption) => {
    setSelected(value);
    onSortChange(value);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-gray-600 font-semibold text-sm">Sort by:</label>
      <select
        value={selected}
        onChange={(e) => handleChange(e.target.value as SortOption)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
      >
        <option value="recommended">Recommended</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}