function getInputView(){
    // Localisation ist im DOM versteckt
    let begriffLabel = document.getElementById('formLocationBegriff').textContent;
    let beschreibungLabel = document.getElementById('formLocationBeschreibung').textContent;
    let linkLabel = document.getElementById('formLocationLink').textContent;
    let submitLabel = document.getElementById('formLocationSubmit').textContent;
    // Form erstellen
    let res = '';
    res = res + '<form method="post" class="editView">';
    res = res +     '<label>' + begriffLabel + '</label><br>';
    res = res +     '<textarea type="text" id="formBegriff" name="formBegriff"></textarea><br>';
    res = res +     '<label>' + beschreibungLabel +'</label><br>';
    res = res +     '<textarea name="formBeschreibung" id="formBeschreibung" type="text"></textarea><br>';
    res = res +     '<label>' + linkLabel + '</label><br>';
    res = res +     '<textarea name="formLink" id="formLink" type="text"></textarea><br>';
    res = res +     '<input id="formBegriffId" name="formBegriffId" style="display: none;" type="text"/><br>'; // hidden
    res = res +     '<input name="formWortlisteId" id="formWortlisteId" style="display: none;" type="text"/>'; // hidden
    res = res +     '<input class="submit" type="submit" value="' + submitLabel +'">';
    res = res +     '<img id="abbortBtn" src="images/cross.png">';
    res = res + '</form>';
    return res;
};

function resetUserInput(){
    document.querySelectorAll('.begriffcontainer').forEach(function(item){
        item.style.backgroundColor = '#ffffff';
    });
    document.getElementById('inputcontainer').innerHTML = '';
};

function updateBegriffeFromSelectedWortliste(){
    let wortlisteId = document.getElementById('wortlisten').options[document.getElementById('wortlisten').selectedIndex].value;
    let begriffe = document.querySelectorAll('.begriffcontainer');
    if(begriffe.length > 0){
        begriffe.forEach(begriff => {
            if(begriff.querySelector('.wortlisteId').textContent === wortlisteId){
                begriff.style.display = 'block';
            }
            else{                
                begriff.style.display = 'none';
            }
        });
    }
    // update des versteckten feldes im Input field
    if(!!document.getElementById('formWortlisteId')){
        document.getElementById('formWortlisteId').value = wortlisteId;
    }
};

function getPsoydoForm(begriffId, wortlisteId){
    let res = '';
    res = res + '<form method="post" id="hiddenform">';
    res = res +     '<input class="formDel" name="formDel" value="1">';
    res = res +     '<input class="formBegriffId" name="formBegriffId" value="' + begriffId +'">';
    res = res +     '<input class="formWortlisteId" name="formWortlisteId" value="' + wortlisteId +'">';
    res = res +     '<input id="hiddenformSubmit" type="submit" value="Save">';
    res = res + '</form>';
    return res;
};

function sendPsoydoForm(form){
    document.getElementById('inputcontainer').innerHTML = form;
    if(!!document.getElementById('hiddenform')){
        document.getElementById('hiddenform').submit();
    }
};

//
// Listeners
//
document.getElementById('wortlisten').addEventListener('change', function(){
    updateBegriffeFromSelectedWortliste();
});

document.querySelectorAll('.delBtn').forEach(function(item){
    item.addEventListener("click", function(event){
        let begriffcontainer = event.target.parentNode.parentNode;
        // nowendige Daten lesen
        let wortlisteId = begriffcontainer.getElementsByClassName('wortlisteId')[0].getAttribute('href');
        let id = begriffcontainer.getElementsByClassName('id')[0].textContent;
        sendPsoydoForm(getPsoydoForm(id, wortlisteId));        
    });
});

document.querySelectorAll('.editBtn').forEach(function(item){
    item.addEventListener("click", function(event){
        // nowendige Daten lesen
        let begriffcontainer = event.target.parentNode.parentNode;
        begriffcontainer.style.backgroundColor = "#808080";
        let begriff = begriffcontainer.getElementsByClassName('begriff')[0].textContent;        
        let beschreibung = begriffcontainer.getElementsByClassName('beschreibung')[0].textContent;
        let link = begriffcontainer.getElementsByClassName('link')[0].getAttribute('href');
        if(link == null){
            link = begriffcontainer.getElementsByClassName('link')[0].innerText;
        }
        let id = begriffcontainer.getElementsByClassName('id')[0].textContent;
        // View erstellen
        document.getElementById('inputcontainer').innerHTML = getInputView();
        document.getElementById('formBegriff').value = begriff;
        document.getElementById('formBeschreibung').value = beschreibung;
        document.getElementById('formLink').value = link;
        document.getElementById('formBegriffId').value = id;
        document.getElementById('formWortlisteId').value = document.getElementById('wortlisten').options[document.getElementById('wortlisten').selectedIndex].value;
        // Listeners registrieren
        document.getElementById('abbortBtn').addEventListener('click', function(){
            resetUserInput();
        });
    });
});

// if user sets string into search field --> filter
document.getElementById('searchtext').addEventListener("input", function(){
    let searchstring = document.getElementById('searchtext').value.toLowerCase();
    let childstring = "";
    let children = document.getElementById('datacontainer').children;
    console.log(children);
    let wortlisteId = document.getElementById('wortlisten').options[document.getElementById('wortlisten').selectedIndex].value;    
    for(child of children){
        childstring = "";
        childstring = child.getElementsByClassName('begriff')[0].innerText.toLowerCase();
        if(childstring.indexOf(searchstring) >= 0 && child.getElementsByClassName('wortlisteId')[0].innerText == wortlisteId){
            child.style.display  = "block";
        }
        else{
            child.style.display  = "none";
        }
    }
});

document.getElementById('refreshBtn').addEventListener('click',function(){
    let wortlisteId = document.getElementById('wortlisten').options[document.getElementById('wortlisten').selectedIndex].value;
    let form = '';
    form = form + '<form method="post" id="hiddenform">';
    if(wortlisteId > 0 && wortlisteId != undefined && wortlisteId != null){
        form = form + '<input id="formWortlistenId" name="formWortlistenId" value="'+ wortlisteId +'">';
    }
    form = form + '</form>';
    sendPsoydoForm(form);
});

document.getElementById('addBtn').addEventListener('click', function(){
    document.getElementById('inputcontainer').innerHTML = getInputView();
    updateBegriffeFromSelectedWortliste();
    document.getElementById('abbortBtn').addEventListener('click', function(){
        resetUserInput();
    });
});


//
// initial function calls
// 
updateBegriffeFromSelectedWortliste(); // wortliste Updaten