import React, { useState } from 'react';
import { useBookingSlots } from '../hooks/useBookingSlots';
import { createBooking } from '../lib/localStorageDb';
import { addMinutes } from '../lib/bookingUtils';
import type { Translations } from '../lib/i18n';

interface Props {
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  master?: string;
  onSuccess?: (id: string) => void;
  onCancel?: () => void;
  t: Translations;
}


export const BookingForm: React.FC<Props> = ({
  serviceId, serviceName, durationMinutes, master, onSuccess, onCancel, t,
}) => {
  const {
    slots, selectedDate, selectedTime,
    minDate, maxDate, isLoading, error,
    setSelectedDate, setSelectedTime,
  } = useBookingSlots({ duration: durationMinutes, master });

  const [form, setForm] = useState({ customer_name: '', customer_email: '', customer_phone: '', notes: '' });
  const [step, setStep] = useState<'datetime' | 'details'>('datetime');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const booking = await createBooking({
        service_id: serviceId,
        service_name: serviceName,
        duration_minutes: durationMinutes,
        booking_date: selectedDate,
        start_time: selectedTime,
        end_time: addMinutes(selectedTime, durationMinutes),
        status: 'pending',
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        notes: form.notes || undefined,
        master: master || undefined,
      });
      onSuccess?.(booking.id);
    } catch (e) {
      setSubmitError(t.saveError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'datetime') return (
    <div className="space-y-6 text-white">
      <div>
        <label className="block text-sm font-medium mb-1 text-white/80">{t.dateLabel}</label>
        <input type="date" value={selectedDate} min={minDate} max={maxDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#e5d3b3] focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-3 text-white/80">
          {t.timeLabel} {isLoading && <span className="text-gray-400 text-xs ml-1">{t.loading}</span>}
        </label>
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((slot) => (
            <button key={slot.time} type="button"
              disabled={!slot.available}
              onClick={() => setSelectedTime(slot.time)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all
                ${!slot.available
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed line-through'
                  : selectedTime === slot.time
                  ? 'bg-[#e5d3b3] text-black shadow-md scale-105'
                  : 'bg-[#1a1a1a] border border-white/20 text-white hover:border-[#e5d3b3] hover:text-[#e5d3b3]'
                }`}>
              {slot.label}
            </button>
          ))}
        </div>
        {slots.length === 0 && !isLoading && (
          <p className="text-gray-400 text-sm text-center py-4">{t.noAvailableSlots}</p>
        )}
      </div>
      <div className="flex gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-white/20 bg-[#1a1a1a] inline-block"/>{t.available}</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#e5d3b3] inline-block"/>{t.selectedSlot}</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-800 inline-block"/>{t.occupied}</span>
      </div>
      <div className="flex gap-3 pt-2">
        {onCancel && <button type="button" onClick={onCancel}
          className="flex-1 py-2 border border-white/20 rounded-lg text-white/80 hover:bg-white/10">{t.cancel}</button>}
        <button type="button" disabled={!selectedDate || !selectedTime}
          onClick={() => setStep('details')}
          className="flex-1 py-2 bg-[#e5d3b3] text-black rounded-lg disabled:opacity-50 font-medium hover:bg-white transition-colors">
          {t.continue}
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div className="bg-[#1a1a1a] rounded-lg p-3 text-sm border border-white/10">
        <p className="font-medium text-white">{serviceName}</p>
        <p className="text-gray-400">{selectedDate} v {selectedTime} · {durationMinutes} min</p>
        <button type="button" onClick={() => setStep('datetime')}
          className="text-[#e5d3b3] text-xs mt-1 hover:underline">← {t.changeTime}</button>
      </div>
      {[
        { name: 'customer_name', label: t.yourName, type: 'text', placeholder: 'Jana Nováková' },
        { name: 'customer_email', label: t.emailLabel, type: 'email', placeholder: 'email@example.com' },
        { name: 'customer_phone', label: t.phone, type: 'tel', placeholder: '+420 000 000 000' },
      ].map(({ name, label, type, placeholder }) => (
        <div key={name}>
          <label className="block text-sm font-medium mb-1 text-white/80">{label} *</label>
          <input name={name} type={type} required placeholder={placeholder}
            value={form[name as keyof typeof form]}
            onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#e5d3b3] focus:border-transparent" />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium mb-1 text-white/80">{t.noteLabel}</label>
        <textarea name="notes" rows={2} value={form.notes} onChange={handleChange}
          className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-white resize-none focus:ring-2 focus:ring-[#e5d3b3] focus:border-transparent"
          placeholder={`${t.commentPlaceholder}...`} />
      </div>
      {submitError && <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-sm text-red-300">{submitError}</div>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => setStep('datetime')}
          className="flex-1 py-2 border border-white/20 rounded-lg text-white/80 hover:bg-white/10">← {t.back}</button>
        <button type="submit" disabled={isSubmitting}
          className="flex-1 py-2 bg-[#e5d3b3] text-black rounded-lg disabled:opacity-50 font-medium hover:bg-white transition-colors">
          {isSubmitting ? t.submitting : t.reserve}
        </button>
      </div>
    </form>
  );
};
