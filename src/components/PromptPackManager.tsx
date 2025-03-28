import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';

interface PromptPackManagerProps {
  packId: string;
  creatorId: string;
  onDelete?: () => void;
}

export default function PromptPackManager({ packId, creatorId, onDelete }: PromptPackManagerProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setError(null);

      // First verify we can access the pack
      const { data: packData, error: fetchError } = await supabase
        .from('prompt_packs')
        .select('*')
        .eq('id', packId)
        .single();

      if (fetchError) {
        console.error('Error fetching pack:', fetchError);
        throw new Error('Could not fetch prompt pack');
      }

      if (!packData) {
        throw new Error('Prompt pack not found');
      }

      if (!user) {
        throw new Error('You must be logged in to delete a prompt pack');
      }

      if (user.id !== packData.creator_id) {
        throw new Error('You do not have permission to delete this prompt pack');
      }

      // Delete the prompt pack (RLS will ensure only the creator can delete)
      const { error: deleteError } = await supabase
        .from('prompt_packs')
        .delete()
        .eq('id', packId);

      if (deleteError) {
        if (deleteError.code === 'PGRST204') {
          throw new Error('You do not have permission to delete this prompt pack');
        }
        console.error('Error deleting from database:', deleteError);
        throw deleteError;
      }

      // Verify the deletion with a delay to allow for any eventual consistency
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: verifyData, error: verifyError } = await supabase
        .from('prompt_packs')
        .select('id')
        .eq('id', packId)
        .single();

      if (verifyError?.code !== 'PGRST116') { // PGRST116 means no rows returned, which is what we want
        console.error('Unexpected error during verification:', verifyError);
      }

      if (verifyData) {
        throw new Error('Deletion failed: Prompt pack still exists. This might be a permissions issue.');
      }

      // Only attempt to delete images if the database deletion was successful
      if (packData.preview_images && Array.isArray(packData.preview_images)) {
        // Extract file paths from the URLs
        const filePaths = packData.preview_images
          .filter((url: unknown): url is string => typeof url === 'string' && url !== '')
          .map((url: string) => {
            try {
              const urlObj = new URL(url);
              const path = urlObj.pathname.split('/').slice(-2).join('/'); // Get "userId/filename"
              return path;
            } catch (e) {
              console.error('Invalid URL:', url);
              return null;
            }
          })
          .filter((path: string | null): path is string => path !== null);

        // Delete all images from storage
        await Promise.all(
          filePaths.map(async (path: string) => {
            const { error } = await supabase.storage
              .from('prompt-pack-images')
              .remove([path]);
            if (error) {
              console.error('Error deleting image:', path, error);
            }
          })
        );
      }

      // Trigger a refresh of the PromptGrid
      window.dispatchEvent(new Event('prompt-grid-refresh'));

      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete();
      }

      // Navigate back to the dashboard
      navigate('/');
    } catch (error) {
      console.error('Error in deletion process:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete prompt pack');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // Only show management options if the user is the creator
  if (!user || user.id !== creatorId) {
    return null;
  }

  return (
    <>
      <Tooltip title="Delete prompt pack">
        <IconButton onClick={() => setDeleteDialogOpen(true)} color="error">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit prompt pack">
        <IconButton onClick={() => navigate(`/prompt/${packId}/edit`)} color="primary">
          <EditIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Prompt Pack</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this prompt pack? This action cannot be undone.
            All associated images and favorites will be deleted as well.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
} 