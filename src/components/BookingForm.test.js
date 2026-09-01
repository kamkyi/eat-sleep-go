import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BookingForm from './BookingForm';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../lib/bookingService';
import { LanguageProvider } from '../i18n';

jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../lib/bookingService', () => ({ createBooking: jest.fn() }));

function renderForm() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <BookingForm
          initialCarId="honda-city-2013"
          initialValues={{
            pickupDate: '',
            returnDate: '',
            pickupLocation: '',
            returnLocation: '',
          }}
        />
      </MemoryRouter>
    </LanguageProvider>
  );
}

beforeEach(() => {
  window.localStorage.clear();
  useAuth.mockReturnValue({
    user: { id: 'customer-id', email: 'customer@example.com' },
    profile: {
      id: 'customer-id',
      full_name: 'Test Customer',
      email: 'customer@example.com',
      phone: '+66 81 234 5678',
    },
  });
  createBooking.mockResolvedValue({ id: 'booking-id' });
});

test('keeps available pickup and return defaults when search parameters are empty', async () => {
  renderForm();

  expect(screen.getByLabelText('Pickup location')).toHaveValue('Bangkok');
  expect(screen.getByLabelText('Return location')).toHaveValue('Bangkok');

  fireEvent.change(screen.getByLabelText('Pickup date'), { target: { value: '2099-01-01' } });
  fireEvent.change(screen.getByLabelText('Return date'), { target: { value: '2099-01-02' } });
  userEvent.click(screen.getByRole('checkbox'));
  userEvent.click(screen.getByRole('button', { name: 'Send booking request' }));

  await waitFor(() => expect(createBooking).toHaveBeenCalledTimes(1));
  expect(createBooking).toHaveBeenCalledWith(expect.objectContaining({
    pickupLocation: 'Bangkok',
    returnLocation: 'Bangkok',
  }));
});
