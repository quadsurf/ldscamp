-- 1. Create Roles and Profile_Roles Tables
CREATE TABLE public.roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stake_id UUID REFERENCES public.stakes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_system BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Ensure system roles are unique globally
CREATE UNIQUE INDEX roles_system_name_idx ON public.roles (name) WHERE stake_id IS NULL;
-- Ensure local roles are unique per stake
CREATE UNIQUE INDEX roles_stake_name_idx ON public.roles (stake_id, name) WHERE stake_id IS NOT NULL;

-- Insert Base System Roles
INSERT INTO public.roles (name, is_system) VALUES 
  ('super_admin', true),
  ('admin', true),
  ('camp_director', true),
  ('assistant_camp_director', true),
  ('travel_director', true),
  ('head_chef', true),
  ('sous_chef', true),
  ('ward_camp_director', true),
  ('parent', true),
  ('non_parent_volunteer', true);

-- Junction Table
CREATE TABLE public.profile_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(profile_id, role_id)
);

-- 2. Migrate existing profiles data
-- For each existing profile, insert their current role into profile_roles
INSERT INTO public.profile_roles (profile_id, role_id)
SELECT p.id, r.id
FROM public.profiles p
JOIN public.roles r ON p.role::text = r.name
WHERE r.stake_id IS NULL;

-- 3. Drop deprecated column and table
ALTER TABLE public.profiles DROP COLUMN role CASCADE;
DROP TYPE public.app_role CASCADE;
DROP TABLE IF EXISTS public.form_submissions CASCADE;

-- 4. Alter camp_attendees
ALTER TABLE public.camp_attendees ADD COLUMN attendee_type TEXT DEFAULT 'youth';
ALTER TABLE public.camp_attendees ADD COLUMN profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.camp_attendees ADD COLUMN waiver_pdf_url TEXT;

-- 5. Create Waivers Storage Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('waivers', 'waivers', false)
ON CONFLICT (id) DO NOTHING;

-- Policies for storage
CREATE POLICY "Super admins can manage all waivers" ON storage.objects
FOR ALL TO authenticated USING (bucket_id = 'waivers' AND public.is_super_admin());

CREATE POLICY "Users can upload and view their own waivers" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'waivers' AND owner = auth.uid())
WITH CHECK (bucket_id = 'waivers' AND owner = auth.uid());

-- 6. Update Handle New User Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_role_id UUID;
  requested_role_name TEXT;
BEGIN
  -- Insert into profiles first
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');

  -- Determine role to grant
  requested_role_name := COALESCE(new.raw_user_meta_data->>'role', 'parent');
  
  SELECT id INTO default_role_id FROM public.roles WHERE name = requested_role_name AND stake_id IS NULL LIMIT 1;
  
  -- Fallback to parent if invalid role requested
  IF default_role_id IS NULL THEN
    SELECT id INTO default_role_id FROM public.roles WHERE name = 'parent' AND stake_id IS NULL LIMIT 1;
  END IF;

  -- Insert default role
  IF default_role_id IS NOT NULL THEN
    INSERT INTO public.profile_roles (profile_id, role_id) VALUES (new.id, default_role_id);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Setup RLS for new tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read roles" 
ON public.roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admins and camp directors can manage roles" 
ON public.roles FOR ALL TO authenticated 
USING (
  public.is_super_admin() OR 
  EXISTS (
    SELECT 1 FROM public.profile_roles pr
    JOIN public.roles r ON pr.role_id = r.id
    WHERE pr.profile_id = auth.uid() AND r.name = 'camp_director'
  )
);

CREATE POLICY "Users can see their own roles" 
ON public.profile_roles FOR SELECT TO authenticated 
USING (profile_id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Super admins and directors can manage profile roles" 
ON public.profile_roles FOR ALL TO authenticated 
USING (
  public.is_super_admin() OR 
  EXISTS (
    SELECT 1 FROM public.profile_roles pr
    JOIN public.roles r ON pr.role_id = r.id
    WHERE pr.profile_id = auth.uid() AND r.name = 'camp_director'
  )
);

-- 8. Fix existing functions and RLS policies that referenced profiles.role

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profile_roles pr
    JOIN public.roles r ON pr.role_id = r.id
    WHERE pr.profile_id = auth.uid() AND r.name = 'super_admin' AND r.stake_id IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update Entities Policy: Camp directors can manage entities in their stake
DROP POLICY IF EXISTS "Camp directors can manage wards in their group" ON public.entities;
CREATE POLICY "Camp directors can manage entities in their stake" 
ON public.entities 
FOR ALL 
TO authenticated 
USING (
  stake_id = (SELECT stake_id FROM public.profiles WHERE id = auth.uid()) AND
  EXISTS (
    SELECT 1 FROM public.profile_roles pr
    JOIN public.roles r ON pr.role_id = r.id
    WHERE pr.profile_id = auth.uid() AND r.name = 'camp_director'
  )
);

-- Update Camp Attendees Policy: Camp directors can view attendees in their stake
CREATE POLICY "Camp directors can view camp attendees in their stake" 
ON public.camp_attendees 
FOR SELECT 
TO authenticated 
USING (
  stake_id = (SELECT stake_id FROM public.profiles WHERE id = auth.uid()) AND
  EXISTS (
    SELECT 1 FROM public.profile_roles pr
    JOIN public.roles r ON pr.role_id = r.id
    WHERE pr.profile_id = auth.uid() AND r.name IN ('camp_director', 'assistant_camp_director', 'admin')
  )
);
