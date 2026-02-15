import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usernameOrEmail, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
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
              "url('https://images.unsplash.com/photo-1705365291453-7962869cae67?w=1200&auto=format&fit=crop&q=80')",
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
              Discover the Pearl<br />of the Indian Ocean
            </h2>
            <p className="text-emerald-100 text-lg max-w-md leading-relaxed">
              Explore ancient temples, pristine beaches, lush tea plantations, and vibrant cultural festivals across Sri Lanka.
            </p>
          </div>
          <p className="text-emerald-200/60 text-sm">© 2026 Taprobane — Sri Lankan Cultural Discovery</p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-b from-emerald-50/50 via-white to-teal-50/30 p-6">
        <div className="w-full max-w-md">
          {/* Mobile back + logo */}
          <div className="flex items-center justify-between mb-8 lg:mb-10">
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
              <CardTitle className="text-2xl font-bold text-gray-900">Welcome back</CardTitle>
              <CardDescription className="text-gray-500">
                Sign in to continue your Sri Lankan adventure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="usernameOrEmail" className="text-gray-700 font-medium">Username or Email</Label>
                  <Input
                    id="usernameOrEmail"
                    type="text"
                    placeholder="Enter your username or email"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    required
                    className="h-11 rounded-lg border-gray-200 focus:border-emerald-400 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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

                <Button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-500">Don't have an account? </span>
                <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
