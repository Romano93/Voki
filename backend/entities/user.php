<?php
class User{
    function createUser($con){
        $mail = $con->real_escape_string(htmlspecialchars($_POST["mail"]));
        $vorname = $con->real_escape_string(htmlspecialchars($_POST["vorname"]));
        $nachname = $con->real_escape_string(htmlspecialchars($_POST["nachname"]));        
        $passwort = $con->real_escape_string(htmlspecialchars($_POST["passwort"]));
        $passwortnochmals = $con->real_escape_string(htmlspecialchars($_POST["passwortnochmals"]));
        if($passwort == $passwortnochmals && $this->isUniqueMail($con, $mail)){            
            $passwort = password_hash($passwort, PASSWORD_DEFAULT); // https://www.php.net/manual/en/function.password-hash.php
            $passwortnochmals = password_hash($passwortnochmals, PASSWORD_DEFAULT);
            $id = $this->getUniqueUuid($con);
            $sql = "INSERT INTO user (publickey, mail, nachname, vorname, passwort) VALUES ('". $id ."', '". $mail ."', '". $nachname ."', '". $vorname ."', '". $passwort ."');";
            $con->query($sql);
            return $con->insert_id; 
        }
        return false;
    }
    function loginUser($con){
        if(!isset($_POST['mail']) || !isset($_POST['passwort'])){
            return false;
        }
        $mail = $con->real_escape_string(htmlspecialchars($_POST["mail"]));
        $passwort = $con->real_escape_string(htmlspecialchars($_POST["passwort"]));
        $sql = "SELECT id, passwort FROM user WHERE mail = '" . $mail . "'";
        $res = $con->query($sql);
        $row = $res->fetch_assoc();
        if(password_verify($passwort, $row['passwort'])){  // https://www.php.net/manual/en/function.password-verify.php
            $_SESSION['userid'] = $row['id'];
            return true;
        }
        return false;
    }
    function getUniqueUuid($con){
        $id = uniqid();
        $sql = "SELECT COUNT(id) FROM user WHERE publickey = " . $id;
        $res = $con->query($sql);
        if($res != 0){ // gibt es schon
            return $this->getUniqueUuid($con); // rekursiv
        }
        return $id;
    }    
    function isUniqueMail($con, $mail){
        $sql = 'SELECT id FROM user WHERE mail = "' . $mail . '";';
        $res = $con->query($sql);
        if($res->num_rows == 0){
            return true;
        }
        return false;
    }
}
?>