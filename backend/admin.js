function getInputView(){
    // Localisation ist im DOM versteckt
    let wortlisteLabel = document.getElementById('formLocationWortliste').textContent;
    let beschreibungLabel = document.getElementById('formLocationBeschreibung').textContent;
    let submitLabel = document.getElementById('formLocationSubmit').textContent;
    // Form erstellen
    let res = '';
    res = res + '<form method="post" class="editView">';
    res = res +     '<label>' + wortlisteLabel + '</label><br>';
    res = res +     '<textarea type="text" id="formWortliste" name="formWortliste"></textarea><br>';
    res = res +     '<label>' + beschreibungLabel +'</label><br>';
    res = res +     '<textarea name="formBeschreibung" id="formBeschreibung" type="text"></textarea><br>';
    res = res +     '<input name="formWortlisteId" id="formWortlisteId" style="display: none;" type="text"/><br>'; // hidden
    res = res +     '<input class="submit" type="submit" value="' + submitLabel +'">';
    res = res +     '<img id="abbortBtn" src="images/cross.png">';
    res = res + '</form>';
    return res;
};

function resetUserInput(){
    document.querySelectorAll('.wortlistencontainer').forEach(function(item){
        item.style.backgroundColor = '#ffffff';
    });
    document.getElementById('inputcontainer').innerHTML = '';
};

function sendPsoydoForm(form){
    document.getElementById('inputcontainer').innerHTML = form;
    if(!!document.getElementById('hiddenform')){
        document.getElementById('hiddenform').submit();
    }
};

function resetUserInput(){
    document.querySelectorAll('.wortlistencontainer').forEach(function(item){
        item.style.backgroundColor = '#ffffff';
    });
    document.getElementById('inputcontainer').innerHTML = '';
};

function insertUserInputField(){
    console.log(getInputView());
    document.getElementById('inputcontainer').innerHTML = getInputView();
    document.getElementById('abbortBtn').addEventListener('click', function(){
        resetUserInput();
    });
};

//
// Listeners
// 
document.querySelectorAll('.editBtn').forEach(function(item){
    item.addEventListener("click", function(event){
        // nowendige Daten lesen
        let container = event.target.parentNode.parentNode;
        container.style.backgroundColor = "#808080";
        let wortliste = container.getElementsByClassName('wortliste')[0].textContent;
        let beschreibung = container.getElementsByClassName('beschreibung')[0].textContent;
        let wortlisteId = container.getElementsByClassName('wortlisteId')[0].textContent;
        // View erstellen
        insertUserInputField();
        document.getElementById('formWortliste').value = wortliste;
        document.getElementById('formBeschreibung').value = beschreibung;
        document.getElementById('formWortlisteId').value = wortlisteId;
        // Listeners registrieren
        document.getElementById('abbortBtn').addEventListener('click', function(){
            resetUserInput();
        });
    });
});

document.querySelectorAll('.delBtn').forEach(function(item){
    item.addEventListener("click", function(event){
        // nowendige Daten lesen
        let container = event.target.parentNode.parentNode;
        let wortlisteId = container.getElementsByClassName('wortlisteId')[0].textContent;
        let form =      '<form method="post" id="hiddenform">';
        form = form +       '<input name="formWortlisteId" value="' + wortlisteId +'">';
        form = form +       '<input name="formDel" value=1>';
        form = form +       '<input type="submit" value="Save">';
        form = form +   '</form>';
        sendPsoydoForm(form);
    });
});

document.getElementById('addBtn').addEventListener('click', function(){
    insertUserInputField();
});

document.getElementById('refreshBtn').addEventListener('click',function(){
    let form = '';
    form = form + '<form method="post" id="hiddenform">';
    form = form + '</form>';
    sendPsoydoForm(form);
});

// if user sets string into search field --> filter
document.getElementById('searchtext').addEventListener("input", function(){
    let searchstring = document.getElementById('searchtext').value.toLowerCase();
    let childstring = "";
    let children = document.getElementById('datacontainer').children;
    for(child of children){
        childstring = "";
        childstring = child.getElementsByClassName('wortliste')[0].innerText.toLowerCase();
        if(childstring.indexOf(searchstring) >= 0){
            child.style.display  = "block";
        }
        else{
            child.style.display  = "none";
        }
    }
});