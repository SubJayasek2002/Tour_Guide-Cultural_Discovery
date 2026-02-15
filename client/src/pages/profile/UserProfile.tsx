import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { usersAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { User, MapPin, Calendar, Mail, Phone, Camera, Save, ArrowLeft, Lock, Heart, Image, Pencil, Loader2 } from 'lucide-react';
import Footer from '@/components/shared/Footer';

const API_BASE_URL = 'http://localhost:8081/api';

type Destination = {
  id: string;
  title: string;
  description?: string;
  imageUrls?: string[];
  location?: string;
};

type Event = {
  id: string;
  title: string;
  description?: string;
  imageUrls?: string[];
  location?: string;
  start?: string;
};

export default function UserProfile() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await usersAPI.getMyProfile();
      setProfile(res);
      setEditFirstName(res.user?.firstName || '');
      setEditLastName(res.user?.lastName || '');
      setEditEmail(res.user?.email || '');
      setEditPhone(res.user?.phoneNumber || '');
      setProfileImageUrl(res.user?.profileImageUrl || '');
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    setSaving(true);
    setMessage(null);
    try {
      await usersAPI.updateMe({
        firstName: editFirstName,
        lastName: editLastName,
        email: editEmail,
        phoneNumber: editPhone,
      });
      await refreshUser();
      await fetchProfile();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    setMessage(null);
    try {
      await usersAPI.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to change password' });
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file (JPG, PNG, etc.)' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB' });
      return;
    }

    setUploadingImage(true);
    setMessage(null);
    try {
      const result = await usersAPI.uploadProfileImage(file);
      const fullUrl = `${API_BASE_URL.replace('/api', '')}${result.imageUrl}`;
      setProfileImageUrl(fullUrl);

      // Auto-save profile image
      await usersAPI.updateMe({ profileImageUrl: fullUrl });
      await refreshUser();
      await fetchProfile();
      setMessage({ type: 'success', text: 'Profile image updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload image' });
    } finally {
      setUploadingImage(false);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50/20 to-white">
        <div className="flex-1 container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto border-emerald-100">
            <CardContent className="py-12 text-center">
              <User className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">Please login to view your profile.</p>
              <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                <Link to="/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const displayName = [profile?.user?.firstName, profile?.user?.lastName].filter(Boolean).join(' ') || user.username;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50/20 to-white">
      <div className="flex-1 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-8 relative">
          <Button variant="outline" onClick={() => navigate(-1)} className="absolute left-0 top-0 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-2">
              My Profile
            </h1>
            <p className="text-lg text-gray-600">Manage your account and favorites</p>
          </div>
        </div>

        {/* Status message */}
        {message && (
          <div className={`max-w-2xl mx-auto mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Profile Card with Avatar */}
        <Card className="max-w-2xl mx-auto mb-6 border-emerald-100 hover:shadow-lg transition-shadow overflow-hidden">
          {/* Header banner */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 relative">
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
              <div className="relative group">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="h-28 w-28 rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                    <User className="h-12 w-12 text-white" />
                  </div>
                )}
                <label
                  htmlFor="profile-image-upload"
                  className="absolute -bottom-1 -right-1 z-10 h-9 w-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-emerald-50 transition-all border-2 border-emerald-400 ring-2 ring-white cursor-pointer"
                >
                  {uploadingImage ? (
                    <Loader2 className="h-4 w-4 text-emerald-600 animate-spin" />
                  ) : (
                    <>
                      <Camera className="h-4 w-4 text-emerald-600" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center leading-none shadow">+</span>
                    </>
                  )}
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </div>
            </div>
          </div>

          <CardContent className="pt-16 pb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-gray-500 text-sm">@{user.username}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              {user.roles?.map((role: string) => (
                <Badge key={role} className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs">
                  {role.replace('ROLE_', '')}
                </Badge>
              ))}
            </div>

            {/* Upload status */}
            {uploadingImage && (
              <div className="mt-4 max-w-sm mx-auto">
                <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading image...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="max-w-2xl mx-auto mb-6 border-emerald-100 hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-emerald-50">
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Pencil className="h-5 w-5 text-emerald-600" />
              Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                <Input
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                <Input
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-emerald-500" /> Email
                </label>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-emerald-500" /> Phone
                </label>
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="+94 77 123 4567"
                />
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={saveProfile}
                disabled={saving}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="max-w-2xl mx-auto mb-6 border-emerald-100 hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-emerald-50">
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Lock className="h-5 w-5 text-emerald-600" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={changePassword}
                disabled={!currentPassword || !newPassword}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Destinations */}
        <Card className="max-w-4xl mx-auto mb-6 border-emerald-100 hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-emerald-50">
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Heart className="h-5 w-5 text-emerald-600" />
              Favorite Destinations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
              </div>
            )}
            {!loading && (!profile?.favoriteDestinations || profile.favoriteDestinations.length === 0) && (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-emerald-200 mx-auto mb-3" />
                <p className="text-gray-500">No favorite destinations yet.</p>
                <Button asChild variant="outline" className="mt-3 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  <Link to="/destinations">Explore Destinations</Link>
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile?.favoriteDestinations?.map((d: Destination) => (
                <Link key={d.id} to={`/destinations/${d.id}`}>
                  <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-emerald-100 hover:border-emerald-300 hover:-translate-y-1">
                    {d.imageUrls && d.imageUrls.length > 0 ? (
                      <img src={d.imageUrls[0]} alt={d.title} className="h-36 w-full object-cover" />
                    ) : (
                      <div className="h-36 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
                        <Image className="h-10 w-10 text-emerald-300" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{d.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{d.description}</p>
                      {d.location && (
                        <div className="flex items-center text-xs text-gray-400 mt-2">
                          <MapPin className="h-3 w-3 mr-1 text-emerald-500" />
                          <span className="line-clamp-1">{d.location}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Favorite Events */}
        <Card className="max-w-4xl mx-auto mb-6 border-emerald-100 hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-emerald-50">
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Heart className="h-5 w-5 text-teal-600" />
              Favorite Events
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
              </div>
            )}
            {!loading && (!profile?.favoriteEvents || profile.favoriteEvents.length === 0) && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-teal-200 mx-auto mb-3" />
                <p className="text-gray-500">No favorite events yet.</p>
                <Button asChild variant="outline" className="mt-3 border-teal-200 text-teal-700 hover:bg-teal-50">
                  <Link to="/events">Explore Events</Link>
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile?.favoriteEvents?.map((e: Event) => (
                <Link key={e.id} to={`/events/${e.id}`}>
                  <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-teal-100 hover:border-teal-300 hover:-translate-y-1">
                    {e.imageUrls && e.imageUrls.length > 0 ? (
                      <img src={e.imageUrls[0]} alt={e.title} className="h-36 w-full object-cover" />
                    ) : (
                      <div className="h-36 flex items-center justify-center bg-gradient-to-br from-teal-100 to-emerald-100">
                        <Calendar className="h-10 w-10 text-teal-300" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-1">{e.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{e.description}</p>
                      {e.location && (
                        <div className="flex items-center text-xs text-gray-400 mt-2">
                          <MapPin className="h-3 w-3 mr-1 text-teal-500" />
                          <span className="line-clamp-1">{e.location}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
