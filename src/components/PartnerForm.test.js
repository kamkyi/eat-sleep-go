import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PartnerForm from './PartnerForm';
import ShopPage from '../pages/ShopPage';
import { LanguageProvider } from '../i18n';

const renderWith = (ui) => render(<LanguageProvider><MemoryRouter>{ui}</MemoryRouter></LanguageProvider>);

beforeEach(() => window.localStorage.clear());

test('publishes a listing and shows it in the shop', async () => {
  const form = renderWith(<PartnerForm />);

  userEvent.click(screen.getByRole('radio', { name: /room/i }));
  userEvent.type(screen.getByLabelText(/listing title/i), 'Garden room with fan');
  userEvent.type(screen.getByLabelText(/business or your name/i), 'Baan Test');
  userEvent.type(screen.getByLabelText(/description/i), 'A quiet room with a small garden and free parking.');
  userEvent.type(screen.getByLabelText(/price per night/i), '800');
  userEvent.clear(screen.getByLabelText(/discount/i));
  userEvent.type(screen.getByLabelText(/discount/i), '25');
  userEvent.click(screen.getByRole('button', { name: /publish listing/i }));

  expect(await screen.findByText(/your listing is live/i)).toBeInTheDocument();
  // 25% off ฿800 a night.
  expect(screen.getByText('฿600')).toBeInTheDocument();

  form.unmount();
  renderWith(<ShopPage />);
  expect(await screen.findByRole('heading', { name: 'Garden room with fan' })).toBeInTheDocument();
});

test('refuses a listing with no price', async () => {
  renderWith(<PartnerForm />);

  userEvent.type(screen.getByLabelText(/listing title/i), 'Half-finished listing');
  userEvent.click(screen.getByRole('button', { name: /publish listing/i }));

  expect(await screen.findByText(/please enter a price above zero/i)).toBeInTheDocument();
  expect(window.localStorage.getItem('esg-partner-listings')).toBeNull();
});
