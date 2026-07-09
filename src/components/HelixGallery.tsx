import { useState, useRef } from 'react';
import type { Translations } from '../lib/i18n';

const galleryItems = [
  { id: 1, src: 'https://www.kbkstudio.cz/wp-content/uploads/2023/03/01_salon_A-scaled.jpg', alt: 'Studio KBK' },
  { id: 2, src: 'https://www.kbkstudio.cz/wp-content/uploads/2023/03/01_salon_C-2048x1366.jpg', alt: 'Studio interiér' },
  { id: 3, src: 'https://www.kbkstudio.cz/wp-content/uploads/2022/08/makeup.jpg', alt: 'Permanentní make-up' },
  { id: 4, src: 'https://www.kbkstudio.cz/wp-content/uploads/2023/10/PMU-rty--1149x1536.jpeg', alt: 'PMU rty' },
  { id: 5, src: 'https://www.kbkstudio.cz/wp-content/uploads/2023/10/Lash-lifting-Laminace-1-2048x1813.jpeg', alt: 'Lash lifting' },
  { id: 6, src: 'https://www.kbkstudio.cz/wp-content/uploads/2022/02/radiofrkvence.jpeg', alt: 'Radiofrekvence' },
  { id: 7, src: 'https://www.kbkstudio.cz/wp-content/uploads/2023/10/Larens-Profesional.jpeg', alt: 'Larens Professional' },
  { id: 8, src: 'https://www.kbkstudio.cz/wp-content/uploads/2025/05/462849486_18275678536246136_6638648624377151157_n.jpg', alt: 'KBK Studio tým' },
];

interface HelixGalleryProps {
  title?: string;
}

export default function HelixGallery({ title }: HelixGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = galleryItems.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const isSwiping = useRef(false);

  const goToNext = () => {
    if (activeIndex < total - 1) setActiveIndex(activeIndex + 1);
  };

  const goToPrev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) goToNext();
    else if (e.deltaY < 0) goToPrev();
  };

  const getCardStyle = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) return { transform: 'translateX(0) translateZ(200px) rotateY(0deg)', opacity: 1, filter: 'blur(0px)', zIndex: 5 };
    if (diff === 1 || diff === -total + 1) return { transform: 'translateX(140px) translateZ(50px) rotateY(-30deg)', opacity: 0.6, filter: 'blur(3px)', zIndex: 4 };
    if (diff === -1 || diff === total - 1) return { transform: 'translateX(-140px) translateZ(50px) rotateY(30deg)', opacity: 0.6, filter: 'blur(3px)', zIndex: 4 };
    return { transform: 'translateX(0) translateZ(-200px) rotateY(180deg)', opacity: 0, filter: 'blur(10px)', zIndex: 1 };
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 30) {
      if (deltaX > 0) {
        goToPrev();
      } else {
        goToNext();
      }
      isSwiping.current = false;
    }
  };

  const onTouchEnd = () => {
    isSwiping.current = false;
  };

  return (
    <div style={{ width: '100%', minHeight: '500px', padding: '40px 0', marginBottom: '20px' }}>
      <div className="text-center mb-6">
        <div className="font-monument text-[9px] tracking-[0.3em] text-[#e5d3b3] uppercase">{title || 'Galerie'}</div>
      </div>
      <div
        ref={containerRef}
        style={{ position: 'relative', width: '100%', height: '400px', perspective: '1000px', touchAction: 'none' }}
        onWheel={handleWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {galleryItems.map((item, idx) => (
          <div key={item.id} style={{ position: 'absolute', width: '240px', height: '340px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', transition: 'transform 0.6s, filter 0.6s, opacity 0.6s', left: 'calc(50% - 120px)', top: 'calc(50% - 170px)', ...getCardStyle(idx) }}>
            <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <button
          onClick={goToPrev}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          ←
        </button>
        <button
          onClick={goToNext}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          →
        </button>
      </div>
    </div>
  );
}
