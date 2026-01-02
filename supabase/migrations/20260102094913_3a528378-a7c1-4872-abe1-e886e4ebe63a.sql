-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  duration_years INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  semester INTEGER NOT NULL,
  credits INTEGER NOT NULL DEFAULT 3,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  syllabus_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table (student-course relationship)
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  semester INTEGER NOT NULL DEFAULT 1,
  academic_year TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id, academic_year)
);

-- Create examinations table
CREATE TABLE public.examinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  exam_type TEXT NOT NULL DEFAULT 'regular',
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 180,
  max_marks INTEGER NOT NULL DEFAULT 100,
  instructions TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create marks table
CREATE TABLE public.marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  examination_id UUID REFERENCES public.examinations(id) ON DELETE CASCADE NOT NULL,
  marks_obtained NUMERIC(5,2),
  grade TEXT,
  remarks TEXT,
  entered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (student_id, examination_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  target_role app_role,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create study_materials table
CREATE TABLE public.study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create queries table
CREATE TABLE public.queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view student profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'teacher'));

-- RLS Policies for courses (viewable by all authenticated)
CREATE POLICY "Authenticated users can view courses" ON public.courses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for subjects
CREATE POLICY "Authenticated users can view subjects" ON public.subjects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage subjects" ON public.subjects
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can update assigned subjects" ON public.subjects
  FOR UPDATE USING (teacher_id = auth.uid());

-- RLS Policies for enrollments
CREATE POLICY "Students can view own enrollments" ON public.enrollments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Admins can manage enrollments" ON public.enrollments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view enrollments" ON public.enrollments
  FOR SELECT USING (public.has_role(auth.uid(), 'teacher'));

-- RLS Policies for examinations
CREATE POLICY "Authenticated users can view exams" ON public.examinations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage exams" ON public.examinations
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can manage exams" ON public.examinations
  FOR ALL USING (public.has_role(auth.uid(), 'teacher'));

-- RLS Policies for marks
CREATE POLICY "Students can view own marks" ON public.marks
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage marks" ON public.marks
  FOR ALL USING (public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Admins can view all marks" ON public.marks
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for notifications
CREATE POLICY "Users can view relevant notifications" ON public.notifications
  FOR SELECT TO authenticated USING (
    target_role IS NULL 
    OR target_role = public.get_user_role(auth.uid())
  );

CREATE POLICY "Admins can manage notifications" ON public.notifications
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'teacher'));

-- RLS Policies for study_materials
CREATE POLICY "Authenticated users can view materials" ON public.study_materials
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Teachers can manage materials" ON public.study_materials
  FOR ALL USING (public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Admins can manage materials" ON public.study_materials
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for queries
CREATE POLICY "Students can manage own queries" ON public.queries
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Teachers can view and respond to queries" ON public.queries
  FOR SELECT USING (public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Teachers can update queries" ON public.queries
  FOR UPDATE USING (public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Admins can manage all queries" ON public.queries
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to create profile and assign role on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New User'),
    NEW.email
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'student')
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON public.subjects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marks_updated_at
  BEFORE UPDATE ON public.marks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for study materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-materials', 'study-materials', true);

-- Storage policies for study-materials bucket
CREATE POLICY "Authenticated users can view materials"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'study-materials');

CREATE POLICY "Teachers can upload materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'study-materials' 
  AND public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admins can upload materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'study-materials' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Teachers can delete own materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'study-materials' 
  AND public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admins can delete any materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'study-materials' 
  AND public.has_role(auth.uid(), 'admin')
);