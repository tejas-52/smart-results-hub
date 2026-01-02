import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, MapPin, BookOpen, Plus, FileText, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useExaminations, useUpcomingExaminations, useDeleteExamination } from '@/hooks/useExaminations';
import { ExaminationDialog } from '@/components/dialogs/ExaminationDialog';
import type { Examination } from '@/hooks/useExaminations';
import { format, differenceInDays, parseISO } from 'date-fns';
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

const Examinations: React.FC = () => {
  const { role } = useAuth();
  const isAdminOrTeacher = role === 'admin' || role === 'teacher';
  const { data: examinations, isLoading, error } = useExaminations();
  const deleteExamination = useDeleteExamination();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Examination | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Examination | null>(null);

  const handleEdit = (exam: Examination) => {
    setSelectedExam(exam);
    setDialogOpen(true);
  };

  const handleDelete = (exam: Examination) => {
    setExamToDelete(exam);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (examToDelete) {
      await deleteExamination.mutateAsync(examToDelete.id);
      setDeleteDialogOpen(false);
      setExamToDelete(null);
    }
  };

  const handleAddNew = () => {
    setSelectedExam(null);
    setDialogOpen(true);
  };

  const getExamStatus = (examDate: string) => {
    const today = new Date();
    const exam = parseISO(examDate);
    const diff = differenceInDays(exam, today);
    
    if (diff < 0) return { label: 'Completed', variant: 'secondary' as const };
    if (diff === 0) return { label: 'Today', variant: 'destructive' as const };
    if (diff <= 7) return { label: 'This Week', variant: 'warning' as const };
    return { label: 'Upcoming', variant: 'default' as const };
  };

  const upcomingExams = examinations?.filter(e => {
    const examDate = parseISO(e.exam_date);
    return differenceInDays(examDate, new Date()) >= 0;
  }) || [];

  const nextExamDays = upcomingExams.length > 0 
    ? differenceInDays(parseISO(upcomingExams[0].exam_date), new Date())
    : null;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading examinations: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {role === 'student' ? 'Exam Schedule' : 'Examination Management'}
          </h1>
          <p className="text-muted-foreground">
            {role === 'student'
              ? 'View your upcoming examinations and schedule'
              : 'Schedule and manage examinations'}
          </p>
        </div>
        {isAdminOrTeacher && (
          <Button variant="gradient" className="gap-2" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
            Schedule Exam
          </Button>
        )}
      </div>

      {/* Exam Info Banner */}
      <Card variant="elevated" className="gradient-hero text-primary-foreground overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Examination Schedule</h2>
              <p className="text-primary-foreground/80">
                {new Date().getFullYear()} Session
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{upcomingExams.length}</p>
                <p className="text-sm text-primary-foreground/70">Upcoming</p>
              </div>
              {nextExamDays !== null && (
                <div className="text-center">
                  <p className="text-3xl font-bold">{nextExamDays}</p>
                  <p className="text-sm text-primary-foreground/70">Days Left</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exam List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} variant="elevated">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : examinations && examinations.length > 0 ? (
          examinations.map((exam, index) => {
            const status = getExamStatus(exam.exam_date);
            const subjectInfo = (exam as any).subjects;
            
            return (
              <Card
                key={exam.id}
                variant="elevated"
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Subject Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl flex-shrink-0 ${exam.exam_type === 'practical' ? 'bg-success/10' : 'gradient-primary'}`}>
                        {exam.exam_type === 'practical' ? (
                          <FileText className="h-6 w-6 text-success" />
                        ) : (
                          <BookOpen className="h-6 w-6 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold">{exam.name}</h3>
                          {subjectInfo && (
                            <Badge variant="outline">{subjectInfo.code}</Badge>
                          )}
                          <Badge variant={exam.exam_type === 'practical' ? 'success' : 'secondary'} className="capitalize">
                            {exam.exam_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Duration: {exam.duration_minutes} mins | Max Marks: {exam.max_marks}
                        </p>
                      </div>
                    </div>

                    {/* Date, Time */}
                    <div className="grid sm:grid-cols-2 gap-4 lg:w-auto">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{format(parseISO(exam.exam_date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{exam.start_time}</span>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-2">
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                      {isAdminOrTeacher && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(exam)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(exam)}
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
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No examinations scheduled</h3>
            <p className="text-muted-foreground mb-4">
              {isAdminOrTeacher 
                ? 'Get started by scheduling your first exam.'
                : 'No exams are currently scheduled.'}
            </p>
            {isAdminOrTeacher && (
              <Button variant="gradient" onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Exam
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      {role === 'student' && examinations && examinations.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Exam Instructions</CardTitle>
            <CardDescription>Important guidelines for examinations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Arrive at the examination hall at least 30 minutes before the exam starts.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Carry your hall ticket and college ID card. Entry without these will not be permitted.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Mobile phones and electronic devices are strictly prohibited inside the exam hall.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Use only blue or black ink pens for writing answers.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>For practical exams, ensure you have the required software access credentials.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Examination Dialog */}
      <ExaminationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        examination={selectedExam}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Examination</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{examToDelete?.name}"? This action cannot be undone.
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

export default Examinations;
