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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateSubject, useUpdateSubject, type Subject } from '@/hooks/useSubjects';
import { useCourses } from '@/hooks/useCourses';
import { useTeachers } from '@/hooks/useUsers';

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  course_id: z.string().min(1, 'Course is required'),
  semester: z.coerce.number().min(1, 'Semester must be at least 1').max(10, 'Semester cannot exceed 10'),
  credits: z.coerce.number().min(1, 'Credits must be at least 1').max(10, 'Credits cannot exceed 10'),
  teacher_id: z.string().optional().nullable(),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: Subject | null;
}

export function SubjectDialog({ open, onOpenChange, subject }: SubjectDialogProps) {
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const { data: courses } = useCourses();
  const { data: teachers } = useTeachers();
  const isEditing = !!subject;

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      code: '',
      course_id: '',
      semester: 1,
      credits: 3,
      teacher_id: null,
    },
  });

  useEffect(() => {
    if (subject) {
      form.reset({
        name: subject.name,
        code: subject.code,
        course_id: subject.course_id,
        semester: subject.semester,
        credits: subject.credits,
        teacher_id: subject.teacher_id || null,
      });
    } else {
      form.reset({
        name: '',
        code: '',
        course_id: '',
        semester: 1,
        credits: 3,
        teacher_id: null,
      });
    }
  }, [subject, form]);

  const onSubmit = async (values: SubjectFormValues) => {
    try {
      if (isEditing && subject) {
        await updateSubject.mutateAsync({ 
          id: subject.id, 
          name: values.name,
          code: values.code,
          course_id: values.course_id,
          semester: values.semester,
          credits: values.credits,
          teacher_id: values.teacher_id || null,
        });
      } else {
        await createSubject.mutateAsync({
          name: values.name,
          code: values.code,
          course_id: values.course_id,
          semester: values.semester,
          credits: values.credits,
          teacher_id: values.teacher_id || null,
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
          <DialogTitle>{isEditing ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the subject details below.' : 'Fill in the details to create a new subject.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Advanced Java Programming" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Code</FormLabel>
                    <FormControl>
                      <Input placeholder="MCA401" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses?.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code} - {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="teacher_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Teacher (Optional)</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === '__none__' ? null : value)} 
                    value={field.value || '__none__'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none__">No teacher assigned</SelectItem>
                      {teachers?.map((teacher) => (
                        <SelectItem key={teacher.user_id} value={teacher.user_id}>
                          {teacher.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                disabled={createSubject.isPending || updateSubject.isPending}
              >
                {createSubject.isPending || updateSubject.isPending ? 'Saving...' : isEditing ? 'Update Subject' : 'Create Subject'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
