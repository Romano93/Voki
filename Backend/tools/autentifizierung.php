<?php
class Autentifizierung{

    function handelLoginTrys($con){
        $date = date("Y-m-d H:i:s");
        $time = strtotime($date);
        $time = $time - (30 * 60);
        $date = date("Y-m-d H:i:s", $time);
        $sql = 'SELECT id FROM log WHERE time > ' . $date . ' AND ip = ' . $this->getIpAddress() .' AND success = 0';
        $res = $con->query($sql);
        if($res && $res->row_count > 3){
                $this->insertLogInfo($con, false);
            return false ;
        }
        $this->insertLogInfo($con, true);
        return true;
    }

    function insertLogInfo($con, $success){
        $date = date("Y-m-d H:i:s");
        $sql = "INSERT INTO log (ip, time, information, success) VALUES ('". $this->getIpAddress() ."', '". $date . "', '". $con->real_escape_string($this->getClientInfo()) ."', ". $success .");";
        return $con->query($sql);
    }

    function matchPublicKey($con, $publickey){
        $publickey = htmlspecialchars($publickey);
        $publickey = $con->real_escape_string($publickey);
        $sql = 'SELECT id FROM user WHERE publickey = ' . $publickey . ';';
        $res = $con->query($sql);
        if($res->num_rows == 1){
            $row = $res->fetch_assoc();
            insertLogInfo($con, true)
            return $row['id'];
        }
        insertLogInfo($con, false)
        return null;
    }

    function getClientInfo(){
        $info = '';
        if(isset($_SERVER['HTTP_USER_AGENT'])){
            $info = 'user agent: ' . $_SERVER['HTTP_USER_AGENT'];
        }
        if(isset($_SERVER['HTTP_REFERER'])){
            $info = $info . ' referer: ' . $_SERVER['HTTP_REFERER'];
        }
        return $info;
    }

    function getIpAddress(){
        foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key){
            if (array_key_exists($key, $_SERVER) === true){
                foreach (explode(',', $_SERVER[$key]) as $ip){
                    $ip = trim($ip); // just to be safe
    
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false){
                        return $ip;
                    }
                }
            }
        }
        return 'unknown';
    }
}
?>
