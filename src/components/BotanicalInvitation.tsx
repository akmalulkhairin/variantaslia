import { type ReactNode, useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, AnimatePresence, stagger } from 'framer-motion';

const copy = {
  en: {
    open: 'Open the Invitation',
    save: 'Save the date',
    date: '04 June 2026',
    place: 'Aceh, Indonesia',
    route: 'Aceh · Hannover · Bukittinggi',
    intro: 'Two Sumatran hearts met far from home, in Hannover, and found their way back to the same promise.',
    storyTitle: 'From a quiet crossing to a homecoming',
    story: 'Taslia from Aceh and Varian from Bukittinggi first met while studying in Hannover. What began as small conversations in a foreign city became a story they now bring home to family and friends.',
    details: 'Wedding details',
    detailsBody: 'Full ceremony and reception details will follow. For now, please keep this date close.',
    calendar: 'Save to calendar',
    google: 'Open in Google Calendar',
    gallery: 'Little memories',
    closing: 'With love, Taslia & Varian',
  },
  id: {
    open: 'Buka Undangan',
    save: 'Tandai tanggalnya',
    date: '04 Juni 2026',
    place: 'Aceh, Indonesia',
    route: 'Aceh · Hannover · Bukittinggi',
    intro: 'Dua hati dari Sumatra bertemu jauh dari rumah, di Hannover, lalu menemukan jalan menuju janji yang sama.',
    storyTitle: 'Dari pertemuan sederhana menuju pulang bersama',
    story: 'Taslia dari Aceh dan Varian dari Bukittinggi bertemu saat menempuh studi di Hannover. Dari percakapan kecil di kota asing, tumbuh kisah yang kini mereka bawa pulang kepada keluarga dan sahabat.',
    details: 'Detail pernikahan',
    detailsBody: 'Detail akad dan resepsi akan menyusul. Untuk saat ini, mohon simpan tanggal ini terlebih dahulu.',
    calendar: 'Simpan ke kalender',
    google: 'Buka di Google Calendar',
    gallery: 'Sedikit kenangan',
    closing: 'Dengan cinta, Taslia & Varian',
  },
} as const;

type Lang = keyof typeof copy;

const googleUrl =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Taslia%20%26%20Varian%20Wedding&dates=20260604/20260605&details=Wedding%20celebration%20of%20Taslia%20Khaira%20and%20Varian%20Furqan&location=Aceh%2C%20Indonesia';

const photos = [
  '/images/2023_1.jpeg',
  '/images/2023_2.jpeg',
  '/images/2023_3.jpeg',
  '/images/2024_1.jpeg',
];

