<?php
    include_once("localisation.php");
    $loc = new Localisation();
?>
<div id="nav">
    <?php
        if(pathinfo($_SERVER['PHP_SELF'], PATHINFO_FILENAME) == 'workspace'){
            echo '<span id= "navadmin"><a href="admin.php">' . $loc->getLocalisationFromSession('NAVBAR_ADMIN') . '</a></span>';
        }
        elseif(pathinfo($_SERVER['PHP_SELF'], PATHINFO_FILENAME) == 'admin'){
            echo '<span id= "navworspace"><a href="workspace.php">' .  $loc->getLocalisationFromSession('NAVBAR_WORKSPACE') . '</a></span>';
        }
    ?>    
</div>