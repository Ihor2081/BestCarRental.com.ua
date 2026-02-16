import { useEffect, useState } from "react";
import api from "../api/api";

export default function Cars() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    api.get("/cars").then((res) => setCars(res.data));
  }, []);

  return (
    <div>
      <h2>Available Cars</h2>
      {cars.map((car) => (
        <div key={car.id}>
          <h3>{car.brand} {car.model}</h3>
          <p>Price: {car.price_per_day}</p>
        </div>
      ))}
    </div>
  );
}