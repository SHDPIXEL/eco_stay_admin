import React, { useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import BookingDetails from './pages/BookingDetails';
import ListPackage from './pages/package/ListPackage';
import AddPackage from "./pages/package/Addpackage"
import AddType from './pages/RoomType/AddType';
import ListType from './pages/RoomType/ListType';
import AddAgent from "./pages/agent/Addagent"
import ListAgent from './pages/agent/ListAgent';
import PaymentList from './pages/PaymentList';
import AddNonAvailability from './pages/nonavailability/Add';
import ListNonAvailability from './pages/nonavailability/List';
import AddAvailability from './pages/roomStatus/addRoomStatus';
import ListAvailabilty from "./pages/roomStatus/listRoomStatus";
import InquiryList from './pages/InquiryList';
import ProtectedRoute from './helper/ProtectedRoute';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiry');
    }
  }, []);

  return (
    <BrowserRouter>
    <HelmetProvider>
    <Routes>
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookingdetails" element={<BookingDetails />} />
          <Route path="packages/list" element={<ListPackage />} />
          <Route path="packages/add" element={<AddPackage />} />
          <Route path="roomtype/list" element={<ListType />} />
          <Route path="roomtype/add" element={<AddType />} />
          <Route path="agent/list" element={<ListAgent />} />
          <Route path="agent/add" element={<AddAgent />} />
          <Route path="paymentlist" element={<PaymentList />} />
          <Route path="nonavailability/list" element={<ListNonAvailability />} />
          <Route path="nonavailability/add" element={<AddNonAvailability />} />
          <Route path="availability/add" element={<AddAvailability />} />
          <Route path="availability/list" element={<ListAvailabilty />} />
          <Route path="inquirylist" element={<InquiryList />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;