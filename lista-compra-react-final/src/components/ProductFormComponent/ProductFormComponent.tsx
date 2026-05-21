import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prioridad } from '../../models/producto.model';
import { useListaCompraContext } from '../../context/ListaCompraContext';
import './ProductFormComponent.css';

const PRIOS: { v: Prioridad; label: string; color: string; key: string }[] = [
  { v: 'baja',  label: 'Baja',   color: '#5A5A78', key: '🟢' },
  { v: 'media', label: 'Media',  color: '#FFD25A', key: '🟡' },
  { v: 'alta',  label: 'Urgente',color: '#FF5C3A', key: '🔴' },
];

export default function ProductFormComponent() {
  const { agregarProducto } = useListaCompraContext();
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [notas, setNotas]   = useState('');
  const [prio, setPrio]     = useState<Prioridad>('media');
  const [touched, setTouched] = useState(false);
  const [flash, setFlash]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const nombreInvalido = touched && !nombre.trim();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!nombre.trim()) { inputRef.current?.focus(); return; }
    agregarProducto(nombre, prio, notas || undefined);
    setNombre(''); setNotas(''); setPrio('media'); setTouched(false);
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
    inputRef.current?.focus();
  }, [nombre, notas, prio, agregarProducto]);

  return (
    <div className="form-section">
      {/* Collapsed trigger */}
      {!open ? (
        <motion.button
          className="form-trigger"
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 200); }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="button"
        >
          <span className="trigger-plus">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="8" x2="14" y2="8"/>
            </svg>
          </span>
          <span className="trigger-label">Añadir producto a la lista</span>
          <span className="trigger-hint">↵ Enter</span>
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            className={`form-card${flash ? ' flash' : ''}`}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22,1,0.36,1] }}
          >
            <form onSubmit={handleSubmit} noValidate>
              {/* Nombre */}
              <div className="field">
                <div className="field-row-label">
                  <label className="flabel" htmlFor="f-nombre">
                    Nombre del producto
                    <span className="req">*</span>
                  </label>
                  <button className="close-btn" type="button" onClick={() => { setOpen(false); setTouched(false); }}
                    aria-label="Cerrar formulario">
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/>
                    </svg>
                  </button>
                </div>
                <input
                  ref={inputRef}
                  id="f-nombre"
                  className={`finput${nombreInvalido ? ' invalid' : ''}`}
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="ej. Leche entera, Aguacates, Cerveza artesanal…"
                  autoComplete="off"
                  maxLength={80}
                />
                <AnimatePresence>
                  {nombreInvalido && (
                    <motion.p className="ferror" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      ⚠ El nombre es obligatorio
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Notas + Prioridad row */}
              <div className="form-row">
                <div className="field flex1">
                  <label className="flabel" htmlFor="f-notas">Notas / Cantidad <span className="opt">(opcional)</span></label>
                  <textarea id="f-notas" className="ftextarea" value={notas}
                    onChange={e => setNotas(e.target.value)} placeholder="2 litros, sin gluten…" rows={2} maxLength={120} />
                </div>
                <div className="field">
                  <label className="flabel">Prioridad</label>
                  <div className="prio-selector">
                    {PRIOS.map(p => (
                      <motion.button key={p.v} type="button"
                        className={`prio-btn${prio === p.v ? ' active' : ''}`}
                        style={{ '--pcolor': p.color } as any}
                        onClick={() => setPrio(p.v)}
                        whileTap={{ scale: 0.9 }}
                        aria-pressed={prio === p.v}>
                        <span className="prio-dot-btn" style={{ background: p.color }} />
                        {p.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                className="fsubmit"
                whileHover={{ scale: 1.01, boxShadow: '0 0 28px rgba(202,255,90,0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="8" x2="14" y2="8"/>
                </svg>
                Añadir a la lista
              </motion.button>
            </form>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
