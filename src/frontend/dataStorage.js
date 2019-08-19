const localStorageKey = "GithubViewedIssueIds";

function addToStorage(id) {
    id += rowIdSuffix;
    getFromStorage(function(list) {
        if (!list) {
            list = [];
        }
        if (list.indexOf(id) == -1) { //not exist
            list.push(id);
            setStorage(list);
        }
    });
}

function removeFromStorage(id) {
    id += rowIdSuffix;
    getFromStorage(function(list) {
        if (list && list.indexOf(id) != -1) {
            list.splice(list.indexOf(id), 1);
            setStorage(list);
        }
    });
}

function setStorage(list) {
    var jsonfile = {};
    jsonfile[localStorageKey] = JSON.stringify(list);
    chrome.storage.sync.set(jsonfile);
}

function getFromStorage(callBack) {
    chrome.storage.sync.get([localStorageKey], function(result) {
        if (typeof result[localStorageKey] != "undefined")
            callBack(JSON.parse(result[localStorageKey]));
        else
            callBack(null);
    });
}