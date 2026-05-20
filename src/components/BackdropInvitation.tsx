import { useEffect, useRef, useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Turnstile } from '@marsidev/react-turnstile';

// ── Copy ────────────────────────────────────────────────────────────────────

const C = {
  en: {
    tap: 'tap the compass to open',
    kicker: 'Wedding Ceremony',
    date: '04 · June · 2026',
    time: '10.00 AM',
    open: 'Open Invitation',
    brideParents: 'second daughter of Mr. Ir. Nazaruddin and Mrs. Dra. Cut Kemalawati',
    groomParents: 'first son of Mr. Sainur Arif and Mrs. Dian Indonesiana',
    sl: 'Our Story',
    st: 'Far from home,\nclose to each other',
    sb: [
      'Taslia is from Aceh. Varian is from Bukittinggi, in the highlands of West Sumatra.',
      'They were far from home when they found each other at Leibniz Universität in Hannover, Germany.',
      'In a city of rain and old streets, a quiet crossing became a promise to return home together.',
    ],
    together: 'Together with their families',
    celebrate: 'invite you to celebrate their wedding',
    save: 'Save the Date',
    location: 'Aceh · Indonesia',
    venue: 'Beulangong Raja\nResto & Garden',
    mapTitle: 'Location',
    openMap: 'Open in Google Maps',
    dlCal: 'Download calendar',
    gCal: 'Google Calendar',
    wl: 'Well Wishes',
    wt: 'Leave a note for the couple',
    name: 'Your name',
    msg: 'Your message',
    send: 'Send wishes',
    sent: 'Thank you for the wish ♡',
    music: 'music',
    rl: 'RSVP',
    rt: 'Will you be joining us?',
    rname: 'Your name',
    ryes: 'Yes, I will attend',
    rno: 'Sorry, I cannot attend',
    rguests: 'Number of guests (including yourself)',
    rsend: 'Send RSVP',
    rsent: 'See you on the day ♡',
    rno_sent: 'Thank you for letting us know ♡',
  },
  id: {
    tap: 'sentuh kompas untuk membuka',
    kicker: 'Undangan Akad Pernikahan',
    date: '04 · Juni · 2026',
    time: '10.00 WIB',
    open: 'Buka Undangan',
    brideParents: 'anak ketiga dari Bpk Ir. Nazaruddin dan Ibu Dra. Cut Kemalawati',
    groomParents: 'anak pertama dari Bpk Sainur Arif dan Ibu Dian Indonesiana',
    sl: 'Cerita Kami',
    st: 'Di tanah rantau,\nhati yang saling menemukan',
    sb: [
      'Taslia berasal dari Aceh. Varian dari Bukittinggi, Sumatera Barat.',
      'Di perantauan, takdir mempertemukan mereka di Leibniz Universität, Hannover, Jerman.',
      'Di kota hujan dan jalan-jalan tua, pertemuan sederhana tumbuh menjadi janji untuk pulang bersama.',
    ],
    together: 'Bersama kedua keluarga',
    celebrate: 'mengundang Anda untuk hadir merayakan pernikahan mereka',
    save: 'Tandai Tanggalnya',
    location: 'Aceh · Indonesia',
    venue: 'Beulangong Raja\nResto & Garden',
    mapTitle: 'Lokasi',
    openMap: 'Buka di Google Maps',
    dlCal: 'Unduh kalender',
    gCal: 'Google Calendar',
    wl: 'Ucapan',
    wt: 'Titipkan doa dan ucapan untuk pasangan',
    name: 'Nama Anda',
    msg: 'Pesan Anda',
    send: 'Kirim ucapan',
    sent: 'Terima kasih ♡',
    music: 'musik',
    rl: 'Konfirmasi Kehadiran',
    rt: 'Apakah Anda dapat hadir?',
    rname: 'Nama Anda',
    ryes: 'Ya, saya akan hadir',
    rno: 'Maaf, saya tidak dapat hadir',
    rguests: 'Jumlah tamu (termasuk Anda)',
    rsend: 'Kirim konfirmasi',
    rsent: 'Sampai jumpa di hari bahagia ♡',
    rno_sent: 'Terima kasih telah memberi tahu kami ♡',
  },
} as const;

type Lang = keyof typeof C;

// ── Hooks ───────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.16) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

