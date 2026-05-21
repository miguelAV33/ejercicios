import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Producto } from '../../models/producto.model';
import { useAltaPrioridad } from '../../directives/useAltaPrioridad';
import './ProductItemComponent.css';

interface Props {
  producto: Producto;
  onToggleComprado: (id: string) => void;
  onEliminar: (id: string) => void;
  onEditar: (id: string, nombre: string) => void;
  index: number;
}

const PRIO_CONFIG = {
  alta:  { label: 'Urgente', color: 'var(--coral)',  bg: 'var(--coral-glow)',  dot: '#FF5C3A' },
  media: { label: 'Media',   color: 'var(--gold)',   bg: 'rgba(255,210,90,0.15)', dot: '#FFD25A' },
  baja:  { label: 'Baja',    color: 'var(--fog)',    bg: 'transparent',        dot: '#5A5A78'  },
};

export default function ProductItemComponent({ producto, onToggleComprado, onEliminar, onEditar, index }: Props) {
  const artRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(producto.nombre);
  const [showActions, setShowActions] = useState(false);

  // Directiva personalizada
  useAltaPrioridad(artRef, producto.prioridad, producto.comprado);

  // Swipe to delete
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-120, -60], [1, 0]);
  const itemOpacity   = useTransform(x, [-120, 0], [0.3, 1]);
  const controls = useAnimation();

  const handleDragEnd = useCallback((_: any, info: any) => {
    if (info.offset.x < -100) {
      controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } })
        .then(() => onEliminar(producto.id));
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
    }
  }, [controls, onEliminar, producto.id]);

  const commitEdit = useCallback(() => {
    const v = editVal.trim();
    if (v && v !== producto.nombre) onEditar(producto.id, v);
    else setEditVal(producto.nombre);
    setEditing(false);
  }, [editVal, producto, onEditar]);

  const prio = PRIO_CONFIG[producto.prioridad];

  return (
    <motion.div
      className="item-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, scale: 0.95 }}
      transition={{ duration: 0.28, delay: index * 0.04, ease: [0.22,1,0.36,1] }}
      layout
    >
      {/* Swipe delete background */}
      <motion.div className="swipe-bg" style={{ opacity: deleteOpacity }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <polyline points="3 6 17 6"/><path d="M6 6V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1"/>
          <rect x="4" y="6" width="12" height="11" rx="1.5"/>
          <line x1="8" y1="10" x2="8" y2="14"/><line x1="12" y1="10" x2="12" y2="14"/>
        </svg>
        <span>Eliminar</span>
      </motion.div>

      {/* Main card */}
      <motion.article
        ref={artRef}
        className={`item${producto.comprado ? ' comprado' : ''}`}
        style={{ x, opacity: itemOpacity }}
        drag="x"
        dragConstraints={{ left: -140, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        whileTap={{ cursor: 'grabbing' }}
        onHoverStart={() => setShowActions(true)}
        onHoverEnd={() => setShowActions(false)}
      >
        {/* Checkbox */}
        <motion.button
          className={`cb${producto.comprado ? ' done' : ''}`}
          onClick={() => onToggleComprado(producto.id)}
          whileTap={{ scale: 0.85 }}
          aria-label={producto.comprado ? 'Desmarcar' : 'Marcar como comprado'}
          type="button"
        >
          <AnimatePresence>
            {producto.comprado && (
              <motion.svg key="check" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="2.5 7 5.5 10 11.5 4"/>
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Content */}
        <div className="item-body">
          {editing ? (
            <input
              className="item-edit-input"
              value={editVal}
              onChange={e => setEditVal(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') { setEditVal(producto.nombre); setEditing(false); } }}
              autoFocus
            />
          ) : (
            <span className="item-nombre" onDoubleClick={() => { setEditing(true); setEditVal(producto.nombre); }}>
              {producto.nombre}
            </span>
          )}
          {producto.notas && <span className="item-notas">{producto.notas}</span>}
        </div>

        {/* Priority badge */}
        <span className="prio-dot" style={{ background: prio.dot }} title={prio.label} />

        {/* Actions - visible on hover */}
        <AnimatePresence>
          {(showActions || editing) && (
            <motion.div className="item-actions"
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}>
              {/* Edit btn */}
              <motion.button className="act-btn edit" type="button" whileTap={{ scale: 0.88 }}
                onClick={() => { setEditing(true); setEditVal(producto.nombre); }}
                aria-label="Editar nombre">
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M10 2l2 2-7 7H3v-2l7-7z"/>
                </svg>
              </motion.button>
              {/* Delete btn */}
              <motion.button className="act-btn del" type="button" whileTap={{ scale: 0.88 }}
                onClick={() => onEliminar(producto.id)}
                aria-label="Eliminar">
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <polyline points="2 4 12 4"/><path d="M5 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1"/>
                  <rect x="2.5" y="4" width="9" height="8" rx="1"/>
                </svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Urgente accent line */}
        {producto.prioridad === 'alta' && !producto.comprado && (
          <motion.div className="urgente-line" layoutId={`urgente-${producto.id}`}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} />
        )}
      </motion.article>
    </motion.div>
  );
}
