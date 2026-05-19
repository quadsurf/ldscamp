-- Create custom types for roles
CREATE TYPE public.app_role AS ENUM (
  'super_admin',
  'admin',
  'camp_director',
  'assistant_camp_director',
  'travel_director',
  'head_chef',
  'sous_chef',
  'ward_camp_director',
  'parent',
  'youth',
  'non_parent_volunteer'
);

-- Groups table
CREATE TABLE public.groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slogan TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Profiles table
-- Linked to auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role public.app_role DEFAULT 'parent'::public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Wards table
CREATE TABLE public.wards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('Ward', 'Branch')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Form submissions
CREATE TABLE public.form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  form_type TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- RLS setup
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Groups Policies
CREATE POLICY "Super admins can manage groups" 
ON public.groups 
TO authenticated 
USING (public.is_super_admin());

CREATE POLICY "Anyone can view groups" 
ON public.groups 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Profiles Policies
CREATE POLICY "Super admins can manage all profiles" 
ON public.profiles 
TO authenticated 
USING (public.is_super_admin());

CREATE POLICY "Users can manage their own profiles" 
ON public.profiles 
FOR ALL 
TO authenticated 
USING (id = auth.uid()) 
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can view profiles in their group" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (group_id = (SELECT group_id FROM public.profiles WHERE id = auth.uid()));

-- Wards Policies
CREATE POLICY "Super admins can manage wards" 
ON public.wards 
TO authenticated 
USING (public.is_super_admin());

CREATE POLICY "Camp directors can manage wards in their group" 
ON public.wards 
FOR ALL 
TO authenticated 
USING (
  group_id = (SELECT group_id FROM public.profiles WHERE id = auth.uid()) AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'camp_director'
);

CREATE POLICY "Anyone can view wards in their group" 
ON public.wards 
FOR SELECT 
TO authenticated 
USING (group_id = (SELECT group_id FROM public.profiles WHERE id = auth.uid()));

-- Form Submissions Policies
CREATE POLICY "Super admins can manage all form submissions" 
ON public.form_submissions 
TO authenticated 
USING (public.is_super_admin());

CREATE POLICY "Users can manage their own form submissions" 
ON public.form_submissions 
FOR ALL 
TO authenticated 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Camp directors can view all form submissions in their group" 
ON public.form_submissions 
FOR SELECT 
TO authenticated 
USING (
  group_id = (SELECT group_id FROM public.profiles WHERE id = auth.uid()) AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('camp_director', 'assistant_camp_director', 'admin')
);

-- Realtime
-- Form Submissions should be exposed to Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.form_submissions;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', COALESCE((new.raw_user_meta_data->>'role')::public.app_role, 'parent'::public.app_role));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
