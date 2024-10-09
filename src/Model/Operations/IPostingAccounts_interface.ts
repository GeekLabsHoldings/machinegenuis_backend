import { model, Schema, Types } from 'mongoose';
import { PlatformArr, PlatformEnum } from "../../Utils/SocialMedia/Platform";

export interface IAccount {
    token: string,
    brand: string|Types.ObjectId,
    platform: string
  }    
export interface IRedditAccountData {appID:string, appSecret:string, username:string, password:string, }
export interface ITelegramAccountData {token:string,}  
export interface ITwetterAccountData {ConsumerKey:string,ConsumerSecret:string,AccessToken:string,TokenSecret:string,BearerToken:string }  
export interface ILinkedInAccountData {token:string,owner:string} 
export interface IFacebookInAccountData {tokenPage?:string,longAccessToken?:string,pageID?:string, email?:string, password?:string, cookies?:string} 

export type accountDataType = 
{platform:string,
  account:IRedditAccountData|ITelegramAccountData|ITwetterAccountData|ILinkedInAccountData|IFacebookInAccountData}