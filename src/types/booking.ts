export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export interface Booking {
  id: string;
  service_id: string;
  service_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: BookingStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}
export type BookingInsert = Omit<Booking, 'id' | 'created_at' | 'updated_at'>;
