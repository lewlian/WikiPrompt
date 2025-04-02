import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Debug() {
  const [promptData, setPromptData] = useState(null);

  useEffect(() => {
    const fetchDrawingPack = async () => {
      const { data, error } = await supabase
        .from('prompt_packs')
        .select(`
          *,
          favorites:favorites(count),
          creator:users(id, full_name, username, avatar_url)
        `)
        .eq('title', 'Drawing')
        .single();

      if (error) {
        console.error('Error fetching Drawing pack:', error);
        return;
      }

      console.log('Drawing pack data:', data);
      setPromptData(data);
    };

    fetchDrawingPack();
  }, []);

  return (
    <pre>
      {JSON.stringify(promptData, null, 2)}
    </pre>
  );
} 