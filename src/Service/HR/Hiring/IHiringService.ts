import { ClientSession, Types } from "mongoose";
import IHiringModel from "../../../Model/HR/Hiring/IHiringModel";

export default interface IHiringService {
    addHiringLinkedinAccount(_id: string, account_id: string, session: ClientSession): Promise<IHiringModel | null>
    createHiring(hiring: IHiringModel): Promise<IHiringModel>;
    changeHiringStep(_id: string, step: String, hiringStatus: string): Promise<IHiringModel | null>;
    getHiring(type: string, limit: number, skip: number): Promise<IHiringModel[]>;
    getOneHiring(_id: string): Promise<IHiringModel | null>
    deleteHiringRequest(_id: string): Promise<boolean>;
    addHiringLinkedinAccount(_id: string, account_id: string, session: ClientSession): Promise<IHiringModel | null>;
    getHiringByLinkedinAccount(account_id: string): Promise<(IHiringModel & { _id: Types.ObjectId | string }) | null>
    changeHiringStatus(_id: string, hiringStatus: string): Promise<IHiringModel | null>;
}