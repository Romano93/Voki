<?php
    include_once("localisation.php");
    $loc = new Localisation();
?>
<div>
    <?php
        if(pathinfo($_SERVER['PHP_SELF'], PATHINFO_FILENAME) == 'index'){            
            echo '<span id= "footerspan"> &copy; Romano Sabbatella</span>';
        }
        else{
            echo '<span id= "footerspan"><a href="logout.php">Logout </a> &copy; Romano Sabbatella</span>';
        }
    ?>
</div>