function getViewedButtonHtmlString(parentId, viewed) {
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