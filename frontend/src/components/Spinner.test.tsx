/// <reference types="@testing-library/jest-dom" />

import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner Component', () => {
  test('renders without message', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  test('renders with custom message', () => {
    const customMessage = 'Loading data...';
    render(<Spinner message={customMessage} />);
    
    const spinner = screen.getByRole('progressbar');
    const messageElement = screen.getByText(customMessage);
    
    expect(spinner).toBeInTheDocument();
    expect(messageElement).toBeInTheDocument();
  });

  test('does not render message when not provided', () => {
    render(<Spinner />);
    
    const spinner = screen.getByRole('progressbar');
    // Check that no message is rendered
    const messages = screen.queryByText(/loading/i);
    
    expect(spinner).toBeInTheDocument();
    expect(messages).not.toBeInTheDocument();
  });
});