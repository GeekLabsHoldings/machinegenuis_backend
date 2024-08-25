import { ClientSession } from "mongoose";
import IEmployeeModel from "../../Model/Employee/IEmployeeModel";

export default interface IAuthenticationService {
    createJWT(employee: IEmployeeModel): string;
    getEmployeeByEmail(email: string, session: ClientSession): Promise<IEmployeeModel | null>;
    saveToken(employeeId: string, token: string, session: ClientSession): Promise<boolean>;
    deleteToken(employeeId: string, session: ClientSession): Promise<boolean>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    verifyToken(token: string): Promise<IEmployeeModel>
}