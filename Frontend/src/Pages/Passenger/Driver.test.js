import { render, screen } from '@testing-library/react';
import Driver from './Driver';

test('renders learn react link', () => {
  render(<Driver />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
