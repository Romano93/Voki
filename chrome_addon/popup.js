function restore(){
    
};

document.getElementById('refreshBtn').addEventListener("click", function(){
    document.getElementById('anchor').innerHTML = "";
    let form = "";
    let request = new XMLHttpRequest();
    let params = 'k=1&task=allWords'
    request.open("POST", "http://localhost/Voki/controller.php", true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
            JSON.parse(request.responseText);
        }
    }
    request.send(params);
});