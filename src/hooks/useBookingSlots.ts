import { useState, useEffect, useCallback } from 'react';
import { generateTimeSlots } from '../lib/bookingUtils';
import { fetchAllBookings } from '../lib/localStorageDb';

export function useBookingSlots({ duration }: { duration: number }) {
  const [slots, setSlots] = useState<{ time: string; label: string; available: boolean }[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSlots = useCallback(() => {
    if (!selectedDate) return;
    setIsLoading(true);
    try {
      const bookings = fetchAllBookings();
      const booked = bookings.map(b => ({ start_time: b.start_time, end_time: b.end_time }));
      const blocked: any[] = [];
      const opening = '09:00';
      const closing = '18:00';
      const generated = generateTimeSlots(selectedDate, duration, opening, closing, booked, blocked);
      setSlots(generated);
      setError(null);
    } catch (e) {
      setError('Chyba načítání');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, duration]);

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date().toISOString().split('T')[0]);
    } else {
      loadSlots();
    }
  }, [selectedDate, loadSlots]);

  return {
    slots,
    selectedDate,
    selectedTime,
    minDate: new Date().toISOString().split('T')[0],
    maxDate: new Date(Date.now() + 30*86400000).toISOString().split('T')[0],
    isLoading,
    error,
    setSelectedDate,
    setSelectedTime,
    refreshSlots: loadSlots,
  };
}
