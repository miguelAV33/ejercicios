<?php
session_start();

if (isset($_SESSION["user"])) {
    header("Location: app1.php");
    exit;
}

require_once "db_utils.php";

$error = "";

if (isset($_POST["login_button"])) {
    $mi_con = conectar_db();
    $q = "SELECT * FROM users WHERE alias = ? AND password = ?";
    $user = $_POST["user"];
    $pas = md5($_POST["passwords"]);
    $args = [$user, $pas];
    $result = realizar_query($mi_con, $q, $args, true);

    if ($result) {
        $_SESSION["user"] = $user;
        $_SESSION["ultimo_acceso"] = time();
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

    <div class="container" style="display:flex; align-items:center; justify-content:center; min-height:100vh;">
        <div class="card">
            <h1>Bienvenido</h1>
            <p class="subtitle">Inicia sesión para continuar</p>

            <?php if (isset($_GET["expired"])): ?>
                <div class="alert alert-warning">⚠️ Tu sesión ha expirado. Vuelve a iniciar sesión.</div>
            <?php endif; ?>

            <?php if ($error): ?>
                <div class="alert alert-error">✕ <?php echo $error; ?></div>
            <?php endif; ?>

            <form method="POST" action="">
                <div class="form-group">
                    <label>Usuario</label>
                    <input type="text" name="user" placeholder="Tu usuario" autocomplete="off">
                </div>
                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" name="passwords" placeholder="••••••••">
                </div>
                <input class="btn" type="submit" name="login_button" value="Iniciar sesión">
            </form>
        </div>
    </div>

</body>

</html>