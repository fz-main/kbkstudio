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

type Tab = 'bookings' | 'services' | 'about' | 'contacts';

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
    { id: 'services', label: 'Služby' },
    { id: 'about', label: 'O mně' },
    { id: 'contacts', label: 'Kontakty' },
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

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Správa služeb</h2>
              <button
                onClick={() => setEditingService({
                  id: '',
                  title: '',
                  subtitle: '',
                  desc: '',
                  price: '',
                  time: '',
                  category: 'cosmetic',
                  video: '',
                  transition: '',
                  position: [0, 0, 0],
                  color: '#e5d3b3'
                })}
                className="px-4 py-2 bg-[#e5d3b3] text-black rounded-lg text-sm font-medium"
              >
                + Přidat službu
              </button>
            </div>

            {/* Service Form */}
            {editingService && (
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 mb-6">
                <h3 className="text-lg mb-4">{editingService.id ? 'Upravit službu' : 'Nová služba'}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Název"
                    value={editingService.title}
                    onChange={e => setEditingService({...editingService, title: e.target.value})}
                    className="bg-[#0a0a0a] border border-white/20 p-2 rounded-lg text-sm"
                  />
                  <input
                    placeholder="Podtitul"
                    value={editingService.subtitle}
                    onChange={e => setEditingService({...editingService, subtitle: e.target.value})}
                    className="bg-[#0a0a0a] border border-white/20 p-2 rounded-lg text-sm"
                  />
                  <input
                    placeholder="Popis"
                    value={editingService.desc}
                    onChange={e => setEditingService({...editingService, desc: e.target.value})}
                    className="bg-[#0a0a0a] border border-white/20 p-2 rounded-lg text-sm col-span-2"
                  />
                  <input
                    placeholder="Cena (např. 1 500 Kč)"
                    value={editingService.price}
                    onChange={e => setEditingService({...editingService, price: e.target.value})}
                    className="bg-[#0a0a0a] border border-white/20 p-2 rounded-lg text-sm"
                  />
                  <input
                    placeholder="Čas (např. 60 min)"
                    value={editingService.time}
                    onChange={e => setEditingService({...editingService, time: e.target.value})}
                    className="bg-[#0a0a0a] border border-white/20 p-2 rounded-lg text-sm"
                  />
                  <select
                    value={editingService.category}
                    onChange={e => setEditingService({...editingService, category: e.target.value})}
                    className="bg-[#0a0a0a] border border-white/20 p-2 rounded-lg text-sm"
                  >
                    {SERVICE_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                  <input
                    placeholder="Booking URL (volitelné)"
                    value={editingService.bookingUrl || ''}
                    onChange={e => setEditingService({...editingService, bookingUrl: e.target.value})}
                    className="bg-[#0a0a0a] border border-white/20 p-2 rounded-lg text-sm"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleSaveService(editingService)}
                    className="px-4 py-2 bg-green-600 rounded-lg text-sm font-medium"
                  >
                    Uložit
                  </button>
                  <button
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium"
                  >
                    Zrušit
                  </button>
                </div>
              </div>
            )}

            {/* Services List */}
            <div className="space-y-2">
              {services.map(service => (
                <div key={service.id} className="flex items-center justify-between bg-[#1a1a1a] p-4 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#e5d3b3] bg-[#e5d3b3]/10 px-2 py-1 rounded">
                      {SERVICE_CATEGORIES.find(c => c.id === service.category)?.title}
                    </span>
                    <span className="font-medium">{service.title}</span>
                    <span className="text-white/50 text-sm">{service.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingService(service)}
                      className="px-3 py-1 bg-white/10 rounded text-sm hover:bg-white/20"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="px-3 py-1 bg-red-600/20 text-red-400 rounded text-sm hover:bg-red-600/30"
                    >
                      Smazat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div>
            <h2 className="text-xl mb-4">Text "O mně"</h2>
            <textarea
              value={aboutText}
              onChange={e => setAboutText(e.target.value)}
              className="w-full h-64 bg-[#1a1a1a] border border-white/10 p-4 rounded-xl resize-none text-sm"
              placeholder="Napište text o sobě..."
            />
            <button
              onClick={saveAbout}
              className="mt-4 px-4 py-2 bg-[#e5d3b3] text-black rounded-lg text-sm font-medium"
            >
              Uložit
            </button>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div>
            <h2 className="text-xl mb-4">Kontakty</h2>
            <div className="grid grid-cols-2 gap-4 max-w-xl">
              <input
                placeholder="Adresa"
                value={contacts.address}
                onChange={e => setContacts({...contacts, address: e.target.value})}
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-sm col-span-2"
              />
              <input
                placeholder="Telefon"
                value={contacts.phone}
                onChange={e => setContacts({...contacts, phone: e.target.value})}
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-sm"
              />
              <input
                placeholder="Email"
                value={contacts.email}
                onChange={e => setContacts({...contacts, email: e.target.value})}
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-sm"
              />
              <input
                placeholder="Otevírací doba"
                value={contacts.hours}
                onChange={e => setContacts({...contacts, hours: e.target.value})}
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-sm"
              />
              <input
                placeholder="Facebook URL"
                value={contacts.facebook}
                onChange={e => setContacts({...contacts, facebook: e.target.value})}
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-sm"
              />
              <input
                placeholder="Instagram URL"
                value={contacts.instagram}
                onChange={e => setContacts({...contacts, instagram: e.target.value})}
                className="bg-[#1a1a1a] border border-white/10 p-2 rounded-lg text-sm"
              />
            </div>
            <button
              onClick={saveContacts}
              className="mt-4 px-4 py-2 bg-[#e5d3b3] text-black rounded-lg text-sm font-medium"
            >
              Uložit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
