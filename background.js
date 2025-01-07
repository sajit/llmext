importScripts('dist/langchain.js');
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'queryOpenAI') {
      const openAIAPIKey = message.openAIAPIKey;
      queryOpenAI(message.prompt, openAIAPIKey)
        .then(response => {
          sendResponse({ result: response });
        })
        .catch(error => {
          console.error('Error:', error);
          sendResponse({ error: error.message || 'Failed to fetch response' });
        });
      return true; // Keeps the messaging channel open for async response
    }

    if (message.action === "getPageContent") {
        // Get the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length === 0) {
            sendResponse({ error: "No active tab found." });
            return;
          }
          
          const activeTabId = tabs[0].id;
          
          // Inject a script to fetch the page content
          chrome.scripting.executeScript(
            {
              target: { tabId: activeTabId },
              func: () => document.documentElement.outerHTML,
            },
            (injectionResults) => {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                sendResponse({ error: chrome.runtime.lastError.message });
                return;
              }
              sendResponse({ content: injectionResults[0].result });
            }
          );
        });
    
        return true; // Indicates asynchronous response
      }
  });
  