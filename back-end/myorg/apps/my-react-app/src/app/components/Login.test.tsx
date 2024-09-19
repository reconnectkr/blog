import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from './Login';

// Mock the fetch function
global.fetch = jest.fn();

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const renderLogin = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    renderLogin();
    const loginTexts = screen.getAllByText('로그인');
    expect(loginTexts).toHaveLength(2);
    expect(screen.getByPlaceholderText('사용자 이름')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'fake-token' }),
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('사용자 이름'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/login',
        expect.any(Object)
      );
    });
  });

  test('handles login failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('사용자 이름'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('handles network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('사용자 이름'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(
        screen.getByText('An error occurred during login')
      ).toBeInTheDocument();
    });
  });
});
