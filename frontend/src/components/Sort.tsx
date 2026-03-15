"use client";

import { useState } from "react";

export type SortOption =
  | "recommended"
  | "price_low"
  | "price_high";

type Props = {
  onSortChange: (option: SortOption) => void;
};

export default function Sort({ onSortChange }: Props) {

  const [sort, setSort] = useState<SortOption>("recommended");

  const handleChange = (value: SortOption) => {

    setSort(value);
    onSortChange(value);

  };

  return (
    <div className="flex items-center gap-2">

      <span className="text-sm text-gray-500">
        Sort by:
      </span>

      <select
        value={sort}
        onChange={(e) =>
          handleChange(e.target.value as SortOption)
        }
        className="border rounded-lg px-3 py-2 bg-white text-sm"
      >

        <option value="recommended">
          Recommended
        </option>

        <option value="price_low">
          Price: Low → High
        </option>

        <option value="price_high">
          Price: High → Low
        </option>

      </select>

    </div>
  );
}