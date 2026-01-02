import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type StudyMaterial = Tables<'study_materials'>;
export type StudyMaterialInsert = TablesInsert<'study_materials'>;

export type StudyMaterialWithDetails = StudyMaterial & {
  subject_name?: string;
  subject_code?: string;
  uploader_name?: string;
};

export function useStudyMaterials(subjectId?: string) {
  return useQuery({
    queryKey: ['study_materials', subjectId],
    queryFn: async () => {
      let query = supabase
        .from('study_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (subjectId) {
        query = query.eq('subject_id', subjectId);
      }

      const { data: materials, error } = await query;
      if (error) throw error;

      // Fetch subject details
      const subjectIds = [...new Set(materials?.map(m => m.subject_id) || [])];
      const { data: subjects } = await supabase
        .from('subjects')
        .select('id, name, code')
        .in('id', subjectIds);

      const subjectMap = new Map(subjects?.map(s => [s.id, s]) || []);

      return materials?.map(m => ({
        ...m,
        subject_name: subjectMap.get(m.subject_id)?.name,
        subject_code: subjectMap.get(m.subject_id)?.code,
      })) as StudyMaterialWithDetails[];
    },
  });
}

export function useUploadMaterial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ file, material }: { file: File; material: Omit<StudyMaterialInsert, 'file_url' | 'file_size' | 'file_type'> }) => {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${material.subject_id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('study-materials')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('study-materials')
        .getPublicUrl(filePath);

      // Insert material record
      const { data, error } = await supabase
        .from('study_materials')
        .insert({
          ...material,
          file_url: urlData.publicUrl,
          file_size: file.size,
          file_type: fileExt?.toUpperCase() || 'FILE',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study_materials'] });
      toast({ title: 'Success', description: 'Material uploaded successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('study_materials')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study_materials'] });
      toast({ title: 'Success', description: 'Material deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
