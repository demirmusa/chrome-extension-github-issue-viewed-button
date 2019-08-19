chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'UrlChanged_ReInitializeIssueViewed_DetailPage') {
            rowIdSuffix = request.rowIdSuffix;
            setTimeout(function () { initalizeDetailPageButton("issue_" + request.issueId); }, 1500);
            console.log("InitializeGithubViewed", request);
            debugger;
        }
    });

function initalizeDetailPageButton(issueId) {
    debugger;
    getFromStorage(function (list) {
        var jsIssueRow = document.querySelector("#show_issue");
        if (jsIssueRow) {
            var tableObject = jsIssueRow.querySelector(".TableObject");

            var btn = jsIssueRow.querySelector(".btn-github-issue-viewed");
            if (btn) return; //if its already added continue

            if (list && list.indexOf(issueId + rowIdSuffix) != -1) {
                tableObject.appendChild(GetDetailPageButton(issueId, true))
            } else {
                tableObject.appendChild(GetDetailPageButton(issueId, false))
            }
            bindOnChangeEvents();
        }
    });
}
function GetDetailPageButton(id, viewed) {
    var element = htmlToElement(GetTemplateHtml(id, viewed).replace("btn-github-issue-viewed-in-list", ""));
    element.children[0].dataset.IsDetailPage = true;
    return element;
}