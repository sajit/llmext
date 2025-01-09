chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get-html") {
    console.log("Background.js Received message:", request);

    const activeTab = request.tabId;


      console.log("Active tab found:", activeTab);
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab },
          func: getHTMLContent,
        },
        (results) => {
          if (results && results[0]?.result) {
            console.log("Sending response with HTML content.");
            sendResponse({ html: results[0].result });
          } else {
            console.error("No results or invalid response from scripting.");
            sendResponse({ html: '' });
          }
        }
      );

      // Signal asynchronous response
      return true;

  }
});

function getHTMLContent() {
  return document.documentElement.outerHTML;
}
