import { Types } from "mongoose";

export default interface IDomain {
    domainName: string,
    contactEmail: string,
    registerDate: Number,
    brand :Types.ObjectId|String,
    autoRenew : boolean,
    certificateID? : string,
    hostedZoneID? : string,
}