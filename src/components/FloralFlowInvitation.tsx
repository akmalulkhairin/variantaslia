const copy = {
  en: {
    open: 'Open invitation',
    hint: 'Tap the seal to open',
    weddingOf: 'The Wedding Of',
    date: '04 June 2026',
    time: '4:00 PM',
    place: 'Aceh, Indonesia',
    venue: 'Wedding venue to be announced',
    intro: 'With gratitude and joy, we invite you to celebrate the wedding of Taslia and Varian.',
    storyLabel: 'Their Story',
    storyTitle: 'From Hannover, with love',
    story:
      'Taslia from Aceh and Varian from Bukittinggi first met while studying in Hannover. Small conversations in a foreign city became a story they now bring home.',
    wishesLabel: 'Leave a wish',
    name: 'Your name',
    message: 'Your message',
    send: 'Send wishes',
    sent: 'Thank you for your wishes',
    err: 'Something went wrong. Please try again.',
    save: 'Reserve the date',
    calendar: 'Save to phone calendar',
    google: 'Open in Google Calendar',
    location: 'Location',
    locationNote: 'Full venue details will follow soon.',
    closing: 'Taslia & Varian',
  },
  id: {
    open: 'Buka undangan',
    hint: 'Sentuh segel untuk membuka',
    weddingOf: 'Pernikahan',
    date: '04 Juni 2026',
    time: '16.00',
    place: 'Aceh, Indonesia',
    venue: 'Lokasi acara akan diumumkan',
    intro: 'Dengan penuh syukur dan bahagia, kami mengundang Anda untuk merayakan pernikahan Taslia dan Varian.',
    storyLabel: 'Kisah Mereka',
    storyTitle: 'Dari Hannover, dengan cinta',
    story:
      'Taslia dari Aceh dan Varian dari Bukittinggi bertemu saat studi di Hannover. Dari percakapan kecil di kota asing, tumbuh kisah yang kini mereka bawa pulang.',
    wishesLabel: 'Kirim ucapan',
    name: 'Nama Anda',
    message: 'Pesan Anda',
    send: 'Kirim ucapan',
    sent: 'Terima kasih atas ucapannya',
    err: 'Terjadi kesalahan. Silakan coba lagi.',
    save: 'Tandai tanggalnya',
    calendar: 'Simpan ke kalender HP',
    google: 'Buka di Google Calendar',
    location: 'Lokasi',
    locationNote: 'Detail lokasi acara akan menyusul.',
    closing: 'Taslia & Varian',
  },
} as const;

type Lang = keyof typeof copy;

const googleUrl =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Taslia%20%26%20Varian%20Wedding&dates=20260604/20260605&details=Wedding%20celebration%20of%20Taslia%20Khaira%20and%20Varian%20Furqan&location=Aceh%2C%20Indonesia';

