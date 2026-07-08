import type { Booking, BookingInsert, BookingStatus } from '../types/booking';

const STORAGE_KEY = 'bibenglow_bookings';

function getBookings(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}
function saveBookings(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function fetchAllBookings(): Booking[] {
  return getBookings();
}

export function createBooking(booking: BookingInsert): Booking {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  bookings.push(newBooking);
  saveBookings(bookings);
  return newBooking;
}

export function updateBookingStatus(id: string, status: BookingStatus): void {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index].status = status;
    bookings[index].updated_at = new Date().toISOString();
    saveBookings(bookings);
  }
}

export function deleteBooking(id: string): void {
  const bookings = getBookings().filter(b => b.id !== id);
  saveBookings(bookings);
}
