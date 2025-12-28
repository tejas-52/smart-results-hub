import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  BookOpen,
  FileText,
  Award,
  TrendingUp,
  Calendar,
  Bell,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Admin Stats
  const adminStats = [
    { icon: Users, label: 'Total Students', value: '1,234', change: '+12%', color: 'text-primary' },
    { icon: Users, label: 'Total Teachers', value: '56', change: '+3%', color: 'text-success' },
    { icon: BookOpen, label: 'Active Courses', value: '24', change: '+5%', color: 'text-warning' },
    { icon: Award, label: 'Results Published', value: '18', change: '+8%', color: 'text-accent' },
  ];

  // Teacher Stats
  const teacherStats = [
    { icon: BookOpen, label: 'Assigned Courses', value: '4', color: 'text-primary' },
    { icon: FileText, label: 'Subjects', value: '8', color: 'text-success' },
    { icon: Users, label: 'Students', value: '320', color: 'text-warning' },
    { icon: Award, label: 'Pending Results', value: '2', color: 'text-destructive' },
  ];

  // Student Stats
  const studentStats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: '6', color: 'text-primary' },
    { icon: FileText, label: 'Subjects', value: '12', color: 'text-success' },
    { icon: Award, label: 'CGPA', value: '8.5', color: 'text-warning' },
    { icon: Calendar, label: 'Upcoming Exams', value: '3', color: 'text-destructive' },
  ];

  const getStats = () => {
    switch (user?.role) {
      case 'admin':
        return adminStats;
      case 'teacher':
        return teacherStats;
      case 'student':
        return studentStats;
      default:
        return [];
    }
  };

  const recentNotifications = [
    {
      id: 1,
      title: 'Exam Schedule Released',
      description: 'MCA Semester 4 exam schedule has been published',
      time: '2 hours ago',
      type: 'info',
    },
    {
      id: 2,
      title: 'Results Published',
      description: 'Semester 3 results are now available',
      time: '1 day ago',
      type: 'success',
    },
    {
      id: 3,
      title: 'Assignment Deadline',
      description: 'Database Management assignment due tomorrow',
      time: '2 days ago',
      type: 'warning',
    },
  ];

  const upcomingEvents = [
    { title: 'Advanced Java Exam', date: 'Jan 15, 2025', status: 'upcoming' },
    { title: 'Project Submission', date: 'Jan 20, 2025', status: 'pending' },
    { title: 'Practical Exam', date: 'Jan 25, 2025', status: 'upcoming' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="gradient-hero rounded-2xl p-6 lg:p-8 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative z-10">
          <p className="text-primary-foreground/80 mb-1">{getGreeting()},</p>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{user?.name}</h1>
          <p className="text-primary-foreground/70 max-w-xl">
            Welcome to your SRMS dashboard. Here's an overview of your academic activities and important updates.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {getStats().map((stat, index) => (
          <Card key={index} variant="elevated" className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  {'change' in stat && (
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-sm text-success">{stat.change}</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Notifications */}
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Recent Notifications
              </CardTitle>
              <CardDescription>Stay updated with important announcements</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      notification.type === 'success'
                        ? 'bg-success/10 text-success'
                        : notification.type === 'warning'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {notification.type === 'success' ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : notification.type === 'warning' ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <Bell className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {notification.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {notification.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Important dates to remember</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border bg-card"
                >
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge variant={event.status === 'pending' ? 'warning' : 'secondary'}>
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features for quick access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {user?.role === 'admin' && (
              <>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-xs">Manage Users</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <BookOpen className="h-6 w-6" />
                  <span className="text-xs">Add Course</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Award className="h-6 w-6" />
                  <span className="text-xs">Publish Results</span>
                </Button>
              </>
            )}
            {user?.role === 'teacher' && (
              <>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-xs">Upload Material</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Award className="h-6 w-6" />
                  <span className="text-xs">Enter Marks</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-xs">Schedule Exam</span>
                </Button>
              </>
            )}
            {user?.role === 'student' && (
              <>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-xs">Study Materials</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Award className="h-6 w-6" />
                  <span className="text-xs">View Results</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-xs">Exam Schedule</span>
                </Button>
              </>
            )}
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Bell className="h-6 w-6" />
              <span className="text-xs">Notifications</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
