-- Enable RLS on the prompt_packs table
ALTER TABLE prompt_packs ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting prompt packs (anyone can view)
CREATE POLICY "Anyone can view prompt packs"
  ON prompt_packs
  FOR SELECT
  USING (true);

-- Create policy for inserting prompt packs (authenticated users only)
CREATE POLICY "Authenticated users can create prompt packs"
  ON prompt_packs
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for updating prompt packs (only creator can update)
CREATE POLICY "Users can update their own prompt packs"
  ON prompt_packs
  FOR UPDATE
  USING (auth.uid() = creator_id);

-- Create policy for deleting prompt packs (only creator can delete)
CREATE POLICY "Users can delete their own prompt packs"
  ON prompt_packs
  FOR DELETE
  USING (auth.uid() = creator_id);

-- Grant necessary permissions to authenticated users
GRANT SELECT ON prompt_packs TO authenticated;
GRANT INSERT ON prompt_packs TO authenticated;
GRANT UPDATE ON prompt_packs TO authenticated;
GRANT DELETE ON prompt_packs TO authenticated; 