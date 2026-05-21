import { useEffect, useRef, useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Turnstile } from '@marsidev/react-turnstile';

// ── Copy ────────────────────────────────────────────────────────────────────

const C = {
  en: {
    tap: 'tap the compass to open',
    kicker: 'Wedding Ceremony',
    date: '04 · June · 2026',
    time: '10.00 AM · Until End',
    brideParents: 'second daughter of Mr. Ir. Nazaruddin\nand Mrs. Dra. Cut Kemalawati',
    groomParents: 'first son of Mr. Sainur Arif\nand Mrs. Dian Indonesiana',
    sl: 'Our Story',
    st: 'Far from home,\nclose to each other',
    sb: [
      'Taslia is from Banda Aceh, Aceh. Varian is from Bukittinggi, in the highlands of West Sumatra.',
      'They were far from home when they found each other at Leibniz Universität in Hannover, Germany.',
      'In a city of rain and old streets, a quiet crossing became a promise to return home together.',
    ],
    save: 'Save the Date',
    location: 'Aceh Besar, Indonesia',
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
    rl: 'Attendance Confirmation',
    rt: 'Attendance Confirmation',
    rname: 'Your name',
    ryes: 'Yes, I will attend',
    rno: 'Sorry, I cannot attend',
    rguests: 'Number of guests (including yourself)',
    rsend: 'Send RSVP',
    rsent: 'See you on the day ♡',
    rno_sent: 'Thank you for letting us know ♡',
    next: 'next',
  },
  id: {
    tap: 'sentuh kompas untuk membuka',
    kicker: 'Undangan Akad Pernikahan',
    date: '04 · Juni · 2026',
    time: '10.00 WIB · Selesai',
    brideParents: 'anak ketiga dari Bpk Ir. Nazaruddin\ndan Ibu Dra. Cut Kemalawati',
    groomParents: 'anak pertama dari Bpk Sainur Arif\ndan Ibu Dian Indonesiana',
    sl: 'Cerita Kami',
    st: 'Di tanah rantau,\nhati yang saling menemukan',
    sb: [
      'Taslia berasal dari Banda Aceh, Aceh. Varian dari Bukittinggi, Sumatera Barat.',
      'Di perantauan, takdir mempertemukan mereka di Leibniz Universität, Hannover, Jerman.',
      'Di kota hujan dan jalan-jalan tua, pertemuan sederhana tumbuh menjadi janji untuk pulang bersama.',
    ],
    save: 'Tandai Tanggalnya',
    location: 'Aceh Besar, Indonesia',
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
    rt: 'Konfirmasi Kehadiran',
    rname: 'Nama Anda',
    ryes: 'Ya, saya akan hadir',
    rno: 'Maaf, saya tidak dapat hadir',
    rguests: 'Jumlah tamu (termasuk Anda)',
    rsend: 'Kirim konfirmasi',
    rsent: 'Sampai jumpa di hari bahagia ♡',
    rno_sent: 'Terima kasih telah memberi tahu kami ♡',
    next: 'lanjut',
  },
} as const;

type Lang = keyof typeof C;
type CardProps = { c: typeof C[Lang]; onNext: () => void };

const TOTAL_CARDS = 6;

// ── Hooks ───────────────────────────────────────────────────────────────────

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
    <button className={`audio-btn${started ? ' show' : ''}${playing ? ' playing' : ''}`}
      onClick={toggle} aria-label={playing ? 'Pause music' : 'Play music'}>
      <div className="audio-ring">
        <div className="audio-icon">
          {playing
            ? <span className="audio-waves"><span className="aw" /><span className="aw" /><span className="aw" /></span>
            : <span className="audio-pause-icon" />}
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
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
          <g key={a} transform={`rotate(${a},110,110)`}>
            <line x1="110" y1="16" x2="110" y2={a % 90 === 0 ? 29 : 24}
              stroke="rgba(107,127,94,0.5)" strokeWidth={a % 90 === 0 ? 1.1 : 0.7} />
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
    setOut(true); onOpen();
    setTimeout(() => setGone(true), 900);
  };
  if (gone) return null;
  return (
    <div className={`bd-splash${out ? ' bd-splash-out' : ''}`} onClick={open}
      role="button" tabIndex={0} aria-label="Open invitation"
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}>
      <div className="bd-splash-card">
        <Compass />
        <p className="bd-tap-hint">{c.tap}</p>
      </div>
    </div>
  );
}

// ── Progress dots ─────────────────────────────────────────────────────────────

function Progress({ current, onGo }: { current: number; onGo: (i: number) => void }) {
  return (
    <div className="bd-progress">
      {Array.from({ length: TOTAL_CARDS }, (_, i) => (
        <button key={i} className={`bd-dot${current === i ? ' bd-dot-active' : ''}`}
          onClick={e => { e.stopPropagation(); onGo(i); }}
          aria-label={`Section ${i + 1}`} />
      ))}
    </div>
  );
}

// ── Cards ─────────────────────────────────────────────────────────────────────

function HeroCard({ c, onNext }: CardProps) {
  return (
    <section className="bd-card bd-hero-card" onClick={onNext}>
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
    </section>
  );
}

