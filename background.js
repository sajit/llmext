import { PromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/ollama";
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
  // if (request.action === 'askLLM') {

  //   const webpageContent = request.document;
  //   const question = request.question;
  //   const llm = new Ollama({
  //     model: "llama3.2", // Default value
  //     temperature: 0,
  //     maxRetries: 2,
  //     // other params...
  //   });
    
  //   const prompt = new PromptTemplate({
  //     template: 'You are helpful assistant. Given following document: {document} , ' + 
  //     ' Answer the question: {question}',
  //     inputVariables: ['document', 'question'],
  //   });

  //   const chain =  prompt.pipe(llm);
  //   const result = chain.invoke({ "document" : webpageContent, "question": question });
  //   sendResponse({ translation: result });
  //   // console.log('Background.js Result:', result);
  //   // result.then((response) => {
  //   //   console.log(response); // Output: "Task completed!"
  //   //   sendResponse({ translation: response });
  //   //   return true; // Required to indicate asynchronous response
  //   // });
    
  // }
  return true; // Required to indicate asynchronous response
});

function getHTMLContent() {
  return document.documentElement.outerHTML;
}
