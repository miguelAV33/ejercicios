import { useState, useCallback, useMemo } from 'react';
import { Producto, Prioridad, FiltroEstado } from '../models/producto.model';

const KEY = 'lacompra_v3';
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

function load(): Producto[] {
  try { const d = localStorage.getItem(KEY); return d ? JSON.parse(d) : []; } catch { return []; }
}
function save(p: Producto[]) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}

export function useListaCompra() {
  const [productos, setProductos] = useState<Producto[]>(load);
  const [filtro, setFiltro] = useState<FiltroEstado>('todos');

  const setAndSave = useCallback((fn: (prev: Producto[]) => Producto[]) => {
    setProductos(prev => { const next = fn(prev); save(next); return next; });
  }, []);

  const agregarProducto = useCallback((nombre: string, prioridad: Prioridad, notas?: string) => {
    setAndSave(prev => [{ id: genId(), nombre: nombre.trim(), notas: notas?.trim() || undefined, prioridad, comprado: false }, ...prev]);
  }, [setAndSave]);

  const toggleComprado = useCallback((id: string) => {
    setAndSave(prev => prev.map(p => p.id === id ? { ...p, comprado: !p.comprado } : p));
  }, [setAndSave]);

  const eliminarProducto = useCallback((id: string) => {
    setAndSave(prev => prev.filter(p => p.id !== id));
  }, [setAndSave]);

  const editarNombre = useCallback((id: string, nombre: string) => {
    setAndSave(prev => prev.map(p => p.id === id ? { ...p, nombre } : p));
  }, [setAndSave]);

  const limpiarComprados = useCallback(() => {
    setAndSave(prev => prev.filter(p => !p.comprado));
  }, [setAndSave]);

  const productosFiltrados = useMemo(() => {
    switch (filtro) {
      case 'pendientes': return productos.filter(p => !p.comprado);
      case 'comprados':  return productos.filter(p =>  p.comprado);
      default:           return productos;
    }
  }, [productos, filtro]);

  const totalPendientes = useMemo(() => productos.filter(p => !p.comprado).length, [productos]);
  const totalComprados  = useMemo(() => productos.filter(p =>  p.comprado).length, [productos]);
  const totalProductos  = productos.length;

  return { productos, productosFiltrados, filtro, setFiltro, agregarProducto, toggleComprado,
    eliminarProducto, editarNombre, limpiarComprados, totalPendientes, totalComprados, totalProductos };
}
