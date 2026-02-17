import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&auto=format&fit=crop&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-teal-800/60 to-cyan-900/70" />
        <div className="relative z-10 flex flex-col justify-between p-10 text-white">
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Taprobane</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Start Your Journey<br />Through Paradise
            </h2>
            <p className="text-emerald-100 text-lg max-w-md leading-relaxed">
              Join thousands of travelers discovering ancient temples, golden beaches, and the warmth of Sri Lankan hospitality.
            </p>
          </div>
          <p className="text-emerald-200/60 text-sm">© 2026 Taprobane — Sri Lankan Cultural Discovery</p>
        </div>
      </div>

      {/* Right Panel — Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-b from-emerald-50/50 via-white to-teal-50/30 p-6 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          {/* Mobile back + logo */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <Link to="/" className="lg:hidden">
              <Button size="icon" variant="ghost" className="text-emerald-600 hover:bg-emerald-50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/" className="hidden lg:flex items-center gap-2 group">
              <ArrowLeft className="h-4 w-4 text-emerald-600 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm text-emerald-600 font-medium">Back to home</span>
            </Link>
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Taprobane</span>
            </div>
          </div>

          <Card className="border-0 shadow-xl shadow-emerald-900/5 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Create your account</CardTitle>
              <CardDescription className="text-gray-500">
                Join Taprobane to review and rate destinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="h-11 rounded-lg border-gray-200 focus:border-emerald-400 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="h-11 rounded-lg border-gray-200 focus:border-emerald-400 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="h-11 rounded-lg border-gray-200 focus:border-emerald-400 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-11 rounded-lg border-gray-200 focus:border-emerald-400 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+94 71 234 5678"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="h-11 rounded-lg border-gray-200 focus:border-emerald-400 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="h-11 rounded-lg border-gray-200 focus:border-emerald-400 focus:ring-emerald-500/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="h-11 rounded-lg border-gray-200 focus:border-emerald-400 focus:ring-emerald-500/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-500">Already have an account? </span>
                <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
