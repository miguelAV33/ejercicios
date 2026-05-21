import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiltroEstado } from '../../models/producto.model';
import { useListaCompraContext } from '../../context/ListaCompraContext';
import ProductItemComponent from '../ProductItemComponent/ProductItemComponent';
import './ShoppingListComponent.css';

const FILTROS: { v: FiltroEstado; label: string }[] = [
  { v: 'todos',      label: 'Todo'       },
  { v: 'pendientes', label: 'Pendiente'  },
  { v: 'comprados',  label: 'Comprado'   },
];

export default function ShoppingListComponent() {
  const { productosFiltrados, filtro, setFiltro, totalPendientes,
          totalComprados, toggleComprado, eliminarProducto, editarNombre, limpiarComprados } = useListaCompraContext();

  const pendientes = productosFiltrados.filter(p => !p.comprado);
  const comprados  = productosFiltrados.filter(p =>  p.comprado);

  const onToggle  = useCallback((id: string) => toggleComprado(id),   [toggleComprado]);
  const onEliminar = useCallback((id: string) => eliminarProducto(id), [eliminarProducto]);
  const onEditar  = useCallback((id: string, n: string) => editarNombre(id, n), [editarNombre]);

  const vacio = productosFiltrados.length === 0;

  return (
    <section>
      {/* Toolbar */}
      <div className="list-toolbar">
        {/* Filter tabs */}
        <div className="filter-tabs" role="group">
          {FILTROS.map(f => (
            <motion.button key={f.v} type="button"
              className={`ftab${filtro === f.v ? ' active' : ''}`}
              onClick={() => setFiltro(f.v)}
              whileTap={{ scale: 0.94 }}
              aria-pressed={filtro === f.v}>
              {f.label}
              {f.v === 'pendientes' && totalPendientes > 0 && (
                <motion.span className="ftab-badge" key={totalPendientes}
                  initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
                  {totalPendientes}
                </motion.span>
              )}
              {f.v === 'comprados' && totalComprados > 0 && (
                <span className="ftab-badge done">{totalComprados}</span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Clear completed */}
        <AnimatePresence>
          {totalComprados > 0 && (
            <motion.button className="clear-btn" type="button" onClick={limpiarComprados}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              whileTap={{ scale: 0.94 }}
              title="Eliminar todos los comprados">
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <polyline points="2 4 12 4"/><path d="M5 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1"/>
                <rect x="2.5" y="4" width="9" height="8" rx="1"/>
              </svg>
              Limpiar comprados
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe hint */}
      <div className="swipe-hint">
        <svg viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="2" y2="5"/><polyline points="5 2 2 5 5 8"/>
        </svg>
        Desliza a la izquierda para eliminar · Doble clic para editar
      </div>

      {/* Empty state */}
      <AnimatePresence mode="wait">
        {vacio ? (
          <motion.div className="empty" key="empty"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="empty-icon" aria-hidden="true">
              <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <circle cx="30" cy="30" r="26"/><path d="M20 26h20M20 34h12"/>
                <circle cx="42" cy="42" r="10" fill="var(--s2)" stroke="var(--s4)"/>
                <line x1="38" y1="42" x2="46" y2="42"/>
              </svg>
            </div>
            <p className="empty-title">
              {filtro === 'comprados'  ? 'Nada comprado aún' :
               filtro === 'pendientes' ? '¡Todo listo! 🎉'  : 'La lista está vacía'}
            </p>
            <p className="empty-sub">
              {filtro === 'todos' && 'Pulsa el botón de arriba para añadir tu primer producto'}
            </p>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Pending section */}
            {pendientes.length > 0 && filtro !== 'comprados' && (
              <div className="list-section">
                {filtro === 'todos' && comprados.length > 0 && (
                  <div className="section-head">
                    <span>Por comprar</span>
                    <span className="section-count">{pendientes.length}</span>
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {pendientes.map((p, i) => (
                    <ProductItemComponent key={p.id} producto={p} index={i}
                      onToggleComprado={onToggle} onEliminar={onEliminar} onEditar={onEditar} />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Completed section */}
            {comprados.length > 0 && filtro !== 'pendientes' && (
              <div className="list-section">
                {filtro === 'todos' && pendientes.length > 0 && (
                  <div className="section-head done-head">
                    <span>Ya en el carro</span>
                    <span className="section-count done">{comprados.length}</span>
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {comprados.map((p, i) => (
                    <ProductItemComponent key={p.id} producto={p} index={i}
                      onToggleComprado={onToggle} onEliminar={onEliminar} onEditar={onEditar} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
