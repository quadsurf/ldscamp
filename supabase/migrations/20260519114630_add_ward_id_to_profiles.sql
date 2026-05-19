-- Add ward_id to profiles table
ALTER TABLE public.profiles
ADD COLUMN ward_id UUID REFERENCES public.wards(id) ON DELETE SET NULL;

-- Update Realtime configuration for profiles if not already added
-- (This ensures the people list can update in real-time)
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
