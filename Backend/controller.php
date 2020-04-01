<?php
    include_once('connection/connection.php');
    $db = new DbConnection();
    $con = $db->getConnection();
    
    if($con){
        include_once('tools/autentifizierung.php');
        $aut = new Autentifizierung();

        if($aut->handelLoginTrys($con) && isset($_POST['k']) && isset($_POST['task'])){
            $userid = $aut->matchPublicKey($con, $_POST['k']);
            if($userid != null)
            {
                http_response_code(200);
                $task = htmlspecialchars($_POST['task']);

                include_once('entities/begriff.php');
                $Begriff = new Begriff();

                include_once('entities/wortliste.php')
                $Wortliste = new Wortliste();

                switch($task){              
                    case "allWords":
                        echo json_encode($Begriff->getAllBegriffe($con, $userid));
                    break;
                    case "newWord":
                        if(isset($_POST['begriff']) && isset($_POST['beschreibung']) && isset($_POST['wortlisteId'])){                            
                            $Begriff->neuerBegriff($con);
                        }
                    break;
                    case "allDef":
                        echo json_encode($Wortliste->getWortlistenFromUser($con, $userid));
                    break;
                    case "newDef":
                        if(isset($_POST['begriff']) && isset($_POST['name'])){
                            $Wortliste->setNewWortliste($con, $userid);
                        }
                    break;
                    case "shareDef":
                        if(isset($_POST['sharemail']) && isset($_POST['wortlisteId']){
                            $Wortliste->shareWortliste();
                        }
                    break;
                }
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