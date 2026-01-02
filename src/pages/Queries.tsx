import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { HelpCircle, Plus, Clock, CheckCircle2, MessageSquare, User } from 'lucide-react';
import { useQueries, useCreateQuery, useRespondToQuery } from '@/hooks/useQueries';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Queries: React.FC = () => {
  const { role, user } = useAuth();
  const isStudent = role === 'student';
  const { data: queries, isLoading, error } = useQueries(isStudent ? user?.id : undefined);
  const createQuery = useCreateQuery();
  const respondToQuery = useRespondToQuery();
  
  const [filter, setFilter] = useState<string>('all');
  const [newQueryDialogOpen, setNewQueryDialogOpen] = useState(false);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
  
  // New query form
  const [querySubject, setQuerySubject] = useState('');
  const [queryMessage, setQueryMessage] = useState('');
  const [queryPriority, setQueryPriority] = useState('medium');
  
  // Response form
  const [responseText, setResponseText] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
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
      case 'open':
        return 'Open';
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

  const handleCreateQuery = async () => {
    if (!querySubject || !queryMessage || !user?.id) return;
    
    await createQuery.mutateAsync({
      subject: querySubject,
      message: queryMessage,
      priority: queryPriority,
      student_id: user.id,
    });
    
    setNewQueryDialogOpen(false);
    setQuerySubject('');
    setQueryMessage('');
    setQueryPriority('medium');
  };

  const handleRespond = async () => {
    if (!selectedQueryId || !responseText) return;
    
    await respondToQuery.mutateAsync({
      id: selectedQueryId,
      response: responseText,
    });
    
    setResponseDialogOpen(false);
    setSelectedQueryId(null);
    setResponseText('');
  };

  const openResponseDialog = (queryId: string) => {
    setSelectedQueryId(queryId);
    setResponseDialogOpen(true);
  };

  const filteredQueries = queries?.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  // Calculate stats
  const totalQueries = queries?.length || 0;
  const pendingCount = queries?.filter(q => q.status === 'open' || q.status === 'pending').length || 0;
  const inProgressCount = queries?.filter(q => q.status === 'in-progress').length || 0;
  const resolvedCount = queries?.filter(q => q.status === 'resolved').length || 0;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading queries: {error.message}</p>
      </div>
    );
  }

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
          <Button variant="gradient" className="gap-2" onClick={() => setNewQueryDialogOpen(true)}>
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
                <p className="text-2xl font-bold">{totalQueries}</p>
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
                <p className="text-2xl font-bold">{pendingCount}</p>
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
                <p className="text-2xl font-bold">{inProgressCount}</p>
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
                <p className="text-2xl font-bold">{resolvedCount}</p>
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
            <Button 
              variant={filter === 'all' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'open' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('open')}
            >
              Pending
            </Button>
            <Button 
              variant={filter === 'in-progress' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('in-progress')}
            >
              In Progress
            </Button>
            <Button 
              variant={filter === 'resolved' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('resolved')}
            >
              Resolved
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Queries List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} variant="elevated">
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
          ))
        ) : filteredQueries && filteredQueries.length > 0 ? (
          filteredQueries.map((query, index) => (
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
                        <Badge variant="outline" className="capitalize">{query.priority}</Badge>
                        <Badge variant={getStatusColor(query.status) as any}>
                          {getStatusLabel(query.status)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">{query.message}</p>
                      {query.response && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Response:</p>
                          <p className="text-sm text-muted-foreground">{query.response}</p>
                        </div>
                      )}
                    </div>
                    {!isStudent && query.status !== 'resolved' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openResponseDialog(query.id)}
                      >
                        Respond
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(new Date(query.created_at), 'MMM d, yyyy')}
                    </div>
                    {!isStudent && (query as any).student_name && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {(query as any).student_name}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No queries found</h3>
            <p className="text-muted-foreground mb-4">
              {isStudent ? 'Submit your first query to get help.' : 'No student queries to manage.'}
            </p>
            {isStudent && (
              <Button variant="gradient" onClick={() => setNewQueryDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Query
              </Button>
            )}
          </div>
        )}
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

      {/* New Query Dialog */}
      <Dialog open={newQueryDialogOpen} onOpenChange={setNewQueryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit New Query</DialogTitle>
            <DialogDescription>
              Describe your issue and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject"
                value={querySubject}
                onChange={(e) => setQuerySubject(e.target.value)}
                placeholder="Brief title for your query"
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={queryPriority} onValueChange={setQueryPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message"
                value={queryMessage}
                onChange={(e) => setQueryMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setNewQueryDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="gradient"
                onClick={handleCreateQuery}
                disabled={!querySubject || !queryMessage || createQuery.isPending}
              >
                {createQuery.isPending ? 'Submitting...' : 'Submit Query'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Respond to Query</DialogTitle>
            <DialogDescription>
              Provide a response to the student's query.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="response">Response</Label>
              <Textarea 
                id="response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response..."
                className="min-h-[150px]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="gradient"
                onClick={handleRespond}
                disabled={!responseText || respondToQuery.isPending}
              >
                {respondToQuery.isPending ? 'Sending...' : 'Send Response'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Queries;
