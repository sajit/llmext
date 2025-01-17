//import { convert } from "html-to-text";


document.addEventListener("DOMContentLoaded", async () => {

  var htmlContent;
  
    // Fetch the active tab and send a request to the background script on load
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.runtime.sendMessage(
          { action: "get-html", tabId: activeTab.id },
          async (response) => {
            if (response?.html) {
              htmlContent = response.html;
              document.getElementById("initMessage").innerText = "Page load complete.";
              //console.log('Plain text:', plainText);
            } else {
              alert("Failed to fetch HTML.");
            }
          }
        );
      } else {
        console.log("No active tab found.");
      }
    });



const apiResponse = document.getElementById("openAIResponse");


// Fetch API data when button is clicked
document.getElementById("fetchData").addEventListener("click", async () => {
 
  if(!htmlContent){
    alert("Page analysis incomplete. Please try again");
    return;
  }

  const questiion  = document.getElementById("userInput").value || "Summary of the page";
  apiResponse.textContent = "Fetching data...";
  const data ={
    "messages": [
      {
        "role": "system", //"system" is a prompt to define how the model should act.
        "content": "you are a helpful ai assistant that can parse html" //system prompt should be written here
      },
      {
        "role": "user", //"user" is a prompt provided by the user.
        "content": "HTML page: "+htmlContent + "\n Question: "+questiion
      }
    ],
    "stream": false //returns as a full message rather than a streamed response
  };

try {
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = response.json();
  apiResponse.textContent = JSON.stringify(result, null, 2);
} catch (error) {
  apiResponse.textContent = `Error: ${error.message}`;
}

});

});
