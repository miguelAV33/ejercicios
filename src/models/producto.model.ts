export type Prioridad = 'baja' | 'media' | 'alta';
export type FiltroEstado = 'todos' | 'pendientes' | 'comprados';

export interface Producto {
  id: string;
  nombre: string;
  notas?: string;
  prioridad: Prioridad;
  comprado: boolean;
}
