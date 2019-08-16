debugger;
var issueToolbar = document.getElementById('js-issues-toolbar');
var container = issueToolbar.querySelector(".js-navigation-container");
var boxRows = container.querySelectorAll(".Box-row");


for (var i = 0, l = boxRows.length; i < l; i++) {
  debugger;
  var table = boxRows[i].querySelectorAll(".d-table");
  table[0].appendChild(htmlToElement(GetTemplateHtml()))
}

function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}
function GetTemplateHtml(){
  return `
<div style="
    position: absolute;
    width: 100%;
    height: 100%;
">
<div style="
    width: 100%;
    height: 100%;
    /* position: absolute; */
    background-color: whitesmoke;
    opacity: .9;
    z-index: 1000002;
">
    </div>
<button class="octicon octicon-comment v-align-middle" style="
    position: absolute;
    top: 0;
    left: -77px;
">Open/Close</button>

</div>
`;
}