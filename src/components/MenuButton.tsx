import { motion } from 'framer-motion';
import type { Service } from '../data/services';

interface MenuButtonProps {
  service: Service;
  translatedTitle?: string;
  translatedSubtitle?: string;
  onClick: () => void;
  enterLabel?: string;
}

export default function MenuButton({ service, translatedTitle, translatedSubtitle, onClick, enterLabel = '[ ENTER ]' }: MenuButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative flex flex-col items-center pointer-events-auto"
      whileHover="hover"
      style={{ flex: '0 0 auto', minWidth: '100px', maxWidth: '200px' }}
    >
      <motion.div
        variants={{ hover: { scale: 1.05, color: '#e5d3b3', transition: { duration: 0.3 } } }}
        className="font-editorial text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-center text-white drop-shadow-2xl leading-tight"
      >
        {translatedTitle || service.title}
      </motion.div>
      <motion.div
        variants={{ hover: { opacity: 1, y: 0, transition: { delay: 0.1 } } }}
        initial={{ opacity: 0, y: 10 }}
        className="font-montreal text-[8px] md:text-[9px] text-white/50 text-center mt-0.5 max-w-[140px] leading-tight"
      >
        {translatedSubtitle || service.subtitle}
      </motion.div>
      <motion.div
        variants={{ hover: { opacity: 1, y: 0, transition: { delay: 0.15 } } }}
        initial={{ opacity: 0, y: 10 }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 font-monument text-[5px] md:text-[6px] tracking-[0.2em] whitespace-nowrap text-[#e5d3b3]"
      >
        {enterLabel}
      </motion.div>
    </motion.button>
  );
}
