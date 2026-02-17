import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Shield, Users, Building } from 'lucide-react';
import Footer from '@/components/shared/Footer';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50/20 to-white">
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 text-lg">Manage your platform content and users efficiently</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Manage Events */}
          <Link to="/admin/events" className="transform transition-all hover:scale-105">
            <Card className="group h-full border-2 border-teal-100 hover:border-teal-300 hover:shadow-2xl transition-all bg-gradient-to-br from-white to-teal-50/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 group-hover:scale-110 transition-transform shadow-lg">
                    <Calendar className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center group-hover:text-teal-700 transition-colors">
                  Manage Events
                </CardTitle>
                <CardDescription className="text-center">
                  Create, update, and delete cultural events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Add festivals, ceremonies, and cultural celebrations to showcase Sri Lanka's vibrant heritage.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Manage Destinations */}
          <Link to="/admin/destinations" className="transform transition-all hover:scale-105">
            <Card className="group h-full border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-2xl transition-all bg-gradient-to-br from-white to-emerald-50/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 group-hover:scale-110 transition-transform shadow-lg">
                    <MapPin className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center group-hover:text-emerald-700 transition-colors">
                  Manage Destinations
                </CardTitle>
                <CardDescription className="text-center">
                  Create, update, and delete travel destinations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Showcase tourist attractions, historical sites, and natural wonders across the island.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Manage Users */}
          <Link to="/admin/users" className="transform transition-all hover:scale-105">
            <Card className="group h-full border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-2xl transition-all bg-gradient-to-br from-white to-cyan-50/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 group-hover:scale-110 transition-transform shadow-lg">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center group-hover:text-cyan-700 transition-colors">
                  Manage Users
                </CardTitle>
                <CardDescription className="text-center">
                  View and manage user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Monitor user activity, manage permissions, and maintain platform security.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Manage Hotels */}
          <Link to="/admin/hotels" className="transform transition-all hover:scale-105">
            <Card className="group h-full border-2 border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all bg-gradient-to-br from-white to-blue-50/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:scale-110 transition-transform shadow-lg">
                    <Building className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center group-hover:text-blue-700 transition-colors">
                  Manage Hotels
                </CardTitle>
                <CardDescription className="text-center">
                  Create, update, and manage hotel listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Control hotel listings, manage payment status, and ensure quality accommodations.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
