import { type ReactNode, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimate, useInView } from 'framer-motion';

/* ── Copy ────────────────────────────────────────── */
const copy = {
  en: {
    kicker: 'Save the Date',
    hint: 'Click the seal to open',
    storyLabel: 'Their Story',
    storyHead: 'From Hannover,\nwith love',
    storyBody: 'Taslia from Aceh and Varian from Bukittinggi first met while studying in Hannover. Small conversations in a foreign city became a story they now bring home.',
    dateSave: 'Save the date',
    dateMonth: 'June · 2026',
    dateLoc: 'Aceh, Indonesia',
    cal: 'Save to calendar',
    gcal: 'Google Calendar',
    galleryLabel: 'Little Memories',
    closingWith: 'With love,',
    closingNames: 'Taslia & Varian',
    closingSub: '04 · VI · MMXXVI · Aceh, Indonesia',
  },
  id: {
    kicker: 'Tandai Tanggalnya',
    hint: 'Klik segel untuk membuka',
    storyLabel: 'Kisah Mereka',
    storyHead: 'Dari Hannover,\ndengan cinta',
    storyBody: 'Taslia dari Aceh dan Varian dari Bukittinggi bertemu saat studi di Hannover. Dari percakapan kecil di kota asing, tumbuh kisah yang kini mereka bawa pulang.',
    dateSave: 'Tandai tanggalnya',
    dateMonth: 'Juni · 2026',
    dateLoc: 'Aceh, Indonesia',
    cal: 'Simpan ke kalender',
    gcal: 'Google Calendar',
    galleryLabel: 'Sedikit Kenangan',
    closingWith: 'Dengan cinta,',
    closingNames: 'Taslia & Varian',
    closingSub: '04 · VI · MMXXVI · Aceh, Indonesia',
  },
} as const;
type Lang = keyof typeof copy;

const googleUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Taslia%20%26%20Varian%20Wedding&dates=20260604/20260605&location=Aceh%2C%20Indonesia';
const photos = ['/images/2023_1.jpeg', '/images/2023_2.jpeg', '/images/2023_3.jpeg', '/images/2024_2.jpeg'];

