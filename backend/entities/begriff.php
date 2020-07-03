<?php
class Begriff{
    function neuerBegriff($con, $userid, $begriff, $beschreibung, $link, $wortlisteId){
        include_once('wortliste.php');
        $Wortliste = new Wortliste();

        if($Wortliste->accessAllowed($con, $userid, $wortlisteId)){
            $sql = 'INSERT INTO begriffe (begriff, beschreibung, link, wortlisteId, active) VALUES ( "'. $begriff .'", "'. $beschreibung .'", "'. $link .'" , ' . $wortlisteId .', 1);';
            return $con->query($sql);
        }
        return false;
    }
    
    function editBegriff($con, $userid, $begriff, $beschreibung, $link, $begriffId, $wortlisteId){ 
        if($this->isFromUser($con, $userid, $begriffId, $wortlisteId)){
            $sql = 'UPDATE begriffe SET begriff = "' . $begriff. '", beschreibung = "'. $beschreibung .'", link = "'. $link .'", wortlisteId = '. $wortlisteId .' WHERE id = '. $begriffId .';';            
            return $con->query($sql);
        }        
        return false;
    }

    function delBegriff($con, $userid, $begriffId, $wortlisteId){
        if($this->isFromUser($con, $userid, $begriffId, $wortlisteId)){
            $sql = 'UPDATE begriffe SET active = 0 WHERE id = '. $begriffId .';';
            return $con->query($sql);
        }
        return false;
    }

    function getAllBegriffe($con, $userid){
        $sql = 'SELECT begriffe.id, begriffe.wortlisteId, begriffe.begriff, begriffe.beschreibung, begriffe.link FROM begriffe JOIN userwortlisten ON begriffe.wortlisteId = userwortlisten.wortlisteId WHERE userwortlisten.userId = ' . $userid . ' AND begriffe.active = 1 ORDER BY  begriffe.begriff ASC;';
        $res = $con->query($sql);
        $array = null;
        if ($res->num_rows > 0)
        {
            while($row = $res->fetch_assoc()){
                $array[] = $row;
            }
        }
        return $array;
    }

    function isFromUser($con, $userid, $begriffId, $wortlisteId){        
        $sql = 'SELECT begriffe.id FROM begriffe JOIN userwortlisten ON begriffe.wortlisteId = userwortlisten.wortlisteId WHERE userwortlisten.userId = ' . $userid . ' AND begriffe.id = '. $begriffId .';';        
        $res = $con->query($sql);
        if ($res->num_rows == 1){
            return true;
        }
        return false;
    }


    function getBegriffe($con, $userid){
        $wortlisteId = $con->real_escape_string(htmlspecialchars($_POST['wortlisteId']));
        $sql = 'SELECT begriffe.id, begriffe.wortlisteId, begriffe.begriff, begriffe.beschreibung, begriffe.link FROM begriffe JOIN userwortlisten ON begriffe.wortlisteId = userwortlisten.wortlisteId WHERE userwortlisten.userId = ' . $userid . ' AND userwortlisten.wortlisteId = '. $wortlisteId .' AND begriffe.active = 1;';
        $res = $con->query($sql);
        $array = null;
        if ($res->num_rows > 0)
        {
            while($row = $res->fetch_assoc()) {
                $array[] = $row;
            }
        }
        return $array;
    }
}
?>