document.getElementById('fetchContent').addEventListener('click', () => {
    chrome.runtime.sendMessage(
      { action: "getPageContent" },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          document.getElementById('contentDisplay').textContent = response.content;
        }
      }
    );
  });
  