import { Types } from "mongoose";
import IEmployeeModel from "../../Employee/IEmployeeModel";

export default interface IEmployeePaperModel {
    contractUrl: string,
    graduationCertificateUrl: string,
    militaryUrl: string,
    IdScanUrl: string,
    criminalRecordUrl: string,
    insuranceUrl: string,
    startDate: number,
    endDate: number,
    employee: Types.ObjectId | IEmployeeModel
}