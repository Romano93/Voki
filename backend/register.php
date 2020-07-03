<?php
  echo 'what';
    if(isset($_POST["mail"]) && isset($_POST['vorname']) && isset($_POST['nachname']) && isset($_POST['passwort']) && isset($_POST['passwortnochmals'])){
      include_once('connection/connection.php');
      $db = new DbConnection();
      $con = $db->getConnection();

      include_once('entities/user.php');
      $user = new User();
      if($user->createUser($con)){
        
      }
    }
?>
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>Voki - Register</title>
  </head>
  <body>
    <div class="center">
      <form action=<?php echo $_SERVER['PHP_SELF']; ?> method="POST">
        <label for="vorname">
        <?php
          include_once("localisation.php");
          $loc = new Localisation();
          echo $loc->getLocalisationFromSession('REGISTER_FIRSTNAME');
        ?>
        </label>
        <input type="text" id="vorname" name="vorname"><br><br>
        <label for="nachname">
        <?php
          include_once("localisation.php");
          $loc = new Localisation();
          echo $loc->getLocalisationFromSession('REGISTER_SURNAME');
        ?>
        </label>
        <input type="text" id="nachname" name="nachname"><br><br>
        <label for="mail">
        <?php
          include_once("localisation.php");
          $loc = new Localisation();
          echo $loc->getLocalisationFromSession('REGISTER_MAIL');
        ?>
        </label>
        <input type="text" id="mail" name="mail"><br><br>
        <label for="passwort">
        <?php        
          include_once("localisation.php");
          $loc = new Localisation();
          echo $loc->getLocalisationFromSession('REGISTER_PASSWORD');
        ?>
        </label>
        <input type="password" id="passwort" name="passwort"><br><br>
        <label for="passwortnochmals">
        <?php        
          include_once("localisation.php");
          $loc = new Localisation();
          echo $loc->getLocalisationFromSession('REGISTER_PASSWORD_AGAIN');
        ?>
        </label>
        <input type="password" id="passwortnochmals" name="passwortnochmals"><br><br>

        <input type="submit" value="<?php
          include_once("localisation.php");
          $loc = new Localisation();
          echo $loc->getLocalisationFromSession('REGISTER_BUTTON');
        ?>">
      </form>
    </div>
  </body>
</html>