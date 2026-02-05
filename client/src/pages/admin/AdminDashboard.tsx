import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Shield, Users, Building } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <p className="text-gray-600">Manage events, destinations, hotels, and users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">{/* Manage Events */}
        {/* Manage Events */}
        <Link to="/admin/events">
          <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Calendar className="h-12 w-12 text-orange-600 group-hover:scale-110 transition-transform" />
              </div>
              <CardTitle className="text-2xl group-hover:text-orange-600 transition-colors">
                Manage Events
              </CardTitle>
              <CardDescription>
                Create, update, and delete cultural events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Add new festivals, ceremonies, and cultural celebrations. Update event details
                and manage the event calendar.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Manage Destinations */}
        <Link to="/admin/destinations">
          <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <MapPin className="h-12 w-12 text-orange-600 group-hover:scale-110 transition-transform" />
              </div>
              <CardTitle className="text-2xl group-hover:text-orange-600 transition-colors">
                Manage Destinations
              </CardTitle>
              <CardDescription>
                Create, update, and delete travel destinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Add new tourist attractions, historical sites, and natural wonders. Update
                destination information and best visiting seasons.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Manage Users */}
        <Link to="/admin/users">
          <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Users className="h-12 w-12 text-orange-600 group-hover:scale-110 transition-transform" />
              </div>
              <CardTitle className="text-2xl group-hover:text-orange-600 transition-colors">
                Manage Users
              </CardTitle>
              <CardDescription>
                View and manage user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Monitor user activity, enable or disable accounts, and manage user roles
                and permissions.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Manage Hotels */}
        <Link to="/admin/hotels">
          <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Building className="h-12 w-12 text-orange-600 group-hover:scale-110 transition-transform" />
              </div>
              <CardTitle className="text-2xl group-hover:text-orange-600 transition-colors">
                Manage Hotels
              </CardTitle>
              <CardDescription>
                Create, update, and manage hotel listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Add new hotels, update details, manage payment status, and control
                hotel visibility on the platform.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
