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
    <title>App 2 — Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

    <nav class="navbar">
        <span class="logo">P05 App</span>
        <div class="nav-links">
            <a href="app1.php">Dashboard</a>
            <a href="app2.php" class="active">App 2</a>
            <a href="logout.php" class="btn-outline">Cerrar sesión</a>
        </div>
    </nav>

    <div class="container">
        <div class="dashboard-header">
            <h1>Página 2 <span class="badge">Zona segura</span></h1>
            <p>Logado como <strong><?php echo $usuario; ?></strong></p>
        </div>

        <div class="grid">
            <div class="widget">
                <h3>Usuario activo</h3>
                <div class="value"><?php echo $usuario; ?></div>
                <div class="desc">Sesión verificada correctamente</div>
            </div>
            <div class="widget">
                <h3>Acceso</h3>
                <div class="value">✓</div>
                <div class="desc">Zona protegida — solo usuarios autenticados</div>
            </div>
        </div>
    </div>

</body>

</html>