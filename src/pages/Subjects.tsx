import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, BookOpen, User, Clock, Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useSubjects, useDeleteSubject } from '@/hooks/useSubjects';
import { useStudentEnrollment } from '@/hooks/useEnrollments';
import { SubjectDialog } from '@/components/dialogs/SubjectDialog';
import type { Subject } from '@/hooks/useSubjects';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

const Subjects: React.FC = () => {
  const { role, user } = useAuth();
  const isAdmin = role === 'admin';
  const { data: subjects, isLoading, error } = useSubjects();
  const { data: enrollment } = useStudentEnrollment(user?.id);
  const deleteSubject = useDeleteSubject();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setDialogOpen(true);
  };

  const handleDelete = (subject: Subject) => {
    setSubjectToDelete(subject);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (subjectToDelete) {
      await deleteSubject.mutateAsync(subjectToDelete.id);
      setDeleteDialogOpen(false);
      setSubjectToDelete(null);
    }
  };

  const handleAddNew = () => {
    setSelectedSubject(null);
    setDialogOpen(true);
  };

  // Filter subjects for students based on enrollment
  const displaySubjects = role === 'student' && enrollment 
    ? subjects?.filter(s => s.course_id === enrollment.course_id && s.semester === enrollment.semester)
    : subjects;

  const totalCredits = displaySubjects?.reduce((sum, s) => sum + s.credits, 0) || 0;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading subjects: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {role === 'student' ? 'My Subjects' : 'Subject Management'}
          </h1>
          <p className="text-muted-foreground">
            {role === 'student'
              ? 'View your enrolled subjects and syllabus'
              : 'Manage academic subjects and assignments'}
          </p>
        </div>
        {isAdmin && (
          <Button variant="gradient" className="gap-2" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
            Add Subject
          </Button>
        )}
      </div>

      {/* Semester Info */}
      {role === 'student' && enrollment && (
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="default" className="text-base px-4 py-1">
                {(enrollment as any).courses?.code || 'N/A'} - Semester {enrollment.semester}
              </Badge>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{displaySubjects?.length || 0} Subjects</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{totalCredits} Credits</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subjects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} variant="elevated">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-16 mb-2" />
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : displaySubjects && displaySubjects.length > 0 ? (
          displaySubjects.map((subject, index) => (
            <Card
              key={subject.id}
              variant="interactive"
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {subject.code}
                    </Badge>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    {isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(subject)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(subject)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Semester</span>
                  <Badge variant="secondary">
                    Semester {subject.semester}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Credits</span>
                  <span className="font-medium">{subject.credits}</span>
                </div>
                {(subject as any).courses && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Course</span>
                    <span className="font-medium">{(subject as any).courses.code}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No subjects found</h3>
            <p className="text-muted-foreground mb-4">
              {role === 'student' 
                ? 'No subjects are available for your current semester.'
                : 'Get started by creating your first subject.'}
            </p>
            {isAdmin && (
              <Button variant="gradient" onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Subject Dialog */}
      <SubjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subject={selectedSubject}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{subjectToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Subjects;
