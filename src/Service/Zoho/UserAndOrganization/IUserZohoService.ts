export interface ICreateUserBody {
    primaryEmailAddress: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName: string;
    oneTimePassword: boolean;
    employeeId: string;
    department: string;
    designation: string;
    mobileNumber: string;
}
export default interface IUserZohoService {
    generateAccessToken(refreshAccessToken: string): Promise<void>;
    addNewUser(userData:ICreateUserBody): Promise<ICreateUserBody>;
}