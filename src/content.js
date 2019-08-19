const localStorageKey = "GithubViewedIssueIds";
rowIdSuffix = "";

function initalize() {
    getFromStorage(function (list) {
        var jsIssueRows = document.querySelectorAll(".js-issue-row");
        if (jsIssueRows) {
            for (var i = 0, l = jsIssueRows.length; i < l; i++) {
                var btn = jsIssueRows[i].querySelector(".btn-github-issue-viewed");
                if (btn) continue; //if its already added continue

                var id = jsIssueRows[i].id;
                var table = jsIssueRows[i].querySelector(".d-table");

                if (list && list.indexOf(id + rowIdSuffix) != -1) {
                    disableTable(table);
                    table.appendChild(htmlToElement(GetTemplateHtml(id, true)))
                } else {
                    table.appendChild(htmlToElement(GetTemplateHtml(id, false)))
                }
            }
            bindOnChangeEvents();
        }
    });
}

function GetTemplateHtml(parentId, viewed) {
    if (viewed) {
        return `
        <label class="js-reviewed-toggle ml-2 mr-1 px-2 py-1 rounded-1 f6 text-normal d-flex flex-items-center border text-gray border-gray-dark btn-github-issue-viewed btn-github-issue-viewed-in-list bg-blue-2" >
        <input class="mr-1 js-reviewed-checkbox checkbox-github-issue-viewed" type="checkbox" checked="checked" data-parentId="` + parentId + `"/>Viewed</label>`;
    } else {
        return `
        <label class="js-reviewed-toggle ml-2 mr-1 px-2 py-1 rounded-1 f6 text-normal d-flex flex-items-center border text-gray border-gray-dark btn-github-issue-viewed btn-github-issue-viewed-in-list" >
        <input class="mr-1 js-reviewed-checkbox checkbox-github-issue-viewed" type="checkbox" data-parentId="` + parentId + `"/>Viewed</label>`;
    }
}

function issueViewedCheckboxOnChange(e) {
    debugger;
    var id = e.target.dataset.parentid;
    if (e.target.checked) {
        e.target.parentNode.classList.add("bg-blue-2");
        addToStorage(id);
    } else {
        e.target.parentNode.classList.remove("bg-blue-2");
        removeFromStorage(id);
    }

    if (!e.target.dataset.IsDetailPage) {
        var boxRow = document.getElementById(id);
        if (boxRow) {
            var table = boxRow.querySelector(".d-table");
            if (table) {
                if (e.target.checked) {
                    e.target.parentNode.classList.add("bg-blue-2");
                    addToStorage(id);
                    disableTable(table);
                } else {
                    e.target.parentNode.classList.remove("bg-blue-2");

                    var overlayDivs = table.querySelectorAll(".overlay-row-github-issue-viewed");
                    if (overlayDivs && overlayDivs.length > 0) {
                        overlayDivs.forEach(overlayDiv => {
                            table.removeChild(overlayDiv);
                        });
                    }
                    removeFromStorage(id);
                }
            }
        }
    }
}

function disableTable(tableElement) {
    tableElement.insertBefore(htmlToElement(getOverlay()), tableElement.childNodes[0]);
}

function bindOnChangeEvents() {
    var checboxes = document.querySelectorAll(".checkbox-github-issue-viewed");
    if (checboxes && checboxes.length > 0) {
        checboxes.forEach(checkbox => {
            checkbox.addEventListener("change", issueViewedCheckboxOnChange);
        });
    }
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function getOverlay() {
    return `<div class="overlay-row-github-issue-viewed"></div>`;
}

function addToStorage(id) {
    id += rowIdSuffix;
    getFromStorage(function (list) {

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
    getFromStorage(function (list) {

        if (list && list.indexOf(id) != -1) {
            list.splice(list.indexOf(id), 1);
            setStorage(list);
        }
    });
}

function setStorage(list) {
    var jsonfile = {};
    jsonfile[localStorageKey] = JSON.stringify(list);

    chrome.storage.sync.set(jsonfile, function () {

    });
}

function getFromStorage(callBack) {
    chrome.storage.sync.get([localStorageKey], function (result) {
        if (typeof result[localStorageKey] != "undefined")
            callBack(JSON.parse(result[localStorageKey]));
        else
            callBack(null);
    });
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'UrlChanged_ReInitializeIssueViewed') {
            rowIdSuffix = request.rowIdSuffix;
            setTimeout(function () { initalize(); }, 1500);
            console.log("InitializeGithubViewed", request);
            debugger;
        } else if (request.message === "ConsoleLogMe") {
            console.log(request);
        }
    });