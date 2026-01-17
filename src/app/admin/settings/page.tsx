'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings, Shield, Bell, Mail, Database, Globe,
  Save, RefreshCw, AlertCircle, Check, Zap, Lock,
  Server, CreditCard, Users, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const settingsCategories = [
  {
    id: 'general',
    title: 'General Settings',
    icon: Settings,
    description: 'Basic platform configuration',
  },
  {
    id: 'security',
    title: 'Security',
    icon: Shield,
    description: 'Security and authentication settings',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    description: 'Email and push notification settings',
  },
  {
    id: 'payments',
    title: 'Payment Settings',
    icon: CreditCard,
    description: 'Payment gateway and commission settings',
  },
  {
    id: 'performance',
    title: 'Performance',
    icon: Zap,
    description: 'Cache and optimization settings',
  },
  {
    id: 'database',
    title: 'Database',
    icon: Database,
    description: 'Database backup and maintenance',
  },
];

const defaultSettings = {
  // General
  platformName: 'BAILS',
  platformUrl: 'https://bails.in',
  supportEmail: 'support@bails.in',
  timezone: 'Asia/Kolkata',
  language: 'en',
  currency: 'INR',

  // Security
  twoFactorAuth: true,
  sessionTimeout: '30',
  maxLoginAttempts: '5',
  passwordMinLength: '8',
  requireEmailVerification: true,
  requireKyc: true,

  // Notifications
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  marketingEmails: false,
  systemAlerts: true,

  // Payments
  clientCommission: '5',
  freelancerCommission: '25',
  minWithdrawal: '500',
  maxWithdrawal: '50000',
  withdrawalFrequency: 'weekly',
  paymentGateway: 'razorpay',
  autoApproveWithdrawals: false,

  // Performance
  enableCache: true,
  cacheExpiry: '3600',
  enableCdn: true,
  compressionEnabled: true,
  lazyLoading: true,

  // Database
  autoBackup: true,
  backupFrequency: 'daily',
  backupRetention: '30',
  maintenanceMode: false,
};

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...defaultSettings, ...data.settings });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    fetchSettings();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSettingsContent = () => {
    switch (activeCategory) {
      case 'general':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Platform Name</Label>
                <Input
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Platform URL</Label>
                <Input
                  value={settings.platformUrl}
                  onChange={(e) => setSettings({ ...settings, platformUrl: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Support Email</Label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                  <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Default Language</Label>
                <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                  <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="ta">Tamil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
                  <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Two-Factor Authentication</Label>
                  <p className="text-xs text-gray-400 mt-1">Require 2FA for admin accounts</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Email Verification</Label>
                  <p className="text-xs text-gray-400 mt-1">Require email verification for new users</p>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">KYC Requirement</Label>
                  <p className="text-xs text-gray-400 mt-1">Require KYC for freelancers</p>
                </div>
                <Switch
                  checked={settings.requireKyc}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireKyc: checked })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Max Login Attempts</Label>
                <Input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Email Notifications</Label>
                  <p className="text-xs text-gray-400 mt-1">Send email notifications to users</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Push Notifications</Label>
                  <p className="text-xs text-gray-400 mt-1">Send push notifications to mobile apps</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">SMS Notifications</Label>
                  <p className="text-xs text-gray-400 mt-1">Send SMS for critical updates</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">System Alerts</Label>
                  <p className="text-xs text-gray-400 mt-1">Admin notifications for system events</p>
                </div>
                <Switch
                  checked={settings.systemAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, systemAlerts: checked })}
                />
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Client Commission (%)</Label>
                <Input
                  type="number"
                  value={settings.clientCommission}
                  onChange={(e) => setSettings({ ...settings, clientCommission: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Freelancer Commission (%)</Label>
                <Input
                  type="number"
                  value={settings.freelancerCommission}
                  onChange={(e) => setSettings({ ...settings, freelancerCommission: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Payment Gateway</Label>
                <Select value={settings.paymentGateway} onValueChange={(value) => setSettings({ ...settings, paymentGateway: value })}>
                  <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="payu">PayU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Min Withdrawal (₹)</Label>
                <Input
                  type="number"
                  value={settings.minWithdrawal}
                  onChange={(e) => setSettings({ ...settings, minWithdrawal: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Max Withdrawal (₹)</Label>
                <Input
                  type="number"
                  value={settings.maxWithdrawal}
                  onChange={(e) => setSettings({ ...settings, maxWithdrawal: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Auto-approve Withdrawals</Label>
                <p className="text-xs text-gray-400 mt-1">Automatically approve withdrawal requests</p>
              </div>
              <Switch
                checked={settings.autoApproveWithdrawals}
                onCheckedChange={(checked) => setSettings({ ...settings, autoApproveWithdrawals: checked })}
              />
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Enable Caching</Label>
                  <p className="text-xs text-gray-400 mt-1">Cache static assets and API responses</p>
                </div>
                <Switch
                  checked={settings.enableCache}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableCache: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">CDN Delivery</Label>
                  <p className="text-xs text-gray-400 mt-1">Serve assets from Content Delivery Network</p>
                </div>
                <Switch
                  checked={settings.enableCdn}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableCdn: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Compression</Label>
                  <p className="text-xs text-gray-400 mt-1">Enable Gzip/Brotli compression</p>
                </div>
                <Switch
                  checked={settings.compressionEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, compressionEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Lazy Loading</Label>
                  <p className="text-xs text-gray-400 mt-1">Lazy load images and components</p>
                </div>
                <Switch
                  checked={settings.lazyLoading}
                  onCheckedChange={(checked) => setSettings({ ...settings, lazyLoading: checked })}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label className="text-gray-300">Cache Expiry (seconds)</Label>
              <Input
                type="number"
                value={settings.cacheExpiry}
                onChange={(e) => setSettings({ ...settings, cacheExpiry: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
              />
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Automatic Backups</Label>
                  <p className="text-xs text-gray-400 mt-1">Schedule periodic database backups</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Maintenance Mode</Label>
                  <p className="text-xs text-gray-400 mt-1">Enabling this restricts user access</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="text-gray-300">Backup Frequency</Label>
                <Select value={settings.backupFrequency} onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}>
                  <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Retention (Days)</Label>
                <Input
                  type="number"
                  value={settings.backupRetention}
                  onChange={(e) => setSettings({ ...settings, backupRetention: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                />
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-900/10 border border-yellow-700/30 rounded-lg">
              <h4 className="text-yellow-500 font-medium flex items-center mb-2">
                <AlertCircle className="w-4 h-4 mr-2" />
                Database Operations
              </h4>
              <p className="text-sm text-gray-400 mb-4">
                Manual actions for database management. Warning: Some actions may affect system availability.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="text-gray-300 border-gray-700 hover:bg-[#2a2a2a]">
                  Run Backup Now
                </Button>
                <Button variant="outline" className="text-gray-300 border-gray-700 hover:bg-[#2a2a2a]">
                  Optimize Tables
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Configure platform settings and preferences</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="text-gray-300 flex-1 sm:flex-none border-gray-700 hover:bg-white/5"
            onClick={handleReset}
            disabled={loading || isSaving}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 flex-1 sm:flex-none min-w-[140px]"
            disabled={saved || isSaving || loading}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {settingsCategories.map((category) => (
          <Card
            key={category.id}
            className={`bg-[#1a1a1a] border-gray-800 p-4 cursor-pointer transition-all ${activeCategory === category.id ? 'border-purple-600 bg-purple-600/10' : 'hover:border-gray-700'
              }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <category.icon className={`w-6 h-6 mb-2 ${activeCategory === category.id ? 'text-purple-400' : 'text-gray-400'
              }`} />
            <h3 className="text-sm font-medium text-white">{category.title}</h3>
          </Card>
        ))}
      </div>

      {/* Settings Content */}
      {/* Settings Content */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-6">
        {loading ? (
          <div className="space-y-6">
            <div className="space-y-2 mb-6">
              <Skeleton className="h-8 w-48 bg-[#2a2a2a]" />
              <Skeleton className="h-4 w-64 bg-[#2a2a2a]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32 bg-[#2a2a2a]" />
                <Skeleton className="h-10 w-full bg-[#2a2a2a]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32 bg-[#2a2a2a]" />
                <Skeleton className="h-10 w-full bg-[#2a2a2a]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32 bg-[#2a2a2a]" />
                <Skeleton className="h-10 w-full bg-[#2a2a2a]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32 bg-[#2a2a2a]" />
                <Skeleton className="h-10 w-full bg-[#2a2a2a]" />
              </div>
            </div>
            <div className="flex justify-end pt-6 border-t border-gray-800">
              <Skeleton className="h-10 w-32 bg-[#2a2a2a]" />
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-6">Platform Settings | BAILS</h1>
            <p className="text-sm text-gray-400 mb-6">
              {settingsCategories.find(c => c.id === activeCategory)?.description}
            </p>
            {renderSettingsContent()}
          </>
        )}
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">API Status</p>
              <p className="text-lg font-semibold text-green-400">Operational</p>
            </div>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Database</p>
              <p className="text-lg font-semibold text-green-400">Connected</p>
            </div>
            <Database className="w-5 h-5 text-green-400" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Cache</p>
              <p className="text-lg font-semibold text-green-400">Active</p>
            </div>
            <Server className="w-5 h-5 text-green-400" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">SSL</p>
              <p className="text-lg font-semibold text-green-400">Secured</p>
            </div>
            <Lock className="w-5 h-5 text-green-400" />
          </div>
        </Card>
      </div>
    </div>
  );
}
