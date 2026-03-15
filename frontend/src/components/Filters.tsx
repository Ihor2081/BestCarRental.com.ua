"use client";

import { useState } from "react";

export type FiltersState = {
  priceRange: [number, number];
  transmission: string[];
  fuel_type: string[];
  passengers: number[];
  luggage: number[];
  features: string[];
};

type Props = {
  onFilterChange: (filters: FiltersState) => void;
};

export default function Filters({ onFilterChange }: Props) {

  const [filters, setFilters] = useState<FiltersState>({
    priceRange: [0, 500],
    transmission: [],
    fuel_type: [],
    passengers: [],
    luggage: [],
    features: [],
  });

  const updateFilters = (newFilters: FiltersState) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleStringFilter = (
    field: keyof FiltersState,
    value: string
  ) => {

    const current = filters[field] as string[];

    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const newFilters = {
      ...filters,
      [field]: updated
    };

    updateFilters(newFilters);
  };

  const toggleNumberFilter = (
    field: keyof FiltersState,
    value: number
  ) => {

    const current = filters[field] as number[];

    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const newFilters = {
      ...filters,
      [field]: updated
    };

    updateFilters(newFilters);
  };

  return (
    <aside className="w-full lg:w-64 space-y-8">

      {/* PRICE RANGE */}

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>

        <div className="flex gap-2">

          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => {

              const newFilters = {
                ...filters,
                priceRange: [Number(e.target.value), filters.priceRange[1]]
              };

              updateFilters(newFilters);

            }}
            className="w-full border rounded-lg p-2"
            placeholder="Min"
          />

          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => {

              const newFilters = {
                ...filters,
                priceRange: [filters.priceRange[0], Number(e.target.value)]
              };

              updateFilters(newFilters);

            }}
            className="w-full border rounded-lg p-2"
            placeholder="Max"
          />

        </div>
      </div>


      {/* TRANSMISSION */}

      <div>

        <h3 className="font-semibold mb-3">Transmission</h3>

        <label className="flex items-center gap-2">

          <input
            type="checkbox"
            onChange={() =>
              toggleStringFilter("transmission", "automatic")
            }
          />

          Automatic

        </label>

        <label className="flex items-center gap-2">

          <input
            type="checkbox"
            onChange={() =>
              toggleStringFilter("transmission", "mechanic")
            }
          />

          Manual

        </label>

      </div>


      {/* FUEL TYPE */}

      <div>

        <h3 className="font-semibold mb-3">Fuel Type</h3>

        <label className="flex items-center gap-2">

          <input
            type="checkbox"
            onChange={() =>
              toggleStringFilter("fuel_type", "gasoline")
            }
          />

          Gasoline

        </label>

        <label className="flex items-center gap-2">

          <input
            type="checkbox"
            onChange={() =>
              toggleStringFilter("fuel_type", "gas")
            }
          />

          Gas

        </label>

        <label className="flex items-center gap-2">

          <input
            type="checkbox"
            onChange={() =>
              toggleStringFilter("fuel_type", "electricity")
            }
          />

          Electric

        </label>

      </div>


      {/* PASSENGERS */}

      <div>

        <h3 className="font-semibold mb-3">Passengers</h3>

        {[2, 4, 5, 7].map((p) => (

          <label key={p} className="flex items-center gap-2">

            <input
              type="checkbox"
              onChange={() =>
                toggleNumberFilter("passengers", p)
              }
            />

            {p} Passengers

          </label>

        ))}

      </div>


      {/* LUGGAGE */}

      <div>

        <h3 className="font-semibold mb-3">Luggage</h3>

        {[1, 2, 3].map((l) => (

          <label key={l} className="flex items-center gap-2">

            <input
              type="checkbox"
              onChange={() =>
                toggleNumberFilter("luggage", l)
              }
            />

            {l} Bags

          </label>

        ))}

      </div>


      {/* FEATURES */}

      <div>

        <h3 className="font-semibold mb-3">Additional Features</h3>

        {[
          "gps",
          "bluetooth",
          "air_conditioning",
          "heated_seats"
        ].map((feature) => (

          <label key={feature} className="flex items-center gap-2">

            <input
              type="checkbox"
              onChange={() =>
                toggleStringFilter("features", feature)
              }
            />

            {feature.replace("_", " ")}

          </label>

        ))}

      </div>

    </aside>
  );
}