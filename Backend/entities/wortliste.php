<?php
class Wortliste{
    function setNewWortliste($con, $ownerId){
        $begriff = $con->real_escape_string(htmlspecialchars($_POST['begriff']));
        $name = $con->real_escape_string(htmlspecialchars($_POST['name']));
        $sql = 'INSERT INTO wortlisten (name, beschreibung, ownerId) VALUES ("'. $name .'", "'. $beschreibung .'",'. $ownerId .' );';
        return $con->query($sql);
    }

    function shareWortliste($con, $ownerId){
        $wortlisteId = $con->real_escape_string(htmlspecialchars($_POST['wortlisteId']));
        if(isOwner($con, $ownerId, $wortlisteId)){
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

    function getWortlistenFromUser($con, $userId){
        $array = null;
        $sql = 'SELECT id, name, beschreibung FROM wortlisten WHERE ownerId = ' . $userId . ';';
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