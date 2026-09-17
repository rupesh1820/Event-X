import { Routes, Route, useLocation } from "react-router-dom";

// Common Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import RouteGuard from "./Components/RouteGuard";

// Public Pages
import Home from "./Pages/Home";
import Events from "./Pages/Events";
import Category from "./Pages/Category";
import AboutUs from "./Pages/AboutUs";
import Contact from "./Pages/Contact";
import EventsDetails from "./Pages/EventsDetails";
import CategoryEvents from "./Pages/CategoryEvent";

// Authentication
import Login from "./Components/Login";
import Signup from "./Components/Signup";

// User Pages
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";

import Wishlist from "./Pages/Wishlist"
import PaymentMethods from "./Pages/PaymentMethods";
import MyBookings from "./Pages/MyBookings";
import TicketBooking from "./Pages/TicketBooking";

// Booking and Payment
import BookingSuccess from "./Pages/BookingSuccesPage";
import Payment from "./Pages/PaymentPage";

// Creator Pages
import CreateEvent from "./Pages/CreateEvent";
import MyEvents from "./Pages/MyEvents";
import CreatorTickets from "./Pages/CreatorTickets";
import CEventBooking from "./Pages/CEventBooking";

// Admin Pages
import AdminEvents from "./Pages/Admin/AdminEvents";
import AdminBookings from "./Pages/Admin/AdminBooking";
import AdminUsers from "./Pages/Admin/AdminUser";
import AdminAccount from "./Pages/Admin/AdminAccount";
import Notifications from "./Pages/Admin/Notifications";

function App() {
  const location = useLocation();

  // Dashboard pages par Navbar aur Footer hide rahenge
  const dashboardPaths = [
    "/dashboard",
    "/tickets",
    "/organizer",
    "/analytics",
    "/create-event",
    "/creator",
    "/admin",
  ];

  // Login aur Signup pages par Navbar/Footer hide rahenge
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const isDashboard = dashboardPaths.some(
    (path) =>
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
  );

  return (
    <>
      {!isAuthPage && !isDashboard && <Navbar />}

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/eventsdetails/:id" element={<EventsDetails />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/events/category/:category" element={<CategoryEvents />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />

        {/* ================= AUTH ROUTES ================= */}

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ================= USER ROUTES ================= */}

        <Route path="/profile" element={<Profile />} />

       

        <Route
          path="/wishlist"
          element={
            <RouteGuard>
              <Wishlist />
            </RouteGuard>
          }
        />


        

        <Route
          path="/payments"
          element={
            <RouteGuard>
              <PaymentMethods />
            </RouteGuard>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <RouteGuard>
              <EditProfile />
            </RouteGuard>
          }
        />

        <Route
          path="/profile/my-tickets"
          element={
            <RouteGuard>
              <MyBookings />
            </RouteGuard>
          }
        />

        <Route
          path="/profile/my-booking/:id"
          element={
            <RouteGuard>
              <TicketBooking />
            </RouteGuard>
          }
        />

        <Route
          path="/profile/notifications"
          element={
            <RouteGuard>
              <Notifications />
            </RouteGuard>
          }
        />

        {/* ================= PAYMENT ROUTES ================= */}

        <Route
          path="/payment/:id"
          element={
            <RouteGuard>
              <Payment />
            </RouteGuard>
          }
        />

        <Route
          path="/booking-success"
          element={
            <RouteGuard>
              <BookingSuccess />
            </RouteGuard>
          }
        />

        {/* ================= CREATOR ROUTES ================= */}

        <Route
          path="/profile/create-event"
          element={
            <RouteGuard>
              <CreateEvent />
            </RouteGuard>
          }
        />

        <Route
          path="/profile/my-events"
          element={
            <RouteGuard>
              <MyEvents />
            </RouteGuard>
          }
        />

        <Route
          path="/profile/my-bookings"
          element={
            <RouteGuard>
              <CreatorTickets />
            </RouteGuard>
          }
        />
        <Route
          path="/profile/event-bookings"
          element={
            <RouteGuard>
              <CEventBooking />
            </RouteGuard>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin/events"
          element={
            <RouteGuard>
              <AdminEvents />
            </RouteGuard>
          }
        />

        <Route
          path="/profile/admin/bookings"
          element={
            <RouteGuard>
              <AdminBookings />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RouteGuard>
              <AdminUsers />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/accounts"
          element={
            <RouteGuard>
              <AdminAccount />
            </RouteGuard>
          }
        />

        <Route
          path="/admin/notifications"
          element={
            <RouteGuard>
              <Notifications />
            </RouteGuard>
          }
        />
      </Routes>

      {!isAuthPage && !isDashboard && <Footer />}
    </>
  );
}

export default App;