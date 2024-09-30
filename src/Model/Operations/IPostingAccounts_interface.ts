import { model, Schema, Types } from 'mongoose';
import { PlatformArr, PlatformEnum } from "../../Utils/SocialMedia/Platform";

export interface IAccount {
    token: string,
    brand: string|Types.ObjectId,
    platform: string
  }    
export interface IRedditAccountData {appID:string, appSecret:string, username:string, password:string, brand:string, brand_id:string}
export interface ITelegramAccountData {token:string, brand_id:string}  


export type accountDataType = 
{platform:PlatformEnum,
  account:IRedditAccountData|ITelegramAccountData}