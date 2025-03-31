-- Get the first user from auth.users as a fallback creator
DO $$
DECLARE
    fallback_user_id UUID;
BEGIN
    -- Get the first user from auth.users
    SELECT id INTO fallback_user_id FROM auth.users LIMIT 1;

    -- Update any prompt packs that don't have a creator_id
    UPDATE public.prompt_packs
    SET creator_id = fallback_user_id
    WHERE creator_id IS NULL;

    -- Make creator_id NOT NULL
    ALTER TABLE public.prompt_packs
    ALTER COLUMN creator_id SET NOT NULL;
END $$; 