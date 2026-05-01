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

function Splash({ c, onStart }: { c: Copy; onStart: () => void }) {
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);
  const go = () => {
    if (out) return;
    setOut(true); onStart();
    setTimeout(() => setGone(true), 1900);
  };
  if (gone) return null;
  return (
    <div className={`splash${out ? ' out' : ''}`} onClick={go}>
      <div className="cover-botanical cover-botanical-a" aria-hidden="true">
        <svg viewBox="0 0 260 520" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M94 505C82 427 94 354 126 287C154 229 167 177 144 116C129 78 106 43 75 10" stroke="currentColor" strokeWidth="1.1"/>
          <path d="M122 165C88 126 48 104 8 96C38 138 77 160 122 165Z" stroke="currentColor" strokeWidth="1"/>
          <path d="M139 214C92 195 50 198 13 223C60 240 102 237 139 214Z" stroke="currentColor" strokeWidth="1"/>
          <path d="M109 314C69 326 36 351 10 389C60 385 93 359 109 314Z" stroke="currentColor" strokeWidth="1"/>
          <path d="M154 118C181 82 212 61 249 54C231 100 199 122 154 118Z" stroke="currentColor" strokeWidth="1"/>
          <path d="M157 274C198 253 230 252 254 270C222 296 190 298 157 274Z" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </div>
      <div className="cover-botanical cover-botanical-b" aria-hidden="true">
        <svg viewBox="0 0 260 520" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M168 6C179 82 165 152 132 216C102 274 90 331 114 401C127 440 150 475 184 512" stroke="currentColor" strokeWidth="1.1"/>
          <path d="M132 96C91 77 56 79 25 102C61 125 97 123 132 96Z" stroke="currentColor" strokeWidth="1"/>
          <path d="M120 188C82 214 55 248 38 291C82 280 110 246 120 188Z" stroke="currentColor" strokeWidth="1"/>
          <path d="M128 339C172 322 213 327 250 354C205 368 164 363 128 339Z" stroke="currentColor" strokeWidth="1"/>
          <path d="M102 421C68 431 40 455 18 493C62 488 91 464 102 421Z" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </div>
      <div className="splash-content">
        <div className="splash-kicker">Wedding Invitation</div>
        <div className="splash-names">
          <span>Taslia</span>
          <span className="splash-name-amp">&amp;</span>
          <span>Varian</span>
        </div>
        <div className="splash-date">{c.date}</div>
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

function Hero({ c, on }: { c: Copy; on: boolean }) {
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
        <div className="hero-name"><span className="clip"><span className={`ci${on ? ' v' : ''}`}>Taslia Khaira</span></span></div>
        <div className="hero-amp"><span className={`hero-amp-i${on ? ' v' : ''}`}>— &amp; —</span></div>
        <div className="hero-name"><span className="clip"><span className={`ci${on ? ' v' : ''}`}>Varian Furqan</span></span></div>

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

export default function WeddingApp() {
  const [lang, setLang] = useState<Lang>('en');
  const [started, setStarted] = useState(false);
  const { ref: audioRef } = useAudio(started);
  const c = C[lang];

  return (
    <>
      <audio ref={audioRef} src="/uploads/One Last Message.m4a" loop preload="auto" style={{ display: 'none' }} />
      <AudioButton started={started} audioRef={audioRef} />
      <Splash c={c} onStart={() => setStarted(true)} />
      <div className={`lang${started ? ' show' : ''}`}>
        <button className={`lb${lang === 'en' ? ' on' : ''}`} onClick={() => setLang('en')}>EN</button>
        <button className={`lb${lang === 'id' ? ' on' : ''}`} onClick={() => setLang('id')}>ID</button>
      </div>
      <main>
        <Hero c={c} on={started} />
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
    </>
  );
}
