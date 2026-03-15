import { ChangeEvent, useMemo, useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { UserRole } from '../components/types';

type SettingsPageProps = {
  userRole: UserRole;
};

export function SettingsPage({ userRole }: SettingsPageProps) {
  const loginImageStorageKey = 'swiftstock.login.customSideImage';
  const defaultLoginSideImage =
    import.meta.env.VITE_LOGIN_SIDE_IMAGE?.trim() ||
    'https://images.unsplash.com/photo-1557097217-bcffc79d6cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  const initialCustomImage = window.localStorage.getItem(loginImageStorageKey) || '';
  const [storeName, setStoreName] = useState('SwiftStock Main Warehouse');
  const [email, setEmail] = useState('admin@swiftstock.com');
  const [dailySummary, setDailySummary] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [loginImagePreview, setLoginImagePreview] = useState(initialCustomImage || defaultLoginSideImage);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const canManageLoginImage = userRole === 'Admin' || userRole === 'Owner';

  const hasCustomLoginImage = useMemo(
    () => Boolean(window.localStorage.getItem(loginImageStorageKey)),
    [loginImageStorageKey, loginImagePreview]
  );

  const handleLoginImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      setUploadMessage('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = String(reader.result || '');
      window.localStorage.setItem(loginImageStorageKey, imageData);
      setLoginImagePreview(imageData);
      setUploadMessage('Login image updated successfully. It will show on the login screen.');
      setUploadError('');
    };
    reader.readAsDataURL(file);
  };

  const handleResetLoginImage = () => {
    window.localStorage.removeItem(loginImageStorageKey);
    setLoginImagePreview(defaultLoginSideImage);
    setUploadMessage('Login image reset to default.');
    setUploadError('');
  };

  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage account and notification preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store-name">Store Name</Label>
            <Input
              id="store-name"
              value={storeName}
              onChange={(event) => setStoreName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Daily Summary Email</p>
              <p className="text-xs text-gray-500">Receive daily sales and inventory summary.</p>
            </div>
            <Switch checked={dailySummary} onCheckedChange={setDailySummary} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Low Stock Alerts</p>
              <p className="text-xs text-gray-500">Get notified when stock levels are critical.</p>
            </div>
            <Switch checked={lowStockAlerts} onCheckedChange={setLowStockAlerts} />
          </div>
        </CardContent>
      </Card>

      {canManageLoginImage && (
        <Card>
          <CardHeader>
            <CardTitle>Login Screen Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Upload a custom image that appears on the login screen.
            </p>
            <div className="overflow-hidden rounded-xl border border-[#e2e8f0]">
              <ImageWithFallback
                src={loginImagePreview}
                alt="Login screen preview"
                className="h-44 w-full object-cover"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex cursor-pointer items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLoginImageUpload}
                />
              </label>
              <Button type="button" variant="outline" onClick={handleResetLoginImage} disabled={!hasCustomLoginImage}>
                Reset to Default
              </Button>
            </div>
            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
            {uploadMessage && <p className="text-sm text-green-600">{uploadMessage}</p>}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </section>
  );
}
