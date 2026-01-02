import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Examination = Tables<'examinations'>;
export type ExaminationInsert = TablesInsert<'examinations'>;
export type ExaminationUpdate = TablesUpdate<'examinations'>;

export type ExaminationWithDetails = Examination & {
  subjects?: { name: string; code: string; course_id: string } | null;
};

export function useExaminations() {
  return useQuery({
    queryKey: ['examinations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('examinations')
        .select(`
          *,
          subjects:subject_id (name, code, course_id)
        `)
        .order('exam_date', { ascending: true });

      if (error) throw error;
      return data as ExaminationWithDetails[];
    },
  });
}

export function useUpcomingExaminations() {
  return useQuery({
    queryKey: ['examinations', 'upcoming'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('examinations')
        .select(`
          *,
          subjects:subject_id (name, code, course_id)
        `)
        .gte('exam_date', today)
        .order('exam_date', { ascending: true });

      if (error) throw error;
      return data as ExaminationWithDetails[];
    },
  });
}

export function useCreateExamination() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (exam: ExaminationInsert) => {
      const { data, error } = await supabase
        .from('examinations')
        .insert(exam)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examinations'] });
      toast({ title: 'Success', description: 'Examination scheduled successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateExamination() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: ExaminationUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('examinations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examinations'] });
      toast({ title: 'Success', description: 'Examination updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteExamination() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('examinations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examinations'] });
      toast({ title: 'Success', description: 'Examination deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
