import { motion } from 'framer-motion';
import type { Service } from '../data/services';

interface MenuButtonProps {
  service: Service;
  onClick: () => void;
  enterLabel?: string;
}

export default function MenuButton({ service, onClick, enterLabel = '[ ENTER ]' }: MenuButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative flex flex-col items-center pointer-events-auto"
      whileHover="hover"
    >
      <motion.div
        variants={{ hover: { scale: 1.1, color: '#e5d3b3', transition: { duration: 0.3 } } }}
        className="font-editorial text-4xl md:text-6xl lg:text-7xl italic whitespace-nowrap text-white drop-shadow-2xl"
      >
        {service.title}
      </motion.div>
      <motion.div
        variants={{ hover: { opacity: 1, y: 0, transition: { delay: 0.1 } } }}
        initial={{ opacity: 0, y: 10 }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-monument text-[9px] tracking-[0.2em] whitespace-nowrap text-[#e5d3b3]"
      >
        {enterLabel}
      </motion.div>
    </motion.button>
  );
}
