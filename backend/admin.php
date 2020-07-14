<?php
    session_start();
    
    if(!isset($_SESSION['userid'])){ // should by now, but hey
        header("Location: index.php");
        die();
    }
    
    include_once('tools/autentifizierung.php');
    $aut = new Autentifizierung();
    
    include_once('connection/connection.php');
    $db = new DbConnection();
    $con = $db->getConnection();
    
    include_once("localisation.php");
    $loc = new Localisation();
    
    include_once('entities/wortliste.php');
    $Wortliste = new Wortliste();
       
    // get vals
    if(isset($_POST['formWortlisteId'])){
        $wortlisteId = $con->real_escape_string(htmlspecialchars($_POST['formWortlisteId']));
    }
    if(isset($_POST['formBeschreibung'])){
        $beschreibung = $con->real_escape_string(htmlspecialchars($_POST['formBeschreibung']));
    }
    if(isset($_POST['formWortliste'])){
        $name = $con->real_escape_string(htmlspecialchars($_POST['formWortliste']));
    }
    
    // working
    
    if(isset($_POST['formDel']) && isset($_POST['formWortlisteId'])){ // delete
        $Wortliste->deleteWortliste($con, $_SESSION['userid'], $wortlisteId);
    }
    if(isset($_POST['formBeschreibung']) && isset($_POST['formWortlisteId'])){ // new + edit
        if(isset($_POST['formWortlisteId']) && $wortlisteId > 0){ // edit
            $Wortliste->updateWortliste($con, $_SESSION['userid'], $name, $beschreibung, $wortlisteId);
        }
        else{ // new
            $Wortliste->neueWortliste($con, $_SESSION['userid'], $name, $beschreibung);
        }
    }
    
?>
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="stylesheet.css">
    <title>Voki</title>
  </head>
  <body>
      <div id="workplace">
        <div id="navbar"><?php include('navbar.php'); ?></div>
        <div id="titel">
            <h2><?php echo $loc->getLocalisationFromSession('ADMIN_TITEL'); ?></h2>
        </div>
        <div id="toolbar">
            <input id="searchtext" type="text">
            <img id="refreshBtn" src="images/refresh.png"/>
            <img id="addBtn" src="images/add.png"/>
        </div>
        <div id="inputcontainer"></div>
        <div id="datacontainer">
            <?php
                $wortlisten = $Wortliste->getWortlistenFromUser($con, $_SESSION['userid']);
                $wortlistenHtmlElements = '';
                if($wortlisten != ""){
                    foreach($wortlisten as $wortliste){
                        $wortlistenHtmlElements = $wortlistenHtmlElements . '<div class="wortlistencontainer">';
                        $wortlistenHtmlElements = $wortlistenHtmlElements .     '<p class="wortliste">' . $wortliste['name'] . '<img class="editBtn" src="images/edit.png"><img class="delBtn" src="images/cross.png"/></p>';
                        $wortlistenHtmlElements = $wortlistenHtmlElements .     '<p class="beschreibung">' . $wortliste['beschreibung'] . '</p>';
                        $wortlistenHtmlElements = $wortlistenHtmlElements .     '<p class="wortlisteId">' . $wortliste['id'] . '</p>';
                        $wortlistenHtmlElements = $wortlistenHtmlElements . '</div>';
                    }
                } 
                echo $wortlistenHtmlElements;
            ?>
        </div>
        <div id="formLocationContainer" style="display: none;">
            <?php            
                echo '<p id="formLocationWortliste">' . $loc->getLocalisationFromSession('ADMIN_WORDLIST') . '</p>';
                echo '<p id="formLocationBeschreibung">' . $loc->getLocalisationFromSession('ADMIN_DESC') . '</p>';
                echo '<p id="formLocationSubmit">' . $loc->getLocalisationFromSession('ADMIN_SUBMIT') . '</p>';      
            ?>
        </div>
    </div>    
    <section id="footer">
        <?php include('footer.php'); ?>
    </sction>
  </body>
  <script src="admin.js"></script> 
</html>