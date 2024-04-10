//Login.test.js
const React = require('react');
const { render, fireEvent, waitFor, screen } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom'); // Import BrowserRouter
const Login = require('./Login').default;

// Mock AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    signin: jest.fn(),
  }),
}));

describe('Login component', () => {
  it('should render login form', () => { // Test 1: Rendering login form
    render(
      <BrowserRouter> {/* Wrap Login component with BrowserRouter */}
        <Login />
      </BrowserRouter>
    );

    // Check if form elements are rendered
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('should display error message on invalid login', async () => { // Test 2: Displaying error message on invalid login
    render(
      <BrowserRouter> {/* Wrap Login component with BrowserRouter */}
        <Login />
      </BrowserRouter>
    );

    // Fill out form with invalid credentials
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'invalid@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'invalidpassword' } });

    // Click the login button
    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginButton);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Login failed. Please check your credentials.')).toBeInTheDocument();
    });
  });
});


