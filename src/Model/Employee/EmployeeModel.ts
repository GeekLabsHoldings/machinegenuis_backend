import { model, Schema } from "mongoose";
import IEmployeeModel from "./IEmployeeModel";
import { EnumStringRequired, NotRequiredString, RefType, RequiredNumber, RequiredString, RequiredUniqueString, StringValidation } from "../../Utils/Schemas";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { phoneRegex } from "../../Utils/Regex";
import { Departments } from "../../Utils/DepartmentAndRoles";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import { EmployeeType } from "../../Utils/employeeType";

const schema = new Schema<IEmployeeModel>({
    firstName: RequiredString,
    lastName: RequiredString,
    email: RequiredUniqueString,
    birthday: RequiredNumber,
    password: RequiredString,
    type: EnumStringRequired(EmployeeType),
    phoneNumber: StringValidation(phoneRegex, ErrorMessages.PHONE_NUMBER_NOT_VALID),
    createdBy: RefType(SchemaTypesReference.Employee, false),
    createdAt: RequiredNumber,
    department: [EnumStringRequired(Departments)],
    personalEmail: RequiredString,
    role: RefType(SchemaTypesReference.Role, true),
    token: NotRequiredString,
    theme: RequiredString,
    cv: RequiredString,
    linkedIn: RequiredString
});

const employeeModel = model(SchemaTypesReference.Employee, schema);
export default employeeModel;

