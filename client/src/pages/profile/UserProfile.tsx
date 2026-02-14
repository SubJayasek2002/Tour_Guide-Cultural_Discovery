import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usersAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

type Destination = {
  id: string;
  title: string;
  description?: string;
  images?: string[];
};

type Event = {
  id: string;
  title: string;
  description?: string;
  images?: string[];
};

export default function UserProfile() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await usersAPI.getMyProfile();
      // apiRequest returns the parsed JSON body directly
      setProfile(res);
      setEditName(res.user?.firstName || res.user?.fullName || '');
      setEditEmail(res.user?.email || '');
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    try {
      await usersAPI.updateMe({ fullName: editName, email: editEmail });
      await refreshUser();
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  }

  async function changePassword() {
    try {
      await usersAPI.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      // optional: sign out or notify
    } catch (err) {
      console.error(err);
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please login to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                className="mt-1 block w-full rounded border p-2"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                className="mt-1 block w-full rounded border p-2"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn btn-primary" onClick={saveProfile}>Save</button>
            <button className="btn" onClick={() => navigate(-1)}>Back</button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current password</label>
              <input
                type="password"
                className="mt-1 block w-full rounded border p-2"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New password</label>
              <input
                type="password"
                className="mt-1 block w-full rounded border p-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <button className="btn btn-primary" onClick={changePassword}>Change Password</button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Favorite Destinations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div>Loading...</div>}
          {!loading && profile?.favoriteDestinations?.length === 0 && <div>No favorite destinations yet.</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile?.favoriteDestinations?.map((d: Destination) => (
              <div key={d.id} className="border rounded p-3">
                <h3 className="font-semibold">{d.title}</h3>
                <p className="text-sm text-gray-600 truncate">{d.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Favorite Events</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div>Loading...</div>}
          {!loading && profile?.favoriteEvents?.length === 0 && <div>No favorite events yet.</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile?.favoriteEvents?.map((e: Event) => (
              <div key={e.id} className="border rounded p-3">
                <h3 className="font-semibold">{e.title}</h3>
                <p className="text-sm text-gray-600 truncate">{e.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
