const localStorageKey = "GithubViewedIssueIds";

var contextMenu = {
    id: "clearAllViewedIds",
    title: "Remove all viewed marks."
}

chrome.contextMenus.create(contextMenu);

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == contextMenu.id) {
        var jsonfile = {};
        jsonfile[localStorageKey] = JSON.stringify([]);

        chrome.storage.sync.set(jsonfile, function() {
            chrome.tabs.reload(tab.id);
        });
    }
});