import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AdminRoute, ProtectedRoute } from './RouteGuards';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true };

function renderRoute(element, initialPath) {
  return render(
    <MemoryRouter initialEntries={[initialPath]} future={routerFuture}>
      <Routes>
        <Route path={initialPath} element={element} />
        <Route path="/login" element={<div>Login destination</div>} />
        <Route path="/unauthorized" element={<div>Unauthorized destination</div>} />
      </Routes>
    </MemoryRouter>
  );
}

const baseAuth = {
  loading: false,
  authError: null,
  configurationError: null,
  user: null,
  profile: null,
};

test('redirects a logged-out visitor from a protected route to login', () => {
  useAuth.mockReturnValue(baseAuth);
  renderRoute(<ProtectedRoute><div>Protected booking</div></ProtectedRoute>, '/booking');
  expect(screen.getByText('Login destination')).toBeInTheDocument();
});

test('redirects a customer away from the admin route', () => {
  useAuth.mockReturnValue({
    ...baseAuth,
    user: { id: 'customer-id' },
    profile: { id: 'customer-id', role: 'customer' },
  });
  renderRoute(<AdminRoute><div>Admin dashboard</div></AdminRoute>, '/admin/dashboard');
  expect(screen.getByText('Unauthorized destination')).toBeInTheDocument();
});

test('allows a profile with the admin role into the admin route', () => {
  useAuth.mockReturnValue({
    ...baseAuth,
    user: { id: 'admin-id' },
    profile: { id: 'admin-id', role: 'admin' },
  });
  renderRoute(<AdminRoute><div>Admin dashboard</div></AdminRoute>, '/admin/dashboard');
  expect(screen.getByText('Admin dashboard')).toBeInTheDocument();
});

