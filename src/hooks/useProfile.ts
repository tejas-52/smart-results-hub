import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!userId) return { error: new Error('No user ID') };
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId);
    
    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }
    
    return { error };
  };

  return { profile, isLoading, updateProfile };
};
