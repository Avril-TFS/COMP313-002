
//SignUp.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from './SignUp';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext');

describe('SignUp component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      signup: jest.fn(),
    });
  });

  it('should render sign-up form', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    // Check if form elements are rendered
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('should navigate to login page on successful sign-up', async () => {
    const mockSignup = jest.fn();
    useAuth.mockReturnValue({
      signup: mockSignup,
    });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    // Fill out form with valid credentials
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Wait for signup function to be called with correct parameters
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('test@example.com', 'testpassword', 'John', 'Doe');
    });

    // Assert that navigation occurs after successful sign-up
    await waitFor(() => {
      expect(window.location.pathname).toEqual('/');
    });
  });
});
