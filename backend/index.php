
<?php
  session_start();
  
  include_once('connection/connection.php');
  $db = new DbConnection();
  $con = $db->getConnection();

  include_once("localisation.php");
  $loc = new Localisation();
  
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
    <meta charset="utf-8"/>
    <link rel="stylesheet" href="stylesheet.css">
    <title>Voki</title>
  </head>
  <body>
    <div id="center">
      <div class="form">
        <form method="POST">
          <label for="mail">
          <?php
            echo $loc->getLocalisationFromSession('LOGIN_MAIL');
          ?>
          </label>
          <input type="text" id="mail" name="mail"><br><br>
          <label for="passwort">
          <?php
            echo $loc->getLocalisationFromSession('LOGIN_PASSWORD');
          ?>
          </label>
          <input type="password" id="passwort" name="passwort"><br><br>
          <input class="submit" type="submit" value="Login">
        </form>
        <p><a href="register.php">
        <?php
            echo $loc->getLocalisationFromSession('LOGIN_REGISTER');
          ?>
        </a></p>
      </div>
    </div>
    <section id="footer">
        <?php include('footer.php'); ?>
    </sction>
  </body>
</html>