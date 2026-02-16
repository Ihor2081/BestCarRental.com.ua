import { useEffect, useState } from "react";
import api from "../api/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/bookings/my").then((res) => setBookings(res.data));
  }, []);

  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.map((b) => (
        <div key={b.id}>
          Car ID: {b.car_id} | {b.start_date} - {b.end_date}
        </div>
      ))}
    </div>
  );
}