<?php
session_start();

if (isset($_SESSION["user_ok"])) {
    header("Location: app1.php");
    exit;
}

require_once "db_utils.php";

$error = "";

if (isset($_POST["login_button"])) {
    $mi_con = conectar_db();
    $q      = "SELECT * FROM users WHERE alias = ? AND password = ?";
    $user   = $_POST["user"];
    $pas    = md5($_POST["passwords"]);
    $args   = [$user, $pas];
    $result = realizar_query($mi_con, $q, $args, true);

    if ($result) {
        $_SESSION["user_ok"]              = $user;
        $_SESSION["tiempo_ultimo_submit"] = time();
        header("Location: app1.php");
        exit;
    } else {
        $error = "Usuario o contraseña incorrectos";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — P05</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="login-wrap">
    <div class="card">
        <p class="card-eyebrow">P05 · Acceso seguro</p>
        <h1>Bienvenido<br>de nuevo</h1>
        <p class="subtitle">Introduce tus credenciales para acceder al panel.</p>

        <?php if (isset($_GET["expired"])): ?>
            <div class="alert alert-warning">⏱ Sesión expirada. Vuelve a iniciar sesión.</div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="alert alert-error">✕ <?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="form-group">
                <label>Usuario</label>
                <input type="text" name="user" placeholder="tu_usuario" autocomplete="off">
            </div>
            <div class="form-group">
                <label>Contraseña</label>
                <input type="password" name="passwords" placeholder="••••••••">
            </div>
            <input class="btn" type="submit" name="login_button" value="Iniciar sesión →">
        </form>
    </div>
</div>

</body>
</html>
