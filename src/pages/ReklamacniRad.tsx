import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ReklamacniRad() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0a0a0a] text-white px-4 py-16" style={{ minHeight: '100vh', overflow: 'visible' }}>
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-8 font-monument text-[10px] md:text-xs tracking-widest hover:text-[#e5d3b3] transition-colors flex items-center gap-3 group">
          <span className="w-4 h-[1px] bg-white group-hover:bg-[#e5d3b3] transition-colors" />
          Zpět
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-editorial text-3xl md:text-5xl mb-8">Reklamační řád</h1>

          <div className="space-y-6 font-montreal text-sm md:text-base text-white/70 leading-relaxed">
            <section>
              <h2 className="font-editorial text-xl md:text-2xl text-white mb-3">1. Obecná ustanovení</h2>
              <p>Tento reklamační řád upravuje práva a povinnosti smluvních stran vyplývající z kupní smlouvy uzavřené mezi poskytovatelem služeb a zákazníkem ohledně poskytování kosmetických služeb.</p>
            </section>

            <section>
              <h2 className="font-editorial text-xl md:text-2xl text-white mb-3">2. Práva zákazníka</h2>
              <p>Zákazník má právo na poskytnutí služeb v dohodnutém rozsahu a kvalitě. V případě, že poskytnuté služby neodpovídají dohodnutým podmínkám nebo standardům, má zákazník právo na reklamaci.</p>
            </section>

            <section>
              <h2 className="font-editorial text-xl md:text-2xl text-white mb-3">3. Postup reklamace</h2>
              <p>Reklamaci je nutné uplatnit bez zbytečného odkladu po zjištění vady, nejpozději však do 5 dnů od poskytnutí služby. Reklamaci lze uplatnit telefonicky, e-mailem nebo osobně ve studiu.</p>
            </section>

            <section>
              <h2 className="font-editorial text-xl md:text-2xl text-white mb-3">4. Vyřízení reklamace</h2>
              <p>O vyřízení reklamace bude zákazník informován do 30 dnů od jejího uplatnění. V případě oprávněné reklamace má zákazník právo na bezplatné opakování služby nebo vrácení poměrné části ceny.</p>
            </section>

            <section>
              <h2 className="font-editorial text-xl md:text-2xl text-white mb-3">5. Zrušení a přeobjednání</h2>
              <p>Zákazník může termín bezplatně zrušit nebo přeobjednat nejpozději 24 hodin před plánovaným termínem. Při pozdějším zrušení nebo nedostavení se na termín bez omluvy si studio vyhrazuje právo na účtování storno poplatku ve výši 50 % ceny služby.</p>
            </section>

            <section>
              <h2 className="font-editorial text-xl md:text-2xl text-white mb-3">6. Ochrana osobních údajů</h2>
              <p>Vaše osobní údaje jsou zpracovávány v souladu s GDPR. Údaje jsou použity pouze pro účely poskytování služeb a nejsou předávány třetím stranám.</p>
            </section>

            <section>
              <h2 className="font-editorial text-xl md:text-2xl text-white mb-3">7. Kontakty</h2>
              <p>Pro případné dotazy nebo reklamace kontaktujte:</p>
              <div className="mt-2 space-y-1">
                <p>Beata Kučerová – KBK Studio</p>
                <p>IČ: 06826067</p>
                <p>Sídlo firmy: Horky 109, 675 73, Kralice nad Oslavou</p>
                <p>Otevírací doba: dle objednávek a přání</p>
                <p className="mt-2"><a href="tel:+420777123456" className="text-[#e5d3b3] hover:underline">+420 777 123 456</a></p>
                <p><a href="mailto:info@kbkstudio.cz" className="text-[#e5d3b3] hover:underline">info@kbkstudio.cz</a></p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
