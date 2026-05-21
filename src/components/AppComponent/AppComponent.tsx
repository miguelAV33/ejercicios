import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useTransform, useSpring } from 'framer-motion';
import { useListaCompraContext } from '../../context/ListaCompraContext';
import ProductFormComponent from '../ProductFormComponent/ProductFormComponent';
import ShoppingListComponent from '../ShoppingListComponent/ShoppingListComponent';
import './AppComponent.css';

/* ─── Confetti particle ─── */
function Particle({ x, color }: { x: number; color: string }) {
  const rot = (Math.random() - 0.5) * 720;
  const tx  = (Math.random() - 0.5) * 300;
  return (
    <motion.div
      style={{ position: 'fixed', top: '40%', left: `${x}%`, width: 8, height: 8,
               borderRadius: Math.random() > 0.5 ? '50%' : '2px', background: color, zIndex: 300, pointerEvents: 'none' }}
      initial={{ y: 0, x: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{ y: [0, -160, 300], x: [0, tx], opacity: [1, 1, 0], rotate: rot, scale: [1, 1, 0.4] }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    />
  );
}

const CONFETTI_COLORS = ['#CAFF5A', '#FF5C3A', '#5AEFFF', '#FFD25A', '#BF7AFF', '#FFFFFF'];
const CIRC = 2 * Math.PI * 18;

export default function AppComponent() {
  const { totalPendientes, totalProductos } = useListaCompraContext();
  const [scrolled, setScrolled]     = useState(false);
  const [particles, setParticles]   = useState<{ id: number; x: number; color: string }[]>([]);
  const prevPending = useRef(totalPendientes);

  const comprados = totalProductos - totalPendientes;
  const rawPct    = totalProductos > 0 ? comprados / totalProductos : 0;
  const pct       = Math.round(rawPct * 100);

  // Animated progress
  const springPct = useSpring(rawPct, { stiffness: 80, damping: 20 });
  const dashOffset = useTransform(springPct, v => CIRC - v * CIRC);

  useEffect(() => { springPct.set(rawPct); }, [rawPct, springPct]);

  // Scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Confetti when all done
  useEffect(() => {
    if (totalProductos > 0 && totalPendientes === 0 && prevPending.current > 0) {
      const ps = Array.from({ length: 40 }, (_, i) => ({
        id: i, x: Math.random() * 100, color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]
      }));
      setParticles(ps);
      setTimeout(() => setParticles([]), 2000);
    }
    prevPending.current = totalPendientes;
  }, [totalPendientes, totalProductos]);

  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="app-root">
      {/* Confetti */}
      <AnimatePresence>
        {particles.map(p => <Particle key={p.id} x={p.x} color={p.color} />)}
      </AnimatePresence>

      {/* ── Sticky header ── */}
      <motion.header
        className={`app-header${scrolled ? ' scrolled' : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="header-inner">
          <div className="header-left">
            <div className="header-logo">
              <div className="logo-ring" />
              <div className="logo-dot">
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 2h10l-1.5 9H3.5L2 2z"/>
                  <circle cx="5" cy="13" r="0.8" fill="currentColor" stroke="none"/>
                  <circle cx="9" cy="13" r="0.8" fill="currentColor" stroke="none"/>
                </svg>
              </div>
            </div>
            <span className="header-title">La Compra</span>
          </div>

          <div className="header-right">
            {/* Pending pill */}
            <AnimatePresence>
              {totalPendientes > 0 && (
                <motion.div className="header-pill"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <span className="pill-num">{totalPendientes}</span>
                  <span>pendientes</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SVG ring progress */}
            {totalProductos > 0 && (
              <div className="ring-wrap" title={`${pct}% completado`}>
                <svg width="38" height="38" viewBox="0 0 38 38">
                  <circle cx="19" cy="19" r="18" fill="none" stroke="var(--s3)" strokeWidth="3"/>
                  <motion.circle cx="19" cy="19" r="18" fill="none" stroke="var(--lime)"
                    strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={CIRC}
                    style={{ strokeDashoffset: dashOffset }}
                    transform="rotate(-90 19 19)"
                  />
                </svg>
                <span className="ring-pct">{pct}<span style={{ fontSize: 7 }}>%</span></span>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <div className="app-hero">
        <motion.div className="hero-eyebrow"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <span className="eyebrow-line" />
          <span className="eyebrow-text">{today}</span>
        </motion.div>

        <motion.h1 className="hero-title"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: [0.22,1,0.36,1] }}>
          Lista de<br /><em>la compra</em>
        </motion.h1>

        {/* Stats row */}
        <motion.div className="hero-stats"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="stat">
            <motion.span className="stat-num" key={totalPendientes}
              initial={{ scale: 1.3, color: '#CAFF5A' }} animate={{ scale: 1, color: '#F0EFFE' }}
              transition={{ duration: 0.3 }}>
              {totalPendientes}
            </motion.span>
            <span className="stat-lbl">por comprar</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <motion.span className="stat-num lime" key={comprados}
              initial={{ scale: 1.3 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
              {comprados}
            </motion.span>
            <span className="stat-lbl">en el carro</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num fog">{totalProductos}</span>
            <span className="stat-lbl">total</span>
          </div>
        </motion.div>

        {/* Progress bar */}
        {totalProductos > 0 && (
          <motion.div className="hero-progress"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <div className="progress-labels">
              <span className="prog-lbl">Progreso</span>
              <motion.span className="prog-pct" key={pct}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {pct}%
              </motion.span>
            </div>
            <div className="prog-track">
              <motion.div className="prog-fill"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: [0.4,0,0.2,1] }}
              >
                {pct > 5 && <span className="prog-glow" />}
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Main content ── */}
      <motion.main className="app-body"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
        <ProductFormComponent />
        <ShoppingListComponent />
      </motion.main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <span className="footer-brand">La Compra</span>
        <span>Datos guardados automáticamente · {totalProductos} {totalProductos === 1 ? 'producto' : 'productos'}</span>
      </footer>
    </div>
  );
}
