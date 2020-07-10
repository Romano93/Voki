<?php
class Wortliste{
    function neueWortliste($con, $ownerId, $name, $beschreibung){
        $sql = 'INSERT INTO wortlisten (name, beschreibung, ownerId, active) VALUES ("'. $name .'", "'. $beschreibung .'",'. $ownerId .', 1);';
        if($con->query($sql)){
            if($con->insert_id > 0){
                $newSql = 'INSERT INTO userwortlisten (userId, wortlisteId, active) VALUES (' . $ownerId . ', ' . $con->insert_id . ', 1);';
                return $con->query($newSql);
            }    
        }
        return false;
    }

    function updateWortliste($con, $ownerId, $name, $beschreibung, $wortlisteId){
        if($this->isOwner($con, $ownerId, $wortlisteId)){
            $sql = 'UPDATE wortlisten SET name = "' . $name . '", beschreibung = "' . $beschreibung . '" WHERE id = ' . $wortlisteId;
            return $con->query($sql);
        }
    }

    function deleteWortliste($con, $ownerId, $wortlisteId){
        if($this->isOwner($con, $ownerId, $wortlisteId)){
            $sql = 'UPDATE wortlisten SET active = 0 WHERE id = ' . $wortlisteId;
            if($con->query($sql)){
                $newSql = 'UPDATE begriffe SET active = 0 WHERE wortlisteId = '. $wortlisteId;
                if($con->query($newSql)){
                    $newNewSql = 'UPDATE userwortlisten SET active = 0 WHERE wortlisteId = ' . $wortlisteId;
                    return $con->query($newNewSql);
                }
            }
            return false;
        }
    }

    function shareWortliste($con, $ownerId){
        $wortlisteId = $con->real_escape_string(htmlspecialchars($_POST['wortlisteId']));
        if($this->isOwner($con, $ownerId, $wortlisteId)){
            $mail = $con->real_escape_string(htmlspecialchars($_POST['sharemail']));
            $sql = 'SELECT id FROM user WHERE mail = '. $mail .';';
            $res = $con->query($sql);
            if($res->num_rows == 1){
                $row = $res->fetchassoc();
                $newSql = 'INSERT INTO userwortlisten (userId, wortlisteId) VALUES ('. $row['id'] .','. $wortlisteId .');';
                return $con->query($newSql);
            }
        }
        return false;
    }

    function isOwner($con, $owner, $wortlisteId){
        $sql = 'SELECT id FROM wortlisten WHERE ownerId = ' . $owner.' AND id = '. $wortlisteId .'';        
        $res = $con->query($sql);
        if($res->num_rows == 1){
            return true;
        }
        return false;
    }

    function accessAllowed($con, $userId, $wortlisteId){
        $sql = 'SELECT id FROM userwortlisten WHERE userId = ' . $userId.' AND wortlisteId = '. $wortlisteId .' AND active = 1';        
        $res = $con->query($sql);
        if($res->num_rows > 0){
            return true;
        }
        return false;
    }

    function getWortlistenFromUser($con, $userId){
        $array = null;
        $sql = 'SELECT id, name, beschreibung FROM wortlisten WHERE ownerId = ' . $userId . ' AND active = 1;';
        $res = $con->query($sql);
        if($res->num_rows >= 1){
            while($row = $res->fetch_assoc()) {
                $array[] = $row;
            }
        }
        return $array;
    }    
}
?>