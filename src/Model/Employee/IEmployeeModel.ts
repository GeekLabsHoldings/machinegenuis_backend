import { Types } from "mongoose";

export default interface IEmployeeModel {
    _id: Types.ObjectId | string,
    firstName: string,
    lastName: string,
    email: string,
    birthday: number,
    password: string,
    personalEmail: string,
    phoneNumber: string,
    type: string,
    department: Array<string>,
    role: string,
    createdAt: number,
    createdBy: Types.ObjectId | IEmployeeModel,
    token: string,
    theme: string,
    cv: string,
    linkedIn: string
}