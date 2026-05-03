import { useEffect, useState } from 'react';

const copy = {
  en: {
    title: 'The Wedding Of',
    tap: 'Open invitation',
    date: '04 June 2026',
    time: '4:00 PM',
    place: 'Aceh, Indonesia',
    venue: 'Wedding venue to be announced',
    intro: 'With gratitude and joy, we invite you to celebrate the wedding of Taslia and Varian.',
    storyTitle: 'A story carried home',
    story:
      'From Aceh and Bukittinggi to Hannover, their paths met far from home. What began quietly now returns home as a promise shared with family and friends.',
    save: 'Save the date',
    calendar: 'Save to phone calendar',
    google: 'Open in Google Calendar',
    gallery: 'Memories',
    closing: 'Taslia & Varian',
  },
  id: {
    title: 'Pernikahan',
    tap: 'Buka undangan',
    date: '04 Juni 2026',
    time: '16.00',
    place: 'Aceh, Indonesia',
    venue: 'Lokasi acara akan diumumkan',
    intro: 'Dengan penuh syukur dan bahagia, kami mengundang Anda untuk merayakan pernikahan Taslia dan Varian.',
    storyTitle: 'Kisah yang dibawa pulang',
    story:
      'Dari Aceh dan Bukittinggi menuju Hannover, jalan mereka bertemu jauh dari rumah. Pertemuan sederhana itu kini pulang sebagai janji yang ingin dibagikan bersama keluarga dan sahabat.',
    save: 'Tandai tanggalnya',
    calendar: 'Simpan ke kalender HP',
    google: 'Buka di Google Calendar',
    gallery: 'Kenangan',
    closing: 'Taslia & Varian',
  },
} as const;

type Lang = keyof typeof copy;

const googleUrl =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Taslia%20%26%20Varian%20Wedding&dates=20260604/20260605&details=Wedding%20celebration%20of%20Taslia%20Khaira%20and%20Varian%20Furqan&location=Aceh%2C%20Indonesia';

const photos = ['/images/2023_1.jpeg', '/images/2023_2.jpeg', '/images/2024_1.jpeg'];

function Flower({ x, y, s = 1, r = 0, tone = 'pink' }: { x: number; y: number; s?: number; r?: number; tone?: 'pink' | 'white' }) {
  const fill = tone === 'pink' ? 'url(#ra-pink)' : 'url(#ra-white)';
  return (
    <g className="ra-flower" transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="0" cy="-15" rx="12" ry="21" fill={fill} transform={`rotate(${a})`} />
      ))}
      <circle cx="0" cy="0" r="9" fill="#e9c3ca" fillOpacity="0.8" />
      <circle cx="0" cy="0" r="4" fill="#6f7f5d" fillOpacity="0.24" />
    </g>
  );
}

