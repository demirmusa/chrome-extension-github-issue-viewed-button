var regexNotAllowedUrl = ["(https:\/\/github.com)\/[0-9a-zA-z-]+\/[0-9a-zA-z-]+\/(issues)\/[0-9]$",
    "(https:\/\/github.com)\/[0-9a-zA-z-]+\/[0-9a-zA-z-]+\/(pulls)\/[0-9]$"
];
var regexAllowedUrlWithOutProjectId = ["(https:\/\/github.com)\/[0-9a-zA-z-]+\/[0-9a-zA-z-]+\/(issues)",
    "(https:\/\/github.com)\/[0-9a-zA-z-]+\/[0-9a-zA-z-]+\/(pulls)",
];
var regexAllowedUrlWithProjectId = ["(https:\/\/github.com)\/(issues)", "(https:\/\/github.com)\/(pulls)"]; //in these pages js-issue-row id has also project name issue_2590_aspnetzero_aspnet-zero-core

var regexDetailsPage = "(https:\/\/github.com)\/[0-9a-zA-z-]+\/[0-9a-zA-z-]+\/((pulls)|(issues))/([0-9]+)";

chrome.tabs.onCreated.addListener(function (tab) {
    debugger;
    runContentJs(tab.id, tab.url);
    runDetailPageJs(tabId, tab.url);

    chrome.tabs.sendMessage(tab.id, {
        message: 'ConsoleLogMe',
        changeInfo: null,
        tab: tab
    });
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //if (changeInfo.url && changeInfo.url && tab && changeInfo.url === tab.url) {
    debugger;
    runContentJs(tabId, tab.url);
    runDetailPageJs(tabId, tab.url);
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
    if (controlDetailPageUrl(url).isTrue) {
        return false;
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

function runDetailPageJs(tabId, url) {
    var control = controlDetailPageUrl(url);

    if (control.isTrue) {
        chrome.tabs.sendMessage(tabId, {
            message: 'UrlChanged_ReInitializeIssueViewed_DetailPage',
            rowIdSuffix: rowIdSuffix,
            issueId: control.issueId
        });
    }
}
function controlDetailPageUrl(url) {
    debugger;
    var regex = new RegExp(regexDetailsPage);
    var regexResult = regex.exec(url);
    if (regexResult) {
        getRowIdSuffix(url);
        return {
            isTrue: true,
            issueId: regexResult[5]
        };
    }

    return {
        isTrue: false
    };
}