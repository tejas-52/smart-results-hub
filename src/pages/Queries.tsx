import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Plus, Clock, CheckCircle2, MessageSquare, User } from 'lucide-react';

const queriesData = [
  {
    id: 1,
    subject: 'Result Discrepancy in MCA301',
    description: 'There seems to be an error in my Database Management System marks. I had expected higher marks based on my answer sheet.',
    category: 'Result',
    status: 'pending',
    createdAt: 'December 25, 2024',
    replies: 0,
  },
  {
    id: 2,
    subject: 'Study Material Access Issue',
    description: 'Unable to download the Advanced Java notes uploaded last week. Getting a 404 error.',
    category: 'Technical',
    status: 'in-progress',
    createdAt: 'December 23, 2024',
    replies: 2,
  },
  {
    id: 3,
    subject: 'Exam Hall Ticket Request',
    description: 'I have not received my hall ticket for the upcoming semester examinations. Please issue it at the earliest.',
    category: 'Examination',
    status: 'resolved',
    createdAt: 'December 20, 2024',
    replies: 3,
  },
  {
    id: 4,
    subject: 'Course Registration Query',
    description: 'I would like to know about the elective courses available for the next semester and the registration process.',
    category: 'Academic',
    status: 'resolved',
    createdAt: 'December 18, 2024',
    replies: 1,
  },
];

const Queries: React.FC = () => {
  const { role } = useAuth();
  const isStudent = role === 'student';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'default';
      case 'resolved':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {isStudent ? 'Help & Queries' : 'Query Management'}
          </h1>
          <p className="text-muted-foreground">
            {isStudent
              ? 'Submit queries and get help from teachers and administrators'
              : 'Manage and respond to student queries'}
          </p>
        </div>
        {isStudent && (
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            New Query
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Total Queries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="elevated">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm">All</Button>
            <Button variant="ghost" size="sm">Pending</Button>
            <Button variant="ghost" size="sm">In Progress</Button>
            <Button variant="ghost" size="sm">Resolved</Button>
          </div>
        </CardContent>
      </Card>

      {/* Queries List */}
      <div className="space-y-4">
        {queriesData.map((query, index) => (
          <Card
            key={query.id}
            variant="interactive"
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold">{query.subject}</h3>
                      <Badge variant="outline">{query.category}</Badge>
                      <Badge variant={getStatusColor(query.status) as 'warning' | 'default' | 'success' | 'secondary'}>
                        {getStatusLabel(query.status)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">{query.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {query.createdAt}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {query.replies} {query.replies === 1 ? 'reply' : 'replies'}
                  </div>
                  {!isStudent && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Amit Patil
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section for Students */}
      {isStudent && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Common topics and quick links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 justify-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Result Queries</p>
                  <p className="text-xs text-muted-foreground">Marks, grades, revaluation</p>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 justify-start gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <HelpCircle className="h-5 w-5 text-warning" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Exam Issues</p>
                  <p className="text-xs text-muted-foreground">Hall ticket, schedule</p>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 justify-start gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <HelpCircle className="h-5 w-5 text-success" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Technical Support</p>
                  <p className="text-xs text-muted-foreground">Portal, access issues</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Queries;
