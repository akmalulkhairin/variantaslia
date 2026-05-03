import { useState, useEffect, useRef } from 'react';
import { useForm, ValidationError } from '@formspree/react';

const C = {
  en: {
    tap: 'tap to open',
    date: '04 · June · 2026',
    city1: 'Banda Aceh', city2: 'Bukittinggi', citymid: 'Hannover',
    sl: 'Our Story',
    st: 'Far from home,\nclose to each other',
    sb: 'She is from Aceh. He is from Bukittinggi, in the highlands of West Sumatra. They were far from home when they found each other at Leibniz Universität in Hannover, Germany — two Sumatran souls in a foreign city, and somehow, everything made sense.',
    gl: 'Hannover, Germany',
    gt: 'Moments together',
    gc: ['Hannover, 2023', 'Together, 2023', 'Germany, 2023', 'Hannover, 2024', 'Together, 2024', 'Germany, 2024'],
    cs: 'save the date',
    cm: 'June',
    cl: 'Aceh · Indonesia',
    cn: 'Full details to follow',
    open: 'Open invitation',
    introTag: '#TasliaAndVarian',
    introVerse: '"Far from home, two paths met in a city of rain and old streets. What began as a quiet crossing became a promise to return home together."',
    calHelp: 'Add this date to your phone calendar.',
    calPrimary: 'Save the date',
    calFallback: 'Having trouble? Add with Google Calendar',
  },
  id: {
    tap: 'sentuh untuk membuka',
    date: '04 · Juni · 2026',
    city1: 'Banda Aceh', city2: 'Bukittinggi', citymid: 'Hannover',
    sl: 'Cerita Kami',
    st: 'Jauh dari tanah air,\nnamun hati saling menemukan',
    sb: 'Taslia dari Aceh. Varian dari Bukittinggi, di dataran tinggi Sumatera Barat. Mereka jauh dari rumah ketika takdir mempertemukan keduanya di Leibniz Universität, Hannover, Jerman — dua jiwa Sumatra di kota asing, dan segalanya terasa seperti sudah seharusnya.',
    gl: 'Hannover, Jerman',
    gt: 'Kenangan dari Hannover',
    gc: ['Hannover, 2023', 'Berdua, 2023', 'Jerman, 2023', 'Hannover, 2024', 'Berdua, 2024', 'Jerman, 2024'],
    cs: 'tandai tanggalnya',
    cm: 'Juni',
    cl: 'Aceh · Indonesia',
    cn: 'Undangan resmi segera menyusul',
    open: 'Buka undangan',
    introTag: '#TasliaDanVarian',
    introVerse: '"Jauh dari rumah, dua jalan bertemu di kota hujan dan jalan-jalan tua. Dari pertemuan sederhana, tumbuh janji untuk pulang bersama."',
    calHelp: 'Tambahkan tanggal ini ke kalender HP Anda.',
    calPrimary: 'Simpan tanggal',
    calFallback: 'Jika gagal, buka lewat Google Calendar',
  },
} as const;

type Lang = keyof typeof C;
type Copy = (typeof C)[Lang];
type Variant = 'default' | 'compass' | 'seal' | 'floral' | 'minimal' | 'watercolor';
type DisplayNames = { bride: string; groom: string };

function useRv(threshold = 0.14) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, v] as const;
}

function useAudio(started: boolean) {
  const ref = useRef<HTMLAudioElement>(null);
  const rampRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!started) return;
    const a = ref.current;
    if (!a) return;
    a.volume = 0; a.playbackRate = 1.0; a.loop = true;
    a.play().then(() => {
      const TARGET = 0.28, DURATION = 16000, STEPS = 100;
      const step = TARGET / STEPS, interval = DURATION / STEPS;
      let n = 0;
      rampRef.current = setInterval(() => {
        n++;
        a.volume = Math.min(TARGET, step * n);
        if (n >= STEPS && rampRef.current) clearInterval(rampRef.current);
      }, interval);
    }).catch(() => {});
  }, [started]);

  return { ref, rampRef };
}

function AudioButton({ started, audioRef }: { started: boolean; audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const [playing, setPlaying] = useState(true);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().catch(() => {}); setPlaying(true); }
  };

  return (
    <button
      className={`audio-btn${started ? ' show' : ''}${playing ? ' playing' : ''}`}
      onClick={toggle}
      aria-label={playing ? 'Pause music' : 'Play music'}
    >
      <div className="audio-ring">
        <div className="audio-icon">
          {playing ? (
            <span className="audio-waves">
              <span className="aw" /><span className="aw" /><span className="aw" />
            </span>
          ) : (
            <span className="audio-pause-icon" />
          )}
        </div>
      </div>
      <span className="audio-label">music</span>
    </button>
  );
}