/* ── Pure SVG florals: no raster crop artifacts ───────────── */
function GardenFloralFrame() {
  const leaves = [
    { x: 72, y: 198, r: -42 }, { x: 96, y: 238, r: 30 }, { x: 122, y: 276, r: -36 },
    { x: 744, y: 310, r: 38 }, { x: 716, y: 354, r: -30 }, { x: 686, y: 396, r: 34 },
  ];
  const berries = [
    [746, 132], [772, 154], [718, 166], [107, 620], [134, 642], [88, 662],
  ];

  return (
    <svg className="grd-svg-frame" viewBox="0 0 820 1180" aria-hidden="true">
      <defs>
        <filter id="grd-soften" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <radialGradient id="grd-mauve-petal" cx="42%" cy="38%" r="68%">
          <stop offset="0%" stopColor="#fff5fb" stopOpacity="0.95" />
          <stop offset="46%" stopColor="#d6a1be" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#8d5a9f" stopOpacity="0.08" />
        </radialGradient>
        <radialGradient id="grd-blue-petal" cx="48%" cy="42%" r="64%">
          <stop offset="0%" stopColor="#f9fbff" stopOpacity="0.92" />
          <stop offset="60%" stopColor="#aebcdd" stopOpacity="0.58" />
          <stop offset="100%" stopColor="#7e8aae" stopOpacity="0.06" />
        </radialGradient>
        <linearGradient id="grd-stem" x1="0" x2="1">
          <stop offset="0%" stopColor="#798564" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#798564" stopOpacity="0.54" />
        </linearGradient>
      </defs>

      <g className="grd-svg-spray grd-svg-spray-top">
        <path className="grd-svg-stem" d="M62 292C152 194 248 144 372 118" />
        <path className="grd-svg-stem thin" d="M182 188C150 132 104 96 42 74" />
        <path className="grd-svg-stem thin" d="M238 158C228 96 252 48 310 16" />
        {leaves.slice(0, 3).map((leaf, i) => (
          <ellipse key={i} cx={leaf.x} cy={leaf.y} rx="24" ry="54" fill="#84906c" fillOpacity="0.22" transform={`rotate(${leaf.r} ${leaf.x} ${leaf.y})`} />
        ))}
        <g className="grd-svg-rose" transform="translate(210 24) rotate(-12)">
          <path d="M78 18C130-14 208 12 226 82C244 150 184 212 116 196C48 180 14 104 48 48C56 34 64 24 78 18Z" fill="url(#grd-mauve-petal)" />
          <path d="M104 58C136 34 186 48 198 92C210 134 174 168 132 160C88 152 70 100 96 66Z" fill="#f0c6dc" fillOpacity="0.5" />
          <path className="grd-svg-ink" d="M70 38C116 0 190 16 218 78C246 140 188 204 122 202C56 200 16 136 42 74C48 60 58 48 70 38Z" />
        </g>
        <g className="grd-svg-blue" transform="translate(28 154) rotate(10)">
          <path d="M36 88C56 32 130 20 170 68C210 116 174 186 110 190C50 194 12 140 36 88Z" fill="url(#grd-blue-petal)" />
          <path className="grd-svg-ink muted" d="M42 92C64 44 126 34 160 72C194 110 166 174 112 184C58 194 18 142 42 92Z" />
          <circle cx="104" cy="112" r="16" fill="#7f87a0" fillOpacity="0.16" />
        </g>
      </g>

      <g className="grd-svg-spray grd-svg-spray-side">
        <path className="grd-svg-stem" d="M742 270C660 380 626 506 650 662" />
        {leaves.slice(3).map((leaf, i) => (
          <ellipse key={i} cx={leaf.x} cy={leaf.y} rx="22" ry="52" fill="#84906c" fillOpacity="0.24" transform={`rotate(${leaf.r} ${leaf.x} ${leaf.y})`} />
        ))}
        {berries.slice(0, 3).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="10" fill="#bd7896" fillOpacity="0.34" />)}
      </g>

      <g className="grd-svg-spray grd-svg-spray-bottom">
        <path className="grd-svg-stem" d="M106 932C206 840 328 802 488 812" />
        <path className="grd-svg-stem thin" d="M196 878C160 788 104 734 26 708" />
        {berries.slice(3).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="10" fill="#bd7896" fillOpacity="0.3" />)}
        <g className="grd-svg-rose" transform="translate(442 768) rotate(24)">
          <path d="M78 18C130-14 208 12 226 82C244 150 184 212 116 196C48 180 14 104 48 48C56 34 64 24 78 18Z" fill="url(#grd-mauve-petal)" />
          <path d="M104 58C136 34 186 48 198 92C210 134 174 168 132 160C88 152 70 100 96 66Z" fill="#f0c6dc" fillOpacity="0.46" />
          <path className="grd-svg-ink" d="M70 38C116 0 190 16 218 78C246 140 188 204 122 202C56 200 16 136 42 74C48 60 58 48 70 38Z" />
        </g>
      </g>
    </svg>
  );
}

