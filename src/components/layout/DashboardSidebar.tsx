import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Bell,
  FolderOpen,
  Calendar,
  ClipboardList,
  Award,
  HelpCircle,
  BarChart3,
  Info,
  Mail,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    const common = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ];

    const adminItems = [
      { icon: Users, label: 'Users', path: '/users' },
      { icon: BookOpen, label: 'Courses', path: '/courses' },
      { icon: FileText, label: 'Subjects', path: '/subjects' },
      { icon: Bell, label: 'Notifications', path: '/notifications' },
      { icon: FolderOpen, label: 'Study Materials', path: '/materials' },
      { icon: Calendar, label: 'Examinations', path: '/exams' },
      { icon: ClipboardList, label: 'Marks Entry', path: '/marks' },
      { icon: Award, label: 'Results', path: '/results' },
      { icon: HelpCircle, label: 'Queries', path: '/queries' },
      { icon: BarChart3, label: 'Reports', path: '/reports' },
    ];

    const teacherItems = [
      { icon: BookOpen, label: 'My Courses', path: '/courses' },
      { icon: FileText, label: 'My Subjects', path: '/subjects' },
      { icon: Bell, label: 'Notifications', path: '/notifications' },
      { icon: FolderOpen, label: 'Study Materials', path: '/materials' },
      { icon: Calendar, label: 'Examinations', path: '/exams' },
      { icon: ClipboardList, label: 'Marks Entry', path: '/marks' },
      { icon: Award, label: 'Results', path: '/results' },
      { icon: HelpCircle, label: 'Queries', path: '/queries' },
      { icon: BarChart3, label: 'Reports', path: '/reports' },
    ];

    const studentItems = [
      { icon: BookOpen, label: 'My Courses', path: '/courses' },
      { icon: FileText, label: 'Subjects', path: '/subjects' },
      { icon: Bell, label: 'Notifications', path: '/notifications' },
      { icon: FolderOpen, label: 'Study Materials', path: '/materials' },
      { icon: Calendar, label: 'Exam Schedule', path: '/exams' },
      { icon: ClipboardList, label: 'My Marks', path: '/marks' },
      { icon: Award, label: 'Results', path: '/results' },
      { icon: HelpCircle, label: 'Help & Queries', path: '/queries' },
    ];

    const bottomItems = [
      { icon: Info, label: 'About Us', path: '/about' },
      { icon: Mail, label: 'Contact', path: '/contact' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    let roleItems: typeof adminItems = [];
    switch (user?.role) {
      case 'admin':
        roleItems = adminItems;
        break;
      case 'teacher':
        roleItems = teacherItems;
        break;
      case 'student':
        roleItems = studentItems;
        break;
    }

    return { mainItems: [...common, ...roleItems], bottomItems };
  };

  const { mainItems, bottomItems } = getNavItems();

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin':
        return <Badge variant="admin">Admin</Badge>;
      case 'teacher':
        return <Badge variant="teacher">Teacher</Badge>;
      case 'student':
        return <Badge variant="student">Student</Badge>;
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg gradient-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">SRMS</h1>
              <p className="text-xs text-sidebar-foreground/60">Result Management</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto p-2 rounded-lg gradient-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <div className="mt-1">{getRoleBadge()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {mainItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                      : 'hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className={cn('h-5 w-5 flex-shrink-0', collapsed && 'mx-auto')} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 pt-6 border-t border-sidebar-border">
          <ul className="space-y-1 px-2">
            {bottomItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground'
                    )}
                  >
                    <item.icon className={cn('h-5 w-5 flex-shrink-0', collapsed && 'mx-auto')} />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors',
            'hover:bg-destructive/10 text-sidebar-foreground/80 hover:text-destructive'
          )}
        >
          <LogOut className={cn('h-5 w-5 flex-shrink-0', collapsed && 'mx-auto')} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
