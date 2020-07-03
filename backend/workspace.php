<?php
    session_start();
    
    include_once('tools/autentifizierung.php');
    $aut = new Autentifizierung();
    
    include_once('connection/connection.php');
    $db = new DbConnection();
    $con = $db->getConnection();
    
    include_once("localisation.php");
    $loc = new Localisation();
    
    if(!isset($_SESSION['userid'])){ // should by now, but hey
        header("Location: index.php");
        die();
    }

    include_once('entities/begriff.php');
    $Begriff = new Begriff();
       
    // get vals
    if(isset($_POST['formBegriff'])){
        $begriff = $con->real_escape_string(htmlspecialchars($_POST['formBegriff']));
    }
    if(isset($_POST['formBeschreibung'])){
        $beschreibung = $con->real_escape_string(htmlspecialchars($_POST['formBeschreibung']));
    }
    if(isset($_POST['formLink'])){
        $link = $con->real_escape_string(htmlspecialchars($_POST['formLink']));
    }
    if(isset($_POST['formBegriffId'])){
        $begriffId = $con->real_escape_string(htmlspecialchars($_POST['formBegriffId']));
    }
    if(isset($_POST['formWortlisteId'])){
        $wortlisteId = $con->real_escape_string(htmlspecialchars($_POST['formWortlisteId']));
    }
    
    // working
    if(isset($_POST['formDel']) && isset($_POST['formBegriffId']) && isset($_POST['formWortlisteId'])){ // delete
        $Begriff->delBegriff($con, $_SESSION['userid'], $begriffId, $wortlisteId);
    }
    if(isset($_POST['formBegriff']) && isset($_POST['formWortlisteId'])){ // new + edit
        if(isset($_POST['formBegriffId'])){ // edit
            $Begriff->editBegriff($con, $_SESSION['userid'], $begriff, $beschreibung, $link, $begriffId, $wortlisteId);
        }
        else{ // new
            $Begriff->neuerBegriff($con, $_SESSION['userid'], $begriff, $beschreibung, $link, $wortlisteId);
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
    <div id="wortlistencontainer">
        <?php
            if(isset($_SESSION['userid'])){
                include_once('entities/wortliste.php');
                $Wortliste = new Wortliste();
                // Wortlisten ausgeben
                $wortlisten = $Wortliste->getWortlistenFromUser($con, $_SESSION['userid']);
                $wortlistenHtmlElement = '<select id="wortlisten">';
                if(count($wortlisten) > 0){
                    foreach ($wortlisten as $wortliste){
                        if(isset($_POST['formWortlistenId']) && $wortliste['id'] == $_POST['formWortlistenId']){
                            $wortlistenHtmlElement = $wortlistenHtmlElement . '<option value="'. $wortliste['id'] .'" selected="selected">'. $wortliste['name'] .'</option>';
                        }
                        else{
                            $wortlistenHtmlElement = $wortlistenHtmlElement . '<option value="'. $wortliste['id'] .'">'. $wortliste['name'] .'</option>';
                        }
                    }
                }
                $wortlistenHtmlElement = $wortlistenHtmlElement . '</select>';
                echo $wortlistenHtmlElement;
            }
        ?>
    </div>
    <div id="toolbar">        
        <input id="searchtext" type="text">
    </div>
    <div id="inputcontainer"></div>
    <div id="datacontainer">
        <?php
            if(isset($_SESSION['userid'])){
                include_once('entities/begriff.php');
                $Begriff = new Begriff();
                
                // localisation stuff
                $begriffLoc = $loc->getLocalisationFromSession('WORKSPACE_TERM');
                $beschreibungLoc = $loc->getLocalisationFromSession('WORKSPACE_DESC');
                $linkLoc = $loc->getLocalisationFromSession('WORKSPACE_LINK');
                // Begriffe ausgeben
                $begriffe = $Begriff->getAllBegriffe($con, $_SESSION['userid']);
                if(count($begriffe) > 0){
                    $begriffeHtmlElement = "";
                    foreach ($begriffe as $begriff){
                        $begriffeHtmlElement = $begriffeHtmlElement . '<div class="begriffcontainer">';
                        $begriffeHtmlElement = $begriffeHtmlElement .   '<p class="begriff">' . $begriff['begriff'] . '<img class="editBtn" src="images/edit.png"><img class="delBtn" src="images/cross.png"/></p>';
                        $begriffeHtmlElement = $begriffeHtmlElement .   '<p class="beschreibung">' . $begriff['beschreibung'] . '</p>';
                        $begriffeHtmlElement = $begriffeHtmlElement .   '<a class="link" href="' . $begriff['link'] . '">' . $begriff['link'] . '</a>';
                        $begriffeHtmlElement = $begriffeHtmlElement .   '<p class="id">' . $begriff['id'] . '</p>';
                        $begriffeHtmlElement = $begriffeHtmlElement .   '<p class="wortlisteId">' . $begriff['wortlisteId'] . '</p>';                        
                        $begriffeHtmlElement = $begriffeHtmlElement . '</div>';
                    }
                }
                echo $begriffeHtmlElement;
            }
        ?>
    </div>
    <div id="formLocationContainer" style="display: none;">
        <?php
            
            echo '<p id="formLocationBegriff">' . $begriffLoc . '</p>';
            echo '<p id="formLocationBeschreibung">' . $beschreibungLoc . '</p>';
            echo '<p id="formLocationLink">' . $linkLoc . '</p>';
            echo '<p id="formLocationSubmit">' . $loc->getLocalisationFromSession('WORKSPACE_SUBMIT') . '</p>';            
        ?>
    </div>
  </body>
  <script src="application.js"></script> 
</html>