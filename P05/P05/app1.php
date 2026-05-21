<?php require_once "header.php"; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App 1 — Panel</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="navbar">
    <span class="logo">P05 App</span>
    <div class="nav-links">
        <a href="app1.php" class="active">Dashboard</a>
        <a href="app2.php">App 2</a>
        <form method="POST" action="logout.php" style="display:inline;margin:0;">
            <input class="btn-outline" type="submit" name="boton_out" value="⏻ Logout">
        </form>
    </div>
</nav>

<div class="container">

    <div class="dashboard-header">
        <p class="eyebrow">Panel principal</p>
        <h1>
            Hola, <?php echo htmlspecialchars($_SESSION["user_ok"]); ?>
            <span class="badge">Activo</span>
        </h1>
        <p>Bienvenido a tu panel de control. Sesión iniciada correctamente.</p>
    </div>

    <div class="grid">
        <div class="widget">
            <span class="w-icon">🔐</span>
            <h3>Autenticación</h3>
            <div class="value">OK</div>
            <div class="desc">Credenciales verificadas contra la base de datos</div>
        </div>
        <div class="widget">
            <span class="w-icon">⏱</span>
            <h3>Expiración</h3>
            <div class="value">10 min</div>
            <div class="desc">Tiempo máximo de inactividad antes de cerrar sesión</div>
        </div>
        <div class="widget">
            <span class="w-icon">🕐</span>
            <h3>Último acceso</h3>
            <div class="value"><?php echo date("H:i:s", $_SESSION["tiempo_ultimo_submit"]); ?></div>
            <div class="desc">Hora del último submit registrado en sesión</div>
        </div>
        <div class="widget">
            <span class="w-icon">👤</span>
            <h3>Usuario en sesión</h3>
            <div class="value" style="font-size:1.3rem;"><?php echo htmlspecialchars($_SESSION["user_ok"]); ?></div>
            <div class="desc">Variable <code>$_SESSION["user_ok"]</code> activa</div>
        </div>
        <div class="widget">
            <span class="w-icon">🗄️</span>
            <h3>Base de datos</h3>
            <div class="value" style="font-size:1.3rem;">poligonos</div>
            <div class="desc">Conexión activa con tabla <code>users</code></div>
        </div>
        <div class="widget">
            <span class="w-icon">🔒</span>
            <h3>Password</h3>
            <div class="value" style="font-size:1.3rem;">MD5</div>
            <div class="desc">Contraseña encriptada en base de datos</div>
        </div>
    </div>

</div>
</body>
</html>