/* ── Compass seal (geometric only — florals come from PNGs) ── */
function CompassSeal({ onOpen }: { onOpen: () => void }) {
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const a = (i * 7.5 * Math.PI) / 180;
    const isCard = i % 12 === 0, isOrd = i % 6 === 0 && !isCard;
    const r1 = 92, r2 = isCard ? 81 : isOrd ? 85 : 89;
    return { x1: 100 + r1 * Math.sin(a), y1: 100 - r1 * Math.cos(a), x2: 100 + r2 * Math.sin(a), y2: 100 - r2 * Math.cos(a), isCard };
  });

  return (
    <button className="grd-seal-btn" onClick={onOpen} aria-label="Open invitation">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="grd-seal-svg">
        <defs>
          <path id="s-arc-up"   d="M 14,100 A 86,86 0 0,1 186,100" />
          <path id="s-arc-down" d="M 20,100 A 80,80 0 0,0 180,100" />
          <radialGradient id="s-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#9a7aaa" stopOpacity=".18"/>
            <stop offset="100%" stopColor="#9a7aaa" stopOpacity="0"/>
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="98" fill="url(#s-glow)"/>
        <circle cx="100" cy="100" r="94" stroke="rgba(92,61,106,.5)"  strokeWidth="1.4"/>
        <circle cx="100" cy="100" r="92" stroke="rgba(92,61,106,.22)" strokeWidth=".7"/>

        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={t.isCard ? 'rgba(92,61,106,.6)' : 'rgba(92,61,106,.28)'}
            strokeWidth={t.isCard ? 1.1 : 0.6}/>
        ))}

        <text fontFamily="'Cormorant Garamond',serif" fontStyle="italic" fontSize="9.5" fill="rgba(92,61,106,.85)" letterSpacing="2.8">
          <textPath href="#s-arc-up"   startOffset="50%" textAnchor="middle">Taslia Khaira</textPath>
        </text>
        <text fontFamily="'Cormorant Garamond',serif" fontStyle="italic" fontSize="9.5" fill="rgba(92,61,106,.85)" letterSpacing="2.8">
          <textPath href="#s-arc-down" startOffset="50%" textAnchor="middle">Varian Furqan</textPath>
        </text>

        <circle cx="100" cy="100" r="62" stroke="rgba(92,61,106,.38)" strokeWidth="1.1"/>
        <circle cx="100" cy="100" r="40" stroke="rgba(92,61,106,.2)"  strokeWidth=".8"/>

        <line x1="100" y1="8"   x2="100" y2="192" stroke="rgba(92,61,106,.16)" strokeWidth=".7"/>
        <line x1="8"   y1="100" x2="192" y2="100" stroke="rgba(92,61,106,.16)" strokeWidth=".7"/>

        <polygon points="100,5 103,13 100,21 97,13"   fill="rgba(92,61,106,.65)"/>
        <polygon points="100,179 103,187 100,195 97,187" fill="rgba(92,61,106,.4)"/>
        <polygon points="179,100 187,103 195,100 187,97" fill="rgba(92,61,106,.4)"/>
        <polygon points="5,100 13,103 21,100 13,97"   fill="rgba(92,61,106,.4)"/>

        <text x="100" y="96"  fontFamily="'Cormorant Garamond',serif" fontStyle="italic" fontSize="21" fontWeight="300" fill="rgba(92,61,106,.92)" textAnchor="middle" letterSpacing="-0.5">04 · VI</text>
        <text x="100" y="114" fontFamily="'Jost',sans-serif" fontSize="6" fill="rgba(92,61,106,.5)" textAnchor="middle" letterSpacing="2.5">MMXXVI · ACEH</text>

        {/* Pulse ring */}
        <circle cx="100" cy="100" r="94" stroke="rgba(154,122,170,.45)" strokeWidth="1.4"
          style={{ animation: 'sealPulse 2.6s ease-in-out infinite' }}/>
      </svg>
    </button>
  );
}

