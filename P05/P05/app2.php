<?php require_once "header.php"; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App 2 — Panel</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="navbar">
    <span class="logo">P05 App</span>
    <div class="nav-links">
        <a href="app1.php">Dashboard</a>
        <a href="app2.php" class="active">App 2</a>
        <form method="POST" action="logout.php" style="display:inline;margin:0;">
            <input class="btn-outline" type="submit" name="boton_out" value="⏻ Logout">
        </form>
    </div>
</nav>

<div class="container">

    <div class="dashboard-header">
        <p class="eyebrow">Zona segura · Página 2</p>
        <h1>
            App 2
            <span class="badge">Zona segura</span>
        </h1>
        <p>Logado como <strong><?php echo htmlspecialchars($_SESSION["user_ok"]); ?></strong> — Acceso verificado por <code>header.php</code></p>
    </div>

    <div class="grid">
        <div class="widget">
            <span class="w-icon">👤</span>
            <h3>Usuario activo</h3>
            <div class="value" style="font-size:1.3rem;"><?php echo htmlspecialchars($_SESSION["user_ok"]); ?></div>
            <div class="desc">Sesión cross-page activa en toda la aplicación</div>
        </div>
        <div class="widget">
            <span class="w-icon">🛡️</span>
            <h3>Protección</h3>
            <div class="value">✓</div>
            <div class="desc">Acceso bloqueado para usuarios no autenticados</div>
        </div>
        <div class="widget">
            <span class="w-icon">🕐</span>
            <h3>Último submit</h3>
            <div class="value"><?php echo date("H:i:s", $_SESSION["tiempo_ultimo_submit"]); ?></div>
            <div class="desc">Tiempo actualizado en cada navegación</div>
        </div>
    </div>

</div>
</body>
</html>
