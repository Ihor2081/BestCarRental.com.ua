export interface Car {
  id: number;
  name: string;
  category: string;
  price: number;
  img: string;
  status?: string;
  bookings?: number;
}

export interface Booking {
  id: string;
  customer: string;
  email: string;
  vehicle: string;
  dates: string;
  total: string;
  status: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  bookings: number;
  spent: string;
  since: string;
}
