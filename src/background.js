chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.url) {
        chrome.tabs.sendMessage(tabId, {
            message: 'TabUrlChanged',
            url: changeInfo.url
        })
    }
});