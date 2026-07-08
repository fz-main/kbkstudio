import React, { useEffect, useState } from 'react';
import { fetchAllBookings, updateBookingStatus, deleteBooking } from '../lib/localStorageDb';
import DatePicker from 'react-datepicker';
import { cs } from 'date-fns/locale/cs';
import 'react-datepicker/dist/react-datepicker.css';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  confirmed: 'bg-green-500/20 text-green-300',
  cancelled: 'bg-red-500/20 text-red-300',
};

const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const loadBookings = () => {
    setLoading(true);
    try {
      const data = fetchAllBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch { setBookings([]); } finally { setLoading(false); }
  };
  useEffect(() => { loadBookings(); }, []);

  const handleStatusChange = (id: string, status: string) => {
    updateBookingStatus(id, status);
    loadBookings();
  };
  const handleDelete = (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto rezervaci?')) return;
    deleteBooking(id);
    loadBookings();
  };

  const filtered = filterDate
    ? bookings.filter(b => b.booking_date === filterDate.toISOString().split('T')[0])
    : bookings;

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] text-white p-8 text-center">Načítání...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Administrace rezervací</h1>
          <div className="flex flex-wrap gap-4 items-center">
            <button onClick={loadBookings} className="text-sm bg-[#e5d3b3] text-black px-3 py-1 rounded-lg hover:bg-white">⟳ Obnovit</button>
            <DatePicker selected={filterDate} onChange={(d: Date | null) => setFilterDate(d)} dateFormat="dd.MM.yyyy" locale={cs} placeholderText="Vyberte datum" className="bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-1 text-sm text-white" />
            {filterDate && <button onClick={() => setFilterDate(null)} className="text-sm text-gray-400 hover:text-white">✕ Zrušit filtr</button>}
            <button onClick={() => { localStorage.removeItem('admin_logged_in'); window.location.reload(); }} className="text-sm text-gray-400 hover:text-white">Odhlásit</button>
          </div>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400">{filterDate ? 'Žádné rezervace k tomuto datu' : 'Žádné rezervace'}</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#0a0a0a] border-b border-white/10">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-400">Datum</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-400">Čas</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-400">Služba</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-400">Klient</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-400">Telefon</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-400">Stav</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-400">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((b: any) => (
                  <tr key={b.id} className="hover:bg-white/5">
                    <td className="px-4 py-3">{b.booking_date || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{b.start_time ? `${b.start_time}–${b.end_time || '?'}` : '—'}</td>
                    <td className="px-4 py-3">{b.service_name || '—'}</td>
                    <td className="px-4 py-3"><div>{b.customer_name || '—'}</div>{b.customer_email && <div className="text-gray-500 text-xs">{b.customer_email}</div>}</td>
                    <td className="px-4 py-3">{b.customer_phone || '—'}</td>
                    <td className="px-4 py-3">
                      <select value={b.status || 'pending'} onChange={(e) => handleStatusChange(b.id, e.target.value)} className={`text-xs rounded-full px-2 py-1 border-0 font-medium ${statusColors[b.status] || statusColors.pending}`}>
                        <option value="pending">Čeká na potvrzení</option>
                        <option value="confirmed">Potvrzeno</option>
                        <option value="cancelled">Zrušeno</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(b.id)} className="text-red-400 hover:text-red-300 text-xs">Smazat</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-500">Celkem: {filtered.length} {filtered.length === 1 ? 'rezervace' : 'rezervací'}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
