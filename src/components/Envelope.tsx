import { useRef, useState } from 'react';
import { motion, useAnimate, AnimatePresence } from 'framer-motion';

interface Props {
  onOpen: () => void;
  lang: 'en' | 'id';
}

const label = { en: 'tap to open', id: 'sentuh untuk membuka' };

export default function Envelope({ onOpen, lang }: Props) {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'gone'>('idle');
  const [scope, animate] = useAnimate();
  const triggered = useRef(false);

  const open = async () => {
    if (triggered.current) return;
    triggered.current = true;
    setPhase('opening');
    onOpen(); // start audio ramp immediately

    // 1. flap lifts open
    await animate('#flap', { rotateX: -180 }, { duration: 0.9, ease: [0.4, 0, 0.2, 1] });

    // 2. card rises out of envelope
    await animate('#card', { y: '-62%', opacity: 1 }, { duration: 0.85, ease: [0.16, 1, 0.3, 1] });

    // 3. brief pause — hold the moment
    await new Promise(r => setTimeout(r, 420));

    // 4. card unfolds (scale up + fade envelope out simultaneously)
    await Promise.all([
      animate('#card', { scale: 1.12, y: '-68%' }, { duration: 0.5, ease: [0.4, 0, 0.2, 1] }),
      animate('#envelope-body', { opacity: 0 }, { duration: 0.4, ease: 'easeIn' }),
      animate('#flap', { opacity: 0 }, { duration: 0.3, ease: 'easeIn' }),
    ]);

    // 5. whole thing fades out
    await animate(scope.current, { opacity: 0 }, { duration: 0.9, ease: 'easeInOut' });

    setPhase('gone');
  };

  if (phase === 'gone') return null;

  return (
    <motion.div
      ref={scope}
      className="env-stage"
      onClick={open}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* hint */}
      <AnimatePresence>
        {phase === 'idle' && (
          <motion.div
            className="env-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            {label[lang]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* envelope wrapper — 3D perspective container */}
      <div className="env-wrap">

        {/* card inside envelope — starts hidden, rises on open */}
        <motion.div
          id="card"
          className="env-card"
          initial={{ y: '0%', opacity: 0 }}
        >
          <div className="env-card-inner">
            {/* ornament */}
            <svg className="env-card-orn" viewBox="0 0 120 20" fill="none">
              <line x1="0" y1="10" x2="120" y2="10" stroke="rgba(201,169,122,0.2)" strokeWidth="0.8"/>
              <rect x="56" y="6" width="8" height="8" transform="rotate(45 60 10)" stroke="rgba(201,169,122,0.5)" strokeWidth="0.6" fill="none"/>
              <circle cx="60" cy="10" r="1" fill="rgba(201,169,122,0.6)"/>
            </svg>
            <p className="env-card-label">Wedding Invitation</p>
            <p className="env-card-names">Taslia<span>&amp;</span>Varian</p>
            <p className="env-card-date">04 · June · 2026</p>
            <svg className="env-card-orn" viewBox="0 0 120 20" fill="none" style={{ transform: 'rotate(180deg)' }}>
              <line x1="0" y1="10" x2="120" y2="10" stroke="rgba(201,169,122,0.2)" strokeWidth="0.8"/>
              <rect x="56" y="6" width="8" height="8" transform="rotate(45 60 10)" stroke="rgba(201,169,122,0.5)" strokeWidth="0.6" fill="none"/>
              <circle cx="60" cy="10" r="1" fill="rgba(201,169,122,0.6)"/>
            </svg>
          </div>
        </motion.div>

        {/* envelope body — back face + side flaps */}
        <div id="envelope-body" className="env-body">
          {/* left flap */}
          <div className="env-flap-side env-flap-left" />
          {/* right flap */}
          <div className="env-flap-side env-flap-right" />
          {/* bottom flap */}
          <div className="env-flap-bottom" />
          {/* wax seal */}
          <div className="env-seal">
            <span className="env-seal-mono">T<small>&amp;</small>V</span>
          </div>
        </div>

        {/* top flap — hinges open */}
        <motion.div id="flap" className="env-flap-top" style={{ rotateX: 0 }} />

      </div>
    </motion.div>
  );
}
