import React from 'react';
import { ListaCompraProvider } from './context/ListaCompraContext';
import AppComponent from './components/AppComponent/AppComponent';

export default function App() {
  return (
    <ListaCompraProvider>
      <AppComponent />
    </ListaCompraProvider>
  );
}
