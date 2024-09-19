import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

// Login 컴포넌트를 모의(mock)합니다.
jest.mock('../components/Login', () => {
  return function MockLogin() {
    return <div data-testid="mock-login">Mock Login Component</div>;
  };
});

describe('LoginPage', () => {
  it('renders without crashing', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('mock-login')).toBeInTheDocument();
  });

  it('has the correct layout classes', () => {
    render(<LoginPage />);
    const pageContainer =
      screen.getByTestId('mock-login').parentElement?.parentElement;
    expect(pageContainer).toHaveClass(
      'min-h-screen flex items-center justify-center bg-gray-100'
    );
  });

  it('contains a wrapper with correct width classes', () => {
    render(<LoginPage />);
    const wrapper = screen.getByTestId('mock-login').parentElement;
    expect(wrapper).toHaveClass('w-full max-w-md');
  });
});
