import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../lib/supabaseClient';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  ImageList,
  ImageListItem,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const AI_MODELS = [
  'GPT-4',
  'GPT-3.5',
  'Claude 2',
  'Claude 3',
  'Gemini Pro',
  'Llama 2',
  'Mistral',
  'Other',
];

const CATEGORIES = [
  'Writing',
  'Programming',
  'Art & Design',
  'Business',
  'Education',
  'Entertainment',
  'Productivity',
  'Other',
];

export default function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aiModel, setAiModel] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > 9) {
      setError('Maximum 9 images allowed');
      return;
    }
    setImages(prev => [...prev, ...acceptedFiles]);
    setError(null);
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5242880, // 5MB
  });

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length < 3) {
      setError('Please upload at least 3 images');
      return;
    }
    if (!title || !prompt || !aiModel || !category) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload images to storage
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${user!.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('prompt-pack-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // Get the public URL using the proper Supabase storage URL format
          const {
            data: { publicUrl },
          } = supabase.storage.from('prompt-pack-images').getPublicUrl(filePath);

          // Ensure the URL is using HTTPS and is valid
          if (!publicUrl) {
            throw new Error('Failed to get public URL for uploaded image');
          }

          const secureUrl = publicUrl.replace('http://', 'https://');
          
          // Verify the URL is accessible
          try {
            const response = await fetch(secureUrl, { method: 'HEAD' });
            if (!response.ok) {
              throw new Error('Image URL is not accessible');
            }
          } catch (error) {
            console.error('Error verifying image URL:', error);
            throw new Error('Failed to verify image URL accessibility');
          }

          return secureUrl;
        })
      );

      // Insert prompt pack
      const { error: insertError } = await supabase
        .from('prompt_packs')
        .insert({
          title,
          prompt: prompt,
          full_prompt: prompt,
          ai_model: aiModel,
          category,
          preview_images: imageUrls,
          creator_id: user!.id,
        });

      if (insertError) throw insertError;

      navigate('/');
    } catch (err) {
      console.error('Error uploading prompt pack:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload prompt pack');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload Prompt Pack
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.value.length <= 100) {
              setTitle(e.target.value);
            }
          }}
          margin="normal"
          required
          helperText={`${title.length}/100 characters`}
        />

        <Box
          {...getRootProps()}
          sx={{
            mt: 2,
            p: 3,
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 1,
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <input {...getInputProps()} />
          <Typography>
            {isDragActive
              ? 'Drop the images here'
              : 'Drag & drop images here, or click to select files'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            (3-9 images, max 5MB each)
          </Typography>
        </Box>

        {images.length > 0 && (
          <ImageList sx={{ mt: 2 }} cols={3} rowHeight={164}>
            {images.map((file, index) => (
              <ImageListItem key={index}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  loading="lazy"
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 4,
                    top: 4,
                    bgcolor: 'background.paper',
                  }}
                  onClick={() => removeImage(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ImageListItem>
            ))}
          </ImageList>
        )}

        <TextField
          fullWidth
          label="Prompt"
          value={prompt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.value.length <= 2000) {
              setPrompt(e.target.value);
            }
          }}
          margin="normal"
          required
          multiline
          rows={4}
          helperText={`${prompt.length}/2000 characters`}
        />

        <TextField
          select
          fullWidth
          label="AI Model"
          value={aiModel}
          onChange={(e) => setAiModel(e.target.value)}
          margin="normal"
          required
        >
          {AI_MODELS.map((model) => (
            <MenuItem key={model} value={model}>
              {model}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          margin="normal"
          required
        >
          {CATEGORIES.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? 'Uploading...' : 'Upload Prompt Pack'}
        </Button>
      </Box>
    </Container>
  );
} 