/* ── Scroll reveal ───────────────────────────────── */
function Reveal({ children, delay = 0, y = 22 }: { children: ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/* ── Main ────────────────────────────────────────── */
export default function GardenInvitation() {
  const [lang, setLang] = useState<Lang>('en');
  const [opened, setOpened] = useState(false);
  const [scope, animate] = useAnimate();
  const c = copy[lang];

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
    document.documentElement.style.overflow = opened ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [opened]);

  const handleOpen = async () => {
    try {
      await animate('.grd-seal-btn', { scale: 0.94 }, { duration: 0.08 });
      animate('.grd-cover-inner', { opacity: 0, scale: 0.96 }, { duration: 0.4 });
      await animate('.grd-cover', { opacity: 0 }, { duration: 0.45, delay: 0.12 });
    } catch {
      // animation failed — open anyway
    }
    setOpened(true);
  };

  return (
    <main className="grd" ref={scope}>
      <style>{`@keyframes sealPulse { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:.1;transform:scale(1.05)} }`}</style>

      <div className="grd-lang">
        <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
        <button className={lang === 'id' ? 'on' : ''} onClick={() => setLang('id')}>ID</button>
      </div>

      {/* ── Cover ──────────────────────────────────── */}
      {!opened && (
        <div className="grd-cover">
          {/* Pure SVG floral frame: avoids raster stretching/crop artifacts */}
          <GardenFloralFrame />

          {/* Center content */}
          <div className="grd-cover-inner">
            <p className="grd-cover-text grd-kicker">{c.kicker}</p>
            <CompassSeal onOpen={handleOpen}/>
            <div className="grd-cover-text grd-cover-names">
              <span className="grd-cover-name">Taslia</span>
              <span className="grd-cover-amp">&amp;</span>
              <span className="grd-cover-name">Varian</span>
            </div>
            <p className="grd-cover-text grd-cover-hint">{c.hint}</p>
          </div>
        </div>
      )}

      {/* ── Editorial content ─────────────────────── */}
      <AnimatePresence>
        {opened && (
          <motion.div className="grd-content" key="content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>

            {/* Hero */}
            <div className="grd-hero">
              <img src="/floral/wisteria-top.png" className="grd-hero-wisteria" alt="" aria-hidden="true"/>
              <div className="grd-hero-text">
                <Reveal><p className="grd-label">{c.kicker}</p></Reveal>
                <Reveal delay={0.08}>
                  <h1 className="grd-hero-names">
                    <span>Taslia</span>
                    <em>&amp;</em>
                    <span>Varian</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.18}>
                  <p className="grd-hero-date">04 · June · 2026 · Aceh, Indonesia</p>
                </Reveal>
              </div>
            </div>

            <div className="grd-rule"/>

            {/* Story */}
            <div className="grd-story">
              <div className="grd-story-photo">
                <img src="/images/2023_3.jpeg" alt="Taslia and Varian"/>
                <img src="/floral/corner-top.png" className="grd-corner-top" alt="" aria-hidden="true"/>
              </div>
              <div className="grd-story-text">
                <Reveal><p className="grd-label">{c.storyLabel}</p></Reveal>
                <Reveal delay={0.1}>
                  <h2 className="grd-story-heading" style={{ whiteSpace: 'pre-line' }}>{c.storyHead}</h2>
                </Reveal>
                <Reveal delay={0.2}><p className="grd-story-body">{c.storyBody}</p></Reveal>
              </div>
            </div>

            <div className="grd-rule"/>

            {/* Date */}
            <div className="grd-date-block">
              <img src="/floral/corner-bottom.png" className="grd-date-floral" alt="" aria-hidden="true"/>
              <div className="grd-date-inner">
                <Reveal y={40}><p className="grd-date-big">04</p></Reveal>
                <div className="grd-date-right">
                  <Reveal delay={0.1}><p className="grd-label">{c.dateSave}</p></Reveal>
                  <Reveal delay={0.16}><p className="grd-date-month">{c.dateMonth}</p></Reveal>
                  <Reveal delay={0.22}><p className="grd-date-loc">{c.dateLoc}</p></Reveal>
                  <Reveal delay={0.3}>
                    <div className="grd-actions">
                      <a href="/taslia-varian-wedding.ics" download className="grd-btn grd-btn-solid">{c.cal}</a>
                      <a href={googleUrl} target="_blank" rel="noreferrer" className="grd-btn grd-btn-ghost">{c.gcal}</a>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>

            <div className="grd-rule"/>

            {/* Gallery */}
            <div className="grd-gallery">
              <img src="/floral/lilac-banner.png" className="grd-lilac-banner" alt="" aria-hidden="true"/>
              <div className="grd-gallery-inner">
                <Reveal><span className="grd-label">{c.galleryLabel}</span></Reveal>
                <motion.div className="grd-photo-grid"
                  initial="hidden" whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
                  {photos.map((src, i) => (
                    <motion.figure key={src}
                      className={`grd-photo grd-photo-${String.fromCharCode(97 + i)}`}
                      variants={{ hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1 } }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                      <img src={src} alt={`Memory ${i + 1}`} loading="lazy"/>
                    </motion.figure>
                  ))}
                </motion.div>
              </div>
            </div>

            <div className="grd-rule"/>

            {/* Closing */}
            <div className="grd-closing">
              <img src="/floral/bouquet-purple.png" className="grd-closing-bouquet" alt="" aria-hidden="true"/>
              <Reveal y={30}>
                <p className="grd-closing-with">{c.closingWith}</p>
                <p className="grd-closing-names">{c.closingNames}</p>
                <p className="grd-closing-sub">{c.closingSub}</p>
              </Reveal>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
