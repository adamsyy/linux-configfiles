let versionElem = document.querySelector("#version");
versionElem.textContent += chrome.app.getDetails().version;
document.querySelectorAll("a[href]").forEach((elem) =>
  elem.addEventListener("click", (e) => {
    window.open(elem.getAttribute("href"));
  })
);
