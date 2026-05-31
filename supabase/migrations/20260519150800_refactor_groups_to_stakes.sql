-- Phase 1: Rename Tables
ALTER TABLE public.groups RENAME TO stakes;
ALTER TABLE public.wards RENAME TO entities;

-- Phase 2: Rename Columns in profiles
ALTER TABLE public.profiles RENAME COLUMN group_id TO stake_id;
ALTER TABLE public.profiles RENAME COLUMN ward_id TO entity_id;

-- Phase 3: Rename Columns in entities (formerly wards)
ALTER TABLE public.entities RENAME COLUMN group_id TO stake_id;

-- Phase 4: Rename Columns in form_submissions
ALTER TABLE public.form_submissions RENAME COLUMN group_id TO stake_id;

-- Phase 5: Update the entity_type constraint on entities
-- First, drop the old constraint. We need to find its name. 
-- In Supabase, the constraint name is usually wards_entity_type_check. We rename it to entities_entity_type_check.
ALTER TABLE public.entities DROP CONSTRAINT IF EXISTS wards_entity_type_check;
ALTER TABLE public.entities DROP CONSTRAINT IF EXISTS entities_entity_type_check;
ALTER TABLE public.entities ADD CONSTRAINT entities_entity_type_check CHECK (entity_type IN ('ward', 'branch', 'group'));

-- Wait, the original values were 'Ward' and 'Branch'. If we have existing data, we should update it to lowercase first.
UPDATE public.entities SET entity_type = lower(entity_type);

-- Now add the constraint again
-- Just to be safe, dropping the constraint again in case it failed
ALTER TABLE public.entities DROP CONSTRAINT IF EXISTS wards_entity_type_check;
ALTER TABLE public.entities ADD CONSTRAINT entities_entity_type_check CHECK (entity_type IN ('ward', 'branch', 'group'));

-- Update Policies
-- We need to drop the old policies that reference the old table names and recreate them.
-- RLS on groups -> stakes
-- The policies names were on public.groups. 
-- "Super admins can manage groups", "Anyone can view groups"
-- Wait, renaming a table in Postgres DOES NOT drop its policies, but it DOES keep them attached to the table (now named stakes).
-- Let's rename the policies to be clean.
ALTER POLICY "Super admins can manage groups" ON public.stakes RENAME TO "Super admins can manage stakes";
ALTER POLICY "Anyone can view groups" ON public.stakes RENAME TO "Anyone can view stakes";

-- Wards -> entities
ALTER POLICY "Super admins can manage wards" ON public.entities RENAME TO "Super admins can manage entities";
ALTER POLICY "Camp directors can manage wards in their group" ON public.entities RENAME TO "Camp directors can manage entities in their stake";
ALTER POLICY "Anyone can view wards in their group" ON public.entities RENAME TO "Anyone can view entities in their stake";

-- Form Submissions
ALTER POLICY "Camp directors can view all form submissions in their group" ON public.form_submissions RENAME TO "Camp directors can view all form submissions in their stake";

-- Drop the old create_new_group function and create create_new_stake
DROP FUNCTION IF EXISTS public.create_new_group(text, text, text, text);

CREATE OR REPLACE FUNCTION public.create_new_stake(
    p_name text,
    p_slug text,
    p_slogan text DEFAULT NULL,
    p_logo_url text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_stake_id uuid;
    v_user_id uuid;
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

    -- Update the caller's profile to be camp_director for this new stake
    UPDATE public.profiles
    SET 
        stake_id = v_new_stake_id,
        role = 'camp_director'::public.app_role
    WHERE id = v_user_id;

    -- Return the basic stake details
    RETURN json_build_object(
        'id', v_new_stake_id,
        'slug', p_slug,
        'name', p_name
    );
END;
$$;
