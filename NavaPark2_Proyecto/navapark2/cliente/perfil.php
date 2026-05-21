<?php
// cliente/perfil.php — Perfil del cliente: datos, registrar viaje e historial
require_once '../includes/db.php';
require_once '../includes/auth.php';
requireLogin();

$uid = $_SESSION['usuario_id'];

// Datos del usuario
$usr = $pdo->prepare("SELECT * FROM usuarios WHERE id=?");
$usr->execute([$uid]);
$usuario = $usr->fetch();
$edad = calcularEdad($usuario['fecha_nac']);

// Registrar un nuevo viaje
$msg = '';
$msgType = 'success';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['atraccion_id'])) {
    $aid = (int)($_POST['atraccion_id'] ?? 0);
    $hora = $_POST['hora_viaje'] ?? date('Y-m-d H:i:s');
    // Validar formato datetime
    $horaFmt = DateTime::createFromFormat('Y-m-d\TH:i', $hora);
    if ($aid && $horaFmt) {
        $pdo->prepare("INSERT INTO viajes (usuario_id, atraccion_id, hora_viaje, edad_viajero) VALUES (?,?,?,?)")
            ->execute([$uid, $aid, $horaFmt->format('Y-m-d H:i:s'), $edad]);
        $msg = '🎢 ¡Viaje registrado! Ya aparece en tu historial.';
    } else {
        $msg = 'Selecciona una atracción y una fecha válida.';
        $msgType = 'error';
    }
}

// Historial de viajes del usuario
$viajes = $pdo->prepare("
    SELECT a.nombre AS atraccion, a.tematica, v.hora_viaje, v.edad_viajero
    FROM viajes v
    JOIN atracciones a ON a.id = v.atraccion_id
    WHERE v.usuario_id = ?
    ORDER BY v.hora_viaje DESC
");
$viajes->execute([$uid]);
$historial = $viajes->fetchAll();

// Atracciones disponibles (activas)
$disponibles = $pdo->query("SELECT id, nombre, tematica FROM atracciones WHERE activa=1 ORDER BY nombre")->fetchAll();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NavaPark2 — Mi Perfil</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

<nav>
  <a href="perfil.php" class="logo">🎢 NavaPark2</a>
  <div class="nav-links">
    <a href="perfil.php" class="active">Mi perfil</a>
    <a href="atracciones.php">Atracciones</a>
    <a href="../logout.php" class="btn-salir">Salir</a>
  </div>
</nav>

<div class="hero">
  <h1>¡Hola, <?= h($usuario['nombre']) ?>!</h1>
  <p><?= $edad ?> años · <?= count($historial) ?> viaje(s) realizados en NavaPark2</p>
</div>

<div class="container">
  <?php if ($msg): ?>
    <div class="alert alert-<?= $msgType ?>"><?= h($msg) ?></div>
  <?php endif; ?>

  <div class="perfil-grid">

    <!-- Columna izquierda: perfil + formulario -->
    <div>
      <div class="card">
        <div class="card-title">👤 Mis datos</div>
        <div class="stat-row">
          <span class="stat-label">Nombre</span>
          <span style="font-weight:700"><?= h($usuario['nombre']) ?></span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Email</span>
          <span><?= h($usuario['email']) ?></span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Edad</span>
          <span class="badge badge-verde"><?= $edad ?> años</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Viajes</span>
          <span class="badge badge-dorado"><?= count($historial) ?></span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">🎢 Registrar viaje</div>
        <form method="POST">
          <div class="form-group">
            <label>Atracción</label>
            <select name="atraccion_id" required>
              <option value="">-- Selecciona una atracción --</option>
              <?php foreach ($disponibles as $a): ?>
                <option value="<?= (int)$a['id'] ?>"><?= h($a['nombre']) ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="form-group">
            <label>Fecha y hora del viaje</label>
            <input type="datetime-local" name="hora_viaje"
                   value="<?= date('Y-m-d\TH:i') ?>"
                   max="<?= date('Y-m-d\TH:i') ?>" required>
          </div>
          <button class="btn btn-primary btn-block">Añadir viaje</button>
        </form>
      </div>
    </div>

    <!-- Columna derecha: historial -->
    <div class="card">
      <div class="card-title">📋 Mis viajes en NavaPark2</div>

      <?php if (empty($historial)): ?>
        <div style="text-align:center;padding:48px 0;color:#bbb">
          <div style="font-size:3.5rem">🎡</div>
          <p style="margin-top:12px;font-weight:700">Aún no has registrado ningún viaje.</p>
          <p style="font-size:.9rem;margin-top:6px">Usa el formulario de la izquierda para añadir tu primera aventura.</p>
        </div>
      <?php else: ?>
        <div class="tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Atracción</th>
                <th>Temática</th>
                <th>Fecha y hora</th>
                <th>Tu edad</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($historial as $v): ?>
              <tr>
                <td><strong><?= h($v['atraccion']) ?></strong></td>
                <td><span class="badge badge-dorado"><?= h($v['tematica']) ?></span></td>
                <td><?= date('d/m/Y H:i', strtotime($v['hora_viaje'])) ?></td>
                <td><span class="badge badge-verde"><?= (int)$v['edad_viajero'] ?> años</span></td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php endif; ?>
    </div>

  </div>
</div>

<footer>NavaPark2 &copy; <?= date('Y') ?> · <span>Navarredonda de Gredos</span></footer>
</body>
</html>
