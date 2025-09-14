-- Add policy allowing first authenticated user to claim admin if no admins exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'First user can claim admin when none exist'
  ) THEN
    CREATE POLICY "First user can claim admin when none exist"
    ON public.user_roles
    FOR INSERT
    TO authenticated
    WITH CHECK (
      role = 'admin'::public.app_role
      AND user_id = auth.uid()
      AND NOT EXISTS (
        SELECT 1 FROM public.user_roles x WHERE x.role = 'admin'::public.app_role
      )
    );
  END IF;
END $$;