function Ornament() {
  return (
    <div className="ornament">
      <svg viewBox="0 0 280 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="24" x2="280" y2="24" stroke="rgba(201,169,122,0.18)" strokeWidth="1"/>
        <rect x="132" y="18" width="12" height="12" transform="rotate(45 138 24)" stroke="rgba(201,169,122,0.55)" strokeWidth="0.8" fill="none"/>
        <rect x="136" y="21" width="6" height="6" transform="rotate(45 139 24)" fill="rgba(201,169,122,0.15)"/>
        <circle cx="138" cy="24" r="1.2" fill="rgba(201,169,122,0.6)"/>
        {[-44, 44].map(dx => (
          <g key={dx} transform={`translate(${138 + dx},24)`}>
            <line x1="-5" y1="0" x2="5" y2="0" stroke="rgba(201,169,122,0.35)" strokeWidth="0.8"/>
            <line x1="0" y1="-5" x2="0" y2="5" stroke="rgba(201,169,122,0.35)" strokeWidth="0.8"/>
            <circle cx="0" cy="0" r="1" fill="rgba(201,169,122,0.3)"/>
          </g>
        ))}
        {[-90, -72, 72, 90].map(dx => (
          <circle key={dx} cx={138 + dx} cy="24" r="1" fill="rgba(201,169,122,0.2)"/>
        ))}
        <line x1="0" y1="24" x2="76" y2="24" stroke="rgba(201,169,122,0.12)" strokeWidth="1"/>
        <line x1="204" y1="24" x2="280" y2="24" stroke="rgba(201,169,122,0.12)" strokeWidth="1"/>
      </svg>
    </div>
  );
}

function Splash({ c, onStart, variant, names }: { c: Copy; onStart: () => void; variant: Variant; names: DisplayNames }) {
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const previousBody = document.body.style.overflow;
    const previousHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousBody;
      document.documentElement.style.overflow = previousHtml;
    };
  }, []);

  const go = () => {
    if (out) return;
    setOut(true); onStart();
    setTimeout(() => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setGone(true);
    }, 1900);
  };
  if (gone) return null;
  return (
    <div className={`splash splash-${variant}${out ? ' out' : ''}`} onClick={go}>
      {variant === 'watercolor' && (
        <div className="watercolor-stage-art" aria-hidden="true">
          <svg viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="roseWash" cx="50%" cy="45%" r="58%">
                <stop offset="0%" stopColor="#ead1df" stopOpacity="0.96" />
                <stop offset="58%" stopColor="#c887a1" stopOpacity="0.52" />
                <stop offset="100%" stopColor="#8f5d79" stopOpacity="0.08" />
              </radialGradient>
              <radialGradient id="paperBloom" cx="44%" cy="42%" r="62%">
                <stop offset="0%" stopColor="#fffdf9" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#d7dce8" stopOpacity="0.2" />
              </radialGradient>
            </defs>
            <g className="wash-flower wash-flower-top">
              <path d="M44 48C82 8 145 11 171 58C202 115 148 161 93 143C43 127 15 83 44 48Z" fill="url(#roseWash)" />
              <path d="M70 63C93 35 132 38 148 67C166 102 133 128 101 117C70 107 51 86 70 63Z" fill="#f7e1ec" fillOpacity="0.42" />
              <path className="ink-line" d="M52 57C79 26 132 21 160 59C190 99 162 139 122 146C78 154 35 113 44 75" />
            </g>
            <g className="wash-flower wash-flower-bottom">
              <path d="M234 648C284 601 353 616 371 678C391 745 317 792 257 756C207 726 194 687 234 648Z" fill="url(#roseWash)" />
              <path d="M266 674C295 646 334 656 345 690C357 726 316 752 283 732C256 716 245 695 266 674Z" fill="#f5d7e5" fillOpacity="0.46" />
              <path className="ink-line" d="M236 660C272 615 341 615 367 669C392 722 344 768 293 766C239 764 202 713 228 672" />
            </g>
            <g className="paper-flower paper-flower-left">
              <path d="M-18 315C10 252 84 250 116 307C148 363 105 425 44 414C-11 404 -42 368 -18 315Z" fill="url(#paperBloom)" />
              <circle cx="50" cy="340" r="18" fill="#6d7488" fillOpacity="0.18" />
              <path className="ink-line" d="M4 306C31 259 84 262 108 306C133 350 103 397 56 407C9 416 -23 360 2 314" />
            </g>
            <g className="leaf-spray leaf-spray-right">
              <path className="ink-line sage" d="M346 154C302 230 286 312 300 400" />
              {[0, 1, 2, 3, 4].map(i => (
                <ellipse key={i} cx={318 + i * 4} cy={218 + i * 34} rx="10" ry="26" fill="#788b66" fillOpacity="0.28" transform={`rotate(${i % 2 ? -34 : 31} ${318 + i * 4} ${218 + i * 34})`} />
              ))}
            </g>
          </svg>
        </div>
      )}
      <div className="splash-content">
        <div className="splash-kicker">Wedding Invitation</div>
        {variant === 'floral' && (
          <>
            <div className="splash-floral splash-floral-a" aria-hidden="true" />
            <div className="splash-floral splash-floral-b" aria-hidden="true" />
          </>
        )}
        <div className="splash-timepiece" aria-hidden="true">
          <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="110" cy="110" r="94" stroke="rgba(201,169,122,0.28)" strokeWidth="1"/>
            <circle cx="110" cy="110" r="82" stroke="rgba(201,169,122,0.12)" strokeWidth="1" strokeDasharray="3 7"/>
            <circle cx="110" cy="110" r="58" stroke="rgba(201,169,122,0.1)" strokeWidth="1"/>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => (
              <g key={a} transform={`rotate(${a},110,110)`}>
                <line x1="110" y1="16" x2="110" y2={a % 90 === 0 ? 29 : 24} stroke="rgba(201,169,122,0.42)" strokeWidth={a % 90 === 0 ? 1.1 : 0.7}/>
              </g>
            ))}
            <path d="M110 51V110L145 132" stroke="rgba(201,169,122,0.26)" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          <div className="splash-mono">T<span>&amp;</span>V</div>
        </div>
        <div className="splash-names">
          <span>{names.bride}</span>
          <span>{names.groom}</span>
        </div>
        <div className="splash-date">{c.date}</div>
        <div className="splash-route">{c.city1} · {c.citymid} · {c.city2}</div>
        <button className="splash-open" type="button" onClick={go}>{c.open}</button>
        <div className="splash-hint">{c.tap}</div>
      </div>
    </div>
  );
}

