var regexNotAllowedUrl = ["(https:\/\/github.com)\/[0-9a-zA-z-]+\/[0-9a-zA-z-]+\/(issues)\/[0-9]$",
    "(https:\/\/github.com)\/[0-9a-zA-z-]+\/[0-9a-zA-z-]+\/(pulls)\/[0-9]$"
];
var regexAllowedUrlWithOutProjectId = ["(https:\/\/github.com)\/[0-9a-zA-z-]+\/[0-9a-zA-z-]+\/(issues)",
    "(https:\/\/github.com)\/[0-9a-zA-z-]+\/[0-9a-zA-z-]+\/(pulls)",
];
var regexAllowedUrlWithProjectId = ["(https:\/\/github.com)\/(issues)", "(https:\/\/github.com)\/(pulls)"]; //in these pages js-issue-row id has also project name issue_2590_aspnetzero_aspnet-zero-core

chrome.tabs.onCreated.addListener(function(tab) {
    debugger;
    runContentJs(tab.id, tab.url);

    chrome.tabs.sendMessage(tab.id, {
        message: 'ConsoleLogMe',
        changeInfo: null,
        tab: tab
    });
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    //if (changeInfo.url && changeInfo.url && tab && changeInfo.url === tab.url) {
    debugger;
    runContentJs(tabId, tab.url);
    //}

    chrome.tabs.sendMessage(tabId, {
        message: 'ConsoleLogMe',
        changeInfo: changeInfo,
        tab: tab
    });
});

var rowIdSuffix = "";

function runContentJs(tabId, url) {
    if (controlUrl(url)) {
        chrome.tabs.sendMessage(tabId, {
            message: 'UrlChanged_ReInitializeIssueViewed',
            rowIdSuffix: rowIdSuffix
        });
    }
}

function controlUrl(url) {
    //check not allowed urls
    for (let index = 0; index < regexNotAllowedUrl.length; index++) {
        var regex = new RegExp(regexNotAllowedUrl[index]);
        if (regex.exec(url)) {
            return false;
        }
    }
    for (let index = 0; index < regexAllowedUrlWithProjectId.length; index++) {
        var regex = new RegExp(regexAllowedUrlWithProjectId[index]);
        if (regex.exec(url)) {
            return true;
        }
    }
    for (let index = 0; index < regexAllowedUrlWithOutProjectId.length; index++) {
        var regex = new RegExp(regexAllowedUrlWithOutProjectId[index]);
        if (regex.exec(url)) {
            getRowIdSuffix(url);
            return true;
        }
    }
    return false;;
}
//issue_1_demirmusa_chrome-extension-github-issue-viewed-button
function getRowIdSuffix(url) {
    var regex = new RegExp("\/[0-9a-zA-z-]+\/[0-9a-zA-z-]+(\/((pulls)|(issue)))");
    var matchedPart = regex.exec(url)[0];
    var splittedList = matchedPart.split('\/');

    var accountName = splittedList[1];
    var projectName = splittedList[2];

    rowIdSuffix = "_" + accountName + "_" + projectName;
}