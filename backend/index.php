
<?php
  session_start();
  
  include_once('connection/connection.php');
  $db = new DbConnection();
  $con = $db->getConnection();

  include_once('tools/autentifizierung.php');
  $aut = new Autentifizierung();
  // Login
  if(!isset($_SESSION['userid'])){
    if(isset($_POST['mail']) && isset($_POST['passwort'])){ // anmeldung
        include_once('entities/user.php');
        $user = new User();
        $user->loginUser($con);
        
        if(isset($_SESSION['userid'])){
          $aut->insertLogInfo($con, true);
        }
        else{
          $aut->insertLogInfo($con, false);
        }
    }
  }
  if(isset($_SESSION['userid'])){
    header("Location: workspace.php");
    die();
  }
?>
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>Voki</title>
  </head>
  <body>
    <div class="center">
      <form method="POST">
        <label for="mail">
        <?php
          include_once("localisation.php");
          $loc = new Localisation();
          echo $loc->getLocalisationFromSession('LOGIN_MAIL');
        ?>
        </label>
        <input type="text" id="mail" name="mail"><br><br>
        <label for="passwort">
        <?php        
          include_once("localisation.php");
          $loc = new Localisation();
          echo $loc->getLocalisationFromSession('LOGIN_PASSWORD');
        ?>
        </label>
        <input type="password" id="passwort" name="passwort"><br><br>
        <input type="submit" value="Login">
      </form>
      <p><a href="register.php">
      <?php
          include_once("localisation.php");
          $loc = new Localisation();
          echo $loc->getLocalisationFromSession('LOGIN_REGISTER');
        ?>
      </a></p>
    </div>
  </body>
</html>