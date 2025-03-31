import { render, screen, act } from './test-utils';
import App from './App';

describe('App', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      render(<App />, { withoutRouter: true });
    });
    expect(screen.getByText(/WikiPrompt/i)).toBeInTheDocument();
  });
});
