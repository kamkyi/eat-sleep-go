import { requireSupabase } from './supabase';

const BOOKING_FIELDS = `
  id,
  user_id,
  customer_name,
  customer_email,
  customer_phone,
  car_id,
  car_label,
  car_details,
  pickup_at,
  return_at,
  pickup_location,
  return_location,
  status,
  customer_notes,
  created_at,
  updated_at
`;

const ADMIN_UPDATE_FIELDS = new Set([
  'customer_name',
  'customer_email',
  'customer_phone',
  'car_id',
  'car_label',
  'car_details',
  'pickup_at',
  'return_at',
  'pickup_location',
  'return_location',
  'status',
  'customer_notes',
]);

function cleanPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
}

export async function createBooking(booking) {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();

  if (userError || !userData.user) {
    throw new Error('Please sign in again before submitting your booking.');
  }

  const payload = cleanPayload({
    customer_name: booking.customerName?.trim(),
    customer_email: booking.customerEmail?.trim(),
    customer_phone: booking.customerPhone?.trim(),
    car_id: booking.carId,
    car_label: booking.carLabel,
    car_details: booking.carDetails,
    pickup_at: booking.pickupAt,
    return_at: booking.returnAt,
    pickup_location: booking.pickupLocation,
    return_location: booking.returnLocation,
    customer_notes: booking.customerNotes?.trim() || null,
    user_id: userData.user.id,
  });

  const { data, error } = await client
    .from('bookings')
    .insert(payload)
    .select(BOOKING_FIELDS)
    .single();

  if (error) throw error;
  return data;
}

export async function getMyBookings() {
  const { data, error } = await requireSupabase()
    .from('bookings')
    .select(BOOKING_FIELDS)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function cancelMyBooking(bookingId) {
  const { data, error } = await requireSupabase()
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('status', 'pending')
    .select(BOOKING_FIELDS)
    .single();

  if (error) throw error;
  return data;
}

export async function getAllBookingsForAdmin() {
  const { data, error } = await requireSupabase()
    .from('bookings')
    .select(`
      *,
      customer:profiles!bookings_user_id_fkey (
        id,
        full_name,
        email,
        phone
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateBookingAsAdmin(bookingId, changes) {
  const updates = Object.fromEntries(
    Object.entries(changes).filter(
      ([key, value]) => ADMIN_UPDATE_FIELDS.has(key) && value !== undefined
    )
  );

  if (!Object.keys(updates).length) {
    throw new Error('No supported booking changes were supplied.');
  }

  const { data, error } = await requireSupabase()
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select(`
      *,
      customer:profiles!bookings_user_id_fkey (
        id,
        full_name,
        email,
        phone
      )
    `)
    .single();

  if (error) throw error;
  return data;
}