/* ── Compass Rose SVG with Framer Motion ink-draw ── */
function CompassRose() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const rings    = svgRef.current.querySelectorAll<SVGCircleElement>('.bot-ring');
    const axes     = svgRef.current.querySelectorAll<SVGLineElement>('.bot-axis, .bot-axis-ord');
    const sprigs   = svgRef.current.querySelectorAll<SVGGElement>('.bot-sprig-group');
    const diamonds = svgRef.current.querySelectorAll<SVGPolygonElement>('.bot-diamond');
    const arcTexts = svgRef.current.querySelectorAll<SVGTextElement>('.bot-arc-name');
    const center   = svgRef.current.querySelectorAll<SVGTextElement>('.bot-center-num, .bot-center-label');

    animate(rings,    { pathLength: [0, 1], opacity: [0, 1] }, { duration: 1.4, delay: stagger(0.12), ease: 'easeOut' });
    animate(axes,     { pathLength: [0, 1], opacity: [0, 0.22] }, { duration: 1.0, delay: stagger(0.08, { startDelay: 0.6 }), ease: 'easeOut' });
    animate(diamonds, { opacity: [0, 1], scale: [0.4, 1] }, { duration: 0.4, delay: stagger(0.06, { startDelay: 1.0 }), ease: 'backOut' });
    animate(sprigs,   { opacity: [0, 0.9], y: [6, 0] }, { duration: 0.7, delay: stagger(0.1, { startDelay: 1.2 }), ease: 'easeOut' });
    animate(arcTexts, { opacity: [0, 1] }, { duration: 0.9, delay: stagger(0.3, { startDelay: 1.5 }) });
    animate(center,   { opacity: [0, 1], y: [4, 0] }, { duration: 0.8, delay: stagger(0.2, { startDelay: 1.8 }) });
  }, []);

  const ticks = Array.from({ length: 72 }, (_, i) => {
    const deg = i * 5;
    const rad = (deg * Math.PI) / 180;
    const isCardinal = deg % 90 === 0;
    const isOrdinal = deg % 45 === 0 && !isCardinal;
    const isMajor = deg % 15 === 0 && !isCardinal && !isOrdinal;
    const r1 = 183;
    const r2 = isCardinal ? 163 : isOrdinal ? 171 : isMajor ? 176 : 179;
    return {
      x1: 200 + r1 * Math.sin(rad), y1: 200 - r1 * Math.cos(rad),
      x2: 200 + r2 * Math.sin(rad), y2: 200 - r2 * Math.cos(rad),
      cls: `bot-tick${isCardinal ? ' major' : isOrdinal ? ' ord' : ''}`,
    };
  });

  const ordinals = [45, 135, 225, 315];

  return (
    <svg ref={svgRef} className="bot-compass" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <path id="arc-up"   d="M 36,200 A 164,164 0 0,1 364,200" />
        <path id="arc-down" d="M 46,200 A 154,154 0 0,0 354,200" />
        <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#c8a24e" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#c8a24e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#c8a24e" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#c8a24e" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="200" r="196" fill="url(#bg-glow)" opacity="0" />

      {/* Outer rings */}
      <circle cx="200" cy="200" r="192" className="bot-ring" opacity="0" />
      <circle cx="200" cy="200" r="183" className="bot-ring bot-ring-thin" opacity="0" />

      {/* Ticks */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} className={t.cls} />
      ))}

      {/* Names on arc */}
      <text className="bot-arc-name" opacity="0">
        <textPath href="#arc-up" startOffset="50%" textAnchor="middle">TASLIA KHAIRA</textPath>
      </text>
      <text className="bot-arc-name" opacity="0">
        <textPath href="#arc-down" startOffset="50%" textAnchor="middle">VARIAN FURQAN</textPath>
      </text>

      {/* Middle rings */}
      <circle cx="200" cy="200" r="132" className="bot-ring" opacity="0" />
      <circle cx="200" cy="200" r="120" className="bot-ring bot-ring-thin" opacity="0" />
      <circle cx="200" cy="200" r="72"  className="bot-ring" opacity="0" />
      <circle cx="200" cy="200" r="36"  className="bot-ring bot-ring-thin" opacity="0" />

      {/* Cardinal cross */}
      <line x1="200" y1="10"  x2="200" y2="390" className="bot-axis" opacity="0" />
      <line x1="10"  y1="200" x2="390" y2="200" className="bot-axis" opacity="0" />

      {/* Ordinal lines */}
      {ordinals.map(deg => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={deg}
            x1={200 + 120 * Math.sin(rad)} y1={200 - 120 * Math.cos(rad)}
            x2={200 + 183 * Math.sin(rad)} y2={200 - 183 * Math.cos(rad)}
            className="bot-axis-ord" opacity="0" />
        );
      })}

      {/* Cardinal diamonds */}
      <polygon points="200,5 204,14 200,23 196,14"  className="bot-diamond" opacity="0" style={{ transformOrigin: '200px 14px' }} />
      <polygon points="200,377 204,386 200,395 196,386" className="bot-diamond" opacity="0" style={{ transformOrigin: '200px 386px' }} />
      <polygon points="377,200 386,204 395,200 386,196" className="bot-diamond" opacity="0" style={{ transformOrigin: '386px 200px' }} />
      <polygon points="5,200 14,204 23,200 14,196"  className="bot-diamond" opacity="0" style={{ transformOrigin: '14px 200px' }} />

      {/* Botanical sprigs */}
      <g className="bot-sprig-group" opacity="0" transform="translate(200,8)">
        <path d="M0,0 C-4,-12 -10,-20 -6,-30 M0,0 C4,-12 10,-20 6,-30 M0,0 C0,-14 0,-28 0,-38" className="bot-sprig" />
        <ellipse cx="-9" cy="-20" rx="4.5" ry="10" className="bot-sprig" transform="rotate(-24,-9,-20)" />
        <ellipse cx="9"  cy="-20" rx="4.5" ry="10" className="bot-sprig" transform="rotate(24,9,-20)" />
      </g>
      <g className="bot-sprig-group" opacity="0" transform="translate(200,392) scale(1,-1) translate(0,-8)">
        <path d="M0,0 C-4,-12 -10,-20 -6,-30 M0,0 C4,-12 10,-20 6,-30 M0,0 C0,-14 0,-28 0,-38" className="bot-sprig" />
        <ellipse cx="-9" cy="-20" rx="4.5" ry="10" className="bot-sprig" transform="rotate(-24,-9,-20)" />
        <ellipse cx="9"  cy="-20" rx="4.5" ry="10" className="bot-sprig" transform="rotate(24,9,-20)" />
      </g>
      <g className="bot-sprig-group" opacity="0" transform="translate(392,200) rotate(90) translate(0,0)">
        <path d="M0,0 C-4,-12 -10,-20 -6,-30 M0,0 C4,-12 10,-20 6,-30 M0,0 C0,-14 0,-28 0,-38" className="bot-sprig" />
        <ellipse cx="-9" cy="-20" rx="4.5" ry="10" className="bot-sprig" transform="rotate(-24,-9,-20)" />
        <ellipse cx="9"  cy="-20" rx="4.5" ry="10" className="bot-sprig" transform="rotate(24,9,-20)" />
      </g>
      <g className="bot-sprig-group" opacity="0" transform="translate(8,200) rotate(-90)">
        <path d="M0,0 C-4,-12 -10,-20 -6,-30 M0,0 C4,-12 10,-20 6,-30 M0,0 C0,-14 0,-28 0,-38" className="bot-sprig" />
        <ellipse cx="-9" cy="-20" rx="4.5" ry="10" className="bot-sprig" transform="rotate(-24,-9,-20)" />
        <ellipse cx="9"  cy="-20" rx="4.5" ry="10" className="bot-sprig" transform="rotate(24,9,-20)" />
      </g>

      {/* Center glow + inscription */}
      <circle cx="200" cy="200" r="34" fill="url(#center-glow)" />
      <text x="200" y="194" className="bot-center-num"   textAnchor="middle" opacity="0">04</text>
      <text x="200" y="215" className="bot-center-label" textAnchor="middle" opacity="0">JUNE · 2026</text>
    </svg>
  );
}

