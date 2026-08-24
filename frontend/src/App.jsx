import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Locations from "./pages/Locations";
import LocationDetails from "./pages/LocationDetails";
import Login from "./pages/admin/Login";
import Signup from "./pages/admin/Signup";
import CreateListing from "./pages/admin/CreateListing";
import ViewListings from "./pages/admin/ViewListings";
import UpdateListing from "./pages/admin/UpdateListing";
import ViewReservations from "./pages/admin/ViewReservations";

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/locations" element={<PublicLayout><Locations /></PublicLayout>} />
        <Route path="/locations/:id" element={<PublicLayout><LocationDetails /></PublicLayout>} />

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<Signup />} />
        <Route
          path="/admin/listings"
          element={
            <ProtectedRoute requireHost>
              <ViewListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/listings/new"
          element={
            <ProtectedRoute requireHost>
              <CreateListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/listings/:id/edit"
          element={
            <ProtectedRoute requireHost>
              <UpdateListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <ProtectedRoute>
              <ViewReservations />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<PublicLayout><div className="page-error">Page not found.</div></PublicLayout>} />
      </Routes>
    </AuthProvider>
  );
}
