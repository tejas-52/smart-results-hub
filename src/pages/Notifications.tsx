import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Clock, Plus, CheckCircle2, AlertCircle, Info, Megaphone, Trash2 } from 'lucide-react';
import { useNotifications, useDeleteNotification } from '@/hooks/useNotifications';
import { NotificationDialog } from '@/components/dialogs/NotificationDialog';
import { format } from 'date-fns';

const Notifications: React.FC = () => {
  const { role } = useAuth();
  const isAdminOrTeacher = role === 'admin' || role === 'teacher';
  const { data: notifications, isLoading, error } = useNotifications();
  const deleteNotification = useDeleteNotification();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');

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

  const filteredNotifications = notifications?.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading notifications: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              {notifications?.length || 0} notifications
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAdminOrTeacher && (
            <Button variant="gradient" className="gap-2" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              New Announcement
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card variant="elevated">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'exam' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('exam')}
            >
              Exams
            </Button>
            <Button 
              variant={filter === 'result' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('result')}
            >
              Results
            </Button>
            <Button 
              variant={filter === 'assignment' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('assignment')}
            >
              Assignments
            </Button>
            <Button 
              variant={filter === 'announcement' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('announcement')}
            >
              Announcements
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} variant="elevated">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredNotifications && filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <Card
              key={notification.id}
              variant="elevated"
              className="animate-slide-up"
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
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {notification.type}
                        </Badge>
                        {notification.target_role && (
                          <Badge variant="secondary" className="capitalize">
                            {notification.target_role}s only
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(notification.created_at), 'MMM d, yyyy')}
                        </div>
                        <span>{format(new Date(notification.created_at), 'h:mm a')}</span>
                      </div>
                      {isAdminOrTeacher && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteNotification.mutate(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? "You're all caught up!" 
                : `No ${filter} notifications found.`}
            </p>
          </div>
        )}
      </div>

      {/* Notification Dialog */}
      <NotificationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Notifications;
