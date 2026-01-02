import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Lock, Bell, Shield, Palette } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const Settings: React.FC = () => {
  const { user, profile, role } = useAuth();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Section */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{profile?.full_name}</h3>
              <Badge variant={role as 'admin' | 'teacher' | 'student' | undefined}>
                {role?.charAt(0).toUpperCase()}{role?.slice(1)}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={profile?.full_name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={user?.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" defaultValue="Computer Science" />
            </div>
          </div>

          <Button variant="gradient" onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" placeholder="••••••••" />
            </div>
            <div></div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" placeholder="••••••••" />
            </div>
          </div>

          <Button variant="outline">Update Password</Button>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Email Notifications', desc: 'Receive updates via email' },
            { label: 'Exam Reminders', desc: 'Get notified about upcoming exams' },
            { label: 'Result Alerts', desc: 'Notification when results are published' },
            { label: 'Study Material Updates', desc: 'New material upload notifications' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked={index < 3} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
