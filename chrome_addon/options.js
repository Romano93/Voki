document.getElementById('save').addEventListener("click", function(){
    chrome.storage.sync.set({
        "apikey": escape(document.getElementById('publickey').value)
    });
});

document.addEventListener("DOMContentLoaded", function(){
    chrome.storage.sync.get("apikey", function(result){
        document.getElementById('publickey').value = result["apikey"];
    })
});