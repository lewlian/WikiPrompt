import { render, screen, act } from '@testing-library/react';
import PromptGrid from '../PromptGrid';
import { mockSupabase } from '../../test-utils';

const defaultProps = {
  categories: [],
  aiModel: 'All',
  priceRange: [0, 100],
  sortBy: 'newest',
  searchQuery: '',
};

describe('PromptGrid', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('shows loading state initially', async () => {
    // Mock the execute function to simulate a delay
    mockSupabase.from().execute.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: [], error: null }), 100))
    );

    render(<PromptGrid {...defaultProps} />);
    
    // Check for loading skeleton
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });
  });

  it('renders prompts after loading', async () => {
    render(<PromptGrid {...defaultProps} />);
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Check for prompt title
    expect(screen.getByText('Test Prompt')).toBeInTheDocument();
  });

  it('shows favorite count for non-logged in users', async () => {
    render(<PromptGrid {...defaultProps} />);
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Check for favorite count
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('filters prompts by category', async () => {
    const categories = ['Test Category'];
    render(<PromptGrid {...defaultProps} categories={categories} />);
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify query chain
    expect(mockSupabase.from).toHaveBeenCalledWith('prompt_packs');
    expect(mockSupabase.from().select).toHaveBeenCalled();
    expect(mockSupabase.from().in).toHaveBeenCalledWith('category', categories);
  });

  it('filters prompts by AI model', async () => {
    const aiModel = 'GPT-4';
    render(<PromptGrid {...defaultProps} aiModel={aiModel} />);
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify query chain
    expect(mockSupabase.from).toHaveBeenCalledWith('prompt_packs');
    expect(mockSupabase.from().select).toHaveBeenCalled();
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('ai_model', aiModel);
  });

  it('filters prompts by price range', async () => {
    const priceRange = [10, 50];
    render(<PromptGrid {...defaultProps} priceRange={priceRange} />);
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify query chain
    expect(mockSupabase.from).toHaveBeenCalledWith('prompt_packs');
    expect(mockSupabase.from().select).toHaveBeenCalled();
    expect(mockSupabase.from().gte).toHaveBeenCalledWith('price', priceRange[0]);
    expect(mockSupabase.from().lte).toHaveBeenCalledWith('price', priceRange[1]);
  });

  it('sorts prompts by popularity', async () => {
    render(<PromptGrid {...defaultProps} sortBy="popular" />);
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify query chain
    expect(mockSupabase.from).toHaveBeenCalledWith('prompt_packs');
    expect(mockSupabase.from().select).toHaveBeenCalled();
    expect(mockSupabase.from().order).toHaveBeenCalledWith('favorites', { ascending: false, foreignTable: 'favorites' });
  });

  it('filters prompts by search query', async () => {
    const searchQuery = 'test';
    render(<PromptGrid {...defaultProps} searchQuery={searchQuery} />);
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify query chain
    expect(mockSupabase.from).toHaveBeenCalledWith('prompt_packs');
    expect(mockSupabase.from().select).toHaveBeenCalled();
    expect(mockSupabase.from().ilike).toHaveBeenCalledWith('title', `%${searchQuery}%`);
  });
}); 