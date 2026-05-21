<?php
// admin/control.php — Control general: todas las atracciones con sus viajes
require_once '../includes/db.php';
require_once '../includes/auth.php';
requireAdmin();

// Consulta principal: todas las atracciones con sus viajes (hora + edad por viajero)
$sql = "
    SELECT
        a.id             AS atraccion_id,
        a.nombre         AS atraccion,
        a.tematica,
        u.nombre         AS viajero,
        v.hora_viaje,
        v.edad_viajero
    FROM atracciones a
    LEFT JOIN viajes v    ON v.atraccion_id = a.id
    LEFT JOIN usuarios u  ON u.id = v.usuario_id
    ORDER BY a.nombre ASC, v.hora_viaje ASC
";
$rows = $pdo->query($sql)->fetchAll();

// Agrupar por atracción
$data = [];
foreach ($rows as $r) {
    $k = $r['atraccion_id'];
    if (!isset($data[$k])) {
        $data[$k] = [
            'nombre'   => $r['atraccion'],
            'tematica' => $r['tematica'],
            'viajes'   => [],
        ];
    }
    if ($r['hora_viaje']) {
        $data[$k]['viajes'][] = [
            'viajero' => $r['viajero'],
            'hora'    => $r['hora_viaje'],
            'edad'    => $r['edad_viajero'],
        ];
    }
}

// Totales para el resumen superior
$totalAtracciones = count($data);
$totalViajes      = array_sum(array_map(fn($a) => count($a['viajes']), $data));
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NavaPark2 — Control General</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

<nav>
  <a href="control.php" class="logo">🎢 NavaPark2</a>
  <div class="nav-links">
    <a href="control.php" class="active">Control general</a>
    <a href="atracciones.php">Atracciones</a>
    <a href="../logout.php" class="btn-salir">Salir</a>
  </div>
</nav>

<div class="hero">
  <h1>Control General del Parque</h1>
  <p><?= $totalAtracciones ?> atracciones · <?= $totalViajes ?> viajes registrados</p>
</div>

<div class="container">

  <!-- Resumen rápido -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px">
    <div class="card" style="text-align:center;padding:20px">
      <div style="font-family:'Bebas Neue',cursive;font-size:2.6rem;color:var(--verde)"><?= $totalAtracciones ?></div>
      <div style="font-size:.9rem;color:#777;font-weight:700">Atracciones</div>
    </div>
    <div class="card" style="text-align:center;padding:20px">
      <div style="font-family:'Bebas Neue',cursive;font-size:2.6rem;color:var(--dorado)"><?= $totalViajes ?></div>
      <div style="font-size:.9rem;color:#777;font-weight:700">Viajes totales</div>
    </div>
    <div class="card" style="text-align:center;padding:20px">
      <div style="font-family:'Bebas Neue',cursive;font-size:2.6rem;color:var(--oscuro)">
        <?= $totalAtracciones > 0 ? round($totalViajes / $totalAtracciones, 1) : 0 ?>
      </div>
      <div style="font-size:.9rem;color:#777;font-weight:700">Viajes/atracción</div>
    </div>
  </div>

  <!-- Tabla por atracción -->
  <?php foreach ($data as $a): ?>
  <div class="card">
    <div class="card-title">
      <?= h($a['nombre']) ?>
      <span class="badge badge-dorado" style="font-size:.72rem"><?= h($a['tematica']) ?></span>
      <span class="badge badge-verde" style="font-size:.72rem;margin-left:auto"><?= count($a['viajes']) ?> viaje(s)</span>
    </div>

    <?php if (empty($a['viajes'])): ?>
      <p style="color:#bbb;font-style:italic;text-align:center;padding:16px 0">Sin viajes registrados todavía.</p>
    <?php else: ?>
      <div class="tabla-wrap">
        <table>
          <thead>
            <tr>
              <th>Viajero</th>
              <th>Fecha y hora del viaje</th>
              <th>Edad del viajero</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($a['viajes'] as $v): ?>
            <tr>
              <td><?= h($v['viajero']) ?></td>
              <td><?= date('d/m/Y H:i', strtotime($v['hora'])) ?></td>
              <td><span class="badge badge-verde"><?= (int)$v['edad'] ?> años</span></td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    <?php endif; ?>
  </div>
  <?php endforeach; ?>

</div>

<footer>NavaPark2 &copy; <?= date('Y') ?> · <span>Navarredonda de Gredos</span> · Panel Administrador</footer>
</body>
</html>
