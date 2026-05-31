CREATE TABLE public.camp_attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stake_id UUID REFERENCES public.stakes(id) ON DELETE CASCADE NOT NULL,
  entity_id UUID REFERENCES public.entities(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  slug TEXT NOT NULL,
  registration_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(stake_id, slug) -- A slug must be unique within a stake
);

ALTER TABLE public.camp_attendees ENABLE ROW LEVEL SECURITY;

-- Policies for camp_attendees
CREATE POLICY "Super admins can manage camp attendees" 
ON public.camp_attendees 
TO authenticated 
USING (public.is_super_admin());

CREATE POLICY "Parents can manage their own camp attendees" 
ON public.camp_attendees 
FOR ALL 
TO authenticated 
USING (parent_id = auth.uid()) 
WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Camp directors can view camp attendees in their stake" 
ON public.camp_attendees 
FOR SELECT 
TO authenticated 
USING (
  stake_id = (SELECT stake_id FROM public.profiles WHERE id = auth.uid()) AND
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('camp_director', 'assistant_camp_director', 'admin')
);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.camp_attendees;
