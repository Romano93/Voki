<?php
    include_once("localisation.php");
    $loc = new Localisation();
?>
<div id="nav">
    <span id= "navworspace"><a href="workspace.php"><?php echo $loc->getLocalisationFromSession('NAVBAR_WORKSPACE') ?></a></span>
    <span id= "navadmin"><a href="admin.php"><?php echo $loc->getLocalisationFromSession('NAVBAR_ADMIN') ?></a></span>
</div>