// ==============================
// Productos (tus PNG locales)
// ==============================
const productos = [
  {
    id: 1,
    nombre: "iGlass Bottle 500ml",
    precio: 19.99,
    categoria: "Accesorios",
    imagen: "assets/products/botellaAgua.png",
  },
  {
    id: 2,
    nombre: "Minimal Hoodie",
    precio: 59.9,
    categoria: "Ropa",
    imagen: "assets/products/sudaderaNegra.png",
  },
  {
    id: 3,
    nombre: "Wireless Earbuds",
    precio: 129.0,
    categoria: "Tecnología",
    imagen: "assets/products/auricularesNegros.png",
  },
  {
    id: 4,
    nombre: "Leather Tote Bag",
    precio: 89.5,
    categoria: "Ropa",
    imagen: "assets/products/toteBag.png",
  },
  {
    id: 5,
    nombre: "Desk Lamp Pro",
    precio: 39.95,
    categoria: "Hogar",
    imagen: "assets/products/lamparaEscritorio.png",
  },
  {
    id: 6,
    nombre: "Ceramic Mug Set",
    precio: 24.75,
    categoria: "Hogar",
    imagen: "assets/products/setTazas.png",
  },
  {
    id: 7,
    nombre: "Charging Brick 30W",
    precio: 29.99,
    categoria: "Tecnología",
    imagen: "assets/products/cargadorUsb.png",
  },
  {
    id: 8,
    nombre: "Scented Candle",
    precio: 18.5,
    categoria: "Hogar",
    imagen: "assets/products/velaNegra.png",
  },
];

// Imagen fallback (por si alguna falla)
const FALLBACK_IMG = "assets/products/botellaAgua.png";

// ==============================
// Estado
// ==============================
let carrito = [];
let cupon = { codigo: "", porcentaje: 0 };

const CUPONES = {
  MINIMAL10: 0.1,
  APPLE15: 0.15,
};
const ENVIO_GRATIS_DESDE = 150;

// ==============================
// DOM
// ==============================
const gridProductos = document.getElementById("gridProductos");
const listaCarrito = document.getElementById("listaCarrito");

const contadorCarrito = document.getElementById("contadorCarrito");
const totalTop = document.getElementById("totalTop");
const itemsCarrito = document.getElementById("itemsCarrito");

const subtotalEl = document.getElementById("subtotal");
const descuentoEl = document.getElementById("descuento");
const envioEl = document.getElementById("envio");
const totalCarritoEl = document.getElementById("totalCarrito");
const mensajeEnvio = document.getElementById("mensajeEnvio");

// Dropdown
const dropdownToggle = document.getElementById("dropdownToggle");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownOverlay = document.getElementById("dropdownOverlay");
const dropdown = document.querySelector(".dropdown");
const dropdownLabel = document.querySelector(".dropdown-label");

// Botones / inputs
const btnVaciar = document.getElementById("btnVaciar");
const btnCheckout = document.getElementById("btnCheckout");
const btnAplicarCupon = document.getElementById("btnAplicarCupon");
const inputCupon = document.getElementById("inputCupon");

const btnAbrirCarrito = document.getElementById("btnAbrirCarrito");
const btnCerrarCarrito = document.getElementById("btnCerrarCarrito");
const panelCarrito = document.getElementById("panelCarrito");

// Quick View
const qvOverlay = document.getElementById("qvOverlay");
const qvModal = document.getElementById("qvModal");
const qvClose = document.getElementById("qvClose");
const qvImg = document.getElementById("qvImg");
const qvCat = document.getElementById("qvCat");
const qvName = document.getElementById("qvName");
const qvPrice = document.getElementById("qvPrice");
const qvAdd = document.getElementById("qvAdd");
const qvBuy = document.getElementById("qvBuy");

let qvProductoActual = null;

// ==============================
// Utilidades
// ==============================
function eur(n) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("cupon", JSON.stringify(cupon));
}

