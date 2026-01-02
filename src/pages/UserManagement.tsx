import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search, Shield, Edit, Eye, UserCog, Phone, Mail as MailIcon, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useUsers, useUpdateUserRole, useUpdateProfile, type UserWithRole } from '@/hooks/useUsers';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const UserManagement: React.FC = () => {
  const { role, user: currentUser } = useAuth();
  const { data: users, isLoading, error } = useUsers();
  const updateUserRole = useUpdateUserRole();
  const updateProfile = useUpdateProfile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  
  // Edit form state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  
  // Role change state
  const [newRole, setNewRole] = useState<'admin' | 'teacher' | 'student'>('student');

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

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'teacher':
        return 'default';
      case 'student':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleViewUser = (userData: UserWithRole) => {
    setSelectedUser(userData);
    setViewDialogOpen(true);
  };

  const handleEditUser = (userData: UserWithRole) => {
    setSelectedUser(userData);
    setEditName(userData.full_name);
    setEditPhone(userData.phone || '');
    setEditDialogOpen(true);
  };

  const handleChangeRole = (userData: UserWithRole) => {
    setSelectedUser(userData);
    setNewRole(userData.role || 'student');
    setRoleDialogOpen(true);
  };

  const confirmEditUser = async () => {
    if (!selectedUser) return;
    
    await updateProfile.mutateAsync({
      userId: selectedUser.user_id,
      data: {
        full_name: editName,
        phone: editPhone || undefined,
      },
    });
    
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const confirmRoleChange = async () => {
    if (!selectedUser) return;
    
    await updateUserRole.mutateAsync({
      userId: selectedUser.user_id,
      newRole,
    });
    
    setRoleDialogOpen(false);
    setSelectedUser(null);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading users: {error.message}</p>
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
                <p className="text-2xl font-bold">{users?.length || 0}</p>
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
                <p className="text-2xl font-bold">
                  {users?.filter(u => u.role === 'admin').length || 0}
                </p>
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
                <p className="text-2xl font-bold">
                  {users?.filter(u => u.role === 'teacher').length || 0}
                </p>
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
                <p className="text-2xl font-bold">
                  {users?.filter(u => u.role === 'student').length || 0}
                </p>
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
              <Input 
                placeholder="Search by name or email..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant={roleFilter === 'all' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setRoleFilter('all')}
              >
                All ({users?.length || 0})
              </Button>
              <Button 
                variant={roleFilter === 'admin' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setRoleFilter('admin')}
              >
                Admins ({users?.filter(u => u.role === 'admin').length || 0})
              </Button>
              <Button 
                variant={roleFilter === 'teacher' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setRoleFilter('teacher')}
              >
                Teachers ({users?.filter(u => u.role === 'teacher').length || 0})
              </Button>
              <Button 
                variant={roleFilter === 'student' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setRoleFilter('student')}
              >
                Students ({users?.filter(u => u.role === 'student').length || 0})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} variant="elevated">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((userData, index) => (
            <Card 
              key={userData.id} 
              variant="elevated"
              className="animate-slide-up hover:shadow-md transition-shadow"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* User Avatar & Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
                      {userData.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{userData.full_name}</h3>
                        <Badge variant={getRoleBadgeVariant(userData.role) as any}>
                          {userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Unknown'}
                        </Badge>
                        {userData.user_id === currentUser?.id && (
                          <Badge variant="outline">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{userData.email}</p>
                    </div>
                  </div>

                  {/* User Meta */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    {userData.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span className="hidden lg:inline">{userData.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden lg:inline">
                        {format(new Date(userData.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewUser(userData)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditUser(userData)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(userData)}>
                          <UserCog className="h-4 w-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.location.href = `mailto:${userData.email}`}>
                          <MailIcon className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card variant="elevated">
            <CardContent className="py-12">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || roleFilter !== 'all' 
                    ? 'Try adjusting your search or filter.'
                    : 'No users in the system yet.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View complete user information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">
                  {selectedUser.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.full_name}</h3>
                  <Badge variant={getRoleBadgeVariant(selectedUser.role) as any} className="mt-1">
                    {selectedUser.role ? selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1) : 'Unknown'}
                  </Badge>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <MailIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{format(new Date(selectedUser.created_at), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
                <Button variant="gradient" onClick={() => {
                  setViewDialogOpen(false);
                  handleEditUser(selectedUser);
                }}>
                  Edit User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editName">Full Name</Label>
              <Input 
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="editPhone">Phone Number</Label>
              <Input 
                id="editPhone"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="gradient"
                onClick={confirmEditUser}
                disabled={!editName || updateProfile.isPending}
              >
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <AlertDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Change the role for {selectedUser?.full_name}. This will affect their permissions in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Select New Role</Label>
            <Select value={newRole} onValueChange={(value: 'admin' | 'teacher' | 'student') => setNewRole(value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-destructive" />
                    Admin - Full system access
                  </div>
                </SelectItem>
                <SelectItem value="teacher">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Teacher - Manage courses & students
                  </div>
                </SelectItem>
                <SelectItem value="student">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Student - Limited access
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRoleChange}
              disabled={updateUserRole.isPending}
            >
              {updateUserRole.isPending ? 'Updating...' : 'Confirm Change'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
