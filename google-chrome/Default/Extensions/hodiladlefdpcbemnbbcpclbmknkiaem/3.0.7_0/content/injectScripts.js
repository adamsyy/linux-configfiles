// @ts-nocheck

/**
 * 
 * @param {[{type:String,url:String}]} dependencies - A list of dependencies that will be loaded in before the script begins
 */
async function injectDependencies(dependencies) {
  function loadDependency(id) {
    if (!dependencies[id]) return;
    let { type, url } = dependencies[id];

    // stylesheet dependency, or script dependency
    switch (type) {
      case "stylesheet":
        let styleElement = document.createElement("link");
        styleElement.setAttribute("rel", "stylesheet");
        styleElement.setAttribute("href", url);
        styleElement.setAttribute("id", "optic-control-" + id);
        (
          document.body ||
          document.head ||
          document.documentElement
        ).appendChild(styleElement);
        document.querySelector("#optic-control-" + id).onload = function () {
          loadDependency(id + 1);
        };
        break;
      case "script":
        let scriptElement = document.createElement("script");
        scriptElement.setAttribute("src", url);
        scriptElement.setAttribute("type", "text/javascript");
        scriptElement.setAttribute("id", "optic-control-" + id);
        (
          document.body ||
          document.head ||
          document.documentElement
        ).appendChild(scriptElement);
        document.querySelector("#optic-control-" + id).onload = function () {
          loadDependency(id + 1);
        };
        break;
    }
  }
  loadDependency(0);
}

// pure text
function injectScript(scriptText) {
  let scriptElement = document.createElement("script");
  scriptElement.setAttribute("async", "");
  scriptElement.appendChild(document.createTextNode(scriptText));
  (document.body || document.head || document.documentElement).appendChild(
    scriptElement
  );
}

function initiate() {
  injectScript(
    'window.OpticFiles={url:"' +
    chrome.runtime.getURL("") +
    '",id:"' +
    chrome.runtime.getURL("").slice(19, -1) +
    '",images:{sunglasses:"' +
    chrome.runtime.getURL("dist/img/sunglasses.png") +
    '",softblur:"' +
    chrome.runtime.getURL("dist/img/softblur.png") +
    '",toucan:"' + chrome.runtime.getURL("dist/img/toucan.png") + '"}}'
  );
  injectScript(
    `
   setInterval(() => {let a=document.evaluate("//div[text()='Camera is starting']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;if(a){a.innerText="Plugins being installed"}}, 500)`
  );

  injectDependencies([
    {
      type: "script",
      url: chrome.runtime.getURL("dist/dependencies/tfjs.js")
    },
    {
      type: "script",
      url: chrome.runtime.getURL("dist/dependencies/body-pix.js")
    },
    {
      type: "stylesheet",
      url: chrome.runtime.getURL("dist/main.css")
    },
    {
      type: "script",
      url: chrome.runtime.getURL("dist/dependencies/blur.js")
    },
    {
      type: "script",
      url: chrome.runtime.getURL("dist/dependencies/paint.js")
    },
    {
      type: "script",
      url: chrome.runtime.getURL("dist/dependencies/jeelizFaceFilter.js")
    },
    {
      type: "script",
      url: chrome.runtime.getURL("dist/dependencies/three.js")
    },
    {
      type: "script",
      url: chrome.runtime.getURL("dist/dependencies/dependen.js")
    },
    {
      type: "script",
      url: chrome.runtime.getURL("dist/dependencies/donation.js")
    },
    {
      type: "script",
      url: chrome.runtime.getURL("dist/content.js")
    }
  ]);
}

if (!location.href.includes("visual-effects")) { // just to be sure
  initiate();
}
