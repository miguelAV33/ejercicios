<?php
// login.php — Inicio de sesión
require_once 'includes/db.php';
require_once 'includes/auth.php';

if (isLoggedIn()) {
    header('Location: ' . (isAdmin() ? 'admin/control.php' : 'cliente/perfil.php'));
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['usuario_id'] = $user['id'];
        $_SESSION['nombre']     = $user['nombre'];
        $_SESSION['rol']        = $user['rol'];
        $_SESSION['fecha_nac']  = $user['fecha_nac'];
        header('Location: ' . ($user['rol'] === 'admin' ? 'admin/control.php' : 'cliente/perfil.php'));
        exit;
    }
    $error = 'Email o contraseña incorrectos.';
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NavaPark2 — Acceder</title>
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
      max-width: 420px;
      box-shadow: 0 12px 40px rgba(0,0,0,.3);
    }
    .login-logo {
      font-family: 'Bebas Neue', cursive;
      font-size: 2.8rem;
      color: #d4a017;
      text-align: center;
      letter-spacing: 3px;
      margin-bottom: 4px;
    }
    .login-sub {
      text-align: center;
      color: #999;
      font-size: .9rem;
      margin-bottom: 30px;
    }
    .login-foot {
      text-align: center;
      margin-top: 20px;
      font-size: .9rem;
      color: #888;
    }
    .login-foot a { color: #2d6a4f; font-weight: 800; text-decoration: none; }
  </style>
</head>
<body>
<div class="login-box">
  <p class="login-logo">🎢 NavaPark2</p>
  <p class="login-sub">Navarredonda de Gredos</p>

  <?php if ($error): ?>
    <div class="alert alert-error">⚠️ <?= h($error) ?></div>
  <?php endif; ?>

  <form method="POST" novalidate>
    <div class="form-group">
      <label>Email</label>
      <input type="email" name="email" required placeholder="tu@email.com"
             value="<?= h($_POST['email'] ?? '') ?>">
    </div>
    <div class="form-group">
      <label>Contraseña</label>
      <input type="password" name="password" required placeholder="••••••••">
    </div>
    <button class="btn btn-primary btn-block">Entrar al parque →</button>
  </form>

  <p class="login-foot">¿No tienes cuenta? <a href="registro.php">Regístrate aquí</a></p>
</div>
</body>
</html>
