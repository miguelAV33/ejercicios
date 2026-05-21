import { useEffect, RefObject } from 'react';
import { Prioridad } from '../models/producto.model';

export function useAltaPrioridad(ref: RefObject<HTMLElement | null>, prioridad: Prioridad, comprado: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const urgente = prioridad === 'alta' && !comprado;
    urgente ? el.classList.add('urgente') : el.classList.remove('urgente');
  }, [ref, prioridad, comprado]);
}
