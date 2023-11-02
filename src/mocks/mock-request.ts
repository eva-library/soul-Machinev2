/**
 * These functions use Promises and setTimeouts to mock HTTP requests to a third part NLP service
 * and should be replaced with the actual HTTP calls when implementing.
 */

import { Intent, Memory, MemoryScope } from "@soulmachines/smskillsdk";

/**
 * Model of an example response
 */
interface MockGetResponse {
  intent: Intent;
  spokenResponse: string;
  cardsResponse: object;
  annotations: object;
}

/**
 * Example of an action performed by the Initalize ednpoint
 */
export const mockInitActions = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Pre-training initialized. . .");
      console.log("Pre-training completed");
      resolve();
    }, 0);
  });
};

/**
 * Example of an action performed by the Session ednpoint
 * @param {string} sessionId - ID of the current session
 */
export const mockInitResources = (sessionId: string): Promise<Memory[]> => {
  
  const memoryData1: Memory = {
    sessionId,
    name: "public string memory",
    value: "This is to be persisted",
    scope: MemoryScope.Public,
  }
  const memoryData2: Memory = {
    sessionId,
    name: "private json memory",
    value: { example: "object" },
    scope: MemoryScope.Private,
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([memoryData1, memoryData2]);
    }, 0);
  });
};

/**
 * Example of an action performed by the Execute ednpoint
 * @param {string} userInput - incoming user input
 */
export const mockGetResponse = (userInput: string): Promise<MockGetResponse> => {
  console.log(`User said: ${userInput}`);
  return new Promise((resolve) => {
    // Response to be spoken by your Digital Person
    const spokenResponse = `Hello! @showcards(myImageCard) Here is a kitten.`;

    // Add your Cards as required
    const cardsResponse = {
      myImageCard: {
        type: 'image',
        data: {
          url: 'https://placekitten.com/200/200',
          alt: 'An adorable kitten',
        },
      },
    };

    // Add your Intent as required
    const intent: Intent = {
      name: "Welcome",
      confidence: 1,
    };

    // If applicable, add your conversation annotations to see metrics for your Skill on Studio Insights
    const annotations = {
      conv_tag: "Skill.BaseTemplate", 
      conv_id: intent.name, 
      conv_intent: intent.name, 
      conv_type: "Entry",
    };

    setTimeout(() => {
      resolve({ spokenResponse, cardsResponse, intent, annotations });
    }, 0);
  });
};
