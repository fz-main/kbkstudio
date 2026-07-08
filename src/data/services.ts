export const STAGES = { INTRO: 0, MENU: 1, SERVICE_DETAIL: 2, ABOUT: 3 };

export interface Service {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  desc: string;
  benefits: string[];
  process: string[];
  price: string;
  time: string;
  durationMinutes: number;
  category: string;
  video: string;
  transition: string;
  position: [number, number, number];
  color: string;
  bookingUrl?: string;
}

export const SERVICE_CATEGORIES = [
  { id: 'kosmeticke-ocetreni', title: 'Kosmetické ošetření pleti' },
  { id: 'phi-ion-microneedling', title: 'Phi-Ion & Microneedling' },
  { id: 'radiofrekvencni', title: 'Radiofrekvenční ošetření pleti' },
  { id: 'chemicky-peeling', title: 'Chemický peeling' },
  { id: 'carbon-peel', title: 'Carbon Peel' },
  { id: 'pmu-laser-removal', title: 'Odstranění PMU LASER/REMOVAL' },
  { id: 'permanentni-make-up', title: 'Permanentní make-up' },
  { id: 'lash-lifting', title: 'Lash Lifting & Laminace' },
  { id: 'skoleni', title: 'Školení' }
];

export const SERVICES: Service[] = [
  // Kosmetické ošetření pleti
  {
    id: 'kosmeticke-ocetreni',
    title: 'Kosmetické ošetření pleti',
    shortTitle: 'Ošetření pleti',
    subtitle: 'Profesionální péče',
    desc: 'Komplexní kosmetické ošetření zaměřené na hloubkovou regeneraci a rozjasnění pleti. Individuální přístup ke každému typu pleti.',
    benefits: ['Hloubková hydratace', 'Sjednocení tónu pleti', 'Anti-aging efekt', 'Relaxace'],
    process: ['Diagnostika pleti', 'Čištění a tonizace', 'Speciální sérum', 'Masáž', 'Maska', 'Závěrečná péče'],
    price: 'od 1 500 Kč',
    time: '60 min',
    durationMinutes: 60,
    category: 'kosmeticke-ocetreni',
    video: '',
    transition: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1783497995/0708_2_crpiub.mp4',
    position: [-10, 0, -10],
    color: '#e5d3b3',
    bookingUrl: 'https://www.kbkstudio.cz'
  },

  // Phi-Ion & Microneedling
  {
    id: 'phi-ion-microneedling',
    title: 'Phi-Ion & Microneedling',
    shortTitle: 'Phi-Ion',
    subtitle: 'Pokročilé omlazení',
    desc: 'Kombinace Phi-Ion technologie a mikrojehličkování pro maximální omlazení pleti. Stimulace kolagenu a elastinu.',
    benefits: ['Omlazení pleti', 'Stimulace kolagenu', 'Zlepšení textury', 'Trvalé výsledky'],
    process: ['Příprava pleti', 'Aplikace Phi-Ion / Microneedling', 'Séra a boostery', 'Zklidňující maska', 'Ochranný faktor'],
    price: 'od 2 500 Kč',
    time: '75 min',
    durationMinutes: 75,
    category: 'phi-ion-microneedling',
    video: '',
    transition: '',
    position: [-10, 0, 10],
    color: '#d4c5b0',
    bookingUrl: 'https://www.kbkstudio.cz'
  },

  // Radiofrekvenční ošetření pleti
  {
    id: 'radiofrekvencni',
    title: 'Radiofrekvenční ošetření',
    shortTitle: 'Radiofrekvence',
    subtitle: 'Zpevnění a lifting',
    desc: 'Neinvazivní radiofrekvenční ošetření pro zpevnění, vypnutí a omlazení pleti. Bezbolestné a účinné.',
    benefits: ['Zpevnění pleti', 'Liftingový efekt', 'Stimulace kolagenu', 'Bezbolestné'],
    process: ['Vyčištění pleti', 'Aplikace vodivého gelu', 'RF ošetření', 'Sérum a hydratace', 'Ochranný faktor'],
    price: 'od 1 800 Kč',
    time: '50 min',
    durationMinutes: 50,
    category: 'radiofrekvencni',
    video: '',
    transition: '',
    position: [10, 0, -10],
    color: '#c4a77d',
    bookingUrl: 'https://www.kbkstudio.cz'
  },

  // Chemický peeling
  {
    id: 'chemicky-peeling',
    title: 'Chemický peeling',
    shortTitle: 'Peeling',
    subtitle: 'Rozjasnění a regenerace',
    desc: 'Profesionální chemický peeling pro rozjasnění, sjednocení a omlazení pleti. Volba koncentrace dle typu pleti.',
    benefits: ['Rozjasnění pleti', 'Sjednocení tónu', 'Redukce pigmentace', 'Omlazení'],
    process: ['Diagnostika pleti', 'Aplikace peelingu', 'Neutralizace', 'Zklidňující sérum', 'Hydratace a SPF'],
    price: 'od 1 200 Kč',
    time: '45 min',
    durationMinutes: 45,
    category: 'chemicky-peeling',
    video: '',
    transition: '',
    position: [10, 0, 10],
    color: '#f8f5f2',
    bookingUrl: 'https://www.kbkstudio.cz'
  },

  // Carbon Peel
  {
    id: 'carbon-peel',
    title: 'Carbon Peel',
    shortTitle: 'Carbon',
    subtitle: 'Laserové ošetření',
    desc: 'Unikátní laserové ošetření s uhlíkovým sérem pro hloubkové čištění, zúžení pórů a rozjasnění pleti.',
    benefits: ['Hloubkové čištění', 'Zúžení pórů', 'Rozjasnění', 'Redukce akné'],
    process: ['Aplikace uhlíkového séra', 'Laserové ošetření', 'Zklidnění', 'Hydratace', 'SPF ochrana'],
    price: 'od 2 000 Kč',
    time: '40 min',
    durationMinutes: 40,
    category: 'carbon-peel',
    video: '',
    transition: '',
    position: [0, 0, -15],
    color: '#e5d3b3',
    bookingUrl: 'https://www.kbkstudio.cz'
  },

  // Odstranění PMU LASER/REMOVAL
  {
    id: 'pmu-laser-removal',
    title: 'Odstranění PMU LASER',
    shortTitle: 'Laser Removal',
    subtitle: 'Profesionální odstranění',
    desc: 'Bezpečné a účinné odstranění permanentního make-upu pomocí laserové technologie. Více sezení dle potřeby.',
    benefits: ['Bezpečné odstranění', 'Minimální downtime', 'Profesionální přístup', 'Výsledky již po 1. sezení'],
    process: ['Konzultace', 'Laserové ošetření', 'Ošetření pleti', 'Pokyny na doma', 'Kontrolní termín'],
    price: 'od 1 500 Kč',
    time: '30 min',
    durationMinutes: 30,
    category: 'pmu-laser-removal',
    video: '',
    transition: '',
    position: [0, 0, 15],
    color: '#d4c5b0',
    bookingUrl: 'https://www.kbkstudio.cz'
  },

  // Permanentní make-up
  {
    id: 'permanentni-make-up',
    title: 'Permanentní make-up',
    shortTitle: 'PMU',
    subtitle: 'Přirozená krása',
    desc: 'Profesionální permanentní make-up pro přirozený a upravený vzhled. Obočí, rty i oční linky.',
    benefits: ['Přirozený vzhled', 'Úspora času', 'Dlouhotrvající efekt', 'Individuální design'],
    process: ['Konzultace a návrh', 'Anestezie', 'Aplikace PMU', 'Instrukce na doma', 'Korekce (cenena)'],
    price: 'od 3 500 Kč',
    time: '120 min',
    durationMinutes: 120,
    category: 'permanentni-make-up',
    video: '',
    transition: '',
    position: [-10, 0, -10],
    color: '#c4a77d',
    bookingUrl: 'https://www.kbkstudio.cz'
  },

  // Lash Lifting & Laminace
  {
    id: 'lash-lifting',
    title: 'Lash Lifting & Laminace',
    shortTitle: 'Lash Lifting',
    subtitle: 'Krása řas a obočí',
    desc: 'Profesionální lifting a laminace řas pro přirozeně natočené a upravené řasy. Laminace obočí pro perfektní tvar.',
    benefits: ['Natočení řas', 'Posílení a výživa', 'Trvanlivost 6-8 týdnů', 'Přirozený efekt'],
    process: ['Příprava řas', 'Aplikace liftingového roztoku', 'Barvení', 'Laminace', 'Ošetření sérem'],
    price: 'od 1 200 Kč',
    time: '60 min',
    durationMinutes: 60,
    category: 'lash-lifting',
    video: '',
    transition: '',
    position: [10, 0, -10],
    color: '#e5d3b3',
    bookingUrl: 'https://www.kbkstudio.cz'
  },

  // Školení
  {
    id: 'skoleni',
    title: 'Školení',
    shortTitle: 'Školení',
    subtitle: 'Profesionální vzdělávání',
    desc: 'Profesionální školení v oblasti permanentního make-upu, kosmetických ošetření a moderních technologií.',
    benefits: ['Certifikát', 'Praktický přístup', 'Malé skupiny', 'Materiály zdarma'],
    process: ['Teoretická část', 'Ukázka techniky', 'Praktické cvičení', 'Hodnocení', 'Certifikace'],
    price: 'Dle školení',
    time: '8 hod',
    durationMinutes: 480,
    category: 'skoleni',
    video: '',
    transition: '',
    position: [10, 0, 10],
    color: '#d4c5b0',
    bookingUrl: 'https://www.kbkstudio.cz'
  }
];

export const getServicesByCategory = (categoryId: string) =>
  SERVICES.filter(s => s.category === categoryId);
