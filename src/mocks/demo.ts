var request = require('request');
import { mockGetResponse, mockInitResources, mockInitActions } from "./mock-request";
import { Memory, MemoryScope } from "@soulmachines/smskillsdk";
import { response } from "express";

export default function authenticate(){
    var options = {
      'method': 'POST',
      'url': 'https://keycloak-americas-admin.eva.bot/auth/realms/NTTDATA-EMEAL/protocol/openid-connect/token',
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        'grant_type': 'client_credentials',
        'client_id': 'studio',
        'client_secret': 'GBtdNWiw41dcpp0Lq6yVn9QVNIsCccyA'
      }
    };
    var response
    request(options, function (error: string , res: Response) {
      if (error) throw new Error(error);
      console.log(res.body);
      response = res.body;
    });
  return response
}