import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Users, Clock, Plus, MoreVertical, Calendar, Edit, Trash2 } from 'lucide-react';
import { useCourses, useDeleteCourse } from '@/hooks/useCourses';
import { useStudentEnrollment } from '@/hooks/useEnrollments';
import { CourseDialog } from '@/components/dialogs/CourseDialog';
import type { Course } from '@/hooks/useCourses';
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

const Courses: React.FC = () => {
  const { role, user } = useAuth();
  const isAdmin = role === 'admin';
  const { data: courses, isLoading, error } = useCourses();
  const { data: enrollment } = useStudentEnrollment(user?.id);
  const deleteCourse = useDeleteCourse();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const handleDelete = (course: Course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (courseToDelete) {
      await deleteCourse.mutateAsync(courseToDelete.id);
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleAddNew = () => {
    setSelectedCourse(null);
    setDialogOpen(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading courses: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {role === 'student' ? 'My Courses' : 'Course Management'}
          </h1>
          <p className="text-muted-foreground">
            {role === 'student'
              ? 'View your enrolled courses and progress'
              : 'Manage academic courses and programs'}
          </p>
        </div>
        {isAdmin && (
          <Button variant="gradient" className="gap-2" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        )}
      </div>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} variant="elevated">
              <CardHeader className="pb-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-5 w-20 mt-2" />
                <Skeleton className="h-6 w-full mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))
        ) : courses && courses.length > 0 ? (
          courses.map((course, index) => (
            <Card
              key={course.id}
              variant="interactive"
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl gradient-primary">
                      <BookOpen className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-1">
                        {course.code}
                      </Badge>
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                    </div>
                  </div>
                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(course)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(course)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between py-4 border-y">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Clock className="h-4 w-4" />
                    </div>
                    <p className="font-semibold">{course.duration_years} Years</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first course.</p>
            {isAdmin && (
              <Button variant="gradient" onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Enrollment Info for Students */}
      {role === 'student' && enrollment && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Enrollment Information
            </CardTitle>
            <CardDescription>Your academic enrollment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-sm text-muted-foreground">Program</p>
                <p className="font-semibold">{(enrollment as any).courses?.code || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-sm text-muted-foreground">Current Semester</p>
                <p className="font-semibold">Semester {enrollment.semester}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-sm text-muted-foreground">Academic Year</p>
                <p className="font-semibold">{enrollment.academic_year}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-sm text-muted-foreground">Enrolled On</p>
                <p className="font-semibold">{new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Dialog */}
      <CourseDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        course={selectedCourse}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{courseToDelete?.name}"? This action cannot be undone.
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

export default Courses;
