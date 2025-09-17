import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Navbar from './Navbar';

describe('Navbar.tsx', () => {
  it('renders the OCS title', () => {
    render(<Navbar />);
    const title = screen.queryByText('OurCleanStreets');
    expect(title).not.toBe(null);
    expect(title?.innerHTML).toBe('OurCleanStreets');
  });

  it('renders the login', () => {
    render(<Navbar />);
    const login = screen.queryByText('Login');
    expect(login).not.toBe(null);
    expect(login?.innerHTML).toBe('Login');
  });
});
