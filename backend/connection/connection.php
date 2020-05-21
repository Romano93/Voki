<?php
class DbConnection{
    private $db = "voki";
    private $user = "root";
    private $password = "";
    private $url = "localhost";

    function getConnection (){		
    // Create connection
		return new mysqli($this->url, $this->user, $this->password, $this->db);
	}
}

?>