<?php
class Localisation{
    
    //
    // sets up default localisation stuff and stores it in the session of this user
    //
    function __construct(){
        if(!isset($_SESSION["language"])){
            include_once('tools/autentifizierung.php');
            $aut = new Autentifizierung();
            $ip = $aut->getIpAddress();
            if($ip != 'unknown'){
                $details = json_decode(file_get_contents("http://ipinfo.io/{$ip}/json"));
                if (strtolower($details->country) == 'de' || strtolower($details->country) == 'at' || strtolower($details->country) == 'ch'){
                $_SESSION["language"] = 'de';
                }
            }
            else{
                $_SESSION["language"] = 'en';
            }
        }
        if(!isset($_SESSION["localization"])){
            $fileWithLocation = "translation/" . $_SESSION["language"] . ".txt";
            if(filesize($fileWithLocation) > 0){
                $file = fopen($fileWithLocation, "r");
                $_SESSION["localisationfile"] = json_decode(fread($file, filesize($fileWithLocation)), true);
                fclose($file);
            }
            else{
                $_SESSION["localisationfile"] = "";
            }
        }
    }
    
    //
    // gets the 
    //
    function getLocalisationFromSession($key){        
        if($_SESSION["localisationfile"] != ''){
            return $_SESSION["localisationfile"][$key];
        }
        return "location failed";
    }
}
?>