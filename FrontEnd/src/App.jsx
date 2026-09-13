import { Routes, Route, useLocation} from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from "./Pages/Home";
import Login from './Components/Login';
import Signup from './Components/Signup';
import Events from './Pages/Events';
import Category from './Pages/Category';
import AboutUs from './Pages/AboutUs';
import Contact from './Pages/Contact';
import Profile from './Pages/Profile';
import Dashboard from './Pages/Dashboard';
import Tickets from './Pages/Tickets';
import OrganizerDashboard from './Pages/OrganizerDashboard';
import Analytics from './Pages/Analytics';
import CreateEvent from './Pages/CreateEvent';
import EventsDetails from './Pages/EventsDetails';
import MyRegistrations from './Pages/MyRegistrations';
import Wishlist from './Pages/Wishlist';
import SavedEvents from './Pages/SavedEvents';
import MyOrders from './Pages/MyOrders';
import Notifications from './Pages/Notifications';
import PaymentMethods from './Pages/PaymentMethods';
import AdminDashboard from './Pages/AdminDashboard';
import CreatorDashboard from './Pages/CreatorDashboard';
import TicketBooking from './Pages/TicketBooking';
import BookingSuccess from './Pages/BookingSuccesPage';
import Payment from './Pages/PaymentPage';
import RouteGuard from './Components/RouteGuard';

function App() {
  const location = useLocation();
  const dashboardPaths = ['/dashboard', '/tickets', '/organizer', '/analytics', '/create-event', '/profile', '/profile/create-event', '/creator', '/admin'];
  const isauth = location.pathname === "/login" || location.pathname === "/signup";
  const isDashboard = dashboardPaths.some((path) => 
    location.pathname === path || location.pathname.startsWith(`${path}/`)
  );

  return (
    <>
      {!isauth && !isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
       <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/events' element={<Events/>}></Route>
      <Route path='/events/:id' element={<EventsDetails />}></Route>
      <Route path='/categories' element={<Category/>}></Route>
      <Route path='/about' element={<AboutUs/>}></Route>
      <Route path='/contact' element={<Contact/>}></Route>
      <Route path='/profile' element={<RouteGuard><Profile/></RouteGuard>}></Route>
      <Route path='/profile/dashboard' element={<RouteGuard><Dashboard/></RouteGuard>}></Route>
      <Route path='/profile/tickets' element={<RouteGuard><Tickets/></RouteGuard>}></Route>
      <Route path='/profile/organizer' element={<RouteGuard roles={['creator','admin']}><OrganizerDashboard/></RouteGuard>}></Route>
      <Route path='/profile/analytics' element={<RouteGuard roles={['creator','admin']}><Analytics/></RouteGuard>}></Route>
      <Route path='/profile/create-event' element={<RouteGuard roles={['creator','admin']}><CreateEvent/></RouteGuard>}></Route>
      <Route path='/create-event' element={<RouteGuard roles={['creator','admin']}><CreateEvent/></RouteGuard>}></Route>

      <Route path='/admin' element={<RouteGuard roles={['admin']}><AdminDashboard /></RouteGuard>}></Route>
      <Route path='/creator' element={<RouteGuard roles={['creator','admin']}><CreatorDashboard /></RouteGuard>}></Route>
      <Route path='/registrations' element={<RouteGuard><MyRegistrations /></RouteGuard>}></Route>
      <Route path='/wishlist' element={<RouteGuard><Wishlist /></RouteGuard>}></Route>
      <Route path='/saved-events' element={<RouteGuard><SavedEvents /></RouteGuard>}></Route>
      <Route path='/orders' element={<RouteGuard><MyOrders /></RouteGuard>}></Route>
      <Route path='/notifications' element={<RouteGuard><Notifications /></RouteGuard>}></Route>
      <Route path='/payments' element={<RouteGuard><PaymentMethods /></RouteGuard>}></Route>
      <Route path="/booking/:id" element={<RouteGuard><TicketBooking /></RouteGuard>} />
      <Route path="/payment/:id" element={<RouteGuard><Payment /></RouteGuard>} />
      <Route path="/booking-success" element={<RouteGuard><BookingSuccess /></RouteGuard>} />

        
      </Routes>


      {!isauth && !isDashboard && <Footer/>}
    </>
  )
}

export default App
