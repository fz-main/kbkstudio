import { useState, useRef } from 'react';
import type { Translations } from '../lib/i18n';

const galleryItems = [
  { id: 1, src: 'https://static.wixstatic.com/media/6e5a68_58ff6be540194d249d9df44ad99c2e83~mv2.jpg/v1/fill/w_858,h_566,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DSC01966_JPG.jpg', alt: 'Interior 1' },
  { id: 2, src: 'https://res.cloudinary.com/dfh97tdty/image/upload/v1781347513/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-06-13_134240_irljmw.png', alt: 'Work 1' },
  { id: 3, src: 'https://res.cloudinary.com/dfh97tdty/image/upload/v1781347513/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-06-13_133957_fz8rga.png', alt: 'Work 2' },
  { id: 4, src: 'https://res.cloudinary.com/dfh97tdty/image/upload/v1781347513/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-06-13_134309_mm1ct8.png', alt: 'Work 3' },
  { id: 5, src: 'https://res.cloudinary.com/dfh97tdty/image/upload/v1781347513/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-06-13_134328_mndg3p.png', alt: 'Work 4' },
  { id: 6, src: 'https://res.cloudinary.com/dfh97tdty/image/upload/v1781347513/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-06-13_134224_efesrr.png', alt: 'Work 5' },
  { id: 7, src: 'https://res.cloudinary.com/dfh97tdty/image/upload/v1781347513/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-06-13_134202_lbbgme.png', alt: 'Work 6' },
];

interface HelixGalleryProps {
  t: Translations;
}

export default function HelixGallery({ t }: HelixGalleryProps) {
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
        <div className="font-monument text-[9px] tracking-[0.3em] text-[#e5d3b3] uppercase">{t.galleryTitle}</div>
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
