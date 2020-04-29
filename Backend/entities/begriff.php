<?php
class Begriff{
    function neuerBegriff($con){ 
        if(isset($_POST['link'])){
            $link =  $con->real_escape_string(htmlspecialchars($_POST['link']));
        }
        else{
            $link = "";
        }
        $wortlisteId = $con->real_escape_string(htmlspecialchars($_POST['wortlisteId']));
        $begriff = $con->real_escape_string(htmlspecialchars($_POST['begriff']));
        $beschreibung = $con->real_escape_string(htmlspecialchars($_POST['beschreibung']));
        $sql = 'INSERT INTO begriffe (begriff, beschreibung, link, wortlisteId) VALUES ( "'. $begriff .'", "'. $beschreibung .'", "'. $link .'" , ' . $wortlisteId .');';
        return $con->query($sql);
    }
    
    function editBegriff($con){ 
        if(isset($_POST['link'])){
            $link =  $con->real_escape_string(htmlspecialchars($_POST['link']));
        }
        else{
            $link = "";
        }
        $wortlisteId = $con->real_escape_string(htmlspecialchars($_POST['wortlisteId']));
        $begriff = $con->real_escape_string(htmlspecialchars($_POST['begriff']));
        $beschreibung = $con->real_escape_string(htmlspecialchars($_POST['beschreibung']));
        $begriffId = $con->real_escape_string(htmlspecialchars($_POST['begriffId']));
        $sql = 'UPDATE begriffe SET begriff = "' . $begriff. '", beschreibung = "'. $beschreibung .'", link = "'. $link .'", wortlisteId = '. $wortlisteId .' WHERE id = '. $begriffId .';';
        return $con->query($sql);
    }

    function getAllBegriffe($con, $userid){
        $sql = 'SELECT begriffe.id, begriffe.wortlisteId, begriffe.begriff, begriffe.beschreibung, begriffe.link FROM begriffe JOIN userwortlisten ON begriffe.wortlisteId = userwortlisten.wortlisteId WHERE userwortlisten.userId = ' . $userid . ';';
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

    function getBegriffe($con, $userid){
        $wortlisteId = $con->real_escape_string(htmlspecialchars($_POST['wortlisteId']));
        $sql = 'SELECT begriffe.id, begriffe.wortlisteId, begriffe.begriff, begriffe.beschreibung, begriffe.link FROM begriffe JOIN userwortlisten ON begriffe.wortlisteId = userwortlisten.wortlisteId WHERE userwortlisten.userId = ' . $userid . ' AND userwortlisten.wortlisteId = '. $wortlisteId .';';
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