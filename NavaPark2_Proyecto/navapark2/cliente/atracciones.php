<?php
// cliente/atracciones.php — Catálogo de atracciones disponibles
require_once '../includes/db.php';
require_once '../includes/auth.php';
requireLogin();

$atracciones = $pdo->query("
    SELECT a.*, COUNT(v.id) AS total_viajes
    FROM atracciones a
    LEFT JOIN viajes v ON v.atraccion_id = a.id
    WHERE a.activa = 1
    GROUP BY a.id
    ORDER BY a.nombre
")->fetchAll();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NavaPark2 — Atracciones</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

<nav>
  <a href="perfil.php" class="logo">🎢 NavaPark2</a>
  <div class="nav-links">
    <a href="perfil.php">Mi perfil</a>
    <a href="atracciones.php" class="active">Atracciones</a>
    <a href="../logout.php" class="btn-salir">Salir</a>
  </div>
</nav>

<div class="hero">
  <h1>Nuestras Atracciones</h1>
  <p><?= count($atracciones) ?> experiencias únicas te esperan en Gredos</p>
</div>

<div class="container">
  <div class="grid-cards">
    <?php foreach ($atracciones as $a): ?>
    <div class="atraccion-card">
      <h3><?= h($a['nombre']) ?></h3>
      <p class="tematica">🏷️ <?= h($a['tematica']) ?></p>
      <p><?= h($a['descripcion']) ?></p>
      <p class="viajeros">🎢 <?= (int)$a['total_viajes'] ?> viajero(s) ya la han disfrutado</p>
    </div>
    <?php endforeach; ?>
  </div>
</div>

<footer>NavaPark2 &copy; <?= date('Y') ?> · <span>Navarredonda de Gredos</span></footer>
</body>
</html>