function cargarCarrito() {
  const data = localStorage.getItem("carrito");
  const dataCupon = localStorage.getItem("cupon");
  carrito = data ? JSON.parse(data) : [];
  cupon = dataCupon ? JSON.parse(dataCupon) : { codigo: "", porcentaje: 0 };
  if (cupon?.codigo) inputCupon.value = cupon.codigo;
}

// ==============================
// Cálculos
// ==============================
function calcularSubtotal() {
  return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}
function calcularDescuento(subtotal) {
  return subtotal * (cupon?.porcentaje || 0);
}
function calcularTotal() {
  const subtotal = calcularSubtotal();
  const descuento = calcularDescuento(subtotal);
  return Math.max(0, subtotal - descuento);
}
function calcularNumeroArticulos() {
  return carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

// ==============================
// Quick View
// ==============================
function abrirQuickView(producto) {
  qvProductoActual = producto;

  qvImg.src = producto.imagen;
  qvImg.alt = producto.nombre;
  qvCat.textContent = producto.categoria;
  qvName.textContent = producto.nombre;
  qvPrice.textContent = eur(producto.precio);

  qvImg.onerror = () => (qvImg.src = FALLBACK_IMG);

  qvOverlay.classList.add("active");
  qvModal.classList.add("active");
  qvModal.setAttribute("aria-hidden", "false");
}

function cerrarQuickView() {
  qvOverlay.classList.remove("active");
  qvModal.classList.remove("active");
  qvModal.setAttribute("aria-hidden", "true");
  qvProductoActual = null;
}

// ==============================
// Render Productos
// ==============================
function renderProductos(lista) {
  gridProductos.innerHTML = "";

  lista.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="product-image">
        <img src="${p.imagen}" alt="${p.nombre}">
      </div>

      <div class="card-content">
        <span class="badge">${p.categoria}</span>
        <h3>${p.nombre}</h3>

        <div class="card-footer">
          <span class="price">${eur(p.precio)}</span>
          <button class="btn primary" data-id="${p.id}">Añadir</button>
        </div>
      </div>
    `;

    // ✅ Debug + fallback si falla la imagen
    const img = card.querySelector("img");
    img.addEventListener("error", () => {
      console.error("❌ No se pudo cargar:", p.imagen);
      img.src = FALLBACK_IMG;
    });

    // ✅ Click en tarjeta => Quick View (excepto botón)
    card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      abrirQuickView(p);
    });

    gridProductos.appendChild(card);
  });

  // Botón añadir
  gridProductos.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      añadirAlCarrito(id);
    });
  });
}

// ==============================
// Render Carrito con miniaturas + controles +/−
// ==============================
function renderCarrito() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML = `
      <div class="cart-item" style="grid-template-columns: 1fr;">
        <div>
          <h4>Tu carrito está vacío</h4>
          <div class="meta">Añade productos para verlos aquí.</div>
        </div>
      </div>
    `;
  } else {
    carrito.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";

      row.innerHTML = `
        <div class="cart-thumb">
          <img src="${item.imagen}" alt="${item.nombre}">
        </div>

        <div class="cart-info-col">
          <h4>${item.nombre}</h4>

          <div class="meta">
            <span>${eur(item.precio)}</span>

            <div class="qty-controls">
              <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
              <span class="qty-number">${item.cantidad}</span>
              <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>

        <button class="remove" data-id="${item.id}">Eliminar</button>
      `;

      // fallback miniatura
      const img = row.querySelector(".cart-thumb img");
      img.addEventListener("error", () => {
        img.src = FALLBACK_IMG;
      });

      listaCarrito.appendChild(row);
    });

    // Eliminar
    listaCarrito.querySelectorAll(".remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        eliminarDelCarrito(id);
      });
    });

    // +/−
    listaCarrito.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = Number(btn.dataset.id);
        const action = btn.dataset.action;
        await cambiarCantidad(id, action === "plus" ? +1 : -1);
      });
    });
  }

  const num = calcularNumeroArticulos();
  const subtotal = calcularSubtotal();
  const descuento = calcularDescuento(subtotal);
  const total = calcularTotal();

  contadorCarrito.textContent = num;
  itemsCarrito.textContent = num;
  totalTop.textContent = eur(total);

  subtotalEl.textContent = eur(subtotal);
  descuentoEl.textContent = `-${eur(descuento)}`;
  totalCarritoEl.textContent = eur(total);

  if (total === 0) {
    envioEl.textContent = "—";
    mensajeEnvio.textContent = "";
  } else if (total >= ENVIO_GRATIS_DESDE) {
    envioEl.textContent = "Gratis";
    mensajeEnvio.textContent = "🎉 Envío gratis activado.";
  } else {
    envioEl.textContent = "Calculado en checkout";
    const falta = ENVIO_GRATIS_DESDE - total;
    mensajeEnvio.textContent = `Te faltan ${eur(falta)} para envío gratis.`;
  }

  guardarCarrito();
}

// ==============================
// Dropdown categorías (divisor + iconos + check)
// ==============================
function iconForCategory(cat) {
  const map = {
    Todas: "◼︎",
    Accesorios: "🧴",
    Ropa: "👕",
    Tecnología: "🎧",
    Hogar: "🏠",
  };
  return map[cat] || "◼︎";
}

function buildDropdownItem(cat, selected) {
  const item = document.createElement("div");
  item.className = "dropdown-item";
  if (selected) item.classList.add("selected");

  item.innerHTML = `
    <span class="icon">${iconForCategory(cat)}</span>
    <span class="text">${cat}</span>
    <span class="check">✓</span>
  `;

  item.addEventListener("click", () => {
    dropdownLabel.textContent = cat;

    dropdownMenu.querySelectorAll(".dropdown-item").forEach((i) => {
      i.classList.remove("selected");
    });
    item.classList.add("selected");

    closeDropdown();

    if (cat === "Todas") renderProductos(productos);
    else renderProductos(productos.filter((p) => p.categoria === cat));
  });

  return item;
}

function renderFiltroCategorias() {
  const categorias = ["Todas", ...new Set(productos.map((p) => p.categoria))];

  dropdownMenu.innerHTML = "";

  dropdownMenu.appendChild(buildDropdownItem(categorias[0], true));

  const divider = document.createElement("div");
  divider.className = "dropdown-divider";
  dropdownMenu.appendChild(divider);

  categorias.slice(1).forEach((cat) => {
    dropdownMenu.appendChild(buildDropdownItem(cat, false));
  });
}

function openDropdown() {
  dropdownMenu.classList.add("active");
  dropdown.classList.add("open");
  dropdownOverlay.classList.add("active");
}
function closeDropdown() {
  dropdownMenu.classList.remove("active");
  dropdown.classList.remove("open");
  dropdownOverlay.classList.remove("active");
}
function toggleDropdown() {
  const isOpen = dropdownMenu.classList.contains("active");
  if (isOpen) closeDropdown();
  else openDropdown();
}

// ==============================
// Acciones del carrito
// ==============================
function añadirAlCarrito(idProducto) {
  const prod = productos.find((p) => p.id === idProducto);
  if (!prod) return;

  const existe = carrito.find((item) => item.id === idProducto);
  if (existe) existe.cantidad += 1;
  else carrito.push({ ...prod, cantidad: 1 });

  renderCarrito();

  Swal.fire({
    icon: "success",
    title: "Añadido al carrito",
    text: `${prod.nombre} se ha añadido correctamente.`,
    timer: 1200,
    showConfirmButton: false,
  });
}

async function cambiarCantidad(idProducto, delta) {
  const item = carrito.find((i) => i.id === idProducto);
  if (!item) return;

  const nueva = item.cantidad + delta;

  if (nueva <= 0) {
    const res = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar producto?",
      text: "La cantidad quedará en 0, se eliminará del carrito.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#11131a",
      color: "#e9e9ee",
    });

    if (res.isConfirmed) {
      carrito = carrito.filter((i) => i.id !== idProducto);
      renderCarrito();
    }
    return;
  }

  item.cantidad = nueva;
  renderCarrito();
}

async function eliminarDelCarrito(idProducto) {
  const item = carrito.find((i) => i.id === idProducto);
  if (!item) return;

  const res = await Swal.fire({
    icon: "warning",
    title: "¿Eliminar producto?",
    text: `Se eliminará ${item.nombre} del carrito.`,
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#ffffff",
    cancelButtonColor: "#333",
    color: "#e9e9ee",
    background: "#11131a",
  });

  if (res.isConfirmed) {
    carrito = carrito.filter((i) => i.id !== idProducto);
    renderCarrito();
  }
}

async function vaciarCarrito() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Nada que vaciar",
      timer: 1200,
      showConfirmButton: false,
    });
    return;
  }

  const res = await Swal.fire({
    icon: "warning",
    title: "¿Vaciar carrito?",
    text: "Se eliminarán todos los productos del carrito.",
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#ffffff",
    cancelButtonColor: "#333",
    color: "#e9e9ee",
    background: "#11131a",
  });

  if (res.isConfirmed) {
    carrito = [];
    cupon = { codigo: "", porcentaje: 0 };
    inputCupon.value = "";
    renderCarrito();
  }
}

function aplicarCupon() {
  const code = (inputCupon.value || "").trim().toUpperCase();

  if (!code) {
    cupon = { codigo: "", porcentaje: 0 };
    renderCarrito();
    return;
  }

  if (!CUPONES[code]) {
    Swal.fire({
      icon: "error",
      title: "Cupón no válido",
      text: "Prueba con MINIMAL10 o APPLE15.",
    });
    return;
  }

  cupon = { codigo: code, porcentaje: CUPONES[code] };
  renderCarrito();
}

function abrirCarrito() {
  panelCarrito.scrollIntoView({ behavior: "smooth", block: "start" });
}
function cerrarCarrito() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function checkout() {
  const total = calcularTotal();

  if (total <= 0) {
    Swal.fire({
      icon: "info",
      title: "Carrito vacío",
      text: "Añade productos antes de finalizar compra.",
    });
    return;
  }

  const res = await Swal.fire({
    icon: "success",
    title: "¿Confirmar compra?",
    html: `Total a pagar: <b>${eur(total)}</b>`,
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#ffffff",
    cancelButtonColor: "#333",
    background: "#11131a",
    color: "#e9e9ee",
  });

  if (!res.isConfirmed) return;

  // ✅ “Compra realizada”: vaciar carrito + reset cupón
  carrito = [];
  cupon = { codigo: "", porcentaje: 0 };
  inputCupon.value = "";

  renderCarrito();

  Swal.fire({
    icon: "success",
    title: "Compra realizada ✅",
    text: "Gracias por tu compra. El carrito se ha vaciado.",
    timer: 1400,
    showConfirmButton: false,
    background: "#11131a",
    color: "#e9e9ee",
  });

  // opcional: subir arriba
  // window.scrollTo({ top: 0, behavior: "smooth" });
}


// ==============================
// Init
// ==============================
function init() {
  cargarCarrito();
  renderFiltroCategorias();
  renderProductos(productos);
  renderCarrito();

  btnVaciar.addEventListener("click", vaciarCarrito);
  btnCheckout.addEventListener("click", checkout);
  btnAplicarCupon.addEventListener("click", aplicarCupon);

  btnAbrirCarrito.addEventListener("click", abrirCarrito);
  btnCerrarCarrito.addEventListener("click", cerrarCarrito);

  // Dropdown
  dropdownToggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown();
  });

  dropdownOverlay.addEventListener("click", closeDropdown);

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) closeDropdown();
  });

  // Quick View: cerrar
  qvOverlay.addEventListener("click", cerrarQuickView);
  qvClose.addEventListener("click", cerrarQuickView);

  // Escape: cierra ambos (dropdown y quick view)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdown();
      cerrarQuickView();
    }
  });

  // Quick View: acciones
  qvAdd.addEventListener("click", () => {
    if (!qvProductoActual) return;
    añadirAlCarrito(qvProductoActual.id);
  });

  qvBuy.addEventListener("click", () => {
    if (!qvProductoActual) return;
    añadirAlCarrito(qvProductoActual.id);
    cerrarQuickView();
    abrirCarrito();
  });
}

init();