/* ── Herbarium sprig decoration ──────────────────── */
function HerbariumSprig() {
  return (
    <svg className="bot-herbarium-sprig" viewBox="0 0 120 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M60 268 C60 200 54 140 60 80"                    className="bot-h-stem" />
      <path d="M60 220 C40 200 22 192 10 198 C18 212 40 218 60 220Z" className="bot-h-leaf" />
      <path d="M60 190 C80 170 98 166 108 172 C98 186 78 192 60 190Z" className="bot-h-leaf" />
      <path d="M60 155 C38 132 18 126 6 130 C14 148 38 156 60 155Z"  className="bot-h-leaf" />
      <path d="M60 125 C84 100 104 96 116 102 C106 120 84 128 60 125Z" className="bot-h-leaf" />
      <path d="M60 92 C44 68 32 56 24 56 C28 74 42 84 60 92Z"    className="bot-h-leaf bot-h-leaf-sm" />
      <path d="M60 82 C76 56 90 46 98 48 C94 66 78 78 60 82Z"    className="bot-h-leaf bot-h-leaf-sm" />
      <path d="M56 80 C52 56 44 38 38 28"                        className="bot-h-stem thin" />
      <path d="M38 28 C32 12 36 4 42 2"                          className="bot-h-stem thin" />
      <ellipse cx="42" cy="18" rx="8" ry="16"                    className="bot-h-bloom" transform="rotate(-14,42,18)" />
      <path d="M64 80 C68 54 78 36 84 26"                        className="bot-h-stem thin" />
      <ellipse cx="84" cy="12" rx="6" ry="14"                    className="bot-h-bloom" transform="rotate(18,84,12)" />
    </svg>
  );
}