function useAudio(started: boolean) {
  const ref = useRef<HTMLAudioElement>(null);
  const rampRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!started) return;
    const a = ref.current;
    if (!a) return;
    a.volume = 0; a.loop = true;
    a.play().then(() => {
      const TARGET = 0.28, STEPS = 100, DURATION = 16000;
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

// ── Audio button ─────────────────────────────────────────────────────────────

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

// ── Compass SVG ───────────────────────────────────────────────────────────────

function Compass() {
  return (
    <div className="bd-compass" aria-hidden="true">
      <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="110" cy="110" r="94" stroke="rgba(107,127,94,0.32)" strokeWidth="1" />
        <circle cx="110" cy="110" r="82" stroke="rgba(107,127,94,0.14)" strokeWidth="1" strokeDasharray="3 7" />
        <circle cx="110" cy="110" r="58" stroke="rgba(107,127,94,0.10)" strokeWidth="1" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => (
          <g key={a} transform={`rotate(${a},110,110)`}>
            <line
              x1="110" y1="16" x2="110" y2={a % 90 === 0 ? 29 : 24}
              stroke="rgba(107,127,94,0.5)"
              strokeWidth={a % 90 === 0 ? 1.1 : 0.7}
            />
          </g>
        ))}
      </svg>
      <div className="bd-compass-mono">T<span>&amp;</span>V</div>
    </div>
  );
}

// ── Splash ────────────────────────────────────────────────────────────────────

function Splash({ c, onOpen }: { c: typeof C[Lang]; onOpen: () => void }) {
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);

  const open = () => {
    if (out) return;
    setOut(true);
    onOpen();
    setTimeout(() => setGone(true), 900);
  };

  if (gone) return null;
  return (
    <div
      className={`bd-splash${out ? ' bd-splash-out' : ''}`}
      onClick={open}
      role="button"
      tabIndex={0}
      aria-label="Open invitation"
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      }}
    >
      <div className="bd-splash-card">
        <Compass />
        <p className="bd-tap-hint">{c.tap}</p>
      </div>
    </div>
  );
}

// ── Cards ─────────────────────────────────────────────────────────────────────

function HeroCard({ c }: { c: typeof C[Lang] }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <section ref={ref} className={`bd-card bd-hero-card bd-reveal${visible ? ' bd-in' : ''}`}>
      <p className="bd-kicker">{c.kicker}</p>
      <div className="bd-hero-names">
        <div className="bd-name-block">
          <h2>Taslia Khaira Nazaruddin</h2>
          <p>{c.brideParents}</p>
        </div>
        <span className="bd-name-amp">&amp;</span>
        <div className="bd-name-block">
          <h2>Varian Furqan Arif</h2>
          <p>{c.groomParents}</p>
        </div>
      </div>
      <p className="bd-sub">{c.date}</p>
      <p className="bd-time">{c.time}</p>
    </section>
  );
}

function StoryCard({ c }: { c: typeof C[Lang] }) {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} className={`bd-card bd-story-card bd-reveal${visible ? ' bd-in' : ''}`}>
      <p className="bd-kicker">{c.sl}</p>
      <h2 className="bd-card-title">{c.st}</h2>
      <div className="bd-copy">
        {c.sb.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </section>
  );
}

function DateCard({ c }: { c: typeof C[Lang] }) {
  const [ref, visible] = useReveal();
  const googleUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Taslia%20%26%20Varian%20Wedding%20Ceremony&dates=20260604T100000/20260604T120000&ctz=Asia%2FJakarta&location=Beulangong%20Raja%20Resto%20%26%20Garden%2C%20Aceh%2C%20Indonesia';
  return (
    <section ref={ref} className={`bd-card bd-date-card bd-reveal${visible ? ' bd-in' : ''}`}>
      <p className="bd-kicker">{c.save}</p>
      <div className="bd-date-num">04</div>
      <div className="bd-date-row">
        <span>{c.date.split('·')[1].trim()}</span>
        <span>2026</span>
      </div>
      <p className="bd-time">{c.time}</p>
      <p className="bd-location">{c.location}</p>
      <div className="bd-actions">
        <a className="bd-btn" href="/taslia-varian-wedding.ics" download>{c.dlCal}</a>
        <a className="bd-btn bd-btn-ghost" href={googleUrl} target="_blank" rel="noreferrer">{c.gCal}</a>
      </div>
    </section>
  );
}

function MapCard({ c }: { c: typeof C[Lang] }) {
  const [ref, visible] = useReveal();
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=5.4837634,95.2545945';
  return (
    <section ref={ref} className={`bd-card bd-map-card bd-reveal${visible ? ' bd-in' : ''}`}>
      <p className="bd-kicker">{c.mapTitle}</p>
      <h2 className="bd-card-title">{c.venue}</h2>
      <p className="bd-location">{c.location}</p>
      <a className="bd-btn" href={mapsUrl} target="_blank" rel="noreferrer">{c.openMap}</a>
    </section>
  );
}

const STATICFORMS_KEY = 'sf_a03693328f8cd7e352782578';
const TURNSTILE_SITE_KEY = '0x4AAAAAADTKPMeFIbNG0Qty';

