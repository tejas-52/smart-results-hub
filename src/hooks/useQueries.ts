import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Query = Tables<'queries'>;
export type QueryInsert = TablesInsert<'queries'>;
export type QueryUpdate = TablesUpdate<'queries'>;

export type QueryWithDetails = Query & {
  student_name?: string;
};

export function useQueries(studentId?: string) {
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('queries-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queries',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['queries'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['queries', studentId],
    queryFn: async () => {
      let query = supabase
        .from('queries')
        .select('*')
        .order('created_at', { ascending: false });

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data: queries, error } = await query;
      if (error) throw error;

      // Fetch student profiles if not filtering by student
      if (!studentId && queries?.length) {
        const studentIds = [...new Set(queries.map(q => q.student_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', studentIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

        return queries.map(q => ({
          ...q,
          student_name: profileMap.get(q.student_id)?.full_name,
        })) as QueryWithDetails[];
      }

      return queries as QueryWithDetails[];
    },
  });
}

export function useCreateQuery() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (query: QueryInsert) => {
      const { data, error } = await supabase
        .from('queries')
        .insert(query)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
      toast({ title: 'Success', description: 'Query submitted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateQuery() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: QueryUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('queries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
      toast({ title: 'Success', description: 'Query updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useRespondToQuery() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, response }: { id: string; response: string }) => {
      const { data, error } = await supabase
        .from('queries')
        .update({ 
          response, 
          status: 'resolved',
          responded_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
      toast({ title: 'Success', description: 'Response sent successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
