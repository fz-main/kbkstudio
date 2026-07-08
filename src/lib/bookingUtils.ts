import type { Booking, BlockedSlot } from '../types/booking';

export function addMinutes(time: string, add: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + add;
  const hours = Math.floor(total / 60).toString().padStart(2, '0');
  const mins = (total % 60).toString().padStart(2, '0');
  return `${hours}:${mins}`;
}
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
export function formatTimeLabel(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${h}:${m.toString().padStart(2, '0')}`;
}
export function generateTimeSlots(date: string, duration: number, opening: string, closing: string, booked: Pick<Booking, 'start_time' | 'end_time'>[], blocked: BlockedSlot[]): { time: string; label: string; available: boolean }[] {
  const slots = [];
  const start = timeToMinutes(opening);
  const end = timeToMinutes(closing);
  const now = new Date();
  const isToday = date === now.toISOString().split('T')[0];
  const currentMin = isToday ? now.getHours() * 60 + now.getMinutes() + 30 : 0;
  for (let t = start; t + duration <= end; t += 30) {
    const time = `${Math.floor(t/60).toString().padStart(2,'0')}:${(t%60).toString().padStart(2,'0')}`;
    const endTime = addMinutes(time, duration);
    const isBlocked = blocked.some(b => b.blocked_date === date && timeToMinutes(b.start_time || '00:00') < t + duration && timeToMinutes(b.end_time || '23:59') > t);
    const isBooked = booked.some(b => timeToMinutes(b.start_time) < t + duration && timeToMinutes(b.end_time) > t);
    slots.push({
      time,
      label: formatTimeLabel(time),
      available: t >= currentMin && !isBlocked && !isBooked,
    });
  }
  return slots;
}
