var console = chrome.extension.getBackgroundPage().console;
// chrome.storage.local.get(null, function (Items) {console.log(Items)});
// restores the data localy
function restoreLocalData(){
    document.getElementById('table').innerHTML = "";
    // data came from server
    chrome.storage.local.get("data", function(result){
        let val;
        let itemcollection = "";
        if(result["data"] != null){
            for (val of result["data"]){
                itemcollection += getItem(val.begriff, val.beschreibung, val.link, val.id, val.wortlisteId);
            }
            if(itemcollection){
                document.getElementById('table').innerHTML += itemcollection;
                setLinksClickable();
                enableEditBtn();
            }
        }
    });

    // read the cache of the new begriffe, if the server is unavalible
    chrome.storage.local.get("cachedata", function(result){
        let val;
        let itemcollection = "";
        if(result["cachedata"] != null){
            for (val of result["cachedata"]){
                itemcollection += getItem(val.begriff, val.beschreibung, val.link, val.id, val.wortlisteId);
            }
            if(itemcollection){
                document.getElementById('table').innerHTML += itemcollection;
                setLinksClickable();
                enableEditBtn();
            }
        }
    });
};

function enableEditBtn(){
    document.querySelectorAll('.editBtn').forEach(function(item){
        item.addEventListener('click', function(){
            let parent = item.parentNode.parentNode;
            let link = "";
            console.log(parent);
            if(parent.getElementsByClassName('link')[0] != null){
                link = parent.getElementsByClassName('link')[0].innerText;
            }
            else if(parent.getElementsByClassName('linkempty')[0] != null){
                link = parent.getElementsByClassName('linkempty')[0].innerText;
            }
            document.getElementById('anchor').innerHTML =       getInputView(parent.getElementsByClassName('id')[0].innerText, 1);
            document.getElementById('newBegriff').value =       parent.getElementsByClassName('begriff')[0].innerText;
            document.getElementById('newBeschreibung').value =  parent.getElementsByClassName('beschreibung')[0].innerText;
            document.getElementById('newLink').value =          link;            
            document.getElementById('editId').innerText =       parent.getElementsByClassName('id')[0].innerText;
            
            // Listener
            document.getElementById('newSpeichern').addEventListener("click", function(){
                if(validateUserInput()){
                    let begriff =           escape(document.getElementById("newBegriff").value).trim();
                    let beschreibung =      escape(document.getElementById("newBeschreibung").value);
                    let link =              escape(document.getElementById("newLink").value);
                    let wortlisteId =       1 // TODO: fix me per dropdown
                    let id =                escape(document.getElementById('editId').innerText);

                    sendServerData(id, begriff, beschreibung, link, wortlisteId);
                    clearUserInputField();
                }
            });                        
        });
    });
};

// server unavalible --> store local
function storeLocalData(id, begriff, beschreibung, link, wortlisteId){
    let string = '{"id":"'+ id +'", "begriff":"'+ begriff +'","beschreibung":"'+ beschreibung +'","link":"'+ link +'","wortlisteId":"'+ wortlisteId +'"}';
    var begriff = JSON.parse(string);
    chrome.storage.local.get("cachedata", function(result){
        let cache = [];
        if(result["cachedata"] != null){
            cache = result["cachedata"];
        }
        cache.push(begriff);
        chrome.storage.local.set({
            "cachedata": cache,
            "date": Date.now()
        }, function()
        {
            restoreLocalData();
        });
    });
}

// delivers the html for display
function getItem(begriff, beschreibung, link, id, wortlisteId){
    let linkitem = "";
    if(link){
        if(isValidURL(link)){
            linkitem = "<a class=\"link\" href=\"" + link + "\">" + link + "</a>";
        }
        else{
            linkitem ="<p class=\"linkempty\">" + link + "</p>";
        }
    }
    return "<div class=\"begriffcontainer\">\
        <p class=\"begriff\">" + begriff + "<input class=\"input editBtn\" type=\"image\" src=\"images/edit.png\"/></p>\
        <p class=\"beschreibung\">" + beschreibung + "</p>\
        " + linkitem + "\
        <p class=\"id\"\>" + id + "</p>\
        <p class=\"wortlisteId\"\>" + wortlisteId + "</p>\
        </div>";
};

// checks local cache and sends it to the server if found --> TODO: überarbeiten, tut nicht
function tryToSendLocalCache(){
    function handleGet(result){
        chrome.storage.local.clear();
        let success = true;
        while(result.length > 0){
            val = result[result.length -1];
            sendServerData(null, val.begriff, val.beschreibung, val.link, val.wortlisteId);
            result.pop();
        }
    };
    chrome.storage.local.get("cachedata", function(result){
        handleGet(result);
    });
};

