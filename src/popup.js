import { convert } from "html-to-text";
import axios from "axios";

document.addEventListener("DOMContentLoaded", async () => {

  var apiKey;
  chrome.storage.local.get("apiKey", (data) => {
    if (data.apiKey) {
        console.log("API Key found:", data.apiKey);
        apiKey = data.apiKey;
    }
  });
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


const apiResponse = document.getElementById("openAIResponse");


// Fetch API data when button is clicked
document.getElementById("fetchData").addEventListener("click", async () => {
  if(!apiKey) {
    apiResponse.textContent = "Please enter an API key in the settings.";
    return;
  }

apiResponse.textContent = "Fetching data...";

try {
  const response = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
  apiResponse.textContent = JSON.stringify(response.data, null, 2);
} catch (error) {
  apiResponse.textContent = `Error: ${error.message}`;
}
});

});
