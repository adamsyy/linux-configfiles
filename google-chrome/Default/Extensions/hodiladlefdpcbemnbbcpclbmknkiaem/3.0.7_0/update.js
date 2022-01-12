chrome.runtime.onUpdateAvailable.addListener(function (details) {
  console.log(`Version Outdated - Updating to ${details.version}`);
  chrome.runtime.reload();
});

// chrome.storage.sync.get(["optic-uuid"], function (result) {
//   if (!result.key) {
//     chrome.storage.sync.set({ "optic-uuid": uuidV4 });
//   }
// });
