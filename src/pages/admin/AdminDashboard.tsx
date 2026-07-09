import React, { useEffect, useState } from 'react';
import { fetchAllBookings, updateBookingStatus, deleteBooking } from '../../lib/localStorageDb';
import type { Booking } from '../../types/booking';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  confirmed: 'bg-green-500/20 text-green-300',
  cancelled: 'bg-red-500/20 text-red-300',
  new: 'bg-yellow-500/20 text-yellow-300',
};

type Tab = 'reze-beata' | 'reze-stepanka' | 'poukazy' | 'blokovani' | 'skoleni';

interface BlockedSlot { id: number; date: string; time?: string; type: 'hour' | 'day'; master: string; note: string; }
interface VoucherOrder { id: number; name: string; email: string; message: string; date: string; status: string; }
interface SkoleniApp { id: number; name: string; email: string; message: string; service: string; date: string; status: string; }

const MASTERS = ['Beata Kučerová', 'Štěpánka Kavínová'];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('reze-beata');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [vouchers, setVouchers] = useState<VoucherOrder[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [blockDate, setBlockDate] = useState('');
  const [blockTime, setBlockTime] = useState('');
  const [blockType, setBlockType] = useState<'hour' | 'day'>('hour');
  const [blockMaster, setBlockMaster] = useState(MASTERS[0]);
  const [blockNote, setBlockNote] = useState('');
  const [skoleniApps, setSkoleniApps] = useState<SkoleniApp[]>([]);

  useEffect(() => {
    setBlockedSlots(JSON.parse(localStorage.getItem('kbk_blocked_slots') || '[]'));
    setVouchers(JSON.parse(localStorage.getItem('kbk_gift_orders') || '[]'));
    setSkoleniApps(JSON.parse(localStorage.getItem('kbk_skoleni_apps') || '[]'));
  }, []);

  const loadBookings = () => {
    setLoading(true);
    const data = fetchAllBookings();
    const masterFilter = activeTab === 'reze-beata' ? 'Beata' : 'Štěpánka';
    let filtered = data.filter(b => {
      const name = (b.master || b.customer_name || '').toLowerCase();
      return name.includes(masterFilter.toLowerCase()) || (activeTab === 'reze-beata' && !b.master);
    });
    if (filterDate) filtered = filtered.filter(b => b.booking_date === filterDate);
    setBookings(filtered);
    setLoading(false);
  };

  useEffect(() => { loadBookings(); }, [activeTab, filterDate]);

  const handleStatusChange = (id: string, status: string) => {
    updateBookingStatus(id, status as Booking['status']);
    loadBookings();
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Opravdu chcete smazat tuto rezervaci?')) {
      deleteBooking(id);
      loadBookings();
    }
  };

  const handleVoucherStatus = (id: number, status: string) => {
    const updated = vouchers.map(v => v.id === id ? { ...v, status } : v);
    localStorage.setItem('kbk_gift_orders', JSON.stringify(updated));
    setVouchers(updated);
  };

  const handleDeleteVoucher = (id: number) => {
    if (confirm('Opravdu smazat?')) {
      const updated = vouchers.filter(v => v.id !== id);
      localStorage.setItem('kbk_gift_orders', JSON.stringify(updated));
      setVouchers(updated);
    }
  };

  const addBlock = () => {
    if (!blockDate) return;
    const newBlock: BlockedSlot = {
      id: Date.now(),
      date: blockDate,
      time: blockType === 'hour' ? blockTime : undefined,
      type: blockType,
      master: blockMaster,
      note: blockNote,
    };
    const updated = [...blockedSlots, newBlock];
    localStorage.setItem('kbk_blocked_slots', JSON.stringify(updated));
    setBlockedSlots(updated);
    setBlockDate('');
    setBlockTime('');
    setBlockNote('');
  };

  const removeBlock = (id: number) => {
    const updated = blockedSlots.filter(b => b.id !== id);
    localStorage.setItem('kbk_blocked_slots', JSON.stringify(updated));
    setBlockedSlots(updated);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    window.location.reload();
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'reze-beata', label: 'Rezervace — Beata' },
    { id: 'reze-stepanka', label: 'Rezervace — Štěpánka' },
    { id: 'poukazy', label: 'Poukazy' },
    { id: 'skoleni', label: 'Školení' },
    { id: 'blokovani', label: 'Blokování' },
  ];

  const handleSkoleniStatus = (id: number, status: string) => {
    const updated = skoleniApps.map(a => a.id === id ? { ...a, status } : a);
    localStorage.setItem('kbk_skoleni_apps', JSON.stringify(updated));
    setSkoleniApps(updated);
  };

  const handleDeleteSkoleni = (id: number) => {
    if (confirm('Opravdu smazat?')) {
      const updated = skoleniApps.filter(a => a.id !== id);
      localStorage.setItem('kbk_skoleni_apps', JSON.stringify(updated));
      setSkoleniApps(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">KBK Studio — Administrace</h1>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white">Odhlásit</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-2 flex-wrap">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-[#e5d3b3] text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}>{tab.label}</button>
          ))}
        </div>

        {/* Bookings Tab */}
        {(activeTab === 'reze-beata' || activeTab === 'reze-stepanka') && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">{activeTab === 'reze-beata' ? 'Rezervace — Beata Kučerová' : 'Rezervace — Štěpánka Kavínová'}</h2>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
                className="bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-1 text-sm text-white" />
            </div>
            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Načítání...</div>
              ) : bookings.length === 0 ? (
                <div className="p-8 text-center text-gray-400">Žádné rezervace</div>
              ) : (
                <div className="overflow-x-auto">
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
                            <select value={b.status} onChange={(e) => handleStatusChange(b.id, e.target.value)}
                              className={`text-xs rounded-full px-2 py-1 border-0 font-medium ${STATUS_COLORS[b.status] || ''}`}>
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
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vouchers Tab */}
        {activeTab === 'poukazy' && (
          <div>
            <h2 className="text-xl mb-4">Objednávky dárkových poukazů</h2>
            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
              {vouchers.length === 0 ? (
                <div className="p-8 text-center text-gray-400">Žádné objednávky poukazů</div>
              ) : (
                <div className="overflow-x-auto">
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
                            <select value={v.status} onChange={(e) => handleVoucherStatus(v.id, e.target.value)}
                              className={`text-xs rounded-full px-2 py-1 border-0 font-medium ${STATUS_COLORS[v.status] || ''}`}>
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
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skoleni Tab */}
        {activeTab === 'skoleni' && (
          <div>
            <h2 className="text-xl mb-4">Přihlášky na školení</h2>
            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
              {skoleniApps.length === 0 ? (
                <div className="p-8 text-center text-gray-400">Žádné přihlášky</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#0a0a0a] border-b border-white/10">
                      <tr>
                        {['Datum', 'Jméno', 'E-mail', 'Služba', 'Zpráva', 'Stav', ''].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-medium text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {skoleniApps.map(a => (
                        <tr key={a.id} className="hover:bg-white/5">
                          <td className="px-4 py-3 whitespace-nowrap">{new Date(a.date).toLocaleDateString('cs-CZ')}</td>
                          <td className="px-4 py-3">{a.name}</td>
                          <td className="px-4 py-3">{a.email}</td>
                          <td className="px-4 py-3 text-[#e5d3b3]">{a.service}</td>
                          <td className="px-4 py-3 max-w-xs truncate">{a.message || '—'}</td>
                          <td className="px-4 py-3">
                            <select value={a.status} onChange={e => handleSkoleniStatus(a.id, e.target.value)}
                              className={`text-xs rounded-full px-2 py-1 border-0 font-medium ${STATUS_COLORS[a.status] || ''}`}>
                              <option value="new">Nová</option>
                              <option value="confirmed">Kontaktováno</option>
                              <option value="cancelled">Zamítnuto</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDeleteSkoleni(a.id)} className="text-red-400 hover:text-red-300 text-xs">Smazat</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Blocking Tab */}
        {activeTab === 'blokovani' && (
          <div>
            <h2 className="text-xl mb-4">Blokování termínů</h2>

            {/* Add block form */}
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Typ</label>
                  <select value={blockType} onChange={e => setBlockType(e.target.value as 'hour' | 'day')}
                    className="w-full bg-[#0a0a0a] border border-white/20 p-2 rounded-lg text-sm">
                    <option value="hour">Blokovat hodinu</option>
                    <option value="day">Blokovat celý den</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Datum</label>
                  <input type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/20 p-2 rounded-lg text-sm text-white" />
                </div>
                {blockType === 'hour' && (
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Čas</label>
                    <input type="time" value={blockTime} onChange={e => setBlockTime(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/20 p-2 rounded-lg text-sm text-white" />
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Master</label>
                  <select value={blockMaster} onChange={e => setBlockMaster(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/20 p-2 rounded-lg text-sm">
                    {MASTERS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Poznámka</label>
                  <input value={blockNote} onChange={e => setBlockNote(e.target.value)} placeholder="Volitelné"
                    className="w-full bg-[#0a0a0a] border border-white/20 p-2 rounded-lg text-sm" />
                </div>
              </div>
              <button onClick={addBlock} className="mt-4 px-6 py-2 bg-[#e5d3b3] text-black rounded-lg text-sm font-medium">
                + Přidat blokaci
              </button>
            </div>

            {/* Blocked list */}
            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
              {blockedSlots.length === 0 ? (
                <div className="p-8 text-center text-gray-400">Žádné blokace</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#0a0a0a] border-b border-white/10">
                      <tr>
                        {['Datum', 'Typ', 'Čas', 'Master', 'Poznámka', ''].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-medium text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {blockedSlots.map(b => (
                        <tr key={b.id} className="hover:bg-white/5">
                          <td className="px-4 py-3">{b.date}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs rounded-full px-2 py-1 font-medium ${b.type === 'day' ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/20 text-orange-300'}`}>
                              {b.type === 'day' ? 'Celý den' : 'Hodina'}
                            </span>
                          </td>
                          <td className="px-4 py-3">{b.time || '—'}</td>
                          <td className="px-4 py-3">{b.master}</td>
                          <td className="px-4 py-3 text-gray-400">{b.note || '—'}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => {
                              if (confirm('Odebrat tuto blokaci?')) removeBlock(b.id);
                            }} className="px-3 py-1 bg-red-600/20 text-red-400 rounded text-xs hover:bg-red-600/30 border border-red-500/30">Zrušit blokaci</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
