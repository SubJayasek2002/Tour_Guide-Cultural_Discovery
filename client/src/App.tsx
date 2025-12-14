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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
