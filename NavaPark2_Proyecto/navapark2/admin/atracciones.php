<?php
// admin/atracciones.php — CRUD completo de atracciones (listar, insertar, modificar, borrar)
require_once '../includes/db.php';
require_once '../includes/auth.php';
requireAdmin();

$msg     = '';
$msgType = 'success';

/* ── INSERTAR ── */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['accion'] ?? '') === 'insertar') {
    $nombre      = trim($_POST['nombre']      ?? '');
    $tematica    = trim($_POST['tematica']    ?? '');
    $descripcion = trim($_POST['descripcion'] ?? '');
    if (!$nombre || !$tematica) {
        $msg = 'El nombre y la temática son obligatorios.';
        $msgType = 'error';
    } else {
        $pdo->prepare("INSERT INTO atracciones (nombre, tematica, descripcion) VALUES (?,?,?)")
            ->execute([$nombre, $tematica, $descripcion]);
        $msg = "✅ Atracción «{$nombre}» añadida correctamente.";
    }
}

/* ── MODIFICAR ── */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['accion'] ?? '') === 'modificar') {
    $id          = (int)($_POST['id']          ?? 0);
    $nombre      = trim($_POST['nombre']       ?? '');
    $tematica    = trim($_POST['tematica']     ?? '');
    $descripcion = trim($_POST['descripcion']  ?? '');
    $activa      = isset($_POST['activa']) ? 1 : 0;
    if ($id && $nombre && $tematica) {
        $pdo->prepare("UPDATE atracciones SET nombre=?, tematica=?, descripcion=?, activa=? WHERE id=?")
            ->execute([$nombre, $tematica, $descripcion, $activa, $id]);
        $msg = "✅ Atracción actualizada correctamente.";
    }
}

/* ── BORRAR ── */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['accion'] ?? '') === 'borrar') {
    $id = (int)($_POST['id'] ?? 0);
    if ($id) {
        $stmt = $pdo->prepare("SELECT nombre FROM atracciones WHERE id=?");
        $stmt->execute([$id]);
        $nombre = $stmt->fetchColumn();
        $pdo->prepare("DELETE FROM atracciones WHERE id=?")->execute([$id]);
        $msg = "🗑️ Atracción «{$nombre}» eliminada (y sus viajes en cascada).";
        $msgType = 'error';
    }
}

/* ── CARGAR PARA EDITAR ── */
$editando = null;
if (isset($_GET['editar'])) {
    $st = $pdo->prepare("SELECT * FROM atracciones WHERE id=?");
    $st->execute([(int)$_GET['editar']]);
    $editando = $st->fetch();
}

/* ── LISTADO CON TOTAL VIAJES ── */
$lista = $pdo->query("
    SELECT a.*, COUNT(v.id) AS total_viajes
    FROM atracciones a
    LEFT JOIN viajes v ON v.atraccion_id = a.id
    GROUP BY a.id
    ORDER BY a.nombre
")->fetchAll();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NavaPark2 — Gestión de Atracciones</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

<nav>
  <a href="control.php" class="logo">🎢 NavaPark2</a>
  <div class="nav-links">
    <a href="control.php">Control general</a>
    <a href="atracciones.php" class="active">Atracciones</a>
    <a href="../logout.php" class="btn-salir">Salir</a>
  </div>
</nav>

<div class="hero">
  <h1>Gestión de Atracciones</h1>
  <p>Listar · Insertar · Modificar · Borrar</p>
</div>

<div class="container">
  <?php if ($msg): ?>
    <div class="alert alert-<?= $msgType ?>"><?= h($msg) ?></div>
  <?php endif; ?>

  <div style="display:grid;grid-template-columns:360px 1fr;gap:22px;align-items:start">

    <!-- ── FORMULARIO ── -->
    <div class="card">
      <div class="card-title">
        <?= $editando ? '✏️ Modificar atracción' : '➕ Nueva atracción' ?>
      </div>

      <form method="POST">
        <input type="hidden" name="accion" value="<?= $editando ? 'modificar' : 'insertar' ?>">
        <?php if ($editando): ?>
          <input type="hidden" name="id" value="<?= (int)$editando['id'] ?>">
        <?php endif; ?>

        <div class="form-group">
          <label>Nombre de la atracción</label>
          <input type="text" name="nombre" required placeholder="El Toro de Gredos"
                 value="<?= h($editando['nombre'] ?? '') ?>">
        </div>
        <div class="form-group">
          <label>Temática</label>
          <input type="text" name="tematica" required placeholder="Western montañés"
                 value="<?= h($editando['tematica'] ?? '') ?>">
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <textarea name="descripcion" placeholder="Descripción de la atracción..."><?= h($editando['descripcion'] ?? '') ?></textarea>
        </div>
        <?php if ($editando): ?>
          <div class="form-group">
            <div class="form-check">
              <input type="checkbox" name="activa" id="activa" <?= $editando['activa'] ? 'checked' : '' ?>>
              <label for="activa" style="text-transform:none;font-size:.95rem;font-weight:700">Atracción activa (visible para clientes)</label>
            </div>
          </div>
        <?php endif; ?>

        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary"><?= $editando ? 'Guardar cambios' : 'Añadir atracción' ?></button>
          <?php if ($editando): ?>
            <a href="atracciones.php" class="btn btn-outline">Cancelar</a>
          <?php endif; ?>
        </div>
      </form>
    </div>

    <!-- ── LISTADO ── -->
    <div class="card">
      <div class="card-title">📋 Listado de atracciones (<?= count($lista) ?>)</div>
      <div class="tabla-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre / Temática</th>
              <th>Viajes</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($lista as $a): ?>
            <tr>
              <td>
                <strong><?= h($a['nombre']) ?></strong><br>
                <small style="color:#888"><?= h($a['tematica']) ?></small>
              </td>
              <td><span class="badge badge-dorado"><?= (int)$a['total_viajes'] ?></span></td>
              <td>
                <span class="badge <?= $a['activa'] ? 'badge-verde' : 'badge-rojo' ?>">
                  <?= $a['activa'] ? 'Activa' : 'Inactiva' ?>
                </span>
              </td>
              <td style="white-space:nowrap">
                <a href="?editar=<?= (int)$a['id'] ?>" class="btn btn-dorado btn-sm">Editar</a>
                <form method="POST" style="display:inline"
                      onsubmit="return confirm('¿Eliminar «<?= h($a['nombre']) ?>»? Se borrarán también todos sus viajes.')">
                  <input type="hidden" name="accion" value="borrar">
                  <input type="hidden" name="id"     value="<?= (int)$a['id'] ?>">
                  <button class="btn btn-danger btn-sm">Borrar</button>
                </form>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</div>

<footer>NavaPark2 &copy; <?= date('Y') ?> · <span>Navarredonda de Gredos</span> · Panel Administrador</footer>
</body>
</html>
