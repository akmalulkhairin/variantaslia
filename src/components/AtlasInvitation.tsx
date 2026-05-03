import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useScroll, useTransform, useInView,
} from 'framer-motion';

/* ── Copy ──────────────────────────────────────────────────────────── */
const copy = {
  en: {
    kicker: 'Save the Date',
    cta: 'Trace the Route',
    mapEyebrow: 'The Journey',
    mapTitle: 'From a foreign city,\nto a promise at home',
    mapCaption: 'Taslia from Aceh and Varian from Bukittinggi met while studying in Hannover. What began as quiet conversations in a city far from Sumatra became the journey they are now completing — together.',
    storyLabel: 'Their Story',
    storyQuote: '"Two Sumatran hearts met far from home, in Hannover, and found their way back to the same promise."',
    storyBody: 'The first meetings were small — a shared table, a borrowed note, a walk through a German autumn. By the time they understood what was happening, the distance between Aceh and Bukittinggi had become a shared history.',
    dateSave: 'Save the date',
    dateMonth: 'June · 2026',
    dateLoc: 'Aceh, Indonesia',
    cal: 'Save to calendar',
    gcal: 'Open in Google Calendar',
    galleryLabel: 'Little Memories',
    closingWith: 'With love',
    closingNames: 'Taslia & Varian',
    closingSub: '04 · VI · MMXXVI · Aceh',
  },
  id: {
    kicker: 'Tandai Tanggalnya',
    cta: 'Ikuti Perjalanan',
    mapEyebrow: 'Perjalanan Kami',
    mapTitle: 'Dari kota asing,\nmenuju janji di rumah',
    mapCaption: 'Taslia dari Aceh dan Varian dari Bukittinggi bertemu saat menempuh studi di Hannover. Dari percakapan kecil di kota yang jauh dari Sumatra, tumbuh perjalanan yang kini mereka selesaikan bersama.',
    storyLabel: 'Kisah Mereka',
    storyQuote: '"Dua hati dari Sumatra bertemu jauh dari rumah, di Hannover, lalu menemukan jalan menuju janji yang sama."',
    storyBody: 'Pertemuan pertama mereka sederhana — meja yang sama, catatan yang dipinjamkan, jalan-jalan di musim gugur Jerman. Sebelum mereka menyadarinya, jarak antara Aceh dan Bukittinggi telah menjadi sejarah bersama.',
    dateSave: 'Tandai tanggalnya',
    dateMonth: 'Juni · 2026',
    dateLoc: 'Aceh, Indonesia',
    cal: 'Simpan ke kalender',
    gcal: 'Buka di Google Calendar',
    galleryLabel: 'Sedikit Kenangan',
    closingWith: 'Dengan cinta',
    closingNames: 'Taslia & Varian',
    closingSub: '04 · VI · MMXXVI · Aceh',
  },
} as const;
type Lang = keyof typeof copy;

const googleUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Taslia%20%26%20Varian%20Wedding&dates=20260604/20260605&details=Wedding%20celebration%20of%20Taslia%20Khaira%20and%20Varian%20Furqan&location=Aceh%2C%20Indonesia';
const photos = ['/images/2023_1.jpeg','/images/2023_2.jpeg','/images/2023_3.jpeg','/images/2024_1.jpeg'];

