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

function App() {
  const location = useLocation();
  const dashboardPaths = ['/dashboard', '/tickets', '/organizer', '/analytics', '/create-event', '/profile', '/profile/create-event'];
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
      <Route path='/profile' element={<Profile/>}></Route>
      <Route path='/profile/dashboard' element={<Dashboard/>}></Route>
      <Route path='/profile/tickets' element={<Tickets/>}></Route>
      <Route path='/profile/organizer' element={<OrganizerDashboard/>}></Route>
      <Route path='/profile/analytics' element={<Analytics/>}></Route>
      <Route path='/profile/create-event' element={<CreateEvent/>}></Route>
      <Route path='/create-event' element={<CreateEvent/>}></Route>

      <Route path='/admin' element={<AdminDashboard />}></Route>
      <Route path='/creator' element={<CreatorDashboard />}></Route>
      <Route path='/registrations' element={<MyRegistrations />}></Route>
      <Route path='/wishlist' element={<Wishlist />}></Route>
      <Route path='/saved-events' element={<SavedEvents />}></Route>
      <Route path='/orders' element={<MyOrders />}></Route>
      <Route path='/notifications' element={<Notifications />}></Route>
      <Route path='/payments' element={<PaymentMethods />}></Route>
        
      </Routes>


      {!isauth && !isDashboard && <Footer/>}
    </>
  )
}

export default App
