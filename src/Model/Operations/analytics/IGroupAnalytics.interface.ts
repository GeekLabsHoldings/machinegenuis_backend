import { Types } from "mongoose";

export default interface IGroupAnalytics{
brand: string|Types.ObjectId,
group_id: string,
subs:number,
timestamp:number,
platform:string

}