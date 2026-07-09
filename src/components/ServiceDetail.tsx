import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from '../data/services';
import type { Lang, Translations } from '../lib/i18n';
import { useState } from 'react';
import { BookingModal } from './BookingModal';

interface ServiceDetailProps {
  activeService: Service;
  onBack: () => void;
  lang?: Lang;
  t: Translations;
}

export default function ServiceDetail({ activeService, onBack, lang: _lang, t }: ServiceDetailProps) {
  const srvT = t.services[activeService.id as keyof typeof t.services];
  const mastersT = (t.masters[activeService.id as keyof typeof t.masters] as unknown) as Array<{ name: string; role: string; exp: string; photo?: string }>;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<string>('');
  const masters = Array.isArray(mastersT) ? mastersT : [];
  const isSkoleni = activeService.category === 'skoleni';
  const [showApplication, setShowApplication] = useState(false);
  const [appForm, setAppForm] = useState({ name: '', email: '', message: '' });
  const [appSubmitted, setAppSubmitted] = useState(false);

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 pointer-events-auto overflow-y-auto"
      style={{ touchAction: 'pan-y' }}
    >
      <button
        onClick={onBack}
        className="fixed top-16 md:top-20 left-4 md:left-8 font-monument text-[10px] md:text-xs tracking-widest hover:text-[#e5d3b3] transition-colors z-50 flex items-center gap-3 group bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm pointer-events-auto"
      >
        <span className="w-4 h-[1px] bg-white group-hover:bg-[#e5d3b3] transition-colors" />
        {t.back}
      </button>

      <div className="min-h-full px-4 md:px-16 pt-16 pb-16 flex flex-col gap-6 max-w-5xl mx-auto">

        {isSkoleni && (
          <div className="text-center">
            <div className="font-monument text-[10px] md:text-xs tracking-[0.3em] text-[#e5d3b3] mb-2 uppercase">Školení</div>
            <div className="font-montreal text-xs text-[#a3a3a3]">Profesionální vzdělávání v oboru permanentní make-up a kosmetické procedury</div>
          </div>
        )}

        {/* SERVICE CARD */}
        <div className="flex flex-col gap-6">

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="glass-panel p-6 md:p-10 rounded-3xl">
            <h4 className="font-monument text-[10px] md:text-xs tracking-[0.25em] text-[#e5d3b3] mb-3 md:mb-4">
              {srvT?.subtitle}
            </h4>
            <h2 className="text-4xl md:text-7xl font-editorial mb-4 md:mb-6 leading-[0.9]">
              {srvT?.title}
            </h2>
            <p className="font-montreal text-sm md:text-base text-[#a3a3a3] leading-relaxed mb-6 md:mb-10">
              {srvT?.desc}
            </p>

            {/* Benefits & Process */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-6 md:mb-8">
              {activeService.benefits && activeService.benefits.length > 0 && (
                <div>
                  <div className="font-monument text-xs tracking-[0.2em] text-[#e5d3b3] mb-3">{isSkoleni ? 'Výhody školení' : 'Výhody'}</div>
                  <ul className="flex flex-col gap-3">
                    {activeService.benefits.map((b, i) => (
                      <li key={i} className="font-montreal text-sm md:text-base text-[#a3a3a3] flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e5d3b3] shrink-0 mt-2" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {activeService.process && activeService.process.length > 0 && (
                <div>
                  <div className="font-monument text-xs tracking-[0.2em] text-[#e5d3b3] mb-3">{isSkoleni ? 'Průběh školení' : 'Průběh ošetření'}</div>
                  <ol className="flex flex-col gap-3">
                    {activeService.process.map((p, i) => (
                      <li key={i} className="font-montreal text-sm md:text-base text-[#a3a3a3] flex items-start gap-3">
                        <span className="font-monument text-xs text-[#e5d3b3] w-5 text-right shrink-0">{i + 1}.</span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 border-t border-white/10 pt-5">
              {isSkoleni ? (
                <div>
                  <div className="font-montreal text-sm text-[#e5d3b3]">Cena a termín dle individuální domluvy</div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="font-monument text-[8px] text-[#a3a3a3] mb-1 tracking-widest">{t.duration}</div>
                    <div className="font-editorial text-lg md:text-2xl">{activeService.time}</div>
                  </div>
                  <div>
                    <div className="font-monument text-[8px] text-[#a3a3a3] mb-1 tracking-widest">{t.investment}</div>
                    <div className="font-editorial text-lg md:text-2xl text-[#e5d3b3]">{activeService.price}</div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

        </div>

        {/* MASTER BLOCK */}
        {!isSkoleni && masters.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="glass-panel rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">

          <div className="flex-1">
            <div className="font-monument text-[9px] tracking-[0.25em] text-[#e5d3b3] mb-4">{t.yourSpecialist}</div>
            <div className="flex flex-col gap-5">
              {masters.map((m, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="shrink-0">
                    {m.photo ? (
                      <img src={m.photo} alt={m.name}
                        className="w-16 h-16 rounded-2xl object-cover object-top"
                        style={{ border: '1px solid rgba(229,211,179,0.2)' }} />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-editorial font-bold"
                        style={{ background: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)', border: '1px solid rgba(229,211,179,0.2)', color: '#e5d3b3' }}>
                        {m.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-editorial text-lg md:text-xl">{m.name}</div>
                    <div className="font-montreal text-xs text-[#a3a3a3]">{m.role} · {m.exp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        )}

        {/* MASTER SELECTOR + BOOKING */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
          className="glass-panel rounded-3xl p-6 md:p-10 flex flex-col gap-6">
          
          {masters.length > 1 && (
            <div>
              <div className="font-monument text-[9px] tracking-[0.25em] text-[#e5d3b3] mb-3">{t.selectMaster}</div>
              <select
                value={selectedMaster}
                onChange={(e) => setSelectedMaster(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 font-montreal text-sm text-white focus:outline-none focus:border-[#e5d3b3] transition-colors appearance-none cursor-pointer"
              >
                <option value="">{t.selectMaster}...</option>
                {masters.map((m, i) => (
                  <option key={i} value={m.name}>{m.name} — {m.role}</option>
                ))}
              </select>
            </div>
          )}

          {isSkoleni ? (
            <button
              onClick={() => { setShowApplication(true); setAppSubmitted(false); setAppForm({ name: '', email: '', message: '' }); }}
              className="w-full px-6 py-4 bg-white text-black font-monument text-[10px] tracking-widest rounded-full hover:bg-[#e5d3b3] transition-colors uppercase"
            >
              Podat anketu
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full px-6 py-4 bg-white text-black font-monument text-[10px] tracking-widest rounded-full hover:bg-[#e5d3b3] transition-colors uppercase"
            >
              {t.reserve}
            </button>
          )}
        </motion.div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceId={activeService.id}
        serviceName={srvT?.title || activeService.title}
        durationMinutes={activeService.durationMinutes || 60}
      />

      {/* Application Popup for Školení */}
      {showApplication && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4" onClick={() => setShowApplication(false)}>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-md relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowApplication(false)} className="absolute top-3 right-4 text-white/50 hover:text-white text-xl">&times;</button>
            <div className="font-monument text-[9px] tracking-[0.3em] text-[#e5d3b3] mb-2 uppercase text-center">ŠKOLENÍ</div>
            <h3 className="font-editorial text-xl md:text-2xl mb-5 text-center">{srvT?.title || activeService.title}</h3>
            {appSubmitted ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-3">✓</div>
                <p className="font-montreal text-sm text-white/70">Vaše anketa byla odeslána. Budeme vás kontaktovat.</p>
                <button onClick={() => setShowApplication(false)} className="mt-6 px-6 py-2 bg-white/10 rounded-full font-monument text-[10px] tracking-widest hover:bg-white/20 transition-colors">Zavřít</button>
              </div>
            ) : (
              <form onSubmit={e => {
                e.preventDefault();
                if (!appForm.name.trim() || !appForm.email.trim()) return;
                const apps = JSON.parse(localStorage.getItem('kbk_skoleni_apps') || '[]');
                apps.push({ id: Date.now(), ...appForm, service: activeService.title, date: new Date().toISOString(), status: 'new' });
                localStorage.setItem('kbk_skoleni_apps', JSON.stringify(apps));
                setAppSubmitted(true);
              }} className="flex flex-col gap-4">
                <div>
                  <label className="font-montreal text-xs text-[#e5d3b3] block mb-1">Vaše jméno</label>
                  <input required value={appForm.name} onChange={e => setAppForm({...appForm, name: e.target.value})}
                    className="w-full bg-black/40 border border-[#e5d3b3]/30 rounded-lg px-4 py-3 font-montreal text-sm text-white placeholder-white/30 focus:border-[#e5d3b3] outline-none" placeholder="Vaše jméno" />
                </div>
                <div>
                  <label className="font-montreal text-xs text-[#e5d3b3] block mb-1">Váš e-mail</label>
                  <input required type="email" value={appForm.email} onChange={e => setAppForm({...appForm, email: e.target.value})}
                    className="w-full bg-black/40 border border-[#e5d3b3]/30 rounded-lg px-4 py-3 font-montreal text-sm text-white placeholder-white/30 focus:border-[#e5d3b3] outline-none" placeholder="Váš e-mail" />
                </div>
                <div>
                  <label className="font-montreal text-xs text-[#e5d3b3] block mb-1">Vaše zpráva (volitelný)</label>
                  <textarea value={appForm.message} onChange={e => setAppForm({...appForm, message: e.target.value})}
                    className="w-full bg-black/40 border border-[#e5d3b3]/30 rounded-lg px-4 py-3 font-montreal text-sm text-white placeholder-white/30 focus:border-[#e5d3b3] outline-none h-28 resize-none" placeholder="Vaše zpráva (volitelný)" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#e5d3b3] text-black font-monument text-[10px] tracking-[0.2em] rounded-lg hover:bg-white transition-colors">Odeslat anketu</button>
              </form>
            )}
          </div>
        </div>
      )}

      <AnimatePresence />
    </motion.div>
  );
}
