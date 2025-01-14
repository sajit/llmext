document.getElementById("saveKey").addEventListener("click", () => {
    
    const certPath = document.getElementById("certPath").value;
   
    if (certPath) {
        chrome.storage.local.set({ certPath }, () => {
        alert("Settings saved!");
        });
    } 
    // else {
    //     alert("Certificate file path is required.");
    // }
  });
