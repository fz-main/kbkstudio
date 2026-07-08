import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { STAGES, SERVICES, SERVICE_CATEGORIES } from './data/services';
import type { Service } from './data/services';
import { translations } from './lib/i18n';
import type { Lang } from './lib/i18n';
import ThreeScene from './components/ThreeScene';
import ServiceDetail from './components/ServiceDetail';
import MenuButton from './components/MenuButton';
import Testimonials from './components/Testimonials';
import HelixGallery from './components/HelixGallery';
import { AdminPage } from './pages/admin';

export default function MainPage() {
  return <MainApp />;
}

function ContactsBar({ t }: { t: ReturnType<typeof translations.__extract> }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center px-6 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="font-monument text-[8px] tracking-[0.25em] text-[#e5d3b3] uppercase mb-1">{t.contacts?.title || 'Kontakty'}</div>
      <div className="font-montreal text-[10px] text-white/70">{t.contacts?.address}</div>
      <div className="font-montreal text-[10px] text-white/70 flex flex-wrap justify-center gap-x-2">
        <a href={`tel:${t.contacts?.phone?.replace(/\s/g, '')}`} className="hover:text-[#e5d3b3] transition-colors">{t.contacts?.phone}</a>
        <span className="text-white/30">·</span>
        <a href={`mailto:${t.contacts?.email}`} className="hover:text-[#e5d3b3] transition-colors">{t.contacts?.email}</a>
      </div>
      <div className="font-montreal text-[10px] text-white/50 mt-1">{t.contacts?.hours}</div>
      <div className="flex items-center gap-4 mt-1">
        <a href={t.contacts?.facebook} target="_blank" rel="noopener noreferrer" className="font-monument text-[9px] tracking-widest text-white/50 hover:text-[#e5d3b3] transition-colors uppercase">Facebook</a>
        <span className="text-white/20">·</span>
        <a href={t.contacts?.instagram} target="_blank" rel="noopener noreferrer" className="font-monument text-[9px] tracking-widest text-white/50 hover:text-[#e5d3b3] transition-colors uppercase">Instagram</a>
      </div>
    </div>
  );
}

function MainApp() {
  const [lang, setLang] = useState<Lang>('cs');
  const t = translations[lang];

  const [stage, setStage] = useState(STAGES.INTRO);
  const lastScrollTime = useRef(0);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionUrl, setTransitionUrl] = useState('');
  const [bgVideoUrl, setBgVideoUrl] = useState('');
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const closeLightbox = () => setLightboxImage(null);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [videoTransition, setVideoTransition] = useState(false);
  const [heroFading, setHeroFading] = useState(false);
  const [videoBlurred, setVideoBlurred] = useState(false);


  const showCard = useCallback(() => {
    setShowTransition(false);
    if (bgVideoRef.current) { bgVideoRef.current.currentTime = bgVideoRef.current.duration || 99999; bgVideoRef.current.pause(); }
    setStage(STAGES.SERVICE_DETAIL);
  }, []);

  const handleServiceClick = (service: Service) => {
    // If clicking a category (has no price/duration), show category services
    if (!service.price && !service.durationMinutes) {
      setActiveCategory(SERVICE_CATEGORIES.find(c => c.id === service.category));
      return;
    }
    if (!service.transition) {
      setActiveService(service);
      setShowTransition(false);
      setStage(STAGES.SERVICE_DETAIL);
      return;
    }
    setActiveService(service);
    setTransitionUrl(service.transition);
    setBgVideoUrl(service.transition);
    setShowTransition(true);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setBgVideoUrl('');
    setStage(STAGES.MENU);
    setTimeout(() => { setActiveService(null); setIsTransitioning(false); }, 600);
  };

  useEffect(() => {
    const COOLDOWN = 2500;
    const aboutContainer = document.getElementById('about-scroll-container');
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < COOLDOWN) return;
      if (stage === STAGES.INTRO && e.deltaY > 0) {
        setHeroFading(true);
        setTimeout(() => setVideoTransition(true), 500);
        lastScrollTime.current = now;
      } else if (stage === STAGES.MENU && e.deltaY < 0) {
        setStage(STAGES.INTRO);
        lastScrollTime.current = now;
      } else if (stage === STAGES.MENU && e.deltaY > 0) {
        setStage(STAGES.ABOUT);
        lastScrollTime.current = now;
      } else if (stage === STAGES.ABOUT && e.deltaY < 0) {
        if (aboutContainer && aboutContainer.scrollTop === 0) {
          setStage(STAGES.MENU);
          lastScrollTime.current = now;
        }
      }
    };
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < COOLDOWN) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) > 50) {
        if (stage === STAGES.INTRO && deltaY > 0) {
          setHeroFading(true);
          setTimeout(() => setVideoTransition(true), 500);
          lastScrollTime.current = now;
        } else if (stage === STAGES.MENU && deltaY < 0) {
          setVideoTransition(false);
          setVideoBlurred(false);
          setStage(STAGES.INTRO);
          lastScrollTime.current = now;
        } else if (stage === STAGES.MENU && deltaY > 0) {
          setStage(STAGES.ABOUT);
          lastScrollTime.current = now;
        } else if (stage === STAGES.ABOUT && deltaY < 0) {
          if (aboutContainer && aboutContainer.scrollTop === 0) {
            setStage(STAGES.MENU);
            lastScrollTime.current = now;
          }
        }
      }
    };
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [stage]);

  const letterVariants: any = {
    hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
    visible: (i: number) => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: i * 0.05, duration: 0.8 } })
  };
  const langs: Lang[] = ['cs', 'en', 'de'];

  const desktopColumns = [
    { color: '#e5d3b3', categories: ['kosmeticke-ocetreni'] },
    { color: '#d4c5b0', categories: ['phi-ion-microneedling'] },
    { color: '#c4a77d', categories: ['radiofrekvencni', 'chemicky-peeling', 'carbon-peel'] },
    { color: '#e5d3b3', categories: ['pmu-laser-removal', 'permanentni-make-up'] },
    { color: '#f8f5f2', categories: ['lash-lifting', 'skoleni'] }
  ].filter(col => SERVICES.some(s => col.categories.includes(s.category)));

  return (
    <div className="w-screen h-screen bg-[#0a0a0a] text-[#f8f5f2] overflow-hidden relative selection:bg-[#e5d3b3] selection:text-black">
      {lightboxImage && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center cursor-pointer" onClick={closeLightbox}>
          <img src={lightboxImage} alt="Lightbox" className="max-w-[90vw] max-h-[90vh] object-contain" />
          <button className="absolute top-4 right-4 text-white text-4xl">&times;</button>
        </div>
      )}

      {videoTransition && (
        <div className="fixed inset-0 z-[100]" style={{ filter: videoBlurred ? 'blur(8px)' : 'none', transition: 'filter 0.8s ease-out', opacity: videoBlurred ? 0.7 : 1, transition: 'opacity 0.8s ease-out' }}>
          <video ref={(el) => { if (el && !el.dataset.played) { el.dataset.played = '1'; el.play().catch(() => {}); } }} autoPlay muted playsInline onEnded={(e) => { e.target.pause(); setVideoBlurred(true); setTimeout(() => { setVideoTransition(false); setStage(STAGES.MENU); }, 800); }} className="w-full h-full object-cover">
            <source src="https://res.cloudinary.com/dfh97tdty/video/upload/v1783497995/0708_2_crpiub.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {stage === STAGES.INTRO && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ThreeScene stage={stage} activeService={activeService} isTransitioning={isTransitioning} onServiceClick={handleServiceClick} />
        </div>
      )}



      {bgVideoUrl && stage === STAGES.SERVICE_DETAIL && (
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" style={{ transform: 'scale(1.15)' }}>
          <video ref={bgVideoRef} src={bgVideoUrl} muted playsInline className="w-full h-full object-cover" style={{ filter: 'blur(20px)' }} />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      )}

      <AnimatePresence>
        {showTransition && transitionUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-[20] pointer-events-none">
            <TransitionVideo url={transitionUrl} onEnded={showCard} bgVideoRef={bgVideoRef} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <header className="absolute top-0 left-0 w-full px-6 py-5 md:px-8 md:py-8 flex justify-between items-center z-50 mix-blend-difference">
          <div className="font-monument text-[10px] md:text-xs tracking-[0.2em]">KBK STUDIO</div>
          <div className="flex items-center gap-3 md:gap-4 pointer-events-auto">
            {stage === STAGES.MENU && (
              <button onClick={() => setStage(STAGES.ABOUT)} className="lg:hidden font-monument text-[9px] tracking-widest text-white/60 hover:text-[#e5d3b3] transition-colors uppercase">{t.aboutLabel}</button>
            )}
            <div className="flex items-center gap-1">
              {langs.map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`font-monument text-[9px] md:text-[10px] tracking-wider px-2 py-1 rounded-full transition-all ${lang === l ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="font-montreal text-[10px] md:text-xs uppercase tracking-widest">Brno</div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {stage === STAGES.INTRO && (
            <motion.div key="intro" className="absolute inset-0 flex flex-col items-center justify-center px-4" style={{ opacity: heroFading ? 0 : 1, transition: 'opacity 0.5s ease-out' }}>
              <div className="overflow-hidden flex flex-wrap justify-center">
                {'KBK STUDIO'.split('').map((char, i) => (
                  <motion.span key={i} custom={i} variants={letterVariants} initial="hidden" animate="visible"
                    className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-editorial leading-none tracking-tighter">{char}</motion.span>
                ))}
              </div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}
                className="font-montreal text-[11px] md:text-sm text-[#a3a3a3] tracking-widest uppercase mt-4 text-center">{t.tagline}</motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 2 }} className="absolute bottom-8 md:bottom-12 flex flex-col items-center">
                <span className="font-montreal text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#a3a3a3] mb-3 md:mb-4">{t.scrollToEnter}</span>
                <div className="w-[1px] h-10 md:h-12 bg-white/20 overflow-hidden relative">
                  <motion.div animate={{ y: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="absolute inset-0 bg-white" />
                </div>
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
                  onClick={() => { setHeroFading(true); setTimeout(() => setVideoTransition(true), 500); }}
                  className="mt-6 px-6 py-3 border border-white/30 rounded-full font-montreal text-[10px] md:text-xs uppercase tracking-widest text-white/80 hover:bg-white/10 hover:border-white/50 transition-all pointer-events-auto">
                  {t.scrollToServices || 'Služby ↓'}
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {stage === STAGES.MENU && !isTransitioning && !showTransition && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="absolute inset-0 pointer-events-auto z-[5]">
              <div className="w-full h-full flex flex-col" style={{ touchAction: 'pan-y' }}>
                <div className="flex-1 px-4 md:px-8 pt-[100px] md:pt-[130px] pb-20 overflow-hidden">
                  <div className="text-center mb-4 md:mb-7">
                    <div className="font-monument text-[10px] md:text-[11px] tracking-[0.3em] text-[#e5d3b3] uppercase mb-2">Kategorie</div>
                    <h2 className="font-editorial text-2xl md:text-4xl">{t.servicesTitle || 'Služby'}</h2>
                  </div>
                  {/* 9 categories: 3 rows x 3 cols */}
                  <div className="grid grid-cols-3 gap-y-10 md:gap-y-14 w-full max-w-4xl mx-auto">
                    {SERVICE_CATEGORIES.filter(cat => SERVICES.some(s => s.category === cat.id)).map((cat, i) => (
                      <motion.div key={cat.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }}
                        className="flex justify-center">
                        <MenuButton service={{ id: cat.id, title: cat.title, shortTitle: cat.title, subtitle: `${SERVICES.filter(s => s.category === cat.id).length} služeb`, desc: '', benefits: [], process: [], price: '', time: '', durationMinutes: 0, category: cat.id, video: '', transition: '', position: [0,0,0], color: '#e5d3b3' }}
                          translatedTitle={cat.title}
                          translatedSubtitle={`${SERVICES.filter(s => s.category === cat.id).length} služeb`}
                          onClick={() => { setActiveCategory(cat); setStage(STAGES.MENU); }}
                          enterLabel={t.enterModule} />
                      </motion.div>
                    ))}
                   </div>
                </div>
                <div className="shrink-0 mt-4">
                  <ContactsBar t={t} />
                </div>
              </div>
            </motion.div>
          )}

          {stage === STAGES.ABOUT && (
            <motion.div key="about" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-0 pointer-events-auto overflow-y-auto flex flex-col px-6 py-20">
              <button onClick={() => setStage(STAGES.MENU)}
                className="fixed top-16 md:top-20 left-4 md:left-8 font-monument text-[10px] md:text-xs tracking-widest hover:text-[#e5d3b3] transition-colors z-50 flex items-center gap-3 group bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm">
                <span className="w-4 h-[1px] bg-white group-hover:bg-[#e5d3b3] transition-colors" />{t.back}
              </button>
              <div id="about-scroll-container" className="max-w-5xl w-full mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
                  <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                    className="flex justify-center cursor-pointer" onClick={() => setLightboxImage(t.aboutPhoto)}>
                    <img src={t.aboutPhoto} alt="Beata Kučerová" className="w-full max-w-md object-cover rounded-3xl shadow-2xl transition-transform hover:scale-105" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}>
                    <div className="font-monument text-[9px] tracking-[0.3em] text-[#e5d3b3] mb-4 uppercase">{t.aboutLabel}</div>
                    <h2 className="font-editorial text-4xl md:text-5xl mb-2 leading-tight">{t.ownerName}</h2>
                    <div className="font-montreal text-xs text-[#a3a3a3] tracking-widest mb-6">{t.aboutFounder}</div>
                    <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
                      <p className="font-montreal text-sm text-[#a3a3a3] leading-relaxed">{t.aboutBio}</p>
                      <p className="font-montreal text-sm leading-relaxed" style={{ color: '#e5d3b3' }}>{t.aboutMotto}</p>
                      <div className="font-monument text-[9px] tracking-widest text-[#a3a3a3] mt-2">{t.aboutServices}</div>
                    </div>
                  </motion.div>
                </div>
                <Testimonials testimonials={t.testimonialsList} title={t.testimonialsTitle} />
                <HelixGallery />
              </div>
            </motion.div>
          )}

          {/* Category Services View */}
          {activeCategory && stage === STAGES.MENU && !isTransitioning && !showTransition && (
            <motion.div key="category-services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 pointer-events-auto z-[6] bg-[#0a0a0a]">
              <div className="w-full h-full overflow-y-auto flex flex-col" style={{ touchAction: 'pan-y' }}>
                <div className="flex-1 px-4 md:px-8 pt-4 md:pt-[60px] pb-20 overflow-y-auto">
                  <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setActiveCategory(null)} className="font-monument text-[10px] tracking-widest hover:text-[#e5d3b3] transition-colors flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-white group-hover:bg-[#e5d3b3] transition-colors" />Zpět
                    </button>
                    <h2 className="font-editorial text-xl md:text-2xl">{activeCategory.title}</h2>
                  </div>
                  <div className="space-y-3">
                    {SERVICES.filter(s => s.category === activeCategory.id).map((srv, i) => (
                      <motion.div key={srv.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="glass-panel rounded-xl p-4 cursor-pointer hover:border-[#e5d3b3] transition-all"
                        onClick={() => handleServiceClick(srv)}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-editorial text-lg md:text-xl mb-1">{srv.title}</h3>
                            <p className="font-montreal text-xs text-[#a3a3a3] mb-2 line-clamp-2">{srv.desc}</p>
                            <div className="flex gap-4 text-xs">
                              <span className="text-[#e5d3b3]">{srv.price}</span>
                              <span className="text-[#a3a3a3]">{srv.time}</span>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-[#e5d3b3] text-black font-monument text-[9px] tracking-widest rounded-lg shrink-0 ml-4">
                            Rezervovat
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 mt-4">
                  <ContactsBar t={t} />
                </div>
              </div>
            </motion.div>
          )}

          {stage === STAGES.SERVICE_DETAIL && activeService && !isTransitioning && (
            <ServiceDetail key="detail" activeService={activeService} onBack={handleBack} lang={lang} t={t} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TransitionVideo({ url, onEnded, bgVideoRef }: { url: string; onEnded: () => void; bgVideoRef: React.RefObject<HTMLVideoElement | null>; }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (bgVideoRef.current) { bgVideoRef.current.currentTime = 0; bgVideoRef.current.play().catch(() => {}); }
    video.play().catch(() => onEnded());
  }, [onEnded, bgVideoRef]);
  const handleTimeUpdate = () => { if (ref.current && bgVideoRef.current) bgVideoRef.current.currentTime = ref.current.currentTime; };
  return <video ref={ref} src={url} muted playsInline onEnded={onEnded} onTimeUpdate={handleTimeUpdate} className="w-full h-full object-cover" />;
}
