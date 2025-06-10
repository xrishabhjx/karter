// Main application component that handles routing and layout
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ScrollToTop';

// Page imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import UserDashboard from './pages/UserDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import PartnerRegistrationPage from './pages/PartnerRegistrationPage';
import ServicesPage from './pages/ServicesPage';
import LocationsPage from './pages/LocationsPage';

// Service-specific page imports
import MoversAndPackersPage from './pages/services/MoversAndPackersPage';
import SOSDeliveryPage from './pages/services/SOSDeliveryPage';
import InstantDeliveryPage from './pages/services/InstantDeliveryPage';
import ScheduledDeliveryPage from './pages/services/ScheduledDeliveryPage';
import IntercityPage from './pages/services/IntercityPage';
import BusinessSolutionsPage from './pages/services/BusinessSolutionsPage';

// Additional pages
import EnterprisePage from './pages/EnterprisePage';
import PaymentPage from './pages/PaymentPage';
import WalletPage from './pages/WalletPage';
import ReviewsPage from './pages/ReviewsPage';
import PickupPointsPage from './pages/PickupPointsPage';
import PickupPointPartnerRegistration from './pages/PickupPointPartnerRegistration';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

/**
 * Root application component that sets up:
 * - Authentication context
 * - Routing configuration
 * - Main layout structure (Navbar, main content, Footer)
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/track" element={<TrackingPage />} />
              
              {/* Protected Dashboard Routes */}
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/partner/dashboard" element={<PartnerDashboard />} />
              <Route path="/partner/register" element={<PartnerRegistrationPage />} />
              
              {/* Service Routes */}
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/instant-delivery" element={<InstantDeliveryPage />} />
              <Route path="/services/scheduled-delivery" element={<ScheduledDeliveryPage />} />
              <Route path="/services/intercity" element={<IntercityPage />} />
              <Route path="/services/movers-and-packers" element={<MoversAndPackersPage />} />
              <Route path="/services/business" element={<BusinessSolutionsPage />} />
              <Route path="/services/sos-delivery" element={<SOSDeliveryPage />} />
              
              {/* Location and Pickup Points */}
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/pickup-points" element={<PickupPointsPage />} />
              <Route path="/pickup-points/register" element={<PickupPointPartnerRegistration />} />
              
              {/* Additional Routes */}
              <Route path="/enterprise" element={<EnterprisePage />} />
              <Route path="/payment/:deliveryId" element={<PaymentPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Fallback route - redirects to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;