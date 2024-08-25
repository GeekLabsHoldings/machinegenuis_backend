import { ClientSession, UpdateWriteOpResult } from "mongoose";
import IAuthenticationService from "./IAuthenticationService";
import employeeModel from "../../Model/Employee/EmployeeModel";
import IEmployeeModel from "../../Model/Employee/IEmployeeModel";
import jwt from 'jsonwebtoken';
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import bcrypt from "bcrypt";


class AuthenticationService implements IAuthenticationService {

    createJWT(employee: IEmployeeModel): string {
        const privateKey = process.env.JWT_SECRET as string;
        const token = jwt.sign({
            _id: employee._id,
            email: employee.email,
            department: employee.department,
            role: employee.role
        }, privateKey, { expiresIn: "9h" });
        if (!token)
            return ErrorMessages.JWT_ERROR;
        return token;
    }
    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }

    async getEmployeeByEmail(email: string, session: ClientSession): Promise<IEmployeeModel | null> {
        const employee = await employeeModel.findOne({ email }).session(session).select({ password: 1, email: 1, department: 1, role: 1 });
        return employee;
    }


    async deleteToken(employeeId: string, session: ClientSession): Promise<boolean> {
        const deleteTokenStatus: UpdateWriteOpResult = await employeeModel.updateOne({ _id: employeeId }, { token: null }).session(session);
        return deleteTokenStatus.modifiedCount ? true : false;
    }

    async saveToken(employeeId: string, token: string, session: ClientSession): Promise<boolean> {
        const employee: UpdateWriteOpResult = await employeeModel.updateOne({ _id: employeeId }, { $set: { token } }).session(session);
        return employee.modifiedCount ? true : false;
    }

    async verifyToken(token: string): Promise<IEmployeeModel> {
        const privateKey = process.env.JWT_SECRET as string;
        const decodedToken = jwt.verify(token, privateKey) as IEmployeeModel;
        return decodedToken;
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
      }
}

const authenticationService = new AuthenticationService();

export default authenticationService; 