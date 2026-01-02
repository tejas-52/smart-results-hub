import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, Plus, CheckCircle2, AlertCircle, Info, Megaphone } from 'lucide-react';

const notificationsData = [
  {
    id: 1,
    title: 'Semester 4 Exam Schedule Released',
    description: 'The examination schedule for MCA Semester 4 has been published. Please check the exam section for details.',
    type: 'exam',
    date: '2024-12-28',
    time: '10:30 AM',
    isRead: false,
    priority: 'high',
  },
  {
    id: 2,
    title: 'Semester 3 Results Published',
    description: 'Results for MCA Semester 3 examinations are now available. Students can view their results in the Results section.',
    type: 'result',
    date: '2024-12-27',
    time: '3:00 PM',
    isRead: true,
    priority: 'high',
  },
  {
    id: 3,
    title: 'Assignment Submission Deadline',
    description: 'Reminder: Database Management System assignment is due tomorrow. Please submit before 11:59 PM.',
    type: 'assignment',
    date: '2024-12-26',
    time: '9:00 AM',
    isRead: false,
    priority: 'medium',
  },
  {
    id: 4,
    title: 'Holiday Announcement',
    description: 'University will remain closed on January 1, 2025, on account of New Year. Regular classes will resume on January 2, 2025.',
    type: 'announcement',
    date: '2024-12-25',
    time: '11:00 AM',
    isRead: true,
    priority: 'low',
  },
  {
    id: 5,
    title: 'New Study Materials Available',
    description: 'New study materials for Advanced Java Programming have been uploaded. Please check the Materials section.',
    type: 'material',
    date: '2024-12-24',
    time: '2:30 PM',
    isRead: true,
    priority: 'low',
  },
];

const Notifications: React.FC = () => {
  const { role } = useAuth();
  const isAdminOrTeacher = role === 'admin' || role === 'teacher';

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return <AlertCircle className="h-5 w-5" />;
      case 'result':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'announcement':
        return <Megaphone className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-destructive/10 text-destructive';
      case 'result':
        return 'bg-success/10 text-success';
      case 'assignment':
        return 'bg-warning/10 text-warning';
      case 'announcement':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const unreadCount = notificationsData.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAdminOrTeacher && (
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              New Announcement
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card variant="elevated">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm">All</Button>
            <Button variant="ghost" size="sm">Exams</Button>
            <Button variant="ghost" size="sm">Results</Button>
            <Button variant="ghost" size="sm">Assignments</Button>
            <Button variant="ghost" size="sm">Announcements</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {notificationsData.map((notification, index) => (
          <Card
            key={notification.id}
            variant={notification.isRead ? 'default' : 'elevated'}
            className={`animate-slide-up ${!notification.isRead ? 'border-l-4 border-l-primary' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl flex-shrink-0 ${getTypeColor(notification.type)}`}>
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    {getPriorityBadge(notification.priority)}
                  </div>
                  <p className="text-muted-foreground mb-3">{notification.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {notification.date}
                    </div>
                    <span>{notification.time}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
