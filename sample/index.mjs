import { Ollama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";

const prompt = PromptTemplate.fromTemplate(
 "This is a document: The fox jumped over the fence as it was tired. Answer the question: {question}");
async function runOllama() {
  const llm = new Ollama({
    model: "llama3.2", // Specify the model name
    temperature: 0,
    maxRetries: 2,
  });

  try {
    const chain = prompt.pipe(llm); 
    const promptR = await chain.invoke({question: "Why did the fox jump over the fence?"});
    const response = await llm.invoke({
      prompt: "What is the capital of France?",
    });

    console.log("Ollama Response:", response);
    console.log(promptR);
  } catch (error) {
    console.error("Error invoking Ollama:", error);
  }
}

runOllama();

