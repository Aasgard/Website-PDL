function getURLParameter(paramName) {

    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == paramName) {
            return sParameterName[1];
        }
    }

    return "";
}

function isset(variable) {
    return variable.length > 0;
}

function findMoveDataInJSON(json, id) {
    $.getJSON(json, function (data) {
        var found = false;
        var i = 0;
        while(!found && i < data.length){
            if(data[i].id == id){
                var res = data[i];
                found = true;
            }else{i++;}
        }
        if(!found){document.location.href="/openings.html";}
        return JSON.stringify(res.data);
    });
}


