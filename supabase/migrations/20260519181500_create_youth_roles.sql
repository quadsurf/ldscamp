-- 1. Create youth_roles table
CREATE TABLE public.youth_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stake_id UUID REFERENCES public.stakes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_system BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Ensure system roles are unique globally
CREATE UNIQUE INDEX youth_roles_system_name_idx ON public.youth_roles (name) WHERE stake_id IS NULL;
-- Ensure local roles are unique per stake
CREATE UNIQUE INDEX youth_roles_stake_name_idx ON public.youth_roles (stake_id, name) WHERE stake_id IS NOT NULL;

-- 2. Insert base system youth roles
INSERT INTO public.youth_roles (name, is_system) VALUES 
  ('none', true),
  ('camp president', true),
  ('first councilor', true),
  ('second councilor', true),
  ('team captain', true),
  ('first mate', true),
  ('second mate', true),
  ('masterclass teacher', true),
  ('ycl', true),
  ('purser', true),
  ('fireside leader', true);

-- 3. Create new adult role for assigning youth roles
INSERT INTO public.roles (name, is_system) VALUES ('adult_team_captain', true) ON CONFLICT (name) WHERE stake_id IS NULL DO NOTHING;

-- 4. Create youth_attendee_roles junction table
CREATE TABLE public.youth_attendee_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attendee_id UUID REFERENCES public.camp_attendees(id) ON DELETE CASCADE NOT NULL,
  youth_role_id UUID REFERENCES public.youth_roles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(attendee_id, youth_role_id)
);

-- 5. RLS for youth_roles
ALTER TABLE public.youth_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read youth roles" 
ON public.youth_roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admins and directors can manage youth roles" 
ON public.youth_roles FOR ALL TO authenticated 
USING (
  public.is_super_admin() OR 
  EXISTS (
    SELECT 1 FROM public.profile_roles pr
    JOIN public.roles r ON pr.role_id = r.id
    WHERE pr.profile_id = auth.uid() AND r.name IN ('admin', 'camp_director', 'assistant_camp_director')
  )
);

-- 6. RLS for youth_attendee_roles
ALTER TABLE public.youth_attendee_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read youth attendee roles" 
ON public.youth_attendee_roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authorized leaders can link/unlink youth roles" 
ON public.youth_attendee_roles FOR ALL TO authenticated 
USING (
  public.is_super_admin() OR 
  EXISTS (
    SELECT 1 FROM public.profile_roles pr
    JOIN public.roles r ON pr.role_id = r.id
    WHERE pr.profile_id = auth.uid() AND r.name IN ('admin', 'camp_director', 'assistant_camp_director', 'ward_camp_director', 'adult_team_captain')
  )
);

-- 7. Update create_new_stake RPC to support opt-in youth roles copying
DROP FUNCTION IF EXISTS public.create_new_stake(text, text, text, text);

CREATE OR REPLACE FUNCTION public.create_new_stake(
    p_name text,
    p_slug text,
    p_slogan text DEFAULT NULL,
    p_logo_url text DEFAULT NULL,
    p_copy_youth_roles boolean DEFAULT true
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_stake_id uuid;
    v_user_id uuid;
    v_camp_director_role_id uuid;
BEGIN
    -- Get the ID of the user calling this function
    v_user_id := auth.uid();
    
    -- Ensure the user is authenticated
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Insert the new stake and return its ID
    INSERT INTO public.stakes (name, slug, slogan, logo_url)
    VALUES (p_name, p_slug, p_slogan, p_logo_url)
    RETURNING id INTO v_new_stake_id;

    -- Insert dummy entities
    INSERT INTO public.entities (stake_id, name, entity_type)
    VALUES 
        (v_new_stake_id, 'Ward 1', 'ward'),
        (v_new_stake_id, 'Ward 2', 'ward');

    -- Update the caller's profile to be in this stake
    UPDATE public.profiles
    SET stake_id = v_new_stake_id
    WHERE id = v_user_id;

    -- Grant the camp_director role via profile_roles (assuming the old trigger/column logic is fully deprecated)
    SELECT id INTO v_camp_director_role_id FROM public.roles WHERE name = 'camp_director' AND stake_id IS NULL LIMIT 1;
    
    IF v_camp_director_role_id IS NOT NULL THEN
        INSERT INTO public.profile_roles (profile_id, role_id)
        VALUES (v_user_id, v_camp_director_role_id)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Opt-in youth roles copying
    IF p_copy_youth_roles THEN
        INSERT INTO public.youth_roles (stake_id, name, is_system)
        SELECT v_new_stake_id, name, false
        FROM public.youth_roles
        WHERE stake_id IS NULL AND is_system = true;
    END IF;

    -- Return the basic stake details
    RETURN json_build_object(
        'id', v_new_stake_id,
        'slug', p_slug,
        'name', p_name
    );
END;
$$;
