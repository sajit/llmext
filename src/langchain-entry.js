import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage } from 'langchain/schema';

// Function to query OpenAI via LangChain
export async function queryOpenAI(prompt, openAIAPIKey) {
    const model = new ChatOpenAI({
      openAIApiKey: openAIAPIKey,
    });
  
    try {
      const response = await model.call([new HumanMessage(prompt)]);
      return response.content;
    } catch (error) {
      console.error('Error with LangChain:', error);
      throw error;
    }
  }