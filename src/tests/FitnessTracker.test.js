import { render, screen } from '@testing-library/react';
import FitnessTracker from '../pages/FitnessTracker';

test('renders learn react link', () => {
  render(<FitnessTracker />);
  const linkElement = screen.getByText(/Fitness Tracker/i);
  expect(linkElement).toBeInTheDocument();
});
