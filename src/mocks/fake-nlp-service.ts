var axios = require('axios');
var qs = require('qs');
// import { mockGetResponse, mockInitResources, mockInitActions } from "./mock-request";
// import { Memory, MemoryScope } from "@soulmachines/smskillsdk";
// import { response } from "express";
  /**
   * Example of using credentials to authenticate
   */ 
  let sessionCode:any;  
  import { Schema, model, connect } from 'mongoose';
  let uri = 'mongodb+srv://evaTeams:ntt.2022@cluster0.g64qw.mongodb.net/session-manager-soulmachine';
  //Esquema de usuarios de Instagram
  interface IUser{
    id: String;
    evaSessionId: String;
    timestamp: Date;
  }
  let soulMachineSchema = new Schema<IUser>({
    id: { type: String, required: true },
    evaSessionId: { type: String, required: true },
    timestamp: Date,
  });

  const soulMachine = model<IUser>('soulMachine', soulMachineSchema)|| soulMachineSchema;
  
  async function findSession(id_user_sm: any){
    try {
      await connect(uri);
      let query = {
        "id": id_user_sm,
        "timestamp": {
          $gte: new Date(new Date().getTime() - (20*60*1000))
        }
      };
      const userFound = await soulMachine.findOneAndUpdate(query, { timestamp : new Date() });
      // console.log("--USER FOUND--",userFound);
      if (userFound != null){
        if(userFound.id == id_user_sm){
          sessionCode = userFound.evaSessionId;
        }
      }else{
        let delete_query = {
          "id": id_user_sm,
        };
        await soulMachine.deleteMany(delete_query);
        sessionCode="";
      }
      return sessionCode;
    } catch (error) {
      console.log("Error to find an user: ",error);
    }finally{
      // await mongoose.connection.close();
    }
  }

  async function saveSession(sC:any,sID:any,eS:any,tS:any){
    try {
      if (sC.length == 0){
        await connect(uri);
        let new_user = new soulMachine({ id: sID, evaSessionId: eS, timestamp: tS });
        new_user.save(function(error:any){
        if (!error){
          console.log("--NUEVO USUARIO REGISTRADO--");
        }else{
          return console.error(error);
        }
        });
      }
    } catch (error) {
      console.log("Error to save user: ",error);
    }
  }

  export async function authenticate(){
    let data = qs.stringify({
      'grant_type': 'client_credentials',
      'client_id': 'studio',
      'client_secret': 'GBtdNWiw41dcpp0Lq6yVn9QVNIsCccyA' 
    });
    let tokenConfig = {
      method: 'post',
      url: 'https://keycloak-americas-admin.eva.bot/auth/realms/NTTDATA-EMEAL/protocol/openid-connect/token',
      headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };
    return axios(tokenConfig).then(function (response:any){
      let token = response.data.access_token;
      return token;
    })
    .catch(function(error:any){
      console.log("AccessTokenGenerator ERROR: ",error);
    });
  }

  export async function Eva(userInput: string, token: any, smId:any){
    sessionCode = await findSession(smId);
    console.log("sessionCode: ", sessionCode);
    let code:any = "%EVA_WELCOME_MSG"
    if(sessionCode){
      code = null;
    }
    var data = JSON.stringify({
      "code": code,
      "text": userInput,
      "context": {}
    });
    let nuevoToken = token.split('"');
    nuevoToken = nuevoToken[1]
    nuevoToken = ("bearer "+nuevoToken)
    var config = {
      method: 'post',
      url: 'https://api-americas-instance1.eva.bot/eva-broker/org/48249918-6f7e-4370-9a46-b2dc572db1a3/env/1d87da23-ec13-4701-a8a0-e5e24d156cba/bot/d9b651b3-3013-4474-a746-fe2c9a49d008/conversations/'+sessionCode,
      headers: { 
        'Content-Type': 'application/json', 
        'API-KEY': 'd93ec8b8-ebe6-11ec-8e01-4201ac1e0009', 
        'CHANNEL': 'IVR', 
        'OS': 'Windows', 
        'USER-REF': 'test', 
        'LOCALE': 'es-ES', 
        'Authorization': nuevoToken
        // 'Authorization': "bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3UWtjM21WUmh4c2VuVUJRdDNUR2d4eXI5RjM4TkFvSm9GTG5pRHdtMjhjIn0.eyJleHAiOjE2NzEwMzAzODUsImlhdCI6MTY3MTAyOTQ4NSwianRpIjoiZDk5MDQ0M2QtMGE4MC00M2UyLWE1YzctMjgzZGY2NTk0YzllIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay1hbWVyaWNhcy1hZG1pbi5ldmEuYm90L2F1dGgvcmVhbG1zL05UVERBVEEtRU1FQUwiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZDE2MWI2ZWYtN2I2NS00OTJlLWI2MjgtZWJjYzgxY2I2Njk2IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic3R1ZGlvIiwic2Vzc2lvbl9zdGF0ZSI6ImRmMTAzM2VkLTc0YWMtNDg3Yi04OWE4LTIwODY3YTkwMWEzOCIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1udHRkYXRhLWVtZWFsIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InN0dWRpbyI6eyJyb2xlcyI6WyJ1bWFfcHJvdGVjdGlvbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwic2lkIjoiZGYxMDMzZWQtNzRhYy00ODdiLTg5YTgtMjA4NjdhOTAxYTM4IiwiY2xpZW50SG9zdCI6IjE5MC4xNy4yMTcuMTEwIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJjbGllbnRJZCI6InN0dWRpbyIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1zdHVkaW8iLCJjbGllbnRBZGRyZXNzIjoiMTkwLjE3LjIxNy4xMTAifQ.Lp9oIi-4HpfHR6BammIDeRtEPdWozrHu1dyusZOguRQRGwOhIoYqlwnUbcx2EYGAvamJfCPEGonw9KO79zkahSEqdPzNYyyvL5-pTuOHWZap3wfJME4Qeg-lrlVDYhq5agLxKLSAyddJtPTidrXhZTyvOQoyA_w5UDhGPP3MThg5QCNgZi_rTehNAMeYPYKt1e0WQy-oTMLl1I_c6iyqRL6v9jFAFqFiD4zU3rqZze3JFM_peA4d6AUPNZRodjbIX8Cyn0oC6vtSs7Xdq0VwIIMqbMd4tNF0kY6JLPiczXNvp7zVNALewWzUU5kQbzCV6SIIY6q31v6-A7LKngCDIw"
      },
      data : data
    };
    return axios(config).then(function (response: any) {
      let data = (JSON.stringify(response.data));
      let sessionJson = JSON.parse(data)
      let evaSession = sessionJson.sessionCode
      let timeStamp = new Date();
      saveSession(sessionCode,smId,evaSession,timeStamp);
      return data;
    })
    .catch(async function (error: any) {
      if (error.response.status == '401') {
        let tooken = await authenticate();
        tooken = JSON.stringify(tooken)
        return await Eva(userInput, tooken, smId);
      }
      console.log("soy error "+error);
    })
  }