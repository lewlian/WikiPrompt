-- Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_pack_id UUID NOT NULL REFERENCES public.prompt_packs(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, prompt_pack_id)
);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own purchases"
    ON public.purchases
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases"
    ON public.purchases
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own purchases"
    ON public.purchases
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create or replace the has_user_purchased function
CREATE OR REPLACE FUNCTION public.has_user_purchased(pack_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM purchases
        WHERE prompt_pack_id = pack_id
        AND user_id = auth.uid()
    );
$$;

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON public.purchases TO authenticated;
GRANT USAGE ON SEQUENCE purchases_id_seq TO authenticated; 