function StoryCard({ c, onNext }: CardProps) {
  return (
    <section className="bd-card bd-story-card" onClick={onNext}>
      <p className="bd-kicker">{c.sl}</p>
      <h2 className="bd-card-title">{c.st}</h2>
      <div className="bd-copy">
        {c.sb.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </section>
  );
}

function DateCard({ c, onNext }: CardProps) {
  const googleUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Taslia%20%26%20Varian%20Wedding%20Ceremony&dates=20260604T100000/20260604T120000&ctz=Asia%2FJakarta&location=Beulangong%20Raja%20Resto%20%26%20Garden%2C%20Aceh%2C%20Indonesia';
  const [timeNum, ...timeRest] = c.time.split(' ');
  const timeLabel = timeRest.join(' ');
  return (
    <section className="bd-card bd-date-card" onClick={onNext}>
      <p className="bd-kicker">{c.save}</p>
      <div className="bd-date-num">04</div>
      <div className="bd-date-row">
        <span>{c.date.split('·')[1].trim()}</span>
        <span>2026</span>
      </div>
      <div className="bd-date-num bd-date-time">{timeNum}</div>
      <p className="bd-date-unit">{timeLabel}</p>
      <p className="bd-location">{c.location}</p>
      <div className="bd-actions" onClick={e => e.stopPropagation()}>
        <a className="bd-btn" href="/taslia-varian-wedding.ics" download>{c.dlCal}</a>
        <a className="bd-btn bd-btn-ghost" href={googleUrl} target="_blank" rel="noreferrer">{c.gCal}</a>
      </div>
    </section>
  );
}

function MapCard({ c, onNext }: CardProps) {
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=5.4837634,95.2545945';
  return (
    <section className="bd-card bd-map-card" onClick={onNext}>
      <p className="bd-kicker">{c.mapTitle}</p>
      <h2 className="bd-card-title">{c.venue}</h2>
      <p className="bd-location">{c.location}</p>
      <a className="bd-btn" href={mapsUrl} target="_blank" rel="noreferrer"
        onClick={e => e.stopPropagation()}>{c.openMap}</a>
    </section>
  );
}

const STATICFORMS_KEY = 'sf_a03693328f8cd7e352782578';
const TURNSTILE_SITE_KEY = '0x4AAAAAADTKPMeFIbNG0Qty';

function RsvpCard({ c, onNext }: CardProps) {
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

  return (
    <section className="bd-card bd-rsvp-card">
      {status !== 'done' && <h2 className="bd-card-title">{c.rl}</h2>}
      {status === 'done' ? (
        <>
          <p className="bd-thanks">{attending === 'no' ? c.rno_sent : c.rsent}</p>
          <button className="bd-btn" style={{ marginTop: 20 }} onClick={onNext}>{c.next} →</button>
        </>
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
          <div style={{ position: 'fixed', bottom: -200, left: -200, pointerEvents: 'none', opacity: 0 }}>
            <Turnstile ref={turnstileRef} siteKey={TURNSTILE_SITE_KEY}
              onSuccess={setToken} onExpire={() => setToken(null)}
              options={{ theme: 'light', appearance: 'execute' }} />
          </div>
          <button type="submit" className="bd-btn" disabled={status === 'sending' || !token}>
            {status === 'sending' ? '···' : c.rsend}
          </button>
        </form>
      )}
    </section>
  );
}

function WishesCard({ c, lang }: { c: typeof C[Lang]; lang: Lang }) {
  const [state, handleSubmit] = useForm('mrejzzzd');
  return (
    <section className="bd-card bd-wishes-card">
      <p className="bd-kicker">{c.wl}</p>
      {state.succeeded ? (
        <p className="bd-thanks">{c.sent}</p>
      ) : (
        <form className="bd-form" onSubmit={handleSubmit}>
          <input type="hidden" name="lang" value={lang} />
          <input type="text" name="name" placeholder={c.name} required maxLength={80} />
          <ValidationError field="name" errors={state.errors} className="bd-err" />
          <textarea name="message" placeholder={c.msg} required maxLength={400} rows={3} />
          <ValidationError field="message" errors={state.errors} className="bd-err" />
          <button type="submit" className="bd-btn" disabled={state.submitting}>
            {state.submitting ? '···' : c.send}
          </button>
        </form>
      )}
      <p className="bd-footer-inline">Taslia &amp; Varian · MMXXVI</p>
    </section>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function BackdropInvitation() {
  const [lang, setLang] = useState<Lang>('id');
  const [opened, setOpened] = useState(false);
  const [card, setCard] = useState(0);
  const { ref: audioRef } = useAudio(opened);
  const c = C[lang];
  const next = () => setCard(i => Math.min(i + 1, TOTAL_CARDS - 1));

  const cards = [
    <HeroCard c={c} onNext={next} />,
    <StoryCard c={c} onNext={next} />,
    <DateCard c={c} onNext={next} />,
    <MapCard c={c} onNext={next} />,
    <RsvpCard c={c} onNext={next} />,
    <WishesCard c={c} lang={lang} />,
  ];

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
      {opened && (
        <main className="bd-content bd-content-in">
          {cards.map((el, i) => (
            <div key={i} className={`bd-card-slot${card === i ? ' bd-slot-active' : ''}`}>{el}</div>
          ))}
          <Progress current={card} onGo={setCard} />
        </main>
      )}
    </div>
  );
}
