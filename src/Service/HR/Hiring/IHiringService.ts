import { ClientSession } from "mongoose";
import IHiringModel from "../../../Model/HR/Hiring/IHiringModel";

export default interface IHiringService {
    createHiring(hiring: IHiringModel): Promise<IHiringModel>;
    changeHiringStep(_id: string, step: String, hiringStatus: string): Promise<IHiringModel | null>;
    getHiring(type: string, limit: number, skip: number): Promise<IHiringModel[]>;
    getOneHiring(_id: string): Promise<IHiringModel | null>
    deleteHiringRequest(_id: string): Promise<boolean>;
    addHiringLinkedinAccount(_id: string, account_id: string, session: ClientSession): Promise<IHiringModel | null>;
}