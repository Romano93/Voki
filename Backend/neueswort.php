<?php
    include_once('connection.php');
    $db = new DbConnection();
    $con = $db->getConnection();
    
    if($con){
        include_once('autentifizierung.php');

        $aut = new Autentifizierung();

        if($aut->handelLoginTrys($con) && isset($_POST['begriff'])&& isset($_POST['beschreibung'])){
            if($aut->matchPublicKey($con, $_POST['k']))
            {
                if(isset($_POST['link'])){
                    $link =  $con->real_escape_string(htmlspecialchars($_POST['link']));
                }
                $begriff = $con->real_escape_string(htmlspecialchars($_POST['begriff']));
                $beschreibung = $con->real_escape_string(htmlspecialchars($_POST['beschreibung']));
                $sql = 'INSERT INTO wortliste (begriff, beschreibung, link) VALUES ( "'. $begriff .'", "'. $beschreibung .'", "'. $link .'" );';
                $res = $con->query($sql);
                http_response_code(200);
            }
            else{           
                http_response_code(404);
            }
        }
        else{
            http_response_code(403);
        }
    }    
?>