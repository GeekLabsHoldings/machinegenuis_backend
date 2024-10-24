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
export interface IFacebookInAccountData {tokenPage?:string,longAccessToken?:string, pageID?:string, client_id?:string, client_secret?:string,  email?:string, password?:string, cookies?:string} 
export interface IYoutubeAccountData {client_id:string, client_secret:string, redirect_uris:string,
  tokenY?:{
  access_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}} 

export type accountDataType = 
{platform:string,
  account:IRedditAccountData|ITelegramAccountData|ITwetterAccountData|ILinkedInAccountData|IFacebookInAccountData|IYoutubeAccountData}