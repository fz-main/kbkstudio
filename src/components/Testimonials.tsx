import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lang, Translations } from '../lib/i18n';

const desktopAvatarStyles = [
  { margin: '0 40px 20px 0', order: 1 },
  { margin: '20px 30px 10px 50px', order: 2 },
  { margin: '0 20px 30px 40px', order: 3 },
  { margin: '15px 50px 5px 20px', order: 4 },
  { margin: '10px 20px 25px 30px', order: 5 },
];

const mobilePositions = [
  { margin: '0 15px 20px 0' }, { margin: '10px 5px 15px 25px' }, { margin: '5px 20px 10px 5px' }, { margin: '15px 5px 25px 10px' }, { margin: '0 10px 5px 20px' },
];

interface TestimonialsProps {
  lang: Lang;
  t: Translations;
}

export default function Testimonials({ t }: TestimonialsProps) {
  const testimonialsData = t.testimonialsList;
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeItem = testimonialsData[activeIndex];
  const total = testimonialsData.length;

  const handleAvatarClick = (idx: number) => {
    if (idx === activeIndex) return;
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  };

  const next = () => {
    const newIdx = (activeIndex + 1) % total;
    setDirection(1);
    setActiveIndex(newIdx);
  };

  const prev = () => {
    const newIdx = (activeIndex - 1 + total) % total;
    setDirection(-1);
    setActiveIndex(newIdx);
  };

  const floatingVariants = (index: number) => ({
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, delay: index * 0.1 },
    },
    hover: { scale: 1.05 },
  });

  return (
    <div className="relative w-full mt-20 mb-16" style={{ minHeight: '550px' }}>
      <div className="text-center mb-4">
        <div className="font-monument text-[9px] tracking-[0.3em] text-[#e5d3b3] uppercase">{t.testimonialsTitle}</div>
        <div className="font-editorial text-2xl md:text-3xl text-white mt-1">Real stories, real results</div>
      </div>

      {!isMobile && (
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8 max-w-3xl mx-auto">
          {testimonialsData.map((item, idx) => {
            const isActive = idx === activeIndex;
            const size = isActive ? 'w-[90px] h-[90px]' : 'w-[60px] h-[60px]';
            const style = desktopAvatarStyles[idx % desktopAvatarStyles.length];
            return (
              <motion.div
                key={idx}
                className="cursor-pointer"
                style={{ margin: style.margin }}
                variants={floatingVariants(idx)}
                initial="initial"
                animate="animate"
                whileHover="hover"
                onClick={() => handleAvatarClick(idx)}
              >
                <div className={`${size} rounded-full overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-[#e5d3b3] shadow-[0_0_20px_rgba(229,211,179,0.8)]' : 'border-white/30 hover:border-white/60'}`}>
                  <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="relative z-10 w-full max-w-md mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: direction * 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction * -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="font-montreal text-white/80 text-base leading-relaxed mb-6">{activeItem.text}</p>
            <div className="font-editorial text-xl text-white">{activeItem.name}</div>
            <div className="font-monument text-[10px] text-[#e5d3b3] tracking-wider mt-1">{activeItem.role}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center mt-8 z-10 relative">
        <div className="flex gap-6">
          <button onClick={prev} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white text-xl backdrop-blur-sm">←</button>
          <button onClick={next} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white text-xl backdrop-blur-sm">→</button>
        </div>
        <div className="flex gap-2 mt-4">
          {testimonialsData.map((_, idx) => (
            <button key={idx} onClick={() => handleAvatarClick(idx)} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-5 bg-[#e5d3b3]' : 'bg-white/40 hover:bg-white/80'}`} />
          ))}
        </div>
      </div>

      {isMobile && (
        <div className="relative z-20 mt-10 flex flex-wrap justify-center items-start">
          {testimonialsData.map((item, idx) => {
            const isActive = idx === activeIndex;
            const size = isActive ? 'w-[70px] h-[70px]' : 'w-[55px] h-[55px]';
            return (
              <motion.div
                key={idx}
                className="cursor-pointer"
                style={mobilePositions[idx]}
                variants={floatingVariants(idx)}
                initial="initial"
                animate="animate"
                whileHover="hover"
                onClick={() => handleAvatarClick(idx)}
              >
                <div className={`${size} rounded-full overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-[#e5d3b3] shadow-[0_0_15px_rgba(229,211,179,0.6)]' : 'border-white/30'}`}>
                  <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center text-[10px] text-white/60 mt-1">{item.name.split(' ')[0]}</div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
