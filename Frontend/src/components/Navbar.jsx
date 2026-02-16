import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Cars</Link> |
      <Link to="/bookings">My Bookings</Link> |
      <Link to="/profile">Profile</Link>
    </nav>
  );
}