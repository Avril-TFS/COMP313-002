// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App component', () => {
  render(<App />);
  // You can replace the following line with your actual test based on your component's content or structure
  const appComponent = screen.getByTestId('app-component'); // Replace 'app-component' with the actual test ID or content you expect
  expect(appComponent).toBeInTheDocument();
});
