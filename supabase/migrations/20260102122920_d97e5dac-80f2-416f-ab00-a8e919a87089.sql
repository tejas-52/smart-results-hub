-- Fix security issues: Restrict teacher access to only their students/subjects

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Teachers can view student profiles" ON public.profiles;
DROP POLICY IF EXISTS "Teachers can manage marks" ON public.marks;

-- Create function to check if teacher teaches a subject
CREATE OR REPLACE FUNCTION public.teacher_teaches_subject(_teacher_id uuid, _subject_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subjects
    WHERE id = _subject_id
      AND teacher_id = _teacher_id
  )
$$;

-- Create function to get subject_id from examination
CREATE OR REPLACE FUNCTION public.get_examination_subject(_examination_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT subject_id FROM public.examinations WHERE id = _examination_id LIMIT 1
$$;

-- Teachers can only view profiles of students enrolled in their courses
CREATE POLICY "Teachers can view enrolled student profiles" 
ON public.profiles 
FOR SELECT 
USING (
  has_role(auth.uid(), 'teacher'::app_role) AND
  EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN public.subjects s ON s.course_id = e.course_id
    WHERE e.student_id = profiles.user_id
    AND s.teacher_id = auth.uid()
  )
);

-- Teachers can only manage marks for subjects they teach
CREATE POLICY "Teachers can view marks for their subjects" 
ON public.marks 
FOR SELECT 
USING (
  has_role(auth.uid(), 'teacher'::app_role) AND
  teacher_teaches_subject(auth.uid(), get_examination_subject(examination_id))
);

CREATE POLICY "Teachers can insert marks for their subjects" 
ON public.marks 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'teacher'::app_role) AND
  teacher_teaches_subject(auth.uid(), get_examination_subject(examination_id))
);

CREATE POLICY "Teachers can update marks for their subjects" 
ON public.marks 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'teacher'::app_role) AND
  teacher_teaches_subject(auth.uid(), get_examination_subject(examination_id))
);

CREATE POLICY "Teachers can delete marks for their subjects" 
ON public.marks 
FOR DELETE 
USING (
  has_role(auth.uid(), 'teacher'::app_role) AND
  teacher_teaches_subject(auth.uid(), get_examination_subject(examination_id))
);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.queries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marks;