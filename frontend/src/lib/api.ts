export interface CarsQuery {
  page?: number;
  page_size?: number;
  sort?: string;
  min_price?: number;
  max_price?: number;
  transmission?: string[]; // ["automatic", "manual"]
  fuel_type?: string[]; // ["gasoline", "electric"]
  passengers?: number[];
  luggage?: number[];
  features?: string[]; // ["GPS", "Bluetooth", "Leather Seats"]
}

export async function getCars(queryParams: CarsQuery) {
  const params = new URLSearchParams();

  if (queryParams.page) params.append("page", queryParams.page.toString());
  if (queryParams.page_size) params.append("page_size", queryParams.page_size.toString());
  if (queryParams.sort) params.append("sort", queryParams.sort);
  if (queryParams.min_price !== undefined) params.append("min_price", queryParams.min_price.toString());
  if (queryParams.max_price !== undefined) params.append("max_price", queryParams.max_price.toString());
  if (queryParams.transmission?.length) params.append("transmission", queryParams.transmission.join(","));
  if (queryParams.fuel_type?.length) params.append("fuel_type", queryParams.fuel_type.join(","));
  if (queryParams.passengers?.length) params.append("passengers", queryParams.passengers.join(","));
  if (queryParams.luggage?.length) params.append("luggage", queryParams.luggage.join(","));
  if (queryParams.features?.length) params.append("features", queryParams.features.join(","));

  const res = await fetch(`http://localhost:8000/cars?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch cars: ${res.status}`);
  }
  return res.json(); // очікуємо { items: Car[], total_pages: number }
}