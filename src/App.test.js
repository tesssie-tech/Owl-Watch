import { render, screen } from '@testing-library/react';
import App from './App';

test('renders timer title and start button', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /cozy focus/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
});
