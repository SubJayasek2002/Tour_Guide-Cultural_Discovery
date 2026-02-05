import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Events from './pages/events/Events';
import EventDetail from './pages/events/EventDetail';
import Destinations from './pages/destinations/Destinations';
import DestinationDetail from './pages/destinations/DestinationDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import ManageDestinations from './pages/admin/ManageDestinations';
import ManageUsers from './pages/admin/ManageUsers';
import ManageHotels from './pages/admin/ManageHotels';
import Hotels from './pages/hotels/Hotels';
import HotelRegistration from './pages/hotels/HotelRegistration'; // Import the new component
import PaymentPage from './pages/PaymentPage'; // Create this component next
          

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes - No Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Public Routes - With Layout */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/events"
            element={
              <Layout>
                <Events />
              </Layout>
            }
          />
          <Route
            path="/events/:id"
            element={
              <Layout>
                <EventDetail />
              </Layout>
            }
          />
          <Route
            path="/destinations"
            element={
              <Layout>
                <Destinations />
              </Layout>
            }
          />
          <Route
            path="/destinations/:id"
            element={
              <Layout>
                <DestinationDetail />
              </Layout>
            }
          />
          <Route
            path="/hotels"
            element={
              <Layout>
                <Hotels />
              </Layout>
            }
          />
          <Route
            path="/hotels/register"
            element={
              <Layout>
                <HotelRegistration />
              </Layout>
            }
          />
          <Route
            path="/hotels/payment"
            element={
              <Layout>
                <PaymentPage />
              </Layout>
            }
          />

          {/* Admin Routes - Protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <ManageEvents />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/destinations"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <ManageDestinations />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <ManageUsers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hotels"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <ManageHotels />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
