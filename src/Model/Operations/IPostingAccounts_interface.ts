import { model, Schema, Types } from 'mongoose';
import { PlatformArr, PlatformEnum } from "../../Utils/SocialMedia/Platform";

export interface IAccount {
    token: string,
    brand: string|Types.ObjectId,
    platform: string
  }    
export interface IRedditAccountData {appID:string, appSecret:string, username:string, password:string, }
export interface ITelegramAccountData {token:string,}  


export type accountDataType = 
{platform:string,
  account:IRedditAccountData|ITelegramAccountData}