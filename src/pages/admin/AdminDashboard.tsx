import React, { useEffect, useState } from 'react';
import { SERVICES, SERVICE_CATEGORIES } from '../../data/services';
import type { Service } from '../../data/services';
import { fetchAllBookings, updateBookingStatus, deleteBooking } from '../../lib/localStorageDb';
import type { Booking } from '../../types/booking';

const STATUS_COLORS: Record<Booking['status'], string> = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  confirmed: 'bg-green-500/20 text-green-300',
  cancelled: 'bg-red-500/20 text-red-300',
};

type Tab = 'bookings' | 'services' | 'about' | 'contacts' | 'vouchers';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

  // Services state
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // About state
  const [aboutText, setAboutText] = useState('');

  // Contacts state
  const [contacts, setContacts] = useState({
    address: '',
    phone: '',
    email: '',
    hours: '',
    facebook: '',
    instagram: ''
  });

  // Vouchers state
  interface VoucherOrder { id: number; name: string; email: string; message: string; date: string; status: string; }
  const [vouchers, setVouchers] = useState<VoucherOrder[]>([]);

  const loadVouchers = () => {
    const data = JSON.parse(localStorage.getItem('kbk_gift_orders') || '[]');
    setVouchers(data);
  };

  useEffect(() => { loadVouchers(); }, [activeTab]);

  const handleDeleteVoucher = (id: number) => {
    if (confirm('Opravdu smazat tuto objednávku?')) {
      const updated = vouchers.filter(v => v.id !== id);
      localStorage.setItem('kbk_gift_orders', JSON.stringify(updated));
      setVouchers(updated);
    }
  };

  const handleVoucherStatus = (id: number, status: string) => {
    const updated = vouchers.map(v => v.id === id ? { ...v, status } : v);
    localStorage.setItem('kbk_gift_orders', JSON.stringify(updated));
    setVouchers(updated);
  };

  // Load data from localStorage
  useEffect(() => {
    const savedServices = localStorage.getItem('adminServices');
    if (savedServices) setServices(JSON.parse(savedServices));
    const savedAbout = localStorage.getItem('adminAbout');
    if (savedAbout) setAboutText(savedAbout);
    const savedContacts = localStorage.getItem('adminContacts');
    if (savedContacts) setContacts(JSON.parse(savedContacts));
  }, []);

  // Bookings
  const loadBookings = () => {
    setLoading(true);
    const data = fetchAllBookings();
    if (filterDate) {
      setBookings(data.filter(b => b.booking_date === filterDate));
    } else {
      setBookings(data);
    }
    setLoading(false);
  };

  useEffect(() => { loadBookings(); }, [filterDate]);

  const handleStatusChange = (id: string, status: Booking['status']) => {
    updateBookingStatus(id, status);
    loadBookings();
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Opravdu chcete smazat tuto rezervaci?')) {
      deleteBooking(id);
      loadBookings();
    }
  };

  // Services CRUD
  const saveServices = (newServices: Service[]) => {
    setServices(newServices);
    localStorage.setItem('adminServices', JSON.stringify(newServices));
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Opravdu smazat tuto službu?')) {
      saveServices(services.filter(s => s.id !== id));
    }
  };

  const handleSaveService = (service: Service) => {
    if (editingService?.id) {
      saveServices(services.map(s => s.id === service.id ? service : s));
    } else {
      saveServices([...services, { ...service, id: `service-${Date.now()}` }]);
    }
    setEditingService(null);
  };

  // About
  const saveAbout = () => {
    localStorage.setItem('adminAbout', aboutText);
    alert('Text "O mně" uložen');
  };

  // Contacts
  const saveContacts = () => {
    localStorage.setItem('adminContacts', JSON.stringify(contacts));
    alert('Kontakty uloženy');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    window.location.reload();
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'bookings', label: 'Rezervace' },
    { id: 'vouchers', label: 'Poukazy' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Administrace - Beauty by Renata</h1>
          <div className="flex gap-4 items-center">
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white">Odhlásit</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#e5d3b3] text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Správa rezervací</h2>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-1 text-sm text-white"
              />
            </div>
            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Načítání...</div>
              ) : bookings.length === 0 ? (
                <div className="p-8 text-center text-gray-400">Žádné rezervace</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-[#0a0a0a] border-b border-white/10">
                    <tr>
                      {['Datum', 'Čas', 'Služba', 'Klient', 'Telefon', 'Stav', ''].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-medium text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5">
                        <td className="px-4 py-3">{b.booking_date}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{b.start_time}–{b.end_time}</td>
                        <td className="px-4 py-3">{b.service_name}</td>
                        <td className="px-4 py-3">
                          <div>{b.customer_name}</div>
                          <div className="text-gray-500 text-xs">{b.customer_email}</div>
                        </td>
                        <td className="px-4 py-3">{b.customer_phone}</td>
                        <td className="px-4 py-3">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value as Booking['status'])}
                            className={`text-xs rounded-full px-2 py-1 border-0 font-medium ${STATUS_COLORS[b.status]}`}
                          >
                            <option value="pending">Čeká na potvrzení</option>
                            <option value="confirmed">Potvrzeno</option>
                            <option value="cancelled">Zrušeno</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteBooking(b.id)} className="text-red-400 hover:text-red-300 text-xs">Smazat</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Vouchers Tab */}
        {activeTab === 'vouchers' && (
          <div>
            <h2 className="text-xl mb-4">Objednávky dárkových poukazů</h2>
            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
              {vouchers.length === 0 ? (
                <div className="p-8 text-center text-gray-400">Žádné objednávky poukazů</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-[#0a0a0a] border-b border-white/10">
                    <tr>
                      {['Datum', 'Jméno', 'E-mail', 'Zpráva', 'Stav', ''].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-medium text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {vouchers.map((v) => (
                      <tr key={v.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 whitespace-nowrap">{new Date(v.date).toLocaleDateString('cs-CZ')}</td>
                        <td className="px-4 py-3">{v.name}</td>
                        <td className="px-4 py-3">{v.email}</td>
                        <td className="px-4 py-3 max-w-xs truncate">{v.message || '—'}</td>
                        <td className="px-4 py-3">
                          <select
                            value={v.status}
                            onChange={(e) => handleVoucherStatus(v.id, e.target.value)}
                            className={`text-xs rounded-full px-2 py-1 border-0 font-medium ${
                              v.status === 'confirmed' ? 'bg-green-500/20 text-green-300' :
                              v.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                              'bg-yellow-500/20 text-yellow-300'
                            }`}
                          >
                            <option value="new">Nová</option>
                            <option value="confirmed">Vyřízeno</option>
                            <option value="cancelled">Zamítnuto</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteVoucher(v.id)} className="text-red-400 hover:text-red-300 text-xs">Smazat</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
