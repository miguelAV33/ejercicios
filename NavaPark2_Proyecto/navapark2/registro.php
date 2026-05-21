<?php
// registro.php — Alta de nuevos clientes
require_once 'includes/db.php';
require_once 'includes/auth.php';

if (isLoggedIn()) { header('Location: cliente/perfil.php'); exit; }

$error = '';
$ok    = false;
$data  = ['nombre' => '', 'email' => '', 'fecha_nac' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data['nombre']    = trim($_POST['nombre']    ?? '');
    $data['email']     = trim($_POST['email']     ?? '');
    $data['fecha_nac'] = trim($_POST['fecha_nac'] ?? '');
    $password          = $_POST['password'] ?? '';

    if (!$data['nombre'] || !$data['email'] || !$password || !$data['fecha_nac']) {
        $error = 'Todos los campos son obligatorios.';
    } elseif (strlen($password) < 4) {
        $error = 'La contraseña debe tener al menos 4 caracteres.';
    } else {
        try {
            $hash = password_hash($password, PASSWORD_BCRYPT);
            $pdo->prepare("INSERT INTO usuarios (nombre, email, password, fecha_nac) VALUES (?,?,?,?)")
                ->execute([$data['nombre'], $data['email'], $hash, $data['fecha_nac']]);
            $ok = true;
        } catch (PDOException $e) {
            $error = 'Ese email ya está registrado. ¿Ya tienes cuenta?';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NavaPark2 — Registro</title>
  <link rel="stylesheet" href="css/style.css">
  <style>
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #2d6a4f 100%);
    }
    .login-box {
      background: #fff;
      border-radius: 18px;
      padding: 42px 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 12px 40px rgba(0,0,0,.3);
    }
    .login-logo { font-family:'Bebas Neue',cursive; font-size:2.6rem; color:#d4a017; text-align:center; letter-spacing:3px; margin-bottom:4px; }
    .login-sub  { text-align:center; color:#999; font-size:.9rem; margin-bottom:28px; }
    .login-foot { text-align:center; margin-top:18px; font-size:.9rem; color:#888; }
    .login-foot a { color:#2d6a4f; font-weight:800; text-decoration:none; }
  </style>
</head>
<body>
<div class="login-box">
  <p class="login-logo">🎢 NavaPark2</p>
  <p class="login-sub">Crear cuenta de visitante</p>

  <?php if ($ok): ?>
    <div class="alert alert-success">
      ✅ ¡Cuenta creada con éxito! <a href="login.php" style="color:#155724;font-weight:800">Inicia sesión →</a>
    </div>
  <?php else: ?>
    <?php if ($error): ?>
      <div class="alert alert-error">⚠️ <?= h($error) ?></div>
    <?php endif; ?>
    <form method="POST" novalidate>
      <div class="form-group">
        <label>Nombre completo</label>
        <input type="text" name="nombre" required placeholder="Ana García" value="<?= h($data['nombre']) ?>">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" required placeholder="ana@email.com" value="<?= h($data['email']) ?>">
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input type="password" name="password" required placeholder="Mínimo 4 caracteres">
      </div>
      <div class="form-group">
        <label>Fecha de nacimiento</label>
        <input type="date" name="fecha_nac" required max="<?= date('Y-m-d') ?>" value="<?= h($data['fecha_nac']) ?>">
      </div>
      <button class="btn btn-primary btn-block">Crear mi cuenta →</button>
    </form>
  <?php endif; ?>

  <p class="login-foot">¿Ya tienes cuenta? <a href="login.php">Inicia sesión</a></p>
</div>
</body>
</html>
