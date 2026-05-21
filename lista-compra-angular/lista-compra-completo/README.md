# 🛒 Lista de la Compra — Angular

Aplicación Angular con todos los requisitos del DIG completamente implementados.

## Estructura de componentes

```
AppComponent                    ← contenedor principal
├── ProductFormComponent        ← Reactive Forms + validaciones
└── ShoppingListComponent       ← lista filtrable + filtros
    └── ProductItemComponent    ← tarjeta de producto
        └── AltaPrioridadDirective  ← directiva personalizada
```

## Requisitos implementados ✅

| Requisito | Implementado en |
|-----------|----------------|
| AppComponent | `app.ts` + `app.html` |
| ProductFormComponent | `components/product-form/` |
| ShoppingListComponent | `components/shopping-list/` |
| ProductItemComponent | `components/product-item/` |
| Modelo: id, nombre, notas, prioridad, comprado | `models/producto.model.ts` |
| Reactive Forms + validación nombre obligatorio | `product-form.component.ts` |
| Marcar/desmarcar comprado | `lista-compra.service.ts` |
| Eliminar producto | `lista-compra.service.ts` |
| Filtros: todos / pendientes / comprados | `shopping-list.component.ts` |
| Contador de pendientes | `app.html` + service computed |
| Persistencia localStorage | `lista-compra.service.ts` |
| Directiva personalizada alta prioridad | `directives/alta-prioridad.directive.ts` |

## Cómo probar (opción más rápida)

```bash
cd dist
python3 -m http.server 4200
```

Abre → http://localhost:4200

## Desarrollo con Angular CLI

```bash
npm install
npm start
```
