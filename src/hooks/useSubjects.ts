import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Subject = Tables<'subjects'>;
export type SubjectInsert = TablesInsert<'subjects'>;
export type SubjectUpdate = TablesUpdate<'subjects'>;

export type SubjectWithDetails = Subject & {
  course_name?: string;
  course_code?: string;
  teacher_name?: string;
};

export function useSubjects(courseId?: string) {
  return useQuery({
    queryKey: ['subjects', courseId],
    queryFn: async () => {
      let query = supabase
        .from('subjects')
        .select('*')
        .order('semester', { ascending: true })
        .order('name', { ascending: true });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data: subjects, error } = await query;
      if (error) throw error;

      // Fetch course details
      const courseIds = [...new Set(subjects?.map(s => s.course_id) || [])];
      const { data: courses } = await supabase
        .from('courses')
        .select('id, name, code')
        .in('id', courseIds);

      const courseMap = new Map(courses?.map(c => [c.id, c]) || []);

      return subjects?.map(s => ({
        ...s,
        course_name: courseMap.get(s.course_id)?.name,
        course_code: courseMap.get(s.course_id)?.code,
      })) as SubjectWithDetails[];
    },
  });
}

export function useTeacherSubjects(teacherId: string | undefined) {
  return useQuery({
    queryKey: ['subjects', 'teacher', teacherId],
    queryFn: async () => {
      if (!teacherId) return [];
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!teacherId,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (subject: SubjectInsert) => {
      const { data, error } = await supabase
        .from('subjects')
        .insert(subject)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({ title: 'Success', description: 'Subject created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: SubjectUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({ title: 'Success', description: 'Subject updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({ title: 'Success', description: 'Subject deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