function LeafSprig({ x, y, flip = false, rotate = 0 }: { x: number; y: number; flip?: boolean; rotate?: number }) {
  const scale = flip ? -1 : 1;
  return (
    <g className="ra-sprig" transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale} 1)`}>
      <path d="M0 0C38 42 55 96 48 162" />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={i}
          cx={18 + i * 7}
          cy={30 + i * 26}
          rx="9"
          ry="24"
          fill="#58724f"
          fillOpacity="0.48"
          transform={`rotate(${i % 2 ? -34 : 34} ${18 + i * 7} ${30 + i * 26})`}
        />
      ))}
    </g>
  );
}

function RoseArchFrame() {
  const topFlowers = [
    [46, 40, 0.82, -12], [104, 42, 0.7, 14], [166, 58, 0.88, 8], [248, 30, 0.74, -16],
    [486, 42, 0.9, -8], [566, 28, 0.76, 18], [642, 48, 0.86, 10], [728, 64, 0.76, -18],
  ];
  const sideFlowers = [
    [40, 190, 0.62, 12], [42, 406, 0.56, -10], [64, 744, 0.7, 15],
    [760, 200, 0.62, -16], [748, 438, 0.55, 10], [706, 744, 0.7, -12],
  ];
  const bottomFlowers = [
    [116, 1088, 0.78, 10], [228, 1068, 0.64, -12], [410, 1088, 0.9, 0], [560, 1068, 0.66, 18], [704, 1096, 0.76, -8],
  ];

  return (
    <svg className="ra-frame" viewBox="0 0 820 1180" aria-hidden="true">
      <defs>
        <radialGradient id="ra-pink" cx="42%" cy="38%" r="68%">
          <stop offset="0%" stopColor="#fff3f6" />
          <stop offset="48%" stopColor="#efb7c5" stopOpacity="0.86" />
          <stop offset="100%" stopColor="#cc8198" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="ra-white" cx="50%" cy="44%" r="62%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e5eadf" stopOpacity="0.44" />
        </radialGradient>
      </defs>

      <path className="ra-arch" d="M82 1008V470C82 254 226 126 410 126C594 126 738 254 738 470V1008" />
      <path className="ra-arch soft" d="M108 1002V478C108 278 238 154 410 154C582 154 712 278 712 478V1002" />
      {[...Array(45)].map((_, i) => {
        const t = i / 44;
        const angle = Math.PI - t * Math.PI;
        const x = 410 + Math.cos(angle) * 330;
        const y = 470 - Math.sin(angle) * 322;
        return <circle key={i} className="ra-arch-dot" cx={x} cy={y} r="11" />;
      })}

      <LeafSprig x={44} y={92} rotate={-22} />
      <LeafSprig x={250} y={34} rotate={48} />
      <LeafSprig x={666} y={28} flip rotate={-42} />
      <LeafSprig x={778} y={98} flip rotate={22} />
      <LeafSprig x={70} y={720} rotate={20} />
      <LeafSprig x={738} y={706} flip rotate={-18} />

      {topFlowers.map(([x, y, s, r], i) => <Flower key={`t${i}`} x={x} y={y} s={s} r={r} tone={i % 3 === 1 ? 'white' : 'pink'} />)}
      {sideFlowers.map(([x, y, s, r], i) => <Flower key={`s${i}`} x={x} y={y} s={s} r={r} tone={i % 2 ? 'white' : 'pink'} />)}
      {bottomFlowers.map(([x, y, s, r], i) => <Flower key={`b${i}`} x={x} y={y} s={s} r={r} tone={i % 2 ? 'white' : 'pink'} />)}

      <g className="ra-watercolor-mass">
        <ellipse cx="88" cy="88" rx="138" ry="76" />
        <ellipse cx="642" cy="74" rx="154" ry="84" />
        <ellipse cx="18" cy="640" rx="96" ry="260" />
        <ellipse cx="804" cy="620" rx="94" ry="248" />
        <ellipse cx="410" cy="1132" rx="260" ry="72" />
      </g>
    </svg>
  );
}

export default function RoseArchInvitation() {
  const [lang, setLang] = useState<Lang>('en');
  const [opened, setOpened] = useState(false);
  const c = copy[lang];

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
    document.documentElement.style.overflow = opened ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [opened]);

  return (
    <main className={`rose-arch${opened ? ' opened' : ''}`}>
      <div className="ra-lang">
        <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
        <button className={lang === 'id' ? 'on' : ''} onClick={() => setLang('id')}>ID</button>
      </div>

      <section className="ra-cover" aria-label="Wedding invitation cover">
        <img className="ra-reference-cover" src="/reference/rose-arch-reference.jpeg" alt="" aria-hidden="true" />
        <div className="ra-card">
          <span className="ra-card-corner ra-card-corner-tl" />
          <span className="ra-card-corner ra-card-corner-tr" />
          <span className="ra-card-corner ra-card-corner-bl" />
          <span className="ra-card-corner ra-card-corner-br" />
          <p className="ra-title">{c.title}</p>
          <div className="ra-plaque" aria-hidden="true">
            <span>Varian</span>
            <i />
            <span>Taslia</span>
          </div>
          <div className="ra-card-details">
            <p>{c.date}</p>
            <p>{c.time}</p>
            <p>{c.place}</p>
            <p>{c.venue}</p>
          </div>
        </div>
        <button className="ra-open-btn" onClick={() => setOpened(true)}>{c.tap}</button>
      </section>

      <div className="ra-content" aria-hidden={!opened}>
        <section className="ra-section ra-intro">
          <p className="ra-kicker">{c.date} · {c.place}</p>
          <h1>Taslia <span>&amp;</span> Varian</h1>
          <p>{c.intro}</p>
        </section>

        <section className="ra-section ra-story">
          <p className="ra-kicker">Aceh · Hannover · Bukittinggi</p>
          <h2>{c.storyTitle}</h2>
          <p>{c.story}</p>
        </section>

        <section className="ra-save">
          <div>
            <p>{c.save}</p>
            <strong>04</strong>
            <span>June 2026</span>
          </div>
          <a href="/taslia-varian-wedding.ics" download>{c.calendar}</a>
          <a href={googleUrl} target="_blank" rel="noreferrer">{c.google}</a>
        </section>

        <section className="ra-gallery">
          <p className="ra-kicker">{c.gallery}</p>
          <div>
            {photos.map((photo) => <img key={photo} src={photo} alt="" loading="lazy" />)}
          </div>
        </section>

        <footer className="ra-footer">{c.closing}</footer>
      </div>
    </main>
  );
}