function CompassSeal({ onOpen }: { onOpen: () => void }) {
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const a = (i * 7.5 * Math.PI) / 180;
    const long = i % 12 === 0;
    const mid = i % 6 === 0 && !long;
    const r1 = 92;
    const r2 = long ? 79 : mid ? 84 : 88;
    return { x1: 100 + r1 * Math.sin(a), y1: 100 - r1 * Math.cos(a), x2: 100 + r2 * Math.sin(a), y2: 100 - r2 * Math.cos(a), long };
  });

  return (
    <button className="ff-seal-btn" onClick={onOpen} aria-label="Open invitation">
      <svg viewBox="0 0 200 200" className="ff-seal" aria-hidden="true">
        <defs>
          <path id="ff-seal-top" d="M 16,100 A 84,84 0 0,1 184,100" />
          <path id="ff-seal-bottom" d="M 22,100 A 78,78 0 0,0 178,100" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="rgba(255,255,255,.62)" />
        <circle cx="100" cy="100" r="94" fill="none" stroke="rgba(117,137,102,.52)" strokeWidth="1.4" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(117,137,102,.18)" strokeWidth="1" />
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(117,137,102,.48)" strokeWidth={t.long ? 1.2 : 0.6} />
        ))}
        <text fontFamily="'Cormorant Garamond', serif" fontStyle="italic" fontSize="9" fill="rgba(72,91,62,.78)" letterSpacing="2.4">
          <textPath href="#ff-seal-top" startOffset="50%" textAnchor="middle">Taslia Khaira</textPath>
        </text>
        <text fontFamily="'Cormorant Garamond', serif" fontStyle="italic" fontSize="9" fill="rgba(72,91,62,.78)" letterSpacing="2.4">
          <textPath href="#ff-seal-bottom" startOffset="50%" textAnchor="middle">Varian Furqan</textPath>
        </text>
        <text x="100" y="96" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontStyle="italic" fontSize="24" fill="rgba(72,91,62,.9)">T & V</text>
        <text x="100" y="116" textAnchor="middle" fontFamily="'Jost', sans-serif" fontSize="6" letterSpacing="2.8" fill="rgba(72,91,62,.52)">04 · VI · 2026</text>
      </svg>
    </button>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`ff-card ${className}`}>
      <span className="ff-corner ff-corner-tl" />
      <span className="ff-corner ff-corner-tr" />
      <span className="ff-corner ff-corner-bl" />
      <span className="ff-corner ff-corner-br" />
      {children}
    </section>
  );
}

function Wishes({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <Card className="ff-wishes">
      <p className="ff-label">{c.wishesLabel}</p>
      <form action="https://formspree.io/f/mrejzzzd" method="POST" className="ff-form">
        <input name="name" placeholder={c.name} maxLength={80} required />
        <textarea name="message" placeholder={c.message} rows={4} maxLength={400} required />
        <button type="submit">{c.send}</button>
      </form>
    </Card>
  );
}

export default function FloralFlowInvitation() {
  const lang: Lang = 'en';
  const c = copy[lang];

  return (
    <main className="floral-flow" data-opened="false">
      <div className="ff-bg" aria-hidden="true" />
      <div className="ff-lang">
        <button className="on" type="button">EN</button>
        <button type="button">ID</button>
      </div>

      <section className="ff-cover">
        <p className="ff-cover-kicker">Wedding Invitation</p>
        <CompassSeal onOpen={() => undefined} />
        <h1>Taslia <span>&amp;</span> Varian</h1>
        <button className="ff-open" type="button">{c.open}</button>
        <p className="ff-hint">{c.hint}</p>
      </section>

      <div className="ff-content" aria-hidden="true">
        <Card className="ff-invite">
          <p className="ff-label">{c.weddingOf}</p>
          <div className="ff-plaque">
            <span>Varian</span>
            <i />
            <span>Taslia</span>
          </div>
          <p className="ff-date">{c.date}</p>
          <p className="ff-time">{c.time}</p>
          <p className="ff-place">{c.place}</p>
          <p className="ff-venue">{c.venue}</p>
          <p className="ff-intro">{c.intro}</p>
        </Card>

        <Card className="ff-story">
          <p className="ff-label">{c.storyLabel}</p>
          <h2>{c.storyTitle}</h2>
          <p>{c.story}</p>
        </Card>

        <Wishes lang={lang} />

        <Card className="ff-save">
          <p className="ff-label">{c.save}</p>
          <strong>04</strong>
          <span>{c.date}</span>
          <a href="/taslia-varian-wedding.ics" download>{c.calendar}</a>
          <a href={googleUrl} target="_blank" rel="noreferrer">{c.google}</a>
        </Card>

        <Card className="ff-location">
          <p className="ff-label">{c.location}</p>
          <h2>{c.place}</h2>
          <p>{c.locationNote}</p>
        </Card>

        <footer className="ff-footer">{c.closing}</footer>
      </div>
    </main>
  );
}
