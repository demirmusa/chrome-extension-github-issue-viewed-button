var regexDefaultPages = "(https:\/\/github.com)\/((issues)|(pulls))"; //in these pages js-issue-row id has also project name (example: issue_1_accountName_projectName)
var regexListPages = ["(https:\/\/github.com)\/([0-9a-zA-z-]+)\/([0-9a-zA-z-]+)\/((pulls)|(issues))",
    "(https:\/\/github.com)\/([0-9a-zA-z-]+)\/([0-9a-zA-z-]+)\/(milestone)\/([0-9]+)"]; //in these pages js-issue-row id dont only has id value (example: issue_2590)

var regexDetailsPages = "(https:\/\/github.com)\/([0-9a-zA-z-]+)\/([0-9a-zA-z-]+)\/((pull)|(issues))\/([0-9]+)";

chrome.tabs.onCreated.addListener(function (tab) {
    Initialize(tab);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    Initialize(tab);
});

function Initialize(tab) {
    if (IsDetailPage(tab.url)) {
        var detailInfo = getDetailIssueIdAndSuffix(tab.url);
        triggerDetailPageInitializeEvent(tab.id, detailInfo.suffix, detailInfo.issueId);
    } else {
        debugger;
        var isListPage = IsListPage(tab.url);
        var isDefaultPage = IsDefaultPage(tab.url);
        if (isListPage || isDefaultPage) {
            var suffix = "";
            if (!isDefaultPage) {
                suffix = getListPageSuffix(tab.url);
            }
            triggerListPageInitializeEvent(tab.id, suffix);
        }
    }
}

function triggerListPageInitializeEvent(tabId, rowIdSuffix) {
    chrome.tabs.sendMessage(tabId, {
        message: 'UrlChanged_ReInitializeIssueViewed',
        rowIdSuffix: rowIdSuffix
    });
}

function triggerDetailPageInitializeEvent(tabId, rowIdSuffix, issueId) {
    chrome.tabs.sendMessage(tabId, {
        message: 'UrlChanged_ReInitializeIssueViewed_DetailPage',
        rowIdSuffix: rowIdSuffix,
        issueId: issueId
    });
}

function IsDetailPage(url) {
    var regex = new RegExp(regexDetailsPages);
    if (regex.exec(url)) {
        return true;
    }
    return false;
}

function IsListPage(url) {
    if (IsDetailPage(url)) {
        return false;
    }
    var result = false;
    regexListPages.forEach(regexListPage => {
        var regex = new RegExp(regexListPage);
        if (regex.exec(url)) {
            result = true;
        }
    });
    return result;
}

function IsDefaultPage(url) {
    if (IsDetailPage(url)) {
        return false;
    }

    var regex = new RegExp(regexDefaultPages);
    if (regex.exec(url)) {
        return true;
    }
    return false;
}

function getListPageSuffix(url) {
    var suffix = "";
    regexListPages.forEach(regexListPage => {
        var regex = new RegExp(regexListPage);
        var regexResult = regex.exec(url);
        if (regexResult) {
            debugger;
            var accountName = regexResult[2];
            var projectName = regexResult[3];
            suffix = "_" + accountName + "_" + projectName;
        }
    });
    return suffix;
}

function getDetailIssueIdAndSuffix(url) {
    var regex = new RegExp(regexDetailsPages);
    var regexResult = regex.exec(url);

    var accountName = regexResult[2];
    var projectName = regexResult[3];
    return {
        suffix: "_" + accountName + "_" + projectName,
        issueId: regexResult[7]
    };
}