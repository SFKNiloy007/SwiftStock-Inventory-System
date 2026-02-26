import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { apiClient } from '../lib/api';
import { UserRole } from '../components/types';

type LoginPageProps = {
  onLogin: (role: UserRole, token: string) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Staff');
  const [authError, setAuthError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setAuthError('Email and password are required');
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setAuthError('Please enter a valid email address');
      return;
    }

    try {
      const response = await apiClient.post('/auth/login', {
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;
      const resolvedRole = (user?.role === 'Admin' || user?.role === 'Staff') ? user.role : selectedRole;

      setAuthError('');
      onLogin(resolvedRole, token);
      navigate(resolvedRole === 'Admin' ? '/dashboard' : '/staff-dashboard', { replace: true });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Login failed. Please try again.';
      setAuthError(message);
    }
  };

  return (
    <div className="flex min-h-screen font-['Inter']">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 lg:flex lg:w-1/2">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1557097217-bcffc79d6cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="SwiftStock warehouse"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent" />
      </div>

      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-600 shadow-lg">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <h1 className="mb-2 text-3xl font-semibold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600">Sign in to SwiftStock Inventory System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Login As</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
              >
                <SelectTrigger id="role" className="h-12">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="remember" className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                />
                Remember me
              </label>
              <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700">
                Forgot Password?
              </button>
            </div>

            <Button type="submit" className="h-12 w-full bg-indigo-600 hover:bg-indigo-700">
              Login
            </Button>

            <div className="space-y-1 rounded-[12px] border border-[#f1f5f9] bg-indigo-50 px-3 py-2 text-xs text-indigo-700 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <p>Demo login</p>
              <p>email: admin@swiftstock.com</p>
              <p>password: admin123</p>
            </div>

            {authError && <p className="text-sm text-red-600">{authError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
