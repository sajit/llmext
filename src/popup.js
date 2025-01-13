import { convert } from "html-to-text";
import axios from "axios";

document.addEventListener("DOMContentLoaded", async () => {

  var content;
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
              console.log('Plain text received');
              content = plainText;
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
document.getElementById("fetchData").addEventListener("click", () => {
if (!content) {
  alert("Please load content first.");
  return;
}  
const userInput = document.getElementById("userInput").value;
apiResponse.textContent = "Fetching data...";
chrome.runtime.sendMessage(
  { action: "askLLM", document: content, question: userInput },
  async (responsePromise) => {
    //console.log('LLM Response', response);
    responsePromise.then((response) => {
      console.log('Resolved LLM response:', response);  // Output: "Task completed!"
      if (response?.translation) {

        apiResponse.textContent = response.translation;
        
      } else {
        console.error("Failed to fetch AI response.");
      }
      
    }).catch((error) => {
      console.error('Error resolving result:', error);  // Handle any errors from the promise
      
    });
    
    
  }
);


});

});
