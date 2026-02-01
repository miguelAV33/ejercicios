// URLs EXACTAS (las del enunciado)
const IMG_BY_PRIORITY = {
  Alta: "img/prioridadAlta.png",
  Media: "img/prioridadMedia.png",
  Baja: "img/prioridadBaja.png",
};

// Clase Tarea (como pide el enunciado)
class Tarea {
  constructor({ id, titulo, descripcion, fecha, prioritaria, prioridad }) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.prioritaria = prioritaria; // boolean
    this.prioridad = prioridad; // "Baja" | "Media" | "Alta"
    this.completa = false; // boolean
    this.imagen = IMG_BY_PRIORITY[prioridad];
  }
}

// Estado
let tareas = [];
let nextId = 1;

// DOM
const taskForm = document.getElementById("taskForm");
const tituloEl = document.getElementById("titulo");
const descripcionEl = document.getElementById("descripcion");
const fechaEl = document.getElementById("fecha");
const prioritariaEl = document.getElementById("prioritaria");
const prioridadEl = document.getElementById("prioridad");

const filterSelect = document.getElementById("filterSelect");
const filteredList = document.getElementById("filteredList");
const cards = document.getElementById("cards");

// Helpers
function getActiveTasks() {
  return tareas.filter((t) => !t.completa);
}

function getFilteredTasks() {
  const value = filterSelect.value;
  const active = getActiveTasks();

  if (value === "Todas") return active;
  return active.filter((t) => t.prioridad === value);
}

// Render lista filtrada (derecha)
function renderFilteredList() {
  const list = getFilteredTasks();
  filteredList.innerHTML = "";

  if (list.length === 0) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.innerHTML = `<div class="desc">No hay tareas para este filtro.</div>`;
    filteredList.appendChild(li);
    return;
  }

  list.forEach((t) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.innerHTML = `
      <div class="title">${t.titulo}</div>
      <div class="desc">${t.descripcion || "(sin descripción)"}</div>
    `;
    filteredList.appendChild(li);
  });
}

// Render cartas (abajo) - NO se filtran
function renderCards() {
  const active = getActiveTasks();
  cards.innerHTML = "";

  if (active.length === 0) {
    cards.innerHTML = `<div style="color:#777; grid-column:1/-1;">No hay tareas pendientes.</div>`;
    return;
  }

  active.forEach((t) => {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = t.id;

    card.innerHTML = `
      <img class="prio-img" src="${t.imagen}" alt="prioridad ${t.prioridad}">
      <div class="name">${t.titulo}</div>
      <div class="pill">Prioridad: ${t.prioridad}${
        t.prioritaria ? " · Prioritaria" : ""
      }</div>
      <div class="card-desc">${t.descripcion || "(sin descripción)"}</div>
      <button class="btn btn-complete" type="button" data-id="${
        t.id
      }">Completar</button>
    `;

    cards.appendChild(card);
  });
}

function renderAll() {
  renderFilteredList();
  renderCards();
}

// Eventos
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = tituloEl.value.trim();
  if (!titulo) return;

  const tarea = new Tarea({
    id: nextId++,
    titulo,
    descripcion: descripcionEl.value.trim(),
    fecha: fechaEl.value,
    prioritaria: prioritariaEl.checked,
    prioridad: prioridadEl.value,
  });

  tareas.push(tarea);

  // Limpieza básica
  tituloEl.value = "";
  descripcionEl.value = "";
  prioritariaEl.checked = false;

  renderAll();
});

// Cambiar filtro => solo cambia la lista de la derecha
filterSelect.addEventListener("change", () => {
  renderFilteredList();
});

// Completar desde cartas
cards.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-complete");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return;

  tarea.completa = true;
  renderAll();
});

// Init (fecha por defecto + 3 ejemplos como la imagen)
(function init() {
  const today = new Date();
  const yyyy = String(today.getFullYear());
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  fechaEl.value = `${yyyy}-${mm}-${dd}`;

  tareas.push(
    new Tarea({
      id: nextId++,
      titulo: "Baja1",
      descripcion: "Descripción de la tarea con prioridad baja",
      fecha: fechaEl.value,
      prioritaria: false,
      prioridad: "Baja",
    }),
  );
  tareas.push(
    new Tarea({
      id: nextId++,
      titulo: "Media1",
      descripcion: "Descripción de la tarea con prioridad media",
      fecha: fechaEl.value,
      prioritaria: false,
      prioridad: "Media",
    }),
  );
  tareas.push(
    new Tarea({
      id: nextId++,
      titulo: "Alta1",
      descripcion: "Descripción de la tarea con prioridad alta",
      fecha: fechaEl.value,
      prioritaria: true,
      prioridad: "Alta",
    }),
  );

  renderAll();
})();
