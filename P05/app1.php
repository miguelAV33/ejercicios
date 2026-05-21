<?php
session_start();

if (!isset($_SESSION["user"])) {
    header("Location: login.php");
    exit;
}

$tiempo_limite = 30 * 60;
if (isset($_SESSION["ultimo_acceso"])) {
    if (time() - $_SESSION["ultimo_acceso"] > $tiempo_limite) {
        session_destroy();
        header("Location: login.php?expired=1");
        exit;
    }
}
$_SESSION["ultimo_acceso"] = time();
$usuario = htmlspecialchars($_SESSION["user"]);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App 1 — Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

    <nav class="navbar">
        <span class="logo">P05 App</span>
        <div class="nav-links">
            <a href="app1.php" class="active">Dashboard</a>
            <a href="app2.php">App 2</a>
            <a href="logout.php" class="btn-outline">Cerrar sesión</a>
        </div>
    </nav>

    <div class="container">
        <div class="dashboard-header">
            <h1>Hola, <?php echo $usuario; ?> 👋 <span class="badge">Activo</span></h1>
            <p>Bienvenido a tu panel de control</p>
        </div>

        <div class="grid">
            <div class="widget">
                <h3>Sesión iniciada</h3>
                <div class="value">✓</div>
                <div class="desc">Autenticación completada correctamente</div>
            </div>
            <div class="widget">
                <h3>Expiración</h3>
                <div class="value">30 min</div>
                <div class="desc">Tiempo máximo de inactividad</div>
            </div>
            <div class="widget">
                <h3>Página actual</h3>
                <div class="value">App 1</div>
                <div class="desc">Zona protegida de la aplicación</div>
            </div>
        </div>
    </div>

</body>

</html>