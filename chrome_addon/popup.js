////////// TODO: 
//         del console
//         caching
//         error handling (connection)
var console = chrome.extension.getBackgroundPage().console;

// restores the data localy
function restoreLocalData(){
    chrome.storage.local.get("data", function(result){
        let val;
        let itemcollection = "";
        for (val of result['data']){
            itemcollection += getItem(val.begriff, val.beschreibung, val.link);
        }
        document.getElementById('table').innerHTML = itemcollection;
        setLinksClickable();
    });
};

// delivers the html for display
function getItem(begriff, beschreibung, link){
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
        <p class=\"begriff\">" + begriff + "</p>\
        <p class=\"beschreibung\">" + beschreibung + "</p>\
        " + linkitem + "\
        </div>";
};

// gets the server data per post-request
function getServerData(){
    let request = new XMLHttpRequest();
    let params = 'k=1&task=allWords';
    request.open("POST", "http://localhost/Voki/controller.php", true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
            chrome.storage.local.clear();
            chrome.storage.local.set({
                "data": JSON.parse(request.responseText),
                "date": Date.now()
            }, function()
            {
                restoreLocalData();
            });
        }
        else{
            restoreLocalData();
        }
    }
    request.send(params);
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

//
// Listeners:
//

// Get server data
document.getElementById('refreshBtn').addEventListener("click", function(){
    getServerData();
});

// Load local data
window.addEventListener('load', function(){
    restoreLocalData();
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