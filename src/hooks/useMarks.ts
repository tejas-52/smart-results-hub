import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Mark = Tables<'marks'>;
export type MarkInsert = TablesInsert<'marks'>;
export type MarkUpdate = TablesUpdate<'marks'>;

export type MarkWithDetails = Mark & {
  exam_name?: string;
  max_marks?: number;
  subject_name?: string;
  subject_code?: string;
  student_name?: string;
};

export function useStudentMarks(studentId: string | undefined) {
  return useQuery({
    queryKey: ['marks', 'student', studentId],
    queryFn: async () => {
      if (!studentId) return [];
      const { data: marks, error } = await supabase
        .from('marks')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch examination details
      const examIds = [...new Set(marks?.map(m => m.examination_id) || [])];
      const { data: exams } = await supabase
        .from('examinations')
        .select('id, name, max_marks, subject_id')
        .in('id', examIds);

      const subjectIds = [...new Set(exams?.map(e => e.subject_id) || [])];
      const { data: subjects } = await supabase
        .from('subjects')
        .select('id, name, code')
        .in('id', subjectIds);

      const examMap = new Map(exams?.map(e => [e.id, e]) || []);
      const subjectMap = new Map(subjects?.map(s => [s.id, s]) || []);

      return marks?.map(m => {
        const exam = examMap.get(m.examination_id);
        const subject = exam ? subjectMap.get(exam.subject_id) : null;
        return {
          ...m,
          exam_name: exam?.name,
          max_marks: exam?.max_marks,
          subject_name: subject?.name,
          subject_code: subject?.code,
        };
      }) as MarkWithDetails[];
    },
    enabled: !!studentId,
  });
}

export function useExaminationMarks(examinationId: string | undefined) {
  return useQuery({
    queryKey: ['marks', 'examination', examinationId],
    queryFn: async () => {
      if (!examinationId) return [];
      const { data: marks, error } = await supabase
        .from('marks')
        .select('*')
        .eq('examination_id', examinationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch student profiles
      const studentIds = [...new Set(marks?.map(m => m.student_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', studentIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return marks?.map(m => ({
        ...m,
        student_name: profileMap.get(m.student_id)?.full_name,
      })) as MarkWithDetails[];
    },
    enabled: !!examinationId,
  });
}

export function useUpsertMarks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (marks: MarkInsert[]) => {
      const { data, error } = await supabase
        .from('marks')
        .upsert(marks, { onConflict: 'examination_id,student_id' })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marks'] });
      toast({ title: 'Success', description: 'Marks saved successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateMark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: MarkUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('marks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marks'] });
      toast({ title: 'Success', description: 'Mark updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
