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
function App() {
  const location = useLocation();
  const dashboardPaths = ['/dashboard', '/tickets', '/organizer', '/analytics', '/create-event', '/profile'];
  const isauth = location.pathname === "/login" || location.pathname === "/signup";
  const isDashboard = dashboardPaths.includes(location.pathname);


  return (

    <>
    { !isauth && !isDashboard && <Navbar/>}
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
       <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/events' element={<Events/>}></Route>
      <Route path='/categories' element={<Category/>}></Route>
      <Route path='/about' element={<AboutUs/>}></Route>
      <Route path='/contact' element={<Contact/>}></Route>
      <Route path='/profile' element={<Profile/>}></Route>
      <Route path='/profile/dashboard' element={<Dashboard/>}></Route>
      <Route path='/profile/tickets' element={<Tickets/>}></Route>
      <Route path='/profile/organizer' element={<OrganizerDashboard/>}></Route>
      <Route path='/profile/analytics' element={<Analytics/>}></Route>
      <Route path='/profile/create-event' element={<CreateEvent/>}></Route>
        
      </Routes>


      {!isauth && !isDashboard && <Footer/>}
    </>
  )
}

export default App
