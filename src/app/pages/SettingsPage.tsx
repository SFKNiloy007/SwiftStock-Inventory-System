import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';

export function SettingsPage() {
  const [storeName, setStoreName] = useState('SwiftStock Main Warehouse');
  const [email, setEmail] = useState('admin@swiftstock.com');
  const [dailySummary, setDailySummary] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);

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

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </section>
  );
}
