<?php
    include_once('connection.php');
    $db = new DbConnection();
    $con = $db->getConnection();
    
    if($con){
        include_once('autentifizierung.php');

        $aut = new Autentifizierung();

        if($aut->handelLoginTrys($con) && isset($_POST['k'])){
            $userid = $aut->matchPublicKey($con, $_POST['k']);
            if($userid != null)
            {
                $sql = 'SELECT wortliste.begriff, wortliste.beschreibung, wortliste.link FROM wortliste JOIN userwortlisten ON wortliste.wortlistendefinitionId = userwortlisten.wortlisteId WHERE userId = ' . $userid . ';';
                $res = $con->query($sql);
                if ($res->num_rows > 0)
                {
                    while($row = $res->fetch_assoc()) {
                        $array[] = $row;
                    }
                }
                http_response_code(200);
                echo json_encode($array);
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