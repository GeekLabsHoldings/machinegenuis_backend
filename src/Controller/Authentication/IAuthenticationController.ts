import IEmployeeModel from "../../Model/Employee/IEmployeeModel";

export default interface AuthenticationControllerInterface {
    login(email: string, password: string): Promise<string>;
    logout(employeeId: string): Promise<void>;
}