-- Function to safely create a new group and assign the caller as camp director
CREATE OR REPLACE FUNCTION public.create_new_group(
    p_name text,
    p_slug text,
    p_slogan text DEFAULT NULL,
    p_logo_url text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass normal RLS constraints for groups insert
AS $$
DECLARE
    v_new_group_id uuid;
    v_user_id uuid;
BEGIN
    -- Get the ID of the user calling this function
    v_user_id := auth.uid();
    
    -- Ensure the user is authenticated
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Insert the new group and return its ID
    INSERT INTO public.groups (name, slug, slogan, logo_url)
    VALUES (p_name, p_slug, p_slogan, p_logo_url)
    RETURNING id INTO v_new_group_id;

    -- Update the caller's profile to be camp_director for this new group
    UPDATE public.profiles
    SET 
        group_id = v_new_group_id,
        role = 'camp_director'::public.app_role
    WHERE id = v_user_id;

    -- Return the basic group details
    RETURN json_build_object(
        'id', v_new_group_id,
        'slug', p_slug,
        'name', p_name
    );
END;
$$;