/* ── Scroll-reveal wrapper ───────────────────────── */
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/* ── Main component ──────────────────────────────── */
export default function BotanicalInvitation() {
  const [lang, setLang]     = useState<Lang>('en');
  const [opened, setOpened] = useState(false);
  const c = copy[lang];

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [opened]);

  return (
    <main className={`bot-page${opened ? ' bot-opened' : ''}`}>

      <div className="bot-lang" aria-label="Language">
        <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
        <button className={lang === 'id' ? 'on' : ''} onClick={() => setLang('id')}>ID</button>
      </div>

      {/* ── Cover ──────────────────────────────────── */}
      <section className="bot-cover">
        <motion.div className="bot-compass-wrap"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
          <CompassRose />
          <div className="bot-compass-center-text">
            <p className="bot-kicker">Save the Date</p>
            <div className="bot-place-label">{c.place}</div>
          </div>
        </motion.div>

        <motion.div className="bot-cover-footer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.0, ease: 'easeOut' }}>
          <p className="bot-intro">{c.intro}</p>
          <button className="bot-open-btn" onClick={() => setOpened(true)}>
            <span>{c.open}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1"/>
              <polyline points="3,9 7,13 11,9" stroke="currentColor" strokeWidth="1" fill="none"/>
            </svg>
          </button>
        </motion.div>
      </section>

      {/* ── Content ───────────────────────────────── */}
      <AnimatePresence>
        {opened && (
          <motion.div className="bot-content"
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}>

            <section className="bot-story">
              <div className="bot-story-inner">
                <Reveal><HerbariumSprig /></Reveal>
                <div className="bot-story-text">
                  <Reveal><p className="bot-section-label">{c.route}</p></Reveal>
                  <Reveal delay={0.12}><h2>{c.storyTitle}</h2></Reveal>
                  <Reveal delay={0.22}><p>{c.story}</p></Reveal>
                </div>
              </div>
            </section>

            <section className="bot-date-section">
              <div className="bot-date-seal">
                <Reveal>
                  <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="bot-seal-svg" aria-hidden="true">
                    <defs>
                      <path id="seal-arc-up"   d="M 20,140 A 120,120 0 0,1 260,140" />
                      <path id="seal-arc-down" d="M 30,140 A 110,110 0 0,0 250,140" />
                    </defs>
                    <circle cx="140" cy="140" r="136" className="bot-ring" />
                    <circle cx="140" cy="140" r="126" className="bot-ring bot-ring-thin" />
                    {Array.from({ length: 48 }, (_, i) => {
                      const a = (i * 7.5 * Math.PI) / 180;
                      return <line key={i}
                        x1={140 + 126 * Math.sin(a)} y1={140 - 126 * Math.cos(a)}
                        x2={140 + 122 * Math.sin(a)} y2={140 - 122 * Math.cos(a)}
                        className="bot-tick" />;
                    })}
                    <text className="bot-arc-label"><textPath href="#seal-arc-up"   startOffset="50%" textAnchor="middle">ACEH · INDONESIA</textPath></text>
                    <text className="bot-arc-label"><textPath href="#seal-arc-down" startOffset="50%" textAnchor="middle">04 · VI · MMXXVI</textPath></text>
                    <circle cx="140" cy="140" r="92"  className="bot-ring" />
                    <circle cx="140" cy="140" r="54"  className="bot-ring bot-ring-thin" />
                    <line x1="140" y1="10"  x2="140" y2="270" className="bot-axis" />
                    <line x1="10"  y1="140" x2="270" y2="140" className="bot-axis" />
                    <text x="140" y="156" className="bot-seal-num" textAnchor="middle">04</text>
                  </svg>
                </Reveal>
                <div className="bot-date-text">
                  <Reveal><p className="bot-section-label">{c.save}</p></Reveal>
                  <Reveal delay={0.1}><p className="bot-date-month">June · 2026</p></Reveal>
                  <Reveal delay={0.2}><p className="bot-date-loc">{c.place}</p></Reveal>
                  <Reveal delay={0.3}>
                    <div className="bot-actions">
                      <a href="/taslia-varian-wedding.ics" download className="bot-btn-primary">{c.calendar}</a>
                      <a href={googleUrl} target="_blank" rel="noreferrer" className="bot-btn-ghost">{c.google}</a>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>

            <section className="bot-gallery">
              <Reveal><p className="bot-section-label">{c.gallery}</p></Reveal>
              <motion.div className="bot-photo-strip"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
                {photos.map((src, i) => (
                  <motion.figure key={src} className="bot-photo"
                    variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                    <img src={src} alt={`Taslia and Varian memory ${i + 1}`} loading="lazy" />
                  </motion.figure>
                ))}
              </motion.div>
            </section>

            <section className="bot-details">
              <Reveal><p className="bot-section-label">{c.details}</p></Reveal>
              <Reveal delay={0.1}><h2>{c.place}</h2></Reveal>
              <Reveal delay={0.2}><p>{c.detailsBody}</p></Reveal>
            </section>

            <footer className="bot-footer">
              <Reveal><span>{c.closing}</span></Reveal>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
