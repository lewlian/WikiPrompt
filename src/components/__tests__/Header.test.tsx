import { render, screen, act } from '../../test-utils';
import Header from '../Header';

describe('Header', () => {
  it('renders WikiPrompt logo', async () => {
    await act(async () => {
      render(<Header />);
    });
    expect(screen.getByText(/WikiPrompt/i)).toBeInTheDocument();
  });

  it('shows Sign In / Sign Up button for non-logged in users', async () => {
    await act(async () => {
      render(<Header />);
    });
    expect(screen.getByText(/Sign In \/ Sign Up/i)).toBeInTheDocument();
  });
}); 