// var console = chrome.extension.getBackgroundPage().console;
// chrome.storage.local.get(null, function (Items) {console.log(Items)});

//
// Local cache function
//

// restores the data localy
function restoreLocalData(){
    document.getElementById('table').innerHTML = "";
    
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
};

// checks local cache and sends it to the server if found
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

// handel local wortlisten
function resetWortlisten(){
    var item = document.getElementById('wortlisten');
    var prevSelection = null;
    if(item.selectedIndex >= 0){
        prevSelection = item.options[item.selectedIndex].value;
    }
    chrome.storage.local.get("wortlisten", function(result)
    {
        let val;
        let optioncollection = "";
        if(result["wortlisten"] != null){
            for(val of result["wortlisten"]){
                if(val.id == prevSelection){
                    optioncollection += '<option value="' + val.id + '" selected="selected">' + val.name + '</option>';
                }
                else{
                    optioncollection += '<option value="' + val.id + '">' + val.name + '</option>';
                }
            }
            item.innerHTML = optioncollection;
        }
    });
};

//
// dynamic eventlistener
//

// save btn of the user input
function addSpeicherListener(){
    document.getElementById('newSpeichern').addEventListener("click", function(){
        if(validateUserInput()){     
            let begriff =       document.getElementById("newBegriff").value;
            let beschreibung =  document.getElementById("newBeschreibung").value;
            let link =          document.getElementById("newLink").value;
            let dropdown =      document.getElementById('wortlisten');
            let wortlisteId =   document.getElementById('editWortlistenId').innerText;
            let id =            document.getElementById('editId').innerText;
            // wennn gewechselt und vorhanden --> ueberschreiben
            if(document.getElementById('wortlisten').selectedIndex >= 0){
                wortlisteId = document.getElementById('wortlisten').options[document.getElementById('wortlisten').selectedIndex].value;
            }
            sendServerData(id, begriff, beschreibung, link, wortlisteId);
            clearUserInputField();
        }
    });
};

// abort btn of the user input
function addAbbortListener(){
    document.getElementById('abbortBtn').addEventListener("click",function (){
        clearUserInputField();
    });
};

// enable the edit btn of every entry
function enableEditBtn(){
    document.querySelectorAll('.editBtn').forEach(function(item){
        item.addEventListener('click', function(){
            let parent = item.parentNode.parentNode;
            let link = "";
            if(parent.getElementsByClassName('link')[0] != null){
                link = parent.getElementsByClassName('link')[0].innerText;
            }
            else if(parent.getElementsByClassName('linkempty')[0] != null){
                link = parent.getElementsByClassName('linkempty')[0].innerText;
            }
            document.getElementById('anchor').innerHTML =       getInputView(parent.getElementsByClassName('id')[0].innerText, 1);
            document.getElementById('newBegriff').value =       parent.getElementsByClassName('begriff')[0].innerText;
            document.getElementById('newBeschreibung').value =  parent.getElementsByClassName('beschreibung')[0].innerText;
            document.getElementById('editWortlistenId').value = parent.getElementsByClassName('wortlisteId')[0].innerText;
            document.getElementById('newLink').value =          link;            
            document.getElementById('editId').innerText =       parent.getElementsByClassName('id')[0].innerText;           
            // Listener
            addSpeicherListener();
            addAbbortListener();
            window.scrollTo(0, 0);
        });
    });
};

//
// server calls (get/send)
//

// abstract function to use
function doRequest(params, callback){
    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost/Voki/controller.php", true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.onreadystatechange = function(){
        callback(request);
    };
    request.send(params);
};

// gets the server data per post-request
function getServerData(){
    function getWortlisten(publickey){
        let params = 'k=' + escape(publickey) + '&task=allDef';
        doRequest(params, wortlistenCallback);
    };
    function getBegriffe(publickey){
        let dropdown =      document.getElementById('wortlisten');
        let params = 'k=' + escape(publickey);
        console.log(dropdown.selectedIndex);
        if(dropdown.selectedIndex >= 0){
            params += '&task=selectedWords&wortlisteId=' + dropdown.options[dropdown.selectedIndex].value;
        }
        else{
            params += '&task=allWords'
        }
        doRequest(params, begriffeCallback);
    };
    chrome.storage.sync.get("apikey", function(result){
        if(result == null){
            alert('Kein gültiger API Key.');
        }
        else{
            getWortlisten(result["apikey"]);
            getBegriffe(result["apikey"]);
        }
    });
};

