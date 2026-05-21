import React, { createContext, useContext, ReactNode } from 'react';
import { useListaCompra } from '../hooks/useListaCompra';

type Ctx = ReturnType<typeof useListaCompra>;
const ListaCompraContext = createContext<Ctx | null>(null);

export function ListaCompraProvider({ children }: { children: ReactNode }) {
  return <ListaCompraContext.Provider value={useListaCompra()}>{children}</ListaCompraContext.Provider>;
}
export function useListaCompraContext() {
  const ctx = useContext(ListaCompraContext);
  if (!ctx) throw new Error('Need ListaCompraProvider');
  return ctx;
}