function Intro({ c }: { c: Copy }) {
  const [r, v] = useRv(0.12);
  return (
    <section className="intro" ref={r}>
      <div className="intro-botanical" aria-hidden="true" />
      <div className={`intro-inner rv${v ? ' v' : ''}`}>
        <div className="intro-mono">T<span>&amp;</span>V</div>
        <div className="intro-tag">{c.introTag}</div>
        <p className="intro-verse">{c.introVerse}</p>
      </div>
    </section>
  );
}

function Hero({ c, on, names }: { c: Copy; on: boolean; names: DisplayNames }) {
  const [sy, setSy] = useState(0);
  useEffect(() => {
    const h = () => setSy(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-img-ph" style={{ transform: `translateY(${sy * 0.24}px)`, position: 'absolute', inset: 0, height: '115%' }}/>
      </div>
      <div className="hero-vignette"/>
      <div className="hero-grain"/>

      <div className={`postmark${on ? ' v' : ''}`}>
        <div className="pm-inner">
          <div className="pm-t">Germany</div>
          <div className="pm-r"/>
          <div className="pm-b">2024</div>
        </div>
      </div>

      <div className={`hero-side${on ? ' v' : ''}`}>
        <div className="hero-side-dot"/>
        <div className="hero-side-text">Hannover · 2024</div>
        <div className="hero-side-dot"/>
      </div>

      <div className="hero-names">
        <div className="hero-name"><span className="clip"><span className={`ci${on ? ' v' : ''}`}>{names.bride}</span></span></div>
        <div className="hero-amp"><span className={`hero-amp-i${on ? ' v' : ''}`}>— &amp; —</span></div>
        <div className="hero-name"><span className="clip"><span className={`ci${on ? ' v' : ''}`}>{names.groom}</span></span></div>

        <div className={`journey${on ? ' v' : ''}`}>
          <span className="j-c">{c.city1}</span>
          <span className="j-l"/>
          <span className="j-c" style={{ color: 'rgba(201,169,122,0.7)', fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: '10px' }}>{c.citymid}</span>
          <span className="j-l"/>
          <span className="j-c">{c.city2}</span>
        </div>

        <div className="hero-date"><span className={`hero-date-i${on ? ' v' : ''}`}>{c.date}</span></div>
      </div>

      <div className={`scroll-cue${on ? ' v' : ''}`}>
        <div className="sc-line"/>
        <div className="sc-text">scroll</div>
      </div>
    </section>
  );
}

function Story({ c }: { c: Copy }) {
  const [rL, vL] = useRv();
  const [rT, vT] = useRv();
  const [rP, vP] = useRv();
  return (
    <section className="story">
      <div className="story-inner">
        <div ref={rL} className="slabel">
          <div className={`slabel-line${vL ? ' v' : ''}`}/>
          <span className="slabel-text">{c.sl}</span>
        </div>
        <div ref={rT} className={`rv d1 stitle${vT ? ' v' : ''}`}>{c.st}</div>
        <div className="srule"/>
        <p ref={rP} className={`rv d2 stext${vP ? ' v' : ''}`}>{c.sb}</p>
      </div>
    </section>
  );
}

const PHOTOS = [
  '/images/2023_1.jpeg',
  '/images/2023_2.jpeg',
  '/images/2023_3.jpeg',
  '/images/2024_1.jpeg',
  '/images/2024_2.jpeg',
  '/images/2024_3.jpeg',
];

function Gallery({ c }: { c: Copy }) {
  const [rH, vH] = useRv();
  const [rG, vG] = useRv(0.08);
  const stripRef = useRef<HTMLDivElement>(null);
  const [dh, setDh] = useState(false);

  useEffect(() => {
    if (vG) setTimeout(() => setDh(true), 600);
  }, [vG]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    let down = false, sx = 0, sl = 0;
    const md = (e: MouseEvent | TouchEvent) => {
      down = true;
      sx = 'touches' in e ? e.touches[0].pageX : e.pageX;
      sl = el.scrollLeft;
    };
    const mm = (e: MouseEvent | TouchEvent) => {
      if (!down) return;
      const x = 'touches' in e ? e.touches[0].pageX : e.pageX;
      el.scrollLeft = sl - (x - sx);
    };
    const mu = () => { down = false; };
    el.addEventListener('mousedown', md as EventListener);
    el.addEventListener('touchstart', md as EventListener, { passive: true });
    el.addEventListener('mousemove', mm as EventListener);
    el.addEventListener('touchmove', mm as EventListener, { passive: true });
    el.addEventListener('mouseup', mu);
    el.addEventListener('touchend', mu);
    return () => {
      el.removeEventListener('mousedown', md as EventListener);
      el.removeEventListener('touchstart', md as EventListener);
      el.removeEventListener('mousemove', mm as EventListener);
      el.removeEventListener('touchmove', mm as EventListener);
      el.removeEventListener('mouseup', mu);
      el.removeEventListener('touchend', mu);
    };
  }, []);

  return (
    <section className="gallery">
      <div className="gallery-head">
        <div ref={rH}>
          <div className="slabel" style={{ marginBottom: 16 }}>
            <div className={`slabel-line${vH ? ' v' : ''}`} style={{ background: 'rgba(201,169,122,0.4)' }}/>
            <span className="slabel-text" style={{ color: 'rgba(201,169,122,0.6)' }}>{c.gl}</span>
          </div>
          <div className={`rv d1 stitle${vH ? ' v' : ''}`} style={{ color: 'rgba(240,232,214,0.85)' }}>{c.gt}</div>
        </div>
      </div>

      <div ref={stripRef} className="strip-wrap">
        <div ref={rG} className="strip">
          {PHOTOS.map((src, i) => (
            <div key={i} className={`photo-card${vG ? ' drop' : ''}`} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="photo-frame">
                <img src={src} alt={c.gc[i]} loading="lazy" />
                <div className="photo-overlay" />
              </div>
              <div className="photo-cap">{c.gc[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`drag-hint${dh ? ' v' : ''}`}>
        <div className="dh-line"/>
        <div className="dh-text">drag to explore</div>
      </div>
    </section>
  );
}

const W = {
  en: { label: 'Leave a wish', name: 'Your name', msg: 'Your message', send: 'Send wishes', sent: 'Thank you ♡', err: 'Something went wrong — try again.' },
  id: { label: 'Kirim ucapan', name: 'Nama Anda', msg: 'Pesan Anda', send: 'Kirim ucapan', sent: 'Terima kasih ♡', err: 'Terjadi kesalahan — coba lagi.' },
} as const;

function Wishes({ lang }: { lang: Lang }) {
  const w = W[lang];
  const [r, v] = useRv(0.1);
  const [state, handleSubmit] = useForm('mrejzzzd');

  return (
    <section className="wishes">
      <div className="wishes-inner" ref={r}>
        <div className={`rv slabel${v ? ' v' : ''}`}>
          <div className={`slabel-line${v ? ' v' : ''}`} style={{ background: 'rgba(201,169,122,0.28)' }} />
          <span className="slabel-text" style={{ color: 'rgba(201,169,122,0.45)' }}>{w.label}</span>
        </div>

        {state.succeeded ? (
          <div className={`rv d1 wishes-thanks${v ? ' v' : ''}`}>{w.sent}</div>
        ) : (
          <form className={`rv d1 wishes-form${v ? ' v' : ''}`} onSubmit={handleSubmit}>
            <input
              className="wish-input"
              type="text"
              name="name"
              placeholder={w.name}
              required
              maxLength={80}
            />
            <ValidationError field="name" errors={state.errors} className="wish-err" />
            <textarea
              className="wish-input wish-textarea"
              name="message"
              placeholder={w.msg}
              required
              maxLength={400}
              rows={4}
            />
            <ValidationError field="message" errors={state.errors} className="wish-err" />
            <button className="wish-btn" type="submit" disabled={state.submitting}>
              {state.submitting ? '···' : w.send}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Celeb({ c }: { c: Copy }) {
  const [r, v] = useRv(0.12);
  const googleUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Taslia%20%26%20Varian%20Wedding&dates=20260604/20260605&details=Wedding%20celebration%20of%20Taslia%20Khaira%20and%20Varian%20Furqan&location=Aceh%2C%20Indonesia';
  return (
    <section className="celeb">
      <div className="celeb-inner" ref={r}>
        <div className={`rv slabel${v ? ' v' : ''}`}>
          <div className={`slabel-line${v ? ' v' : ''}`} style={{ background: 'rgba(201,169,122,0.28)' }}/>
          <span className="slabel-text" style={{ color: 'rgba(201,169,122,0.4)' }}>{c.cs}</span>
        </div>
        <span className={`rv d1 celeb-num${v ? ' v' : ''}`}>04</span>
        <div className={`rv d2 celeb-row${v ? ' v' : ''}`}>
          <span className="celeb-month">{c.cm}</span>
          <span className="celeb-year">MMXXVI</span>
        </div>
        <div className={`rv d2 celeb-stem${v ? ' v' : ''}`}/>
        <div className={`rv d3 celeb-loc${v ? ' v' : ''}`}>{c.cl}</div>
        <div className={`rv d3 celeb-note${v ? ' v' : ''}`}>{c.cn}</div>
        <div className={`rv d3 save-actions${v ? ' v' : ''}`}>
          <p className="save-help">{c.calHelp}</p>
          <a className="save-link" href="/taslia-varian-wedding.ics" download>{c.calPrimary}</a>
          <a className="save-link ghost" href={googleUrl} target="_blank" rel="noreferrer">{c.calFallback}</a>
        </div>
      </div>
    </section>
  );
}

export default function WeddingApp({ variant = 'default' }: { variant?: Variant }) {
  const [lang, setLang] = useState<Lang>('en');
  const [started, setStarted] = useState(false);
  const { ref: audioRef } = useAudio(started);
  const c = C[lang];
  const names = variant === 'default'
    ? { bride: 'Taslia Khaira', groom: 'Varian Furqan' }
    : { bride: 'Taslia', groom: 'Varian' };

  return (
    <div className={`site site-${variant}`}>
      <audio ref={audioRef} src="/uploads/One Last Message.m4a" loop preload="auto" style={{ display: 'none' }} />
      <AudioButton started={started} audioRef={audioRef} />
      <Splash c={c} onStart={() => setStarted(true)} variant={variant} names={names} />
      <div className={`lang${started ? ' show' : ''}`}>
        <button className={`lb${lang === 'en' ? ' on' : ''}`} onClick={() => setLang('en')}>EN</button>
        <button className={`lb${lang === 'id' ? ' on' : ''}`} onClick={() => setLang('id')}>ID</button>
      </div>
      <main>
        <Hero c={c} on={started} names={names} />
        <Intro c={c} />
        <Ornament />
        <Story c={c} />
        <Gallery c={c} />
        <Celeb c={c} />
        <Wishes lang={lang} />
        <footer className="footer">
          <div className="footer-names">Taslia &amp; Varian · MMXXVI</div>
        </footer>
      </main>
    </div>
  );
}
