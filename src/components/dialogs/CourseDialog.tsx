import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreateCourse, useUpdateCourse, type Course } from '@/hooks/useCourses';

const courseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  code: z.string().min(1, 'Course code is required'),
  description: z.string().optional(),
  duration_years: z.coerce.number().min(1, 'Duration must be at least 1 year').max(6, 'Duration cannot exceed 6 years'),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course | null;
}

export function CourseDialog({ open, onOpenChange, course }: CourseDialogProps) {
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const isEditing = !!course;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      duration_years: 2,
    },
  });

  useEffect(() => {
    if (course) {
      form.reset({
        name: course.name,
        code: course.code,
        description: course.description || '',
        duration_years: course.duration_years,
      });
    } else {
      form.reset({
        name: '',
        code: '',
        description: '',
        duration_years: 2,
      });
    }
  }, [course, form]);

  const onSubmit = async (values: CourseFormValues) => {
    try {
      if (isEditing && course) {
        await updateCourse.mutateAsync({ id: course.id, ...values });
      } else {
        await createCourse.mutateAsync({
          name: values.name,
          code: values.code,
          description: values.description || null,
          duration_years: values.duration_years,
        });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the course details below.' : 'Fill in the details to create a new course.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Master of Computer Applications" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input placeholder="MCA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration_years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (Years)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Course description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="gradient"
                disabled={createCourse.isPending || updateCourse.isPending}
              >
                {createCourse.isPending || updateCourse.isPending ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
