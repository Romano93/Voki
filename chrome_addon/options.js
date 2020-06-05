document.getElementById('save').addEventListener("click", function(){
    chrome.storage.sync.set({
        "apikey": escape(document.getElementById('publickey').value)
    });
});

document.addEventListener("DOMContentLoaded", function(){
    chrome.storage.sync.get("apikey", function(result){
        if(result["apikey"] != undefined){
            document.getElementById('publickey').value = result["apikey"];
            }
        else{
            document.getElementById('publickey').value = ""
        }
    })
});