function RsvpCard({ c }: { c: typeof C[Lang] }) {
  const [ref, visible] = useReveal();
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef<{ reset: () => void }>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setStatus('sending');
    const fd = new FormData(e.currentTarget);
    const body = {
      apiKey: STATICFORMS_KEY,
      subject: 'Wedding RSVP',
      name: fd.get('name'),
      message: `Attendance: ${fd.get('attendance')}${fd.get('guests') ? ` | Guests: ${fd.get('guests')}` : ''}`,
      'cf-turnstile-response': token,
    };
    try {
      await fetch('https://api.staticforms.dev/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {}
    setStatus('done');
    turnstileRef.current?.reset();
  };

  const thanksMsg = attending === 'no' ? c.rno_sent : c.rsent;

  return (
    <section ref={ref} className={`bd-card bd-wishes-card bd-reveal${visible ? ' bd-in' : ''}`}>
      <p className="bd-kicker">{c.rl}</p>
      {status !== 'done' && <h2 className="bd-card-title">{c.rt}</h2>}
      {status === 'done' ? (
        <p className="bd-thanks">{thanksMsg}</p>
      ) : (
        <form className="bd-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder={c.rname} required maxLength={80} />
          <div className="bd-radio-group">
            <label className={`bd-radio${attending === 'yes' ? ' bd-radio-on' : ''}`}>
              <input type="radio" name="attendance" value="yes" required onChange={() => setAttending('yes')} />
              {c.ryes}
            </label>
            <label className={`bd-radio${attending === 'no' ? ' bd-radio-on' : ''}`}>
              <input type="radio" name="attendance" value="no" onChange={() => setAttending('no')} />
              {c.rno}
            </label>
          </div>
          {attending === 'yes' && (
            <input type="number" name="guests" min={1} max={10} defaultValue={1} placeholder={c.rguests} />
          )}
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={setToken}
            onExpire={() => setToken(null)}
            options={{ theme: 'light', size: 'flexible' }}
          />
          <button type="submit" className="bd-btn" disabled={status === 'sending' || !token}>
            {status === 'sending' ? '···' : c.rsend}
          </button>
        </form>
      )}
    </section>
  );
}

function WishesCard({ c, lang }: { c: typeof C[Lang]; lang: Lang }) {
  const [ref, visible] = useReveal();
  const [state, handleSubmit] = useForm('mrejzzzd');
  return (
    <section ref={ref} className={`bd-card bd-wishes-card bd-reveal${visible ? ' bd-in' : ''}`}>
      <p className="bd-kicker">{c.wl}</p>
      <h2 className="bd-card-title">{c.wt}</h2>
      {state.succeeded ? (
        <p className="bd-thanks">{c.sent}</p>
      ) : (
        <form className="bd-form" onSubmit={handleSubmit}>
          <input type="hidden" name="lang" value={lang} />
          <input type="text" name="name" placeholder={c.name} required maxLength={80} />
          <ValidationError field="name" errors={state.errors} className="bd-err" />
          <textarea name="message" placeholder={c.msg} required maxLength={400} rows={4} />
          <ValidationError field="message" errors={state.errors} className="bd-err" />
          <button type="submit" className="bd-btn" disabled={state.submitting}>
            {state.submitting ? '···' : c.send}
          </button>
        </form>
      )}
    </section>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function BackdropInvitation() {
  const [lang, setLang] = useState<Lang>('id');
  const [opened, setOpened] = useState(false);
  const { ref: audioRef } = useAudio(opened);
  const c = C[lang];

  return (
    <div className="bd-root">
      <audio ref={audioRef} src="/uploads/One Last Message.m4a" loop preload="auto" style={{ display: 'none' }} />
      <img src="/reference/main-backdrop.png" alt="" className="bd-bg" />

      <AudioButton started={opened} audioRef={audioRef} />

      <div className={`bd-lang${opened ? ' bd-lang-show' : ''}`}>
        <button className={`bd-lb${lang === 'en' ? ' bd-lb-on' : ''}`} onClick={() => setLang('en')}>EN</button>
        <button className={`bd-lb${lang === 'id' ? ' bd-lb-on' : ''}`} onClick={() => setLang('id')}>ID</button>
      </div>

      <Splash c={c} onOpen={() => setOpened(true)} />

      <main className={`bd-content${opened ? ' bd-content-in' : ''}`}>
        <HeroCard c={c} />
        <StoryCard c={c} />
        <DateCard c={c} />
        <MapCard c={c} />
        <RsvpCard c={c} />
        <WishesCard c={c} lang={lang} />
        <footer className="bd-footer">Taslia &amp; Varian · MMXXVI</footer>
      </main>
    </div>
  );
}
