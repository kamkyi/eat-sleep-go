import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Eat, Sleep, Go brand', async () => {
  render(<App />);
  expect(await screen.findByRole('link', { name: /eat, sleep, go home/i })).toBeInTheDocument();
});

test('switches the interface to Burmese', async () => {
  const { default: userEvent } = await import('@testing-library/user-event');
  render(<App />);
  await userEvent.click(await screen.findByRole('button', { name: 'မြန်မာ' }));
  expect(document.documentElement.lang).toBe('my');
  expect(await screen.findByText('ကားငှားရန်', { selector: '.header-cta' })).toBeInTheDocument();
});
