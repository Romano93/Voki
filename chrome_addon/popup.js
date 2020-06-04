// var console = chrome.extension.getBackgroundPage().console;
// chrome.storage.local.get(null, function (Items) {console.log(Items)});

//
// Local cache function
//

// restores the data localy
function restoreLocalData(){
    document.getElementById('table').innerHTML = "";
    
    chrome.storage.local.get("begriffe", function(result){
        let val;
        let itemcollection = "";
        document.getElementById('table').innerHTML = "";
        let dropdown = document.getElementById('wortlisten');
        let wortlisteId = 0;
        if(dropdown.selectedIndex >= 0){
            wortlisteId = dropdown.options[dropdown.selectedIndex].value;
        }
        if(result["begriffe"] != null){
            for (val of result["begriffe"]){
                if((wortlisteId > 0 && val.wortlisteId == wortlisteId) || wortlisteId === 0){
                    itemcollection += getItem(val.begriff, val.beschreibung, val.link, val.id, val.wortlisteId);
                }
            }
            if(itemcollection){
                document.getElementById('table').innerHTML += itemcollection;
                setLinksClickable();
                enableEditBtn();
                enableDelBtn();
            }
        }
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
                optioncollection += '<option value="' + val.id + '">' + val.name + '</option>';                
            }
            item.innerHTML = optioncollection;

            if(prevSelection != null){
                item.value = prevSelection;
            }
            else{
                restoreLocalData();
            }
        }
    });
};

//
// dynamic eventlistener
//

// del btn of every entry
function enableDelBtn(){    
    document.querySelectorAll('.delBtn').forEach(function(item){
        item.addEventListener('click', function(){            
            let parent = item.parentNode.parentNode;
            let wortlisteId = parent.getElementsByClassName('wortlisteId')[0].innerText;
            let begriffId = parent.getElementsByClassName('id')[0].innerText;
            delBegriffServer(begriffId, wortlisteId);
        });
    });
};

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
    request.open("POST", "", true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.onreadystatechange = function(){
        callback(request);
    };
    request.send(params);
};

function delBegriffServer(begriffId, wortlisteId){
    function sendDelCallback(request){
        if(request.readyState == 4){
            if(request.status == 200){
                initGetServerData();
            }
        }
    }
    function sendDel(apikey){
        let params = 'k=' + escape(apikey) + '&task=delWord' + '&wortlisteId=' + wortlisteId + '&begriffId=' + begriffId;        
        doRequest(params, sendDelCallback);
    };
    chrome.storage.sync.get("apikey", function(result){
        if(result == null){
            alert('Kein gültiger API Key.');
        }
        else{
            sendDel(result["apikey"]);
        }
    });
};

// gets the server data per post-request
function initGetServerData(){
    chrome.storage.sync.get("apikey", function(result){
        if(result == null){
            alert('Kein gültiger API Key.');
        }
        else{
            getServerData(result["apikey"]);
        }
    });
};

async function getServerData(apikey){
    let params = 'task=allData&k=' + escape(apikey);
    doRequest(params, serverDataCallback);
}


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
                <p class=\"begriff\">" + begriff + "<input class=\"input editBtn\" type=\"image\" src=\"images/edit.png\"/><input class=\"input delBtn\" type=\"image\" src=\"images/cross.png\"/></p>\
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

function serverDataCallback(request){
    if(request.readyState == 4){
        if(request.status == 200){
            chrome.storage.local.clear();
            let response = JSON.parse(request.responseText);
            if(response["wortlisten"] != null){
                chrome.storage.local.set({
                    "wortlisten": response["wortlisten"]
                }, function()
                {
                    resetWortlisten();
                });
            }
            if(response["begriffe"] != null){
                chrome.storage.local.set({
                    "begriffe" : response["begriffe"]
                },function(){
                    restoreLocalData();
                });
            }
        }
        else{
            restoreLocalData();
        }
    }
};

// sendServerData() --> refresh gui
function sendCallback(request){
    if(request.readyState == 4){
        if(request.status == 200){
            initGetServerData(); // refresh
            return true;
        }
        else{
            alert('Bei der Serververbindung trat ein Fehler auf.');
            return false;
        }
    }
};

//
// Listeners
//

// Get server data
document.getElementById('refreshBtn').addEventListener("click", function(){
    document.getElementById('searchtext').value = "";
    initGetServerData();
});

// Load local data
window.addEventListener('load', function(){
    initGetServerData();
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
    restoreLocalData();
});
