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
                $fp = fopen('lidn.txt', 'w');
                fwrite($fp, $userid);
                fclose($fp);
                http_response_code(200);
                $task = htmlspecialchars($_POST['task']);

                include_once('entities/begriff.php');
                $Begriff = new Begriff();

                include_once('entities/wortliste.php');
                $Wortliste = new Wortliste();
                switch($task){
                    case "allData":
                        $array = new \stdClass();
                        $array->begriffe = $Begriff->getAllBegriffe($con, $userid);
                        $array->wortlisten = $Wortliste->getWortlistenFromUser($con, $userid);
                        echo json_encode($array);
                    break;
                    case "allWords":
                        echo json_encode($Begriff->getAllBegriffe($con, $userid));
                    break;                    
                    case "selectedWords":
                        if(isset($_POST['wortlisteId'])){
                            echo json_encode($Begriff->getBegriffe($con, $userid));
                        }
                    break;
                    case "newWord":                        
                        if(isset($_POST['begriff']) && isset($_POST['beschreibung']) && isset($_POST['wortlisteId'])){
                            $Begriff->neuerBegriff($con, $userid);
                        }
                    break;
                    case "editWord":
                        if(isset($_POST['begriff']) && isset($_POST['beschreibung']) && isset($_POST['wortlisteId']) && isset($_POST['begriffId'])){                
                            $Begriff->editBegriff($con, $userid);
                        }
                    break;
                    case "delWord":                        
                        if(isset($_POST['wortlisteId']) && isset($_POST['begriffId'])){                
                            $Begriff->delBegriff($con, $userid);
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
                        if(isset($_POST['sharemail']) && isset($_POST['wortlisteId'])){
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