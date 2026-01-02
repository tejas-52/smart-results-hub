import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Enrollment = Tables<'enrollments'>;
export type EnrollmentInsert = TablesInsert<'enrollments'>;

export type EnrollmentWithDetails = Enrollment & {
  course_name?: string;
  course_code?: string;
  student_name?: string;
  student_email?: string;
};

export function useStudentEnrollment(studentId: string | undefined) {
  return useQuery({
    queryKey: ['enrollments', 'student', studentId],
    queryFn: async () => {
      if (!studentId) return null;
      const { data: enrollment, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('student_id', studentId)
        .maybeSingle();

      if (error) throw error;
      if (!enrollment) return null;

      // Fetch course details
      const { data: course } = await supabase
        .from('courses')
        .select('name, code')
        .eq('id', enrollment.course_id)
        .single();

      return {
        ...enrollment,
        course_name: course?.name,
        course_code: course?.code,
      } as EnrollmentWithDetails;
    },
    enabled: !!studentId,
  });
}

export function useCourseEnrollments(courseId: string | undefined) {
  return useQuery({
    queryKey: ['enrollments', 'course', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', courseId)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      // Fetch student profiles
      const studentIds = [...new Set(enrollments?.map(e => e.student_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', studentIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return enrollments?.map(e => ({
        ...e,
        student_name: profileMap.get(e.student_id)?.full_name,
        student_email: profileMap.get(e.student_id)?.email,
      })) as EnrollmentWithDetails[];
    },
    enabled: !!courseId,
  });
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (enrollment: EnrollmentInsert) => {
      const { data, error } = await supabase
        .from('enrollments')
        .insert(enrollment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      toast({ title: 'Success', description: 'Enrollment created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
