import { convert } from "html-to-text";

document.addEventListener("DOMContentLoaded", async () => {
  //const outputElement = document.getElementById("output");
  console.log('Dom loaded in popup.js');
  document.getElementById("fetchContent").addEventListener("click", () => {
    // Fetch the active tab and send a request to the background script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.runtime.sendMessage(
          { action: "get-html", tabId: activeTab.id },
          async (response) => {
            if (response?.html) {
        
              const plainText = convert(response.html, { wordwrap: 130 });
              console.log('Plain text:', plainText);
            } else {
              console.error("Failed to fetch HTML.");
            }
          }
        );
      } else {
        console.log("No active tab found.");
      }
    });
  });
});
