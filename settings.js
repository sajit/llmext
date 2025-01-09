document.getElementById("saveKey").addEventListener("click", () => {
    const apiKey = document.getElementById("apiKey").value;
    if (apiKey) {
      // Save the API key to chrome storage
      chrome.storage.local.set({ apiKey: apiKey }, () => {
        alert("API Key saved!");
      });
    } else {
      alert("Please enter a key.");
    }
    const certPath = document.getElementById("certPath").value;
    const certPassphrase = document.getElementById("certPassphrase").value;

    if (certPath) {
        chrome.storage.local.set({ certPath, certPassphrase }, () => {
        alert("Settings saved!");
        });
    } 
    // else {
    //     alert("Certificate file path is required.");
    // }
  });
