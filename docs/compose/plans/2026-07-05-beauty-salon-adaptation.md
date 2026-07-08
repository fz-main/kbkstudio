# Beauty Salon Adaptation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adapt the existing beauty salon website (beaty-salon-test) to match the style and content of beautybyrenata.cz, including new services, about section, contacts, testimonials, and admin panel.

**Architecture:** Modify existing React/TypeScript/Vite codebase. Update service data, i18n translations, components, and admin panel. Keep existing UI framework (Tailwind, Framer Motion) and structure.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, React Router

## Global Constraints
- All UI text in Czech (cs) language
- Keep existing dark theme aesthetic (#0a0a0a background, #f8f5f2 text)
- Service images/videos: use placeholder URLs for now (Cloudinary or static)
- Booking system: keep existing BookingModal component
- Admin panel: CRUD for services, about text, contacts

---

## File Structure

| File | Purpose |
|------|---------|
| `src/data/services.ts` | Service categories, prices, descriptions |
| `src/lib/i18n.ts` | All UI translations (cs, en, de) |
| `src/MainPage.tsx` | Main page with Hero, Services, About, Contacts sections |
| `src/components/ServiceDetail.tsx` | Service detail view |
| `src/components/Testimonials.tsx` | Client testimonials |
| `src/components/BookingModal.tsx` | Booking form modal |
| `src/pages/admin/AdminDashboard.tsx` | Admin CRUD interface |
| `src/admin/AdminDashboard.tsx` | Admin dashboard (duplicate?) |

---

### Task 1: Update Service Data Structure

**Covers:** Task 3 (price list and service categories)

**Files:**
- Modify: `src/data/services.ts`

**Interfaces:**
- Consumes: none
- Produces: `SERVICES` array with new categories

- [ ] **Step 1: Update services.ts with new categories**

```typescript
export const STAGES = { INTRO: 0, MENU: 1, SERVICE_DETAIL: 2, ABOUT: 3 };

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  price: string;
  time: string;
  category: string;
  video: string;
  transition: string;
  position: [number, number, number];
  color: string;
  bookingUrl?: string;
}

export const SERVICE_CATEGORIES = [
  { id: 'microneedling', title: 'Mikrojehličkování' },
  { id: 'chemical-peel', title: 'Chemický peeling' },
  { id: 'cosmetic', title: 'Kosmetická ošetření' },
  { id: 'maderotherapy', title: 'Maderoterapie' },
  { id: 'device', title: 'Přístrojová ošetření' },
  { id: 'other', title: 'Ostatní služby' }
];

export const SERVICES: Service[] = [
  // Mikrojehličkování
  {
    id: 'microneedling-face',
    title: 'Mikrojehličkování (obličej, krk)',
    subtitle: 'Omlazení pleti',
    desc: 'Mikrojehličkování je účinné ošetření zaměřené především na omlazení pleti.',
    price: '2 050 Kč',
    time: '60 min',
    category: 'microneedling',
    video: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1781508873/5181757454069876099_f9xf25.mov',
    transition: '',
    position: [-10, 0, -10],
    color: '#e5d3b3',
    bookingUrl: 'https://beauty-by-renata.reservio.com'
  },
  {
    id: 'microneedling-peel',
    title: 'Mikrojehličkování + chemický peeling',
    subtitle: 'Kombinovaný protokol',
    desc: 'Kombinovaný protokol pro maximální výsledky omlazení pleti.',
    price: '2 500 Kč',
    time: '75 min',
    category: 'microneedling',
    video: '',
    transition: '',
    position: [-10, 0, 10],
    color: '#d4c5b0',
    bookingUrl: 'https://beauty-by-renata.reservio.com'
  },
  {
    id: 'salmon-dna',
    title: 'Salmon DNA Microneedling (PDRN)',
    subtitle: 'Biostimulace',
    desc: 'Pokročilé biostimulační mikrojehličkování nové generace.',
    price: '2 890 Kč',
    time: '75 min',
    category: 'microneedling',
    video: '',
    transition: '',
    position: [10, 0, -10],
    color: '#c4a77d',
    bookingUrl: 'https://beauty-by-renata.reservio.com'
  },

  // Chemický peeling
  {
    id: 'peel-first',
    title: 'Chemický peeling - první návštěva',
    subtitle: '2 vrstvy kyseliny',
    desc: 'Účinky peelingu: Rozjasnění a sjednocení tónu pleti, vyhlazení vrásek.',
    price: '1 850 Kč',
    time: '45 min',
    category: 'chemical-peel',
    video: '',
    transition: '',
    position: [10, 0, 10],
    color: '#f8f5f2',
    bookingUrl: 'https://beauty-by-renata.reservio.com'
  },
  {
    id: 'peel-three',
    title: 'Chemický peeling - 3 vrstvy',
    subtitle: 'Intenzivní ošetření',
    desc: 'Intenzivnější ošetření pro pokročilé výsledky.',
    price: '2 050 Kč',
    time: '50 min',
    category: 'chemical-peel',
    video: '',
    transition: '',
    position: [0, 0, -15],
    color: '#e5d3b3',
    bookingUrl: 'https://beauty-by-renata.reservio.com'
  },

  // Kosmetická ošetření
  {
    id: 'first-visit',
    title: 'První návštěva',
    subtitle: 'Konzultace',
    desc: 'Při první návštěvě si společně vyplníme klientskou kartu.',
    price: '1 600 Kč',
    time: '60 min',
    category: 'cosmetic',
    video: '',
    transition: '',
    position: [0, 0, 15],
    color: '#d4c5b0',
    bookingUrl: 'https://beauty-by-renata.reservio.com'
  },
  {
    id: 'refresh',
    title: 'Refresh pleti',
    subtitle: 'Osvěžení',
    desc: 'Ošetření přizpůsobené aktuálním potřebám vaší pleti.',
    price: '1 500 Kč',
    time: '50 min',
    category: 'cosmetic',
    video: '',
    transition: '',
    position: [-10, 0, -10],
    color: '#c4a77d',
    bookingUrl: 'https://beauty-by-renata.reservio.com'
  },
  {
    id: 'lifting',
    title: 'Omlazující lifting',
    subtitle: 'Zpevnění',
    desc: 'Intenzivní ošetření zaměřené na zpevnění, vypnutí a omlazení pleti.',
    price: '1 700 Kč',
    time: '60 min',
    category: 'cosmetic',
    video: '',
    transition: '',
    position: [-10, 0, 10],
    color: '#e5d3b3',
    bookingUrl: 'https://beauty-by-renata.reservio.com'
  },
  {
    id: 'massage-face',
    title: 'Liftingová masáž pleti - ANTI-AGE',
    subtitle: 'Masáž',
    desc: 'Tato liftingová masáž stimuluje mikrocirkulaci, aktivuje pokožku.',
    price: '790 Kč',
    time: '40 min',
    category: 'cosmetic',
    video: '',
    transition: '',
    position: [10, 0, -10],
    color: '#d4c5b0',
    bookingUrl: 'https://beauty-by-renata.reservio.com'
  },
  {
    id: 'deep-clean',
    title: 'Hloubkové čistění pleti',
    subtitle: 'Čištění',
    desc: 'Ošetření určené pro problematickou pleť, ucpané póry.',
    price: '1 200 Kč',
    time: '60 min',
    category: 'cosmetic',
    video: '',
    transition: '',
    position: [10, 0, 10],
    color: '#f8f5f2',
    bookingUrl: 'https://beauty-by-renata.reservio.com'
  },
  {
    id: 'salmon-booster',
    title: 'Omlazující skin booster s lososí DNA',
    subtitle: 'Biostimulace',
    desc: 'Pokročilé bezjehlové ošetření inspirované korejskými skin boostery.',
    price: '2 000 Kč',
    time: '50 min',
    category: 'cosmetic',
    video: '',
    transition: '',
    position: [0, 0, -15],
    color: '#c4a77d',
    bookingUrl: 'https://beauty-by-renata.reservio.com'
  },
  {
    id: 'lymph',
    title: 'Lymfatická masáž obličeje - RELAX',
    subtitle: 'Relaxace',
    desc: 'Jemná manuální technika podporující přirozený tok lymfy.',
    price: '790 Kč',
    time: '40 min',
    category: 'cosmetic',
    video: '',
    transition: '',
    position: [0, 0, 15],
    color: '#e5d3b3',
    bookingUrl: 'https://beauty-by-renata.reservio.com'
  },

  // Maderoterapie
  {
    id: 'madero',
    title: 'Maderoterapie s prvky lymfomodelingu',
    subtitle: 'Problémové partie',
    desc: 'Maderoterapie s prvky lymfomodelingu je moderní metoda péče o tělo.',
    price: 'od 990 Kč',
    time: '60 min',
    category: 'maderotherapy',
    video: '',
    transition: '',
    position: [-10, 0, -10],
    color: '#d4c5b0',
    bookingUrl: 'https://beauty-by-renata.reservio.com'
  }
];

export const getServicesByCategory = (categoryId: string) =>
  SERVICES.filter(s => s.category === categoryId);
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/data/services.ts
git commit -m "feat: update services with beauty salon categories and prices"
```

---

### Task 2: Update i18n Translations

**Covers:** Tasks 2, 4, 5 (about section, testimonials, contacts)

**Files:**
- Modify: `src/lib/i18n.ts`

**Interfaces:**
- Consumes: SERVICES from Task 1
- Produces: Updated translations object

- [ ] **Step 1: Update i18n.ts with new translations**

```typescript
export type Lang = 'cs' | 'en' | 'de';

export const translations = {
  cs: {
    tagline: 'BEAUTY BY RENATA · Kosmetické studio',
    scrollToEnter: 'Přejděte pro vstup',
    back: 'Zpět',
    duration: 'Délka',
    investment: 'Cena',
    reserve: 'Rezervovat',
    yourSpecialist: 'Váš specialista',
    aboutLabel: 'O mně',
    aboutFounder: 'Kosmetické studio Brno - Řečkovice',
    aboutBio: 'Kosmetika se pro mě stala přirozeným profesním směrem, přestože jsem původně vystudovala cestovní ruch a služby letového provozu. Vlastní zkušenost s problematickou pletí mě přivedla k hlubšímu zájmu o složení kosmetických přípravků, odborné procedury a kvalitní vzdělávání v oboru.\n\nSpecializuji se na profesionální kosmetická a přístrojová ošetření, přičemž ve své práci kladu důraz na individuální přístup, odbornou úroveň a vysoký standard péče.\n\nSvou práci vnímám jako spojení odbornosti, estetiky a péče o člověka. Největší radost mi přináší chvíle, kdy klientky i klienti odcházejí spokojení, odpočinutí a s pletí, která působí zdravě, svěže a zářivě.',
    aboutMotto: 'Odbornost · Estetika · Péče',
    aboutServices: 'MIKROJEHLIČKOVÁNÍ · CHEMICKÝ PEELING · KOSMETICKÁ OŠETŘENÍ · MADEROTERAPIE',
    aboutBack: 'Zpět',
    ownerName: 'Renata Birjukov',
    aboutPhoto: 'https://cdn.prod.website-files.com/66a3872ec3af88d823ea480a/69f46ab0da264991b2a88d25_IMG_0221-EditNat.jpeg',
    selectDate: 'Vyberte datum',
    selectTime: 'Vyberte čas',
    continue: 'Pokračovat →',
    confirmReservation: 'Potvrdit rezervaci',
    booking: 'Rezervace...',
    firstName: 'Jméno',
    lastName: 'Příjmení',
    phone: 'Telefon',
    comment: 'Komentář',
    commentPlaceholder: 'Vaše přání nebo dotazy',
    gdpr: 'Souhlasím se zpracováním osobních údajů.',
    reservationConfirmed: 'Rezervace potvrzena',
    done: 'Hotovo',
    change: 'Změnit',
    enterModule: '[ VSTOUPIT ]',
    months: ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'],
    days: ['Ne','Po','Út','St','Čt','Pá','So'],
    errors: { firstName: 'Zadejte jméno', lastName: 'Zadejte příjmení', phone: 'Zadejte telefon', gdpr: 'Nutný souhlas' },
    services: {
      microneedling: { title: 'Mikrojehličkování', subtitle: 'Omlazení pleti', desc: 'Mikrojehličkování je účinné ošetření zaměřené především na omlazení pleti.' },
      'chemical-peel': { title: 'Chemický peeling', subtitle: 'Projasnění', desc: 'Chemický peeling je neinvazivní metoda, která slouží k projasnění a omlazení pleti.' },
      cosmetic: { title: 'Kosmetická ošetření', subtitle: 'Péče o pleť', desc: 'Profesionální kosmetická ošetření pro ženy i muže.' },
      maderotherapy: { title: 'Maderoterapie', subtitle: 'Lymfomodeling', desc: 'Moderní metoda péče o tělo s prvky lymfomodelingu.' },
      device: { title: 'Přístrojová ošetření', subtitle: 'Technologie', desc: 'Pokročilá přístrojová ošetření pro hloubkovou péči.' },
      other: { title: 'Ostatní služby', subtitle: 'Doplňkové', desc: 'Další služby pro vaši krásu a pohodu.' }
    },
    masters: {
      microneedling: [{ name: 'Renata Birjukov', role: 'Kosmetička', exp: '5+ let', photo: '' }],
      'chemical-peel': [{ name: 'Renata Birjukov', role: 'Kosmetička', exp: '5+ let', photo: '' }],
      cosmetic: [{ name: 'Renata Birjukov', role: 'Kosmetička', exp: '5+ let', photo: '' }],
      maderotherapy: [{ name: 'Renata Birjukov', role: 'Terapeutka', exp: '5+ let', photo: '' }],
      device: [{ name: 'Renata Birjukov', role: 'Kosmetička', exp: '5+ let', photo: '' }],
      other: [{ name: 'Renata Birjukov', role: 'Kosmetička', exp: '5+ let', photo: '' }]
    },
    testimonialsTitle: 'Co říkají naši klienti',
    galleryTitle: 'Galerie',
    testimonialsList: [
      { id: 1, name: 'Petra Nováková', role: 'Mikrojehličkování', text: 'Výsledky jsou úžasné! Pleť je viditelně mladší a zářivější. Renata má opravdu zlaté ruce.', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
      { name: 'Jana Dvořáková', role: 'Chemický peeling', text: 'Po peelingu je pleť krásně sjednocená a rozjasněná. Profesionální přístup a skvělé výsledky.', avatar: 'https://randomuser.me/api/portraits/women/45.jpg' },
      { name: 'Lucie Horáková', role: 'Kosmetické ošetření', text: 'Chodím pravidelně a moje pleť je jako znovuzrozená. Doporučuji každému, kdo chce pro svou pleť to nejlepší.', avatar: 'https://randomuser.me/api/portraits/women/89.jpg' },
      { name: 'Michaela Černá', role: 'Maderoterapie', text: 'Maderoterapie je skvělá metoda. Cítím se uvolněně a má postava se zlepšila.', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
      { name: 'Eva Svobodová', role: 'Liftingová masáž', text: 'Liftingová masáž je bomba! Pleť je vypnutá a vypadám odpočatě. Děkuji Renato!', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' }
    ],
    contacts: {
      title: 'Kontakt',
      address: 'Vránova 1245/5, Brno – Řečkovice, 2. patro',
      phone: '+420 734 501 706',
      email: 'birjukov.renata@gmail.com',
      hours: 'Dle objednání',
      facebook: 'https://www.facebook.com/BeautyByRenataCZ',
      instagram: 'https://www.instagram.com/beauty_by_renata/',
      mapUrl: 'https://maps.app.goo.gl/iKjtHBARLtZkSx3X6',
      navigationUrl: 'https://maps.app.goo.gl/kcbft8wx8tctSNp16'
    }
  },
  en: {
    tagline: 'BEAUTY BY RENATA · Cosmetic Studio',
    scrollToEnter: 'Scroll to enter',
    back: 'Back',
    duration: 'Duration',
    investment: 'Price',
    reserve: 'Reserve',
    yourSpecialist: 'Your specialist',
    aboutLabel: 'About me',
    aboutFounder: 'Cosmetic studio Brno - Řečkovice',
    aboutBio: 'Cosmetics became my natural professional direction, even though I originally studied tourism and flight services. My own experience with problematic skin led me to a deeper interest in cosmetic product composition, professional procedures and quality education in the field.\n\nI specialize in professional cosmetic and device treatments, emphasizing an individual approach, professional level and high standards of care.\n\nI perceive my work as a combination of expertise, aesthetics and care for people. The greatest joy for me is when clients leave satisfied, rested and with skin that looks healthy, fresh and radiant.',
    aboutMotto: 'Expertise · Aesthetics · Care',
    aboutServices: 'MICRONEEDLING · CHEMICAL PEEL · COSMETIC TREATMENTS · MADEROTHERAPY',
    aboutBack: 'Back',
    ownerName: 'Renata Birjukov',
    aboutPhoto: 'https://cdn.prod.website-files.com/66a3872ec3af88d823ea480a/69f46ab0da264991b2a88d25_IMG_0221-EditNat.jpeg',
    selectDate: 'Select date',
    selectTime: 'Select time',
    continue: 'Continue →',
    confirmReservation: 'Confirm Reservation',
    booking: 'Booking...',
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone',
    comment: 'Comment',
    commentPlaceholder: 'Wishes or questions',
    gdpr: 'I agree to the processing of personal data.',
    reservationConfirmed: 'Reservation confirmed',
    done: 'Done',
    change: 'Change',
    enterModule: '[ ENTER ]',
    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    days: ['Su','Mo','Tu','We','Th','Fr','Sa'],
    errors: { firstName: 'Enter first name', lastName: 'Enter last name', phone: 'Enter phone', gdpr: 'Consent required' },
    services: {
      microneedling: { title: 'Microneedling', subtitle: 'Skin rejuvenation', desc: 'Microneedling is an effective treatment focused primarily on skin rejuvenation.' },
      'chemical-peel': { title: 'Chemical peel', subtitle: 'Brightening', desc: 'Chemical peel is a non-invasive method for brightening and rejuvenating skin.' },
      cosmetic: { title: 'Cosmetic treatments', subtitle: 'Skin care', desc: 'Professional cosmetic treatments for women and men.' },
      maderotherapy: { title: 'Maderotherapy', subtitle: 'Lymph modeling', desc: 'Modern body care method with lymph modeling elements.' },
      device: { title: 'Device treatments', subtitle: 'Technology', desc: 'Advanced device treatments for deep care.' },
      other: { title: 'Other services', subtitle: 'Supplementary', desc: 'Additional services for your beauty and well-being.' }
    },
    masters: {
      microneedling: [{ name: 'Renata Birjukov', role: 'Cosmetician', exp: '5+ years', photo: '' }],
      'chemical-peel': [{ name: 'Renata Birjukov', role: 'Cosmetician', exp: '5+ years', photo: '' }],
      cosmetic: [{ name: 'Renata Birjukov', role: 'Cosmetician', exp: '5+ years', photo: '' }],
      maderotherapy: [{ name: 'Renata Birjukov', role: 'Therapist', exp: '5+ years', photo: '' }],
      device: [{ name: 'Renata Birjukov', role: 'Cosmetician', exp: '5+ years', photo: '' }],
      other: [{ name: 'Renata Birjukov', role: 'Cosmetician', exp: '5+ years', photo: '' }]
    },
    testimonialsTitle: 'What our clients say',
    galleryTitle: 'Gallery',
    testimonialsList: [
      { id: 1, name: 'Petra Nováková', role: 'Microneedling', text: 'The results are amazing! Skin is visibly younger and more radiant. Renata really has golden hands.', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
      { name: 'Jana Dvořáková', role: 'Chemical peel', text: 'After the peel, skin is beautifully even and brightened. Professional approach and great results.', avatar: 'https://randomuser.me/api/portraits/women/45.jpg' },
      { name: 'Lucie Horáková', role: 'Cosmetic treatment', text: 'I come regularly and my skin is like new. I recommend to everyone who wants the best for their skin.', avatar: 'https://randomuser.me/api/portraits/women/89.jpg' },
      { name: 'Michaela Černá', role: 'Maderotherapy', text: 'Maderotherapy is a great method. I feel relaxed and my figure has improved.', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
      { name: 'Eva Svobodová', role: 'Lifting massage', text: 'Lifting massage is amazing! Skin is firm and I look rested. Thank you Renata!', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' }
    ],
    contacts: {
      title: 'Contact',
      address: 'Vránova 1245/5, Brno – Řečkovice, 2nd floor',
      phone: '+420 734 501 706',
      email: 'birjukov.renata@gmail.com',
      hours: 'By appointment',
      facebook: 'https://www.facebook.com/BeautyByRenataCZ',
      instagram: 'https://www.instagram.com/beauty_by_renata/',
      mapUrl: 'https://maps.app.goo.gl/iKjtHBARLtZkSx3X6',
      navigationUrl: 'https://maps.app.goo.gl/kcbft8wx8tctSNp16'
    }
  },
  de: {
    tagline: 'BEAUTY BY RENATA · Kosmetikstudio',
    scrollToEnter: 'Scrollen zum Eintreten',
    back: 'Zurück',
    duration: 'Dauer',
    investment: 'Preis',
    reserve: 'Reservieren',
    yourSpecialist: 'Ihr Spezialist',
    aboutLabel: 'Über mich',
    aboutFounder: 'Kosmetikstudio Brno - Řečkovice',
    aboutBio: 'Kosmetik wurde mein natürlicher beruflicher Weg, obwohl ich ursprünglich Tourismus und Flugdienste studiert habe. Meine eigene Erfahrung mit problematischer Haut führte zu einem tieferen Interesse an der Zusammensetzung kosmetischer Produkte, professionellen Verfahren und hochwertiger Ausbildung auf diesem Gebiet.\n\nIch bin auf professionelle kosmetische und gerätetechnische Behandlungen spezialisiere und lege in meiner Arbeit Wert auf individuellen Ansatz, professionelles Niveau und hohe Pflegestandards.\n\nIch betrachte meine Arbeit als Verbindung von Expertise, Ästhetik und Menschlichkeit. Die größte Freude bereiten mir Momente, in denen Kundinnen und Kunden zufrieden, ausgeruht und mit Haut, die gesund, frisch und strahlend aussieht, gehen.',
    aboutMotto: 'Expertise · Ästhetik · Pflege',
    aboutServices: 'MIKRONADDELN · CHEMISCHER PEELING · KOSMETISCHE BEHANDLUNGEN · MADEROTHERAPIE',
    aboutBack: 'Zurück',
    ownerName: 'Renata Birjukov',
    aboutPhoto: 'https://cdn.prod.website-files.com/66a3872ec3af88d823ea480a/69f46ab0da264991b2a88d25_IMG_0221-EditNat.jpeg',
    selectDate: 'Datum wählen',
    selectTime: 'Uhrzeit wählen',
    continue: 'Weiter →',
    confirmReservation: 'Reservierung bestätigen',
    booking: 'Wird gebucht...',
    firstName: 'Vorname',
    lastName: 'Nachname',
    phone: 'Telefon',
    comment: 'Kommentar',
    commentPlaceholder: 'Wünsche oder Fragen',
    gdpr: 'Ich stimme der Datenverarbeitung zu.',
    reservationConfirmed: 'Reservierung bestätigt',
    done: 'Fertig',
    change: 'Ändern',
    enterModule: '[ EINTRETEN ]',
    months: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
    days: ['So','Mo','Di','Mi','Do','Fr','Sa'],
    errors: { firstName: 'Vorname eingeben', lastName: 'Nachname eingeben', phone: 'Telefon eingeben', gdpr: 'Zustimmung erforderlich' },
    services: {
      microneedling: { title: 'Mikronadeln', subtitle: 'Hautverjüngung', desc: 'Mikronadeln ist eine effektive Behandlung, die sich hauptsächlich auf die Hautverjüngung konzentriert.' },
      'chemical-peel': { title: 'Chemischer Peeling', subtitle: 'Aufhellung', desc: 'Chemischer Peeling ist eine nicht-invasive Methode zum Aufhellen und Verjüngen der Haut.' },
      cosmetic: { title: 'Kosmetische Behandlungen', subtitle: 'Hautpflege', desc: 'Professionelle kosmetische Behandlungen für Frauen und Männer.' },
      maderotherapy: { title: 'Maderotherapie', subtitle: 'Lymphmodellierung', desc: 'Moderne Körperpflegemethode mit Lymphmodellierungselementen.' },
      device: { title: 'Gerätebehandlungen', subtitle: 'Technologie', desc: 'Fortschrittliche Gerätebehandlungen für tiefe Pflege.' },
      other: { title: 'Andere Dienstleistungen', subtitle: 'Ergänzend', desc: 'Weitere Dienstleistungen für Ihre Schönheit und Ihr Wohlbefinden.' }
    },
    masters: {
      microneedling: [{ name: 'Renata Birjukov', role: 'Kosmetikerin', exp: '5+ Jahre', photo: '' }],
      'chemical-peel': [{ name: 'Renata Birjukov', role: 'Kosmetikerin', exp: '5+ Jahre', photo: '' }],
      cosmetic: [{ name: 'Renata Birjukov', role: 'Kosmetikerin', exp: '5+ Jahre', photo: '' }],
      maderotherapy: [{ name: 'Renata Birjukov', role: 'Therapeutin', exp: '5+ Jahre', photo: '' }],
      device: [{ name: 'Renata Birjukov', role: 'Kosmetikerin', exp: '5+ Jahre', photo: '' }],
      other: [{ name: 'Renata Birjukov', role: 'Kosmetikerin', exp: '5+ Jahre', photo: '' }]
    },
    testimonialsTitle: 'Was unsere Kunden sagen',
    galleryTitle: 'Galerie',
    testimonialsList: [
      { id: 1, name: 'Petra Nováková', role: 'Mikronadeln', text: 'Die Ergebnisse sind erstaunlich! Die Haut ist sichtlich jünger und strahlender. Renata hat wirklich goldene Hände.', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
      { name: 'Jana Dvořáková', role: 'Chemischer Peeling', text: 'Nach dem Peeling ist die Haut wunderschön gleichmäßig und aufgehellt. Professioneller Ansatz und großartige Ergebnisse.', avatar: 'https://randomuser.me/api/portraits/women/45.jpg' },
      { name: 'Lucie Horáková', role: 'Kosmetische Behandlung', text: 'Ich komme regelmäßig und meine Haut ist wie neu. Ich empfehle es jedem, der das Beste für seine Haut will.', avatar: 'https://randomuser.me/api/portraits/women/89.jpg' },
      { name: 'Michaela Černá', role: 'Maderotherapie', text: 'Maderotherapie ist eine großartige Methode. Ich fühle mich entspannt und meine Figur hat sich verbessert.', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
      { name: 'Eva Svobodová', role: 'Lifting-Massage', text: 'Lifting-Massage ist fantastisch! Die Haut ist straff und ich sehe erholt aus. Danke Renata!', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' }
    ],
    contacts: {
      title: 'Kontakt',
      address: 'Vránova 1245/5, Brno – Řečkovice, 2. Stock',
      phone: '+420 734 501 706',
      email: 'birjukov.renata@gmail.com',
      hours: 'Nach Vereinbarung',
      facebook: 'https://www.facebook.com/BeautyByRenataCZ',
      instagram: 'https://www.instagram.com/beauty_by_renata/',
      mapUrl: 'https://maps.app.goo.gl/iKjtHBARLtZkSx3X6',
      navigationUrl: 'https://maps.app.goo.gl/kcbft8wx8tctSNp16'
    }
  }
};

export type Translations = typeof translations.cs;
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/i18n.ts
git commit -m "feat: update i18n with beauty salon translations and contacts"
```

---

### Task 3: Update MainPage Hero and About Section

**Covers:** Tasks 1, 2 (scroll button, about section)

**Files:**
- Modify: `src/MainPage.tsx`

**Interfaces:**
- Consumes: translations from Task 2
- Produces: Updated UI with scroll button and about section

- [ ] **Step 1: Add scroll-to-services button in Hero**

In MainPage.tsx, find the INTRO stage section and add a button:

```tsx
// In the INTRO stage motion.div, add after the scroll indicator:
<motion.button
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1.5, duration: 1 }}
  onClick={() => setStage(STAGES.MENU)}
  className="mt-6 px-6 py-3 border border-white/30 rounded-full font-montreal text-[10px] md:text-xs uppercase tracking-widest text-white/80 hover:bg-white/10 hover:border-white/50 transition-all pointer-events-auto"
>
  {t.scrollToServices || 'Služby ↓'}
</motion.button>
```

- [ ] **Step 2: Update About section with Renata's info**

Find the ABOUT stage section and update:

```tsx
{stage === STAGES.ABOUT && (
  <motion.div key="about" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} transition={{ duration: 1, ease: 'easeOut' }} className="absolute inset-0 pointer-events-auto overflow-y-auto flex flex-col px-6 py-20">
    <button onClick={() => setStage(STAGES.MENU)} className="fixed top-16 md:top-20 left-4 md:left-8 font-monument text-[10px] md:text-xs tracking-widest hover:text-[#e5d3b3] transition-colors z-50 flex items-center gap-3 group bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm">
      <span className="w-4 h-[1px] bg-white group-hover:bg-[#e5d3b3] transition-colors" />
      {t.back}
    </button>
    <div id="about-scroll-container" className="max-w-5xl w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }} className="flex justify-center cursor-pointer" onClick={() => setLightboxImage(t.aboutPhoto)}>
          <img src={t.aboutPhoto} alt="Renata Birjukov" className="w-full max-w-md object-cover rounded-3xl shadow-2xl transition-transform hover:scale-105" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}>
          <div className="font-monument text-[9px] tracking-[0.3em] text-[#e5d3b3] mb-4 uppercase">{t.aboutLabel}</div>
          <h2 className="font-editorial text-4xl md:text-5xl mb-2 leading-tight">{t.ownerName}</h2>
          <div className="font-montreal text-xs text-[#a3a3a3] tracking-widest mb-6">{t.aboutFounder}</div>
          <div className="border-t border-white/10 pt-6">
            <p className="font-montreal text-sm md:text-base leading-relaxed text-white/80 whitespace-pre-line">{t.aboutBio}</p>
          </div>
          <div className="mt-8 font-monument text-[9px] tracking-[0.2em] text-[#e5d3b3] uppercase">{t.aboutMotto}</div>
          <div className="mt-4 font-montreal text-[10px] text-white/50 tracking-widest">{t.aboutServices}</div>
        </motion.div>
      </div>
    </div>
  </motion.div>
)}
```

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/MainPage.tsx
git commit -m "feat: add scroll button and update about section with Renata info"
```

---

### Task 4: Update Contacts Section

**Covers:** Task 5 (contacts)

**Files:**
- Modify: `src/MainPage.tsx`

**Interfaces:**
- Consumes: translations.contacts from Task 2
- Produces: Updated contacts in MENU stage

- [ ] **Step 1: Update contacts in MENU stage**

Find the contacts section in MENU stage and update:

```tsx
// In the contacts section of MENU stage:
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
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/MainPage.tsx
git commit -m "feat: update contacts section with beauty salon data"
```

---

### Task 5: Update Admin Dashboard

**Covers:** Task 6 (admin panel CRUD)

**Files:**
- Modify: `src/pages/admin/AdminDashboard.tsx`
- Modify: `src/admin/AdminDashboard.tsx` (if exists)

**Interfaces:**
- Consumes: SERVICES from Task 1
- Produces: CRUD interface for services, about, contacts

- [ ] **Step 1: Create admin dashboard with CRUD**

```tsx
// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { SERVICES, SERVICE_CATEGORIES } from '../../data/services';
import type { Service } from '../../data/services';

export default function AdminDashboard() {
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState<'services' | 'about' | 'contacts'>('services');
  const [aboutText, setAboutText] = useState('');
  const [contacts, setContacts] = useState({
    address: '',
    phone: '',
    email: '',
    hours: '',
    facebook: '',
    instagram: ''
  });

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('adminServices');
    if (saved) setServices(JSON.parse(saved));
    const savedAbout = localStorage.getItem('adminAbout');
    if (savedAbout) setAboutText(savedAbout);
    const savedContacts = localStorage.getItem('adminContacts');
    if (savedContacts) setContacts(JSON.parse(savedContacts));
  }, []);

  const saveServices = (newServices: Service[]) => {
    setServices(newServices);
    localStorage.setItem('adminServices', JSON.stringify(newServices));
  };

  const saveAbout = () => {
    localStorage.setItem('adminAbout', aboutText);
  };

  const saveContacts = () => {
    localStorage.setItem('adminContacts', JSON.stringify(contacts));
  };

  const handleDelete = (id: string) => {
    if (confirm('Opravdu smazat tuto službu?')) {
      saveServices(services.filter(s => s.id !== id));
    }
  };

  const handleSave = (service: Service) => {
    if (editingService) {
      saveServices(services.map(s => s.id === service.id ? service : s));
    } else {
      saveServices([...services, service]);
    }
    setEditingService(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f8f5f2] p-8">
      <h1 className="text-2xl font-bold mb-8">Admin Panel - Beauty by Renata</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setActiveTab('services')} className={`px-4 py-2 rounded ${activeTab === 'services' ? 'bg-[#e5d3b3] text-black' : 'bg-white/10'}`}>
          Služby
        </button>
        <button onClick={() => setActiveTab('about')} className={`px-4 py-2 rounded ${activeTab === 'about' ? 'bg-[#e5d3b3] text-black' : 'bg-white/10'}`}>
          O mně
        </button>
        <button onClick={() => setActiveTab('contacts')} className={`px-4 py-2 rounded ${activeTab === 'contacts' ? 'bg-[#e5d3b3] text-black' : 'bg-white/10'}`}>
          Kontakty
        </button>
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl">Správa služeb</h2>
            <button onClick={() => setEditingService({ id: '', title: '', subtitle: '', desc: '', price: '', time: '', category: 'cosmetic', video: '', transition: '', position: [0,0,0], color: '#e5d3b3' })} className="px-4 py-2 bg-[#e5d3b3] text-black rounded">
              + Přidat službu
            </button>
          </div>
          
          {/* Service Form */}
          {editingService && (
            <div className="bg-white/5 p-6 rounded-lg mb-6">
              <h3 className="text-lg mb-4">{editingService.id ? 'Upravit službu' : 'Nová služba'}</h3>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Název" value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="bg-white/10 p-2 rounded" />
                <input placeholder="Podtitul" value={editingService.subtitle} onChange={e => setEditingService({...editingService, subtitle: e.target.value})} className="bg-white/10 p-2 rounded" />
                <input placeholder="Popis" value={editingService.desc} onChange={e => setEditingService({...editingService, desc: e.target.value})} className="bg-white/10 p-2 rounded col-span-2" />
                <input placeholder="Cena" value={editingService.price} onChange={e => setEditingService({...editingService, price: e.target.value})} className="bg-white/10 p-2 rounded" />
                <input placeholder="Čas" value={editingService.time} onChange={e => setEditingService({...editingService, time: e.target.value})} className="bg-white/10 p-2 rounded" />
                <select value={editingService.category} onChange={e => setEditingService({...editingService, category: e.target.value})} className="bg-white/10 p-2 rounded">
                  {SERVICE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
                <input placeholder="Booking URL" value={editingService.bookingUrl || ''} onChange={e => setEditingService({...editingService, bookingUrl: e.target.value})} className="bg-white/10 p-2 rounded" />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleSave(editingService)} className="px-4 py-2 bg-green-600 rounded">Uložit</button>
                <button onClick={() => setEditingService(null)} className="px-4 py-2 bg-white/10 rounded">Zrušit</button>
              </div>
            </div>
          )}

          {/* Services List */}
          <div className="space-y-2">
            {services.map(service => (
              <div key={service.id} className="flex items-center justify-between bg-white/5 p-4 rounded">
                <div>
                  <span className="text-xs text-[#e5d3b3] mr-2">{SERVICE_CATEGORIES.find(c => c.id === service.category)?.title}</span>
                  <span className="font-medium">{service.title}</span>
                  <span className="text-white/50 ml-2">{service.price}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingService(service)} className="px-3 py-1 bg-white/10 rounded text-sm">Upravit</button>
                  <button onClick={() => handleDelete(service.id)} className="px-3 py-1 bg-red-600 rounded text-sm">Smazat</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div>
          <h2 className="text-xl mb-4">Text "O mně"</h2>
          <textarea value={aboutText} onChange={e => setAboutText(e.target.value)} className="w-full h-64 bg-white/10 p-4 rounded resize-none" placeholder="Napište text o sobě..." />
          <button onClick={saveAbout} className="mt-4 px-4 py-2 bg-[#e5d3b3] text-black rounded">Uložit</button>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div>
          <h2 className="text-xl mb-4">Kontakty</h2>
          <div className="grid grid-cols-2 gap-4 max-w-xl">
            <input placeholder="Adresa" value={contacts.address} onChange={e => setContacts({...contacts, address: e.target.value})} className="bg-white/10 p-2 rounded col-span-2" />
            <input placeholder="Telefon" value={contacts.phone} onChange={e => setContacts({...contacts, phone: e.target.value})} className="bg-white/10 p-2 rounded" />
            <input placeholder="Email" value={contacts.email} onChange={e => setContacts({...contacts, email: e.target.value})} className="bg-white/10 p-2 rounded" />
            <input placeholder="Otevírací doba" value={contacts.hours} onChange={e => setContacts({...contacts, hours: e.target.value})} className="bg-white/10 p-2 rounded" />
            <input placeholder="Facebook URL" value={contacts.facebook} onChange={e => setContacts({...contacts, facebook: e.target.value})} className="bg-white/10 p-2 rounded" />
            <input placeholder="Instagram URL" value={contacts.instagram} onChange={e => setContacts({...contacts, instagram: t.target.value})} className="bg-white/10 p-2 rounded" />
          </div>
          <button onClick={saveContacts} className="mt-4 px-4 py-2 bg-[#e5d3b3] text-black rounded">Uložit</button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors (fix the typo: `t.target.value` → `e.target.value`)

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/AdminDashboard.tsx
git commit -m "feat: add admin dashboard with CRUD for services, about, contacts"
```

---

### Task 6: Verify and Test

**Covers:** All tasks

**Files:**
- None (verification only)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Working application

- [ ] **Step 1: Install dependencies**

Run: `npm install`
Expected: Dependencies installed

- [ ] **Step 2: Run dev server**

Run: `npm run dev`
Expected: Server starts on http://localhost:5173

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 5: Commit final changes**

```bash
git add .
git commit -m "chore: verify build and lint pass"
```

---

## Execution Handoff

Plan saved. How would you like to execute it?

- [ ] Subagent, always
- [ ] Subagent, this time
- [ ] Inline, always
- [ ] Inline, this time
