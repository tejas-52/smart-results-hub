import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, MoreVertical, Mail, Phone, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';

const usersData = [
  { id: 1, name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@unipune.ac.in', role: 'admin', department: 'Computer Science', status: 'active' },
  { id: 2, name: 'Prof. Priya Sharma', email: 'priya.sharma@unipune.ac.in', role: 'teacher', department: 'Computer Science', status: 'active' },
  { id: 3, name: 'Dr. Amit Patil', email: 'amit.patil@unipune.ac.in', role: 'teacher', department: 'Information Technology', status: 'active' },
  { id: 4, name: 'Prof. Sneha Deshmukh', email: 'sneha.deshmukh@unipune.ac.in', role: 'teacher', department: 'Computer Science', status: 'active' },
  { id: 5, name: 'Rahul Sharma', email: 'rahul.sharma@student.unipune.ac.in', role: 'student', department: 'MCA', status: 'active' },
  { id: 6, name: 'Priya Patil', email: 'priya.patil@student.unipune.ac.in', role: 'student', department: 'MCA', status: 'active' },
];

const UserManagement: React.FC = () => {
  const { role } = useAuth();

  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card variant="elevated" className="max-w-md text-center p-8">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage system users and their roles</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,290</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Shield className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">56</p>
                <p className="text-sm text-muted-foreground">Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card variant="elevated">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="default" size="sm">All</Button>
              <Button variant="ghost" size="sm">Admins</Button>
              <Button variant="ghost" size="sm">Teachers</Button>
              <Button variant="ghost" size="sm">Students</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersData.map((userData) => (
                  <tr key={userData.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium">
                          {userData.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{userData.name}</p>
                          <p className="text-sm text-muted-foreground">{userData.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={userData.role as 'admin' | 'teacher' | 'student'}>
                        {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{userData.department}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="success">Active</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