/* ── Helpers ────────────────────────────────────────────────────────── */
function SplitText({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className} aria-label={text} style={{ display: 'block' }}>
      {text.split('').map((ch, i) => (
        <motion.span key={i} className="atl-char"
          initial={{ opacity: 0, y: '0.25em', filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: delay + i * 0.038, ease: [0.16, 1, 0.3, 1] }}>
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  );
}

function Reveal({ children, delay = 0, y = 20 }: { children: ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/* ── Corner compass decoration ────────────────────────────────────── */
function CornerCompass() {
  return (
    <svg className="atl-cover-corner" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="37" stroke="rgba(196,162,78,0.4)" strokeWidth="0.8"/>
      <circle cx="40" cy="40" r="30" stroke="rgba(196,162,78,0.2)" strokeWidth="0.6"/>
      {Array.from({length:32},(_,i)=>{
        const a=(i*11.25*Math.PI)/180, isCard=i%8===0, r1=37, r2=isCard?32:34;
        return <line key={i} x1={40+r1*Math.sin(a)} y1={40-r1*Math.cos(a)} x2={40+r2*Math.sin(a)} y2={40-r2*Math.cos(a)} stroke="rgba(196,162,78,0.4)" strokeWidth={isCard?0.9:0.5}/>;
      })}
      <line x1="40" y1="4"  x2="40" y2="76" stroke="rgba(196,162,78,0.18)" strokeWidth="0.6"/>
      <line x1="4"  y1="40" x2="76" y2="40" stroke="rgba(196,162,78,0.18)" strokeWidth="0.6"/>
      <polygon points="40,3 42.5,10 40,17 37.5,10"  fill="rgba(196,162,78,0.7)"/>
      <polygon points="40,63 42.5,70 40,77 37.5,70" fill="rgba(196,162,78,0.4)"/>
      <circle cx="40" cy="40" r="6" stroke="rgba(196,162,78,0.5)" strokeWidth="0.8"/>
      <circle cx="40" cy="40" r="2" fill="rgba(196,162,78,0.6)"/>
    </svg>
  );
}

/* ── Route Map ─────────────────────────────────────────────────────── */
function RouteMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 80%', 'end 20%'] });
  const route1 = useTransform(scrollYProgress, [0.05, 0.55], [0, 1]);
  const route2 = useTransform(scrollYProgress, [0.52, 0.75], [0, 1]);
  const city1Opacity = useTransform(scrollYProgress, [0.0, 0.1], [0, 1]);
  const city2Opacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const city3Opacity = useTransform(scrollYProgress, [0.7, 0.8], [0, 1]);

  /* Equirectangular projection, lon 0–120°E, lat -10–65°N, 700×380 */
  const cities = [
    { label: 'Hannover',    sub: '52°22′N  09°44′E', x: 57,  y: 64,  opacity: city1Opacity },
    { label: 'Banda Aceh',  sub: '05°33′N  95°19′E', x: 556, y: 302, opacity: city2Opacity },
    { label: 'Bukittinggi', sub: '00°18′S  100°22′E', x: 586, y: 331, opacity: city3Opacity },
  ];

  return (
    <div ref={sectionRef} className="atl-map-wrap">
      <svg className="atl-map-svg" viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" aria-label="Route map from Hannover to Aceh">

        {/* Graticule — every 15° */}
        {[0,15,30,45,60,75,90,105,120].map(lon => {
          const x = (lon/120)*700;
          return <line key={`v${lon}`} x1={x} y1={0} x2={x} y2={400} className="atl-graticule"/>;
        })}
        {[-10,5,20,35,50,65].map(lat => {
          const y = ((65-lat)/75)*380;
          return <line key={`h${lat}`} x1={0} y1={y} x2={700} y2={y} className="atl-graticule"/>;
        })}

        {/* Land masses — impressionistic silhouettes */}
        {/* Europe */}
        <path className="atl-land" d="M 0,68 L 18,48 L 45,36 L 76,26 L 96,36 L 108,62 L 98,82 L 76,96 L 48,102 L 22,96 L 4,80 Z"/>
        {/* Scandinavian peninsula */}
        <path className="atl-land" d="M 52,26 L 72,10 L 86,16 L 92,36 L 84,56 L 72,62 L 58,52 Z"/>
        {/* Iberian */}
        <path className="atl-land" d="M 4,98 L 38,92 L 46,120 L 36,148 L 12,143 L 0,118 Z"/>
        {/* Italian peninsula */}
        <path className="atl-land" d="M 54,110 L 66,106 L 70,148 L 60,168 L 51,152 L 50,126 Z"/>
        {/* Arabian peninsula */}
        <path className="atl-land" d="M 228,136 L 268,126 L 294,142 L 300,188 L 278,214 L 236,208 L 216,182 L 220,156 Z"/>
        {/* Indian subcontinent */}
        <path className="atl-land" d="M 308,132 L 364,122 L 382,156 L 374,224 L 342,255 L 304,222 L 293,178 Z"/>
        {/* Sri Lanka */}
        <path className="atl-land" d="M 348,254 L 361,248 L 369,265 L 358,278 L 346,270 Z"/>
        {/* Indochina */}
        <path className="atl-land" d="M 432,154 L 484,143 L 498,171 L 493,212 L 462,232 L 433,212 L 416,185 Z"/>
        {/* Malay peninsula */}
        <path className="atl-land" d="M 460,218 L 476,212 L 492,242 L 496,282 L 470,288 L 456,262 Z"/>
        {/* Sumatra — the key island */}
        <path className="atl-land" d="M 478,258 L 534,238 L 574,264 L 607,302 L 616,348 L 582,366 L 532,352 L 493,313 L 476,283 Z"/>
        {/* Java */}
        <path className="atl-land" d="M 518,372 L 568,363 L 602,372 L 622,386 L 582,397 L 522,387 Z"/>
        {/* Borneo */}
        <path className="atl-land" d="M 580,226 L 642,220 L 682,252 L 687,302 L 652,332 L 602,322 L 572,282 Z"/>

        {/* Animated route lines */}
        <motion.path
          d="M 57,64 C 200,18 432,98 556,302"
          className="atl-route"
          style={{ pathLength: route1 }}
          strokeDasharray="4 0"
        />
        <motion.path
          d="M 556,302 C 566,312 576,322 586,331"
          className="atl-route"
          style={{ pathLength: route2 }}
          strokeWidth="1.2"
        />

        {/* City markers */}
        {cities.map(({ label, sub, x, y, opacity }) => {
          const isRight = x > 400;
          return (
            <motion.g key={label} style={{ opacity }}>
              <circle cx={x} cy={y} r="10" className="atl-city-ring"/>
              <circle cx={x} cy={y} r="3.5" className="atl-city-dot"/>
              <text
                x={isRight ? x - 14 : x + 14}
                y={y - 8}
                className="atl-city-name"
                textAnchor={isRight ? 'end' : 'start'}>
                {label}
              </text>
              <text
                x={isRight ? x - 14 : x + 14}
                y={y + 5}
                className="atl-city-coord"
                textAnchor={isRight ? 'end' : 'start'}>
                {sub}
              </text>
            </motion.g>
          );
        })}

      </svg>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────────────── */
export default function AtlasInvitation() {
  const [lang, setLang]     = useState<Lang>('en');
  const [opened, setOpened] = useState(false);
  const c = copy[lang];

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [opened]);

  return (
    <main className="atl-page">

      <div className="atl-lang" aria-label="Language">
        <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
        <button className={lang === 'id' ? 'on' : ''} onClick={() => setLang('id')}>ID</button>
      </div>

      {/* ── Cover ──────────────────────────────────────────── */}
      <section className="atl-cover">
        <CornerCompass />

        <motion.p className="atl-kicker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}>
          {c.kicker}
        </motion.p>

        <div className="atl-names">
          <SplitText text="Taslia" delay={0.4} className="atl-name" />
          <motion.div className="atl-amp-line"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, delay: 1.0 }}>
            <div className="atl-amp-rule" />
            <span className="atl-amp">&amp;</span>
            <div className="atl-amp-rule" />
          </motion.div>
          <SplitText text="Varian" delay={1.1} className="atl-name" />
        </div>

        <motion.div className="atl-meta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.9 }}>
          <p className="atl-date-str">04 · VI · MMXXVI</p>
          <p className="atl-loc">Aceh, Indonesia</p>
        </motion.div>

        <motion.button className="atl-cta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.3 }}
          onClick={() => setOpened(true)}>
          <span>{c.cta}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1"/>
            <polyline points="3,9 7,13 11,9" stroke="currentColor" strokeWidth="1" fill="none"/>
          </svg>
        </motion.button>
      </section>

      {/* ── Content ─────────────────────────────────────────── */}
      <AnimatePresence>
        {opened && (
          <motion.div key="atlas-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}>

            <div className="atl-divider" />

            {/* Map */}
            <section className="atl-map-section">
              <Reveal>
                <div className="atl-map-head">
                  <p className="atl-map-eyebrow">{c.mapEyebrow}</p>
                  <h2 className="atl-map-title" style={{ whiteSpace: 'pre-line' }}>{c.mapTitle}</h2>
                </div>
              </Reveal>
              <RouteMap />
              <Reveal delay={0.1}>
                <div className="atl-map-caption">
                  <p>{c.mapCaption}</p>
                </div>
              </Reveal>
            </section>

            <div className="atl-divider" />

            {/* Story */}
            <section className="atl-story">
              <Reveal><p className="atl-story-label">{c.storyLabel}</p></Reveal>
              <Reveal delay={0.1} y={30}>
                <blockquote className="atl-story-quote">{c.storyQuote}</blockquote>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="atl-story-body">{c.storyBody}</p>
              </Reveal>
            </section>

            <div className="atl-divider" />

            {/* Date */}
            <section className="atl-date-block">
              <div className="atl-date-inner">
                <Reveal y={40}>
                  <p className="atl-date-num">04</p>
                </Reveal>
                <div className="atl-date-right">
                  <Reveal delay={0.1}><p className="atl-date-save">{c.dateSave}</p></Reveal>
                  <Reveal delay={0.18}><p className="atl-date-month">{c.dateMonth}</p></Reveal>
                  <Reveal delay={0.26}><p className="atl-date-place">{c.dateLoc}</p></Reveal>
                </div>
              </div>
              <Reveal delay={0.3}>
                <div className="atl-date-actions">
                  <a href="/taslia-varian-wedding.ics" download className="atl-btn atl-btn-solid">{c.cal}</a>
                  <a href={googleUrl} target="_blank" rel="noreferrer" className="atl-btn atl-btn-ghost">{c.gcal}</a>
                </div>
              </Reveal>
            </section>

            <div className="atl-divider" />

            {/* Gallery */}
            <section className="atl-gallery">
              <Reveal><span className="atl-gallery-label">{c.galleryLabel}</span></Reveal>
              <motion.div className="atl-photo-grid"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
                {photos.map((src, i) => (
                  <motion.figure key={src} className="atl-photo"
                    variants={{ hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1 } }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                    <img src={src} alt={`Taslia and Varian, memory ${i + 1}`} loading="lazy" />
                  </motion.figure>
                ))}
              </motion.div>
            </section>

            <div className="atl-divider" />

            {/* Closing */}
            <section className="atl-closing">
              <Reveal y={30}>
                <p className="atl-closing-text">
                  {c.closingWith}
                  <span className="atl-closing-names">{c.closingNames}</span>
                </p>
                <p className="atl-closing-sub">{c.closingSub}</p>
              </Reveal>
            </section>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
