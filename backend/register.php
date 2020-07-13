<?php
    session_start();
    
    include_once("localisation.php");
    $loc = new Localisation();

    if(isset($_POST["mail"]) && isset($_POST['vorname']) && isset($_POST['nachname']) && isset($_POST['passwort']) && isset($_POST['passwortnochmals'])){
      include_once('connection/connection.php');
      $db = new DbConnection();
      $con = $db->getConnection();

      include_once('entities/user.php');
      $User = new User();
      $userid = $User->createUser($con);
      if($userid > 0){
        $_SESSION['userid'] = $userid;
        header("Location: index.php");
        die();
      }
    }
?>
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="stylesheet.css">
    <title>Voki - Register</title>
  </head>
  <body>
    <div id="center">
      <div class="form">
        <form action=<?php echo $_SERVER['PHP_SELF']; ?> method="POST">
          <label for="vorname">
          <?php
            echo $loc->getLocalisationFromSession('REGISTER_FIRSTNAME');
          ?>
          </label><br>
          <input type="text" id="vorname" name="vorname"><br><br>
          <label for="nachname">
          <?php
            echo $loc->getLocalisationFromSession('REGISTER_SURNAME');
          ?>
          </label><br>
          <input type="text" id="nachname" name="nachname"><br><br>
          <label for="mail">
          <?php
            echo $loc->getLocalisationFromSession('REGISTER_MAIL');
          ?>
          </label><br>
          <input type="text" id="mail" name="mail"><br><br>
          <?php
            if(!isset($_SESSION['userid']) && isset($_POST["mail"])){          
              echo '<p class="error">' . $loc->getLocalisationFromSession('REGISTER_MAIL_ERROR') . '</p>';
            }
          ?>
          <label for="passwort">
          <?php
            echo $loc->getLocalisationFromSession('REGISTER_PASSWORD');
          ?>
          </label><br>
          <input type="password" id="passwort" name="passwort"><br><br>
          <label for="passwortnochmals">
          <?php
            echo $loc->getLocalisationFromSession('REGISTER_PASSWORD_AGAIN');
          ?>
          </label><br>
          <input type="password" id="passwortnochmals" name="passwortnochmals"><br><br>
          <input class="submit" type="submit" value="<?php echo $loc->getLocalisationFromSession('REGISTER_BUTTON'); ?>">
        </form>
        <p><a href="index.php">Login</a></p>
      </div>
          </div>
  </body>
</html>