// sends a new begriff to the server, if connection bad --> cache for later.
function sendServerData(id, begriff, beschreibung, link, wortlisteId){
    function send(apikey){
        let params = 'k=' + escape(apikey) +'&begriff=' + begriff + "&beschreibung=" + beschreibung + "&wortlisteId=" + wortlisteId + "&link="+ link;
        if(id !== null && id !== "null"){
            params += '&task=editWord&begriffId=' + id;
        }
        else{
            params += '&task=newWord';
        }        
        doRequest(params, sendCallback);
    };
    chrome.storage.sync.get("apikey", function(result){
        send(result["apikey"]);
    });
};

//
// Tools
//

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

// the a element, in the displayed begriff, doesn't work propperly in the extension the way we want
function setLinksClickable(){
    document.querySelectorAll('.link').forEach(function(item){
        item.addEventListener('click', function(){
            chrome.tabs.create({url: item.href, active: false});
        });
    });
};

// checks if inserted begriff is valid (length > 0)
function validateUserInput(){
    let begriff = document.getElementById("newBegriff").value.trim();
    if(begriff.length === 0){
        alert('Der Begriff muss min. 1 Zeichen enthalten.');
        return false;
    }
    return true;
};

// clears user input field
function clearUserInputField(){
    document.getElementById('anchor').innerHTML = "";
};

// raw user input field
function getInputView(id, wortlisteId){
    return "<p class=\"input\">Begriff:</p>\
    <textarea class=\"input\" id=\"newBegriff\"></textarea>\
    <p class=\"input\">Beschreibung:</p>\
    <textarea class=\"input\" id=\"newBeschreibung\"></textarea>\
    <p class=\"input\">Link:</p>\
    <textarea class=\"input\" id=\"newLink\" ></textarea><br>\
    <button class=\"input\" id=\"newSpeichern\">Speichern</button>\
    <input class=\"input\" class=\"btn\" id=\"abbortBtn\" type=\"image\" src=\"images/cross.png\"/>\
    <p class=\"id\" id=\"editId\"\>" + id + "</p>\
    <p class=\"wortlisteId\" id=\"editWortlistenId\"\>" + wortlisteId + "</p>";
};

// create input field
function createInputField(id, wortlisteId){
    document.getElementById('anchor').innerHTML = getInputView(id, wortlisteId);
    // Listener
    addSpeicherListener();
    addAbbortListener();
    window.scrollTo(0, 0);
};

//
// Callbacks
//

// getServerData() --> wortlisten
function wortlistenCallback(request){
    if(request.readyState == 4){
        if(request.status == 200){
            chrome.storage.local.set({
                "wortlisten": JSON.parse(request.responseText)
            }, function()
            {
                resetWortlisten();
            });
        }
        else{
            resetWortlisten();
        }
    }
};

// sendServerData() --> refresh gui
function sendCallback(request){
    if(request.readyState == 4){
        if(request.status == 200){
            getServerData(); // refresh
            return true;
        }
        else{
            alert('Es trat ein Fehler auf, bei der Serververbindung. Die Daten wurden lokal gespeichert und werden zu einem spaeteren Zeitpunkt gesendet.');
            storeLocalData(id, begriff, beschreibung, link, wortlisteId);
            return false;
        }
    }
};

// getServerData() --> save begriffe local and refresh
function begriffeCallback(request){
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
};

//
// Listeners
//

// Get server data
document.getElementById('refreshBtn').addEventListener("click", function(){
    tryToSendLocalCache();
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

document.getElementById('wortlisten').addEventListener('change', function(){
    getServerData();
});