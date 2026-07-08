import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGES, SERVICES } from './data/services';
import type { Service } from './data/services';
import { translations } from './lib/i18n';
import type { Lang } from './lib/i18n';
import ThreeScene from './components/ThreeScene';
import ServiceDetail from './components/ServiceDetail';
import MenuButton from './components/MenuButton';
import Testimonials from './components/Testimonials';
import HelixGallery from './components/HelixGallery';

export default function Home() {
  return (
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

  const showCard = useCallback(() => {
    setShowTransition(false);
    if (bgVideoRef.current) { bgVideoRef.current.currentTime = bgVideoRef.current.duration || 99999; bgVideoRef.current.pause(); }
    setStage(STAGES.SERVICE_DETAIL);
  }, []);

  const handleServiceClick = (service: Service) => {
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
        setStage(STAGES.MENU);
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
          setStage(STAGES.MENU);
          lastScrollTime.current = now;
        } else if (stage === STAGES.MENU && deltaY < 0) {
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

  return (
    <div className="w-screen h-screen bg-[#0a0a0a] text-[#f8f5f2] overflow-hidden relative selection:bg-[#e5d3b3] selection:text-black">
      {lightboxImage && <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center cursor-pointer" onClick={closeLightbox}><img src={lightboxImage} alt="Lightbox" className="max-w-[90vw] max-h-[90vh] object-contain" /><button className="absolute top-4 right-4 text-white text-4xl">&times;</button></div>}
      <div className="absolute inset-0 z-0 pointer-events-none"><ThreeScene stage={stage} activeService={activeService} isTransitioning={isTransitioning} onServiceClick={handleServiceClick} /></div>
      {(stage === STAGES.MENU || stage === STAGES.SERVICE_DETAIL) && (<div className="absolute inset-0 z-[1] pointer-events-none" style={{ opacity: stage === STAGES.MENU && !showTransition ? 1 : 0, transition: 'opacity 2s ease' }}><video autoPlay muted loop playsInline className="w-full h-full object-cover object-top"><source src="https://res.cloudinary.com/dfh97tdty/video/upload/v1781625683/-138173675065827356_cj8yud.mov" type="video/mp4" /></video><div className="absolute inset-0 bg-black/75" /></div>)}
      {bgVideoUrl && stage === STAGES.SERVICE_DETAIL && (<div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" style={{ transform: 'scale(1.15)' }}><video ref={bgVideoRef} src={bgVideoUrl} muted playsInline className="w-full h-full object-cover" style={{ filter: 'blur(20px)' }} /><div className="absolute inset-0 bg-black/70" /></div>)}
      <AnimatePresence>{showTransition && transitionUrl && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-[20] pointer-events-none"><TransitionVideo url={transitionUrl} onEnded={showCard} bgVideoRef={bgVideoRef} /></motion.div>)}</AnimatePresence>
      <div className="absolute inset-0 z-10 pointer-events-none">
        <header className="absolute top-0 left-0 w-full px-6 py-5 md:px-8 md:py-8 flex justify-between items-center z-50 mix-blend-difference"><div className="font-monument text-[10px] md:text-xs tracking-[0.2em]">BIBEN GLOW</div><div className="flex items-center gap-3 md:gap-4 pointer-events-auto">{stage === STAGES.MENU && (<button onClick={() => setStage(STAGES.ABOUT)} className="lg:hidden font-monument text-[9px] tracking-widest text-white/60 hover:text-[#e5d3b3] transition-colors uppercase">{t.aboutLabel}</button>)}<div className="flex items-center gap-1">{langs.map((l) => (<button key={l} onClick={() => setLang(l)} className={`font-monument text-[9px] md:text-[10px] tracking-wider px-2 py-1 rounded-full transition-all ${lang === l ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>{l.toUpperCase()}</button>))}</div><div className="font-montreal text-[10px] md:text-xs uppercase tracking-widest">Prague</div></div></header>
        <AnimatePresence mode="wait">
          {stage === STAGES.INTRO && (<motion.div key="intro" exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 1.5, ease: 'easeInOut' }} className="absolute inset-0 flex flex-col items-center justify-center px-4"><div className="overflow-hidden flex flex-wrap justify-center">{'BIBEN GLOW'.split('').map((char, i) => (<motion.span key={i} custom={i} variants={letterVariants} initial="hidden" animate="visible" className="text-[16vw] sm:text-[14vw] md:text-[12vw] font-editorial leading-none tracking-tighter">{char}</motion.span>))}</div><motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }} className="font-montreal text-[11px] md:text-sm text-[#a3a3a3] tracking-widest uppercase mt-4 text-center">{t.tagline}</motion.p><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 2 }} className="absolute bottom-8 md:bottom-12 flex flex-col items-center"><span className="font-montreal text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#a3a3a3] mb-3 md:mb-4">{t.scrollToEnter}</span><div className="w-[1px] h-10 md:h-12 bg-white/20 overflow-hidden relative"><motion.div animate={{ y: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="absolute inset-0 bg-white" /></div></motion.div></motion.div>)}
          {stage === STAGES.MENU && !isTransitioning && !showTransition && (<motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 pointer-events-auto"><div className="flex lg:hidden flex-col h-full"><div className="flex flex-col items-center justify-center flex-1 gap-5 px-8 pt-16 pb-4 overflow-y-auto">{SERVICES.map((srv) => (<MenuButton key={srv.id} service={{ ...srv, title: t.services[srv.id as keyof typeof t.services]?.title || srv.title }} onClick={() => handleServiceClick(srv)} enterLabel={t.enterModule} />))}</div><div className="flex flex-col items-center gap-1 text-center px-6 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}><div className="font-monument text-[8px] tracking-[0.25em] text-[#e5d3b3] uppercase mb-1">Kontakty</div><div className="font-montreal text-[10px] text-white/70">Týnská ulička 1063/4, Staré Město, 110 00 Praha 1</div><div className="font-montreal text-[10px] text-white/70 flex flex-wrap justify-center gap-x-2"><a href="tel:+420727909001" className="hover:text-[#e5d3b3] transition-colors">+420 727 909 001</a><span className="text-white/30">·</span><a href="mailto:info@bibenglow.cz" className="hover:text-[#e5d3b3] transition-colors">info@bibenglow.cz</a></div><div className="flex items-center gap-4 mt-1"><a href="https://www.facebook.com/61586939082286/videos/" target="_blank" rel="noopener noreferrer" className="font-monument text-[9px] tracking-widest text-white/50 hover:text-[#e5d3b3] transition-colors uppercase">Facebook</a><span className="text-white/20">·</span><a href="#" target="_blank" rel="noopener noreferrer" className="font-monument text-[9px] tracking-widest text-white/50 hover:text-[#e5d3b3] transition-colors uppercase">Instagram</a></div></div></div><div className="hidden lg:block w-full h-full">{[{ srv: SERVICES[0], pos: 'absolute top-[15%] left-[8%]' },{ srv: SERVICES[1], pos: 'absolute top-[15%] right-[8%]' },{ srv: SERVICES[2], pos: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' },{ srv: SERVICES[3], pos: 'absolute bottom-[15%] left-[8%]' },{ srv: SERVICES[4], pos: 'absolute bottom-[15%] right-[8%]' },{ srv: SERVICES[5], pos: 'absolute bottom-[4%] left-1/2 -translate-x-1/2' }].map(({ srv, pos }) => (<div key={srv.id} className={pos}><MenuButton service={{ ...srv, title: t.services[srv.id as keyof typeof t.services]?.title || srv.title }} onClick={() => handleServiceClick(srv)} enterLabel={t.enterModule} /></div>))}</div></motion.div>)}
          {stage === STAGES.ABOUT && (<motion.div key="about" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} transition={{ duration: 1, ease: 'easeOut' }} className="absolute inset-0 pointer-events-auto overflow-y-auto flex flex-col px-6 py-20"><button onClick={() => setStage(STAGES.MENU)} className="fixed top-16 md:top-20 left-4 md:left-8 font-monument text-[10px] md:text-xs tracking-widest hover:text-[#e5d3b3] transition-colors z-50 flex items-center gap-3 group bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm"><span className="w-4 h-[1px] bg-white group-hover:bg-[#e5d3b3] transition-colors" />{t.back}</button><div id="about-scroll-container" className="max-w-5xl w-full mx-auto"><div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start"><motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }} className="flex justify-center cursor-pointer" onClick={() => setLightboxImage("https://static.wixstatic.com/media/6e5a68_58ff6be540194d249d9df44ad99c2e83~mv2.jpg/v1/fill/w_858,h_566,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DSC01966_JPG.jpg")}><img src="https://static.wixstatic.com/media/6e5a68_58ff6be540194d249d9df44ad99c2e83~mv2.jpg/v1/fill/w_858,h_566,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DSC01966_JPG.jpg" alt="Biben Glow interior" className="w-full max-w-md object-cover rounded-3xl shadow-2xl transition-transform hover:scale-105" /></motion.div><motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}><div className="font-monument text-[9px] tracking-[0.3em] text-[#e5d3b3] mb-4 uppercase">{t.aboutLabel}</div><h2 className="font-editorial text-4xl md:text-5xl mb-2 leading-tight">{t.ownerName}</h2><div className="font-montreal text-xs text-[#a3a3a3] tracking-widest mb-6">{t.aboutFounder}</div><div className="border-t border-white/10 pt-6 flex flex-col gap-4"><p className="font-montreal text-sm text-[#a3a3a3] leading-relaxed">{t.aboutBio}</p><p className="font-montreal text-sm leading-relaxed" style={{ color: '#e5d3b3' }}>{t.aboutMotto}</p><div className="font-monument text-[9px] tracking-widest text-[#a3a3a3] mt-2">{t.aboutServices}</div></div></motion.div></div><Testimonials lang={lang} t={t} /><HelixGallery t={t} /><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }} className="w-full mt-10 pointer-events-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}><div className="px-6 md:px-12 py-5 flex flex-col items-center gap-1 text-center"><div className="font-monument text-[9px] tracking-[0.25em] text-[#e5d3b3] uppercase mb-1">Kontakty</div><div className="font-montreal text-xs text-white/80">Týnská ulička 1063/4, Staré Město, 110 00 Praha 1</div><div className="font-montreal text-xs text-white/80 flex flex-wrap justify-center gap-x-2"><a href="tel:+420727909001" className="hover:text-[#e5d3b3] transition-colors">+420 727 909 001</a><span className="text-white/30">·</span><a href="mailto:info@bibenglow.cz" className="hover:text-[#e5d3b3] transition-colors">info@bibenglow.cz</a></div><div className="flex items-center gap-5 mt-1"><a href="https://www.facebook.com/61586939082286/videos/" target="_blank" rel="noopener noreferrer" className="font-monument text-[9px] tracking-widest text-white/60 hover:text-[#e5d3b3] transition-colors uppercase">Facebook</a><span className="text-white/20">·</span><a href="#" target="_blank" rel="noopener noreferrer" className="font-monument text-[9px] tracking-widest text-white/60 hover:text-[#e5d3b3] transition-colors uppercase">Instagram</a></div></div></motion.div></div></motion.div>)}
          {stage === STAGES.SERVICE_DETAIL && activeService && !isTransitioning && (<ServiceDetail key="detail" activeService={activeService} onBack={handleBack} lang={lang} t={t} />)}
        </AnimatePresence>
      </div>
    </div>
  );
}
function TransitionVideo({ url, onEnded, bgVideoRef }: { url: string; onEnded: () => void; bgVideoRef: React.RefObject<HTMLVideoElement | null>; }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { const video = ref.current; if (!video) return; if (bgVideoRef.current) { bgVideoRef.current.currentTime = 0; bgVideoRef.current.play().catch(() => {}); } video.play().catch(() => onEnded()); }, [onEnded, bgVideoRef]);
  const handleTimeUpdate = () => { if (ref.current && bgVideoRef.current) bgVideoRef.current.currentTime = ref.current.currentTime; };
  return <video ref={ref} src={url} muted playsInline onEnded={onEnded} onTimeUpdate={handleTimeUpdate} className="w-full h-full object-cover" />;
}
