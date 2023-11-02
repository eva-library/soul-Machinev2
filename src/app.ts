import {
  ExecuteRequest,
  ExecuteResponse,
} from '@soulmachines/smskillsdk';
import { Request, Response } from 'express';
import { authenticate, Eva }  from './mocks/fake-nlp-service';
import express from 'express';


const app = express();
const port = process.env.PORT ?? 3008;
let sessionCode:any;
let token:any;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/**
 * Init Endpoint
 * https://docs.soulmachines.com/skills/api#tag/Init
 *
 * Runs when a DDNA Studio project is deployed with this Skill configured
 */
// app.post('/init', async (req: Request, res: Response) => {
//   // 1. Get the Soul Machines request object
//   const smRequest = req.body as InitRequest;

//   // 2. Extract relevant data

//   // 2a. Extract skill config and its relevant credentials from the request
//   const { firstCredentials} = smRequest.config as any;

//   // 3. Make request to third party service to initialize
//   // any configuration, data storage, or pre-training on the NLP service before executing this Skill
//   const fakeNLPService = new FakeNLPService(firstCredentials);
//   await fakeNLPService.initActions();
  
//   res.send();
// });

/**
 * Session Endpoint
 * https://docs.soulmachines.com/skills/api#tag/Session
 *
 * Runs before the very first interaction between a user and a DP using this Skill
 * Note that if this endpoint is mapped in skill definition file, the execute endpoint
 * will not contain config in the SessionRequest
 */
// app.post('/session', async (req: Request, res: Response) => {
//   // 1. Get the Soul Machines request object
//   const smRequest = req.body as SessionRequest;

//   // 2. Extract relevant data

//   // 2a. Extract relevant credentials from config
//   const { firstCredentials} = smRequest.config as any;

//   // 2b. Extract sessionId if required
//   const sessionId = smRequest.sessionId;

//   // 3. Make request to third party service to initialize session-specific resources
//   const fakeNLPService = new FakeNLPService(firstCredentials);

//   // 4. Extract relevant response data from the third party service
//   const memoryCredentials = fakeNLPService.persistCredentials(sessionId);
//   const memoryResources = await fakeNLPService.initSessionResources(sessionId);
  
//   // 5. Construct SM-formatted response body
//   const smResponse: SessionResponse = {
//     memory: [
//       ...memoryCredentials,
//       ...memoryResources,
//     ],
//   };

//   res.send(smResponse);
// });

/**
 * Execute Endpoint
 * https://docs.soulmachines.com/skills/api#tag/Execute
 *
 * Runs when user input is forwarded to this Skill
 * Note that if the session endpoint is mapped in skill definition file, this endpoint
 * will not contain config in the SessionRequest
 */
 app.post('/execute', async (req: Request, res: Response) => {
  const smRequest = req.body as ExecuteRequest;

  console.log (smRequest);

  const userInput = smRequest.text;
  const smId = smRequest.sessionId;
  if(token == null){
    token = await authenticate();
  }
  const session = await Eva(userInput, JSON.stringify(token), smId);
  let sessionJson = JSON.parse(session)
  let content = sessionJson.answers[0].content
  sessionCode = sessionJson.sessionCode
  const smResponse: ExecuteResponse = { endConversation: true };
  if (content) {
    smResponse.output = {
      text: content,
    };
  }
  res.send(smResponse)
 
});

/**
 * Delete Endpoint
 * https://docs.soulmachines.com/skills/api#tag/Delete
 *
 * Use this endpoint to implement any clean-up for a Skill when it is no longer used by a project.
 * 
 * Skills which make use of the init endpoint may find the delete endpoint particularly useful for
 * cleaning up any long-running tasks or stored data associated with the provided projectId.
 * 
 * The delete endpoint will be called every time a DDNA Studio project using this Skill is deleted.
 * It will also be called when a project using the Skill removes it, and is then redeployed.
 */
app.delete('/delete/:projectId', async (req: Request, res: Response) => {
  // 1. Get the Soul Machines Project ID
  const projectId = req.params?.projectId;

  // 2. Initiate any cleaning up of data or processes for this project
  console.log(`Cleaned up project - ${projectId}`);

  res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
