import { render, screen, act } from '../../test-utils';
import PromptGrid from '../PromptGrid';

const defaultProps = {
  categories: [],
  aiModel: 'All',
  sortBy: 'newest',
  searchQuery: '',
};

describe('PromptGrid', () => {
  it('shows loading state initially', async () => {
    render(<PromptGrid {...defaultProps} />);
    const skeletons = screen.getAllByTestId('loading-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
  });

  it('renders without errors after loading', async () => {
    await act(async () => {
      render(<PromptGrid {...defaultProps} />);
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    // Grid should be in the document (either with prompts or demo data)
    expect(document.querySelector('[class*="MuiBox-root"]')).toBeInTheDocument();
  });

  it('renders with category filter', async () => {
    await act(async () => {
      render(<PromptGrid {...defaultProps} categories={['Writing']} />);
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    expect(document.querySelector('[class*="MuiBox-root"]')).toBeInTheDocument();
  });

  it('renders with AI model filter', async () => {
    await act(async () => {
      render(<PromptGrid {...defaultProps} aiModel="GPT-4" />);
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    expect(document.querySelector('[class*="MuiBox-root"]')).toBeInTheDocument();
  });

  it('renders with popular sort', async () => {
    await act(async () => {
      render(<PromptGrid {...defaultProps} sortBy="popular" />);
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    expect(document.querySelector('[class*="MuiBox-root"]')).toBeInTheDocument();
  });

  it('renders with search query', async () => {
    await act(async () => {
      render(<PromptGrid {...defaultProps} searchQuery="test" />);
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    expect(document.querySelector('[class*="MuiBox-root"]')).toBeInTheDocument();
  });
});
