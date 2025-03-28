-- Add foreign key constraints
ALTER TABLE public.prompt_packs
ADD CONSTRAINT fk_creator
FOREIGN KEY (creator_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

ALTER TABLE public.favorites
ADD CONSTRAINT fk_prompt_pack
FOREIGN KEY (prompt_pack_id)
REFERENCES public.prompt_packs(id)
ON DELETE CASCADE;

ALTER TABLE public.favorites
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Create function to delete images when a prompt pack is deleted
CREATE OR REPLACE FUNCTION public.delete_prompt_pack_images()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete images from storage
    PERFORM storage.delete('prompt-pack-images/' || OLD.creator_id || '/*');
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for image deletion
DROP TRIGGER IF EXISTS before_delete_prompt_pack ON public.prompt_packs;
CREATE TRIGGER before_delete_prompt_pack
    BEFORE DELETE ON public.prompt_packs
    FOR EACH ROW
    EXECUTE FUNCTION public.delete_prompt_pack_images(); 