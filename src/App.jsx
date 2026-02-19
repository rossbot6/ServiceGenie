import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Booking from './pages/Booking';
import bookings from './pages/bookings';
import GroupBooking from './pages/GroupBooking';
import Payouts from './pages/Payouts';
import StylistDashboard from './pages/StylistDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="admin" element={<Admin />} />
        <Route path="bookings" element={bookings()} />
        <Route path="book/:id" element={<Booking />} />
        <Route path="group-booking" element={<GroupBooking />} />
        <Route path="payouts" element={<Payouts />} />
        <Route path="stylist/dashboard" element={<StylistDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
