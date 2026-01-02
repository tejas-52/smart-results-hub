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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreateExamination, useUpdateExamination, type Examination } from '@/hooks/useExaminations';
import { useSubjects } from '@/hooks/useSubjects';
import { useAuth } from '@/contexts/AuthContext';

const examinationSchema = z.object({
  name: z.string().min(1, 'Exam name is required'),
  subject_id: z.string().min(1, 'Subject is required'),
  exam_date: z.string().min(1, 'Exam date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  duration_minutes: z.coerce.number().min(30, 'Duration must be at least 30 minutes').max(300, 'Duration cannot exceed 300 minutes'),
  max_marks: z.coerce.number().min(1, 'Max marks must be at least 1').max(500, 'Max marks cannot exceed 500'),
  exam_type: z.string().min(1, 'Exam type is required'),
  instructions: z.string().optional(),
});

type ExaminationFormValues = z.infer<typeof examinationSchema>;

interface ExaminationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examination?: Examination | null;
}

export function ExaminationDialog({ open, onOpenChange, examination }: ExaminationDialogProps) {
  const createExamination = useCreateExamination();
  const updateExamination = useUpdateExamination();
  const { data: subjects } = useSubjects();
  const { user } = useAuth();
  const isEditing = !!examination;

  const form = useForm<ExaminationFormValues>({
    resolver: zodResolver(examinationSchema),
    defaultValues: {
      name: '',
      subject_id: '',
      exam_date: '',
      start_time: '10:00',
      duration_minutes: 180,
      max_marks: 100,
      exam_type: 'regular',
      instructions: '',
    },
  });

  useEffect(() => {
    if (examination) {
      form.reset({
        name: examination.name,
        subject_id: examination.subject_id,
        exam_date: examination.exam_date,
        start_time: examination.start_time,
        duration_minutes: examination.duration_minutes,
        max_marks: examination.max_marks,
        exam_type: examination.exam_type,
        instructions: examination.instructions || '',
      });
    } else {
      form.reset({
        name: '',
        subject_id: '',
        exam_date: '',
        start_time: '10:00',
        duration_minutes: 180,
        max_marks: 100,
        exam_type: 'regular',
        instructions: '',
      });
    }
  }, [examination, form]);

  const onSubmit = async (values: ExaminationFormValues) => {
    try {
      if (isEditing && examination) {
        await updateExamination.mutateAsync({ 
          id: examination.id, 
          name: values.name,
          subject_id: values.subject_id,
          exam_date: values.exam_date,
          start_time: values.start_time,
          duration_minutes: values.duration_minutes,
          max_marks: values.max_marks,
          exam_type: values.exam_type,
          instructions: values.instructions || null,
        });
      } else {
        await createExamination.mutateAsync({
          name: values.name,
          subject_id: values.subject_id,
          exam_date: values.exam_date,
          start_time: values.start_time,
          duration_minutes: values.duration_minutes,
          max_marks: values.max_marks,
          exam_type: values.exam_type,
          instructions: values.instructions || null,
          created_by: user?.id || null,
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Examination' : 'Schedule New Examination'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the examination details below.' : 'Fill in the details to schedule a new exam.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Mid-term Examination" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subject_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects?.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.code} - {subject.name}
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
                name="exam_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="midterm">Midterm</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                        <SelectItem value="practical">Practical</SelectItem>
                        <SelectItem value="supplementary">Supplementary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="exam_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" min={30} max={300} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_marks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Marks</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={500} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any special instructions for the exam..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
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
                disabled={createExamination.isPending || updateExamination.isPending}
              >
                {createExamination.isPending || updateExamination.isPending ? 'Saving...' : isEditing ? 'Update Exam' : 'Schedule Exam'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