// gets the server data per post-request
function getServerData(){
    function doRequest(publickey){
        let request = new XMLHttpRequest();
        let params = 'k=' + escape(publickey) + '&task=allWords';
        request.open("POST", "http://localhost/Voki/controller.php", true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.onreadystatechange = function(){
            if(request.readyState == 4){
                if(request.status == 200){
                    chrome.storage.local.set({
                        "data": JSON.parse(request.responseText)
                    }, function()
                    {
                        restoreLocalData();
                    });
                }
                else{            
                    alert('Es trat ein Fehler auf, bei der Serververbindung. Es wurden die Lokalen Daten geladen.');
                    restoreLocalData();
                }
            }
        }
        request.send(params);
    }
    chrome.storage.sync.get("apikey", function(result){
        if(result == null){
            alert('Kein gültiger API Key.');
        }
        else{
            doRequest(result["apikey"]);
        }
    });
};

// sends a new begriff to the server, if connection bad --> cache for later.
function sendServerData(id, begriff, beschreibung, link, wortlisteId){
    function doSend(apikey){
        let params = 'k=' + escape(apikey) +'&begriff=' + begriff + "&beschreibung=" + beschreibung + "&wortlisteId=" + wortlisteId + "&link="+ link;
        if(id != null){
            params += '&task=editWord&begriffId=' + id;
        }
        else{
            params += '&task=newWord';
        }
        console.log(params);
        let request = new XMLHttpRequest();
        request.open("POST", "http://localhost/Voki/controller.php", true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.onreadystatechange = function(){
            if(request.readyState == 4){
                if(request.status == 200){
                    getServerData(); // refresh
                    return true;
                }
                else{
                    alert('Es trat ein Fehler auf, bei der Serververbindung. Die Daten wurden lokal gespeichert und werden zu einem spaeteren Zeitpunkt gesendet.');
                    callback(id, begriff, beschreibung, link, wortlisteId);
                    return false;
                }
            }
        }
        function callback(id, begriff, beschreibung, link, wortlisteId){
            storeLocalData(id, begriff, beschreibung, link, wortlisteId);
        };
        request.send(params);
    };
    chrome.storage.sync.get("apikey", function(result){
        if(result == null){
            alert('Kein gültiger API Key.');
        }
        else{
            doSend(result["apikey"]);
        }
    });
};

// checks if its a valid url
function isValidURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
};

// the a element doesn't work propperly in the extension the way we want
function setLinksClickable(){
    document.querySelectorAll('.link').forEach(function(item){
        item.addEventListener('click', function(){
            chrome.tabs.create({url: item.href, active: false});
        });
    });
};

// checks begriff for now
function validateUserInput(){
    let begriff = escape(document.getElementById("newBegriff").value).trim();
    if(begriff.length === 0){
        alert('Der Begriff muss min. 1 Zeichen enthalten.');
        return false;
    }
    return true;
};

function clearUserInputField(){
    document.getElementById('anchor').innerHTML = "";
};

function getInputView(id){    
    return "<p class=\"input\">Begriff:</p>\
    <input class=\"input\" id=\"newBegriff\" type=\"text\">\
    <p class=\"input\">Beschreibung:</p>\
    <input class=\"input\" id=\"newBeschreibung\" type=\"text\">\
    <p class=\"input\">Link:</p>\
    <input class=\"input\" id=\"newLink\" type=\"text\"><br>\
    <button class=\"input\" id=\"newSpeichern\">Speichern</button>\
    <input class=\"input\" class=\"btn\" id=\"abbortBtn\" type=\"image\" src=\"images/cross.png\"/>\
    <p class=\"id\" id=\"editId\"\>" + id + "</p>";
};

function createInputField(id, wortlisteId){
    document.getElementById('anchor').innerHTML = getInputView(id, wortlisteId);
    // Listener
    document.getElementById('newSpeichern').addEventListener("click", function(){
        if(validateUserInput()){            
            let begriff = escape(document.getElementById("newBegriff").value).trim();
            let beschreibung = escape(document.getElementById("newBeschreibung").value);
            let link = escape(document.getElementById("newLink").value);
            let wortlisteId = 1 // TODO: fix me per dropdown
            let id = escape(document.getElementById('editId').innerText);
            sendServerData(id, begriff, beschreibung, link, wortlisteId);
            clearUserInputField();
        }
    });
    document.getElementById('abbortBtn').addEventListener("click",function (){
        clearUserInputField();
    });
};

//
// Listeners:
//

// Get server data
document.getElementById('refreshBtn').addEventListener("click", function(){
    getServerData();
});

// Load local data
window.addEventListener('load', function(){
    tryToSendLocalCache();
    getServerData();
});

// if user sets string into search field --> filter
document.getElementById('searchtext').addEventListener("input", function(){
    let searchstring = document.getElementById('searchtext').value.toLowerCase();
    let childstring = "";
    let children = document.getElementById('table').childNodes;
    for(child of children){
        childstring = "";
        childstring = child.getElementsByClassName('begriff')[0].innerText.toLowerCase();
        if(childstring.indexOf(searchstring) >= 0){
            child.style.display  = "block";
        }
        else{
            child.style.display  = "none";
        }
    }
});

// add new begriff
document.getElementById('addBtn').addEventListener("click", function(){
    createInputField(null, null);
});

document.getElementById('publickeyBtn').addEventListener("click", function(){
    clearUserInputField();
    let html = "<input class=\"input\" id=\"publickey\" type=\"text\"><br>\
    <button id=\"savepublickey\">Speichern</button>";
    document.getElementById('anchor').innerHTML = html;
    document.getElementById('savepublickey').addEventListener("click",function(){
        let key = escape(document.getElementById('publickey').value);
        if(key == null){
            alert('Kein API Key eingegeben');            
        }
        else{
            chrome.storage.sync.set({
                "apikey": key,
            });
            clearUserInputField();
        }
    });
});