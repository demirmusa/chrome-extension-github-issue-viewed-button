rowIdSuffix = "";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'UrlChanged_ReInitializeIssueViewed') {
            rowIdSuffix = request.rowIdSuffix;
            setTimeout(function () { initalizeListPageButtons(); }, 1500);
        }
    });

function initalizeListPageButtons() {
    getFromStorage(function (list) {
        var jsIssueRows = document.querySelectorAll(".js-issue-row"); //get all rows
        if (jsIssueRows) {
            for (var i = 0, l = jsIssueRows.length; i < l; i++) {
                var btn = jsIssueRows[i].querySelector(".btn-github-issue-viewed");
                if (btn) continue; //check if its already added

                var id = jsIssueRows[i].id; //id wil be like issue_{issue/pr Id}
                var flex = jsIssueRows[i].querySelector(".d-flex");

                if (list && list.indexOf(id + rowIdSuffix) != -1) { //if its viewed
                    addOverlayElement(flex);
                    flex.appendChild(htmlToElement(getViewedButtonHtmlString(id, true)))
                } else {
                    flex.appendChild(htmlToElement(getViewedButtonHtmlString(id, false)))
                }
            }
            bindOnChangeEvents();
        }
    });
}

function addOverlayElement(flexElement) {
    //flexElement.insertBefore(htmlToElement(getOverlayHtmlString()), flexElement.childNodes[0]);
    flexElement.appendChild(htmlToElement(getOverlayHtmlString()));
}

function getOverlayHtmlString() {
    return `<div class="overlay-row-github-issue-viewed"></div>`;
}

function issueViewedCheckboxOnChange(e) {
    var id = e.target.dataset.parentid;
    if (e.target.checked) {
        e.target.parentNode.classList.add("bg-blue-2");
        addToStorage(id);
    } else {
        e.target.parentNode.classList.remove("bg-blue-2");
        removeFromStorage(id);
    }

    if (!e.target.dataset.IsDetailPage) { //if its list page add overlays
        var boxRow = document.getElementById(id);
        if (boxRow) {
            var flex = boxRow.querySelector(".d-flex");
            if (flex) {
                if (e.target.checked) {
                    e.target.parentNode.classList.add("bg-blue-2");
                    addToStorage(id);
                    addOverlayElement(flex);
                } else {
                    e.target.parentNode.classList.remove("bg-blue-2");

                    var overlayDivs = flex.querySelectorAll(".overlay-row-github-issue-viewed"); //delete all overlays
                    if (overlayDivs && overlayDivs.length > 0) {
                        overlayDivs.forEach(overlayDiv => {
                            flex.removeChild(overlayDiv);
                        });
                    }
                    removeFromStorage(id);
                }
            }
        }
    }
}