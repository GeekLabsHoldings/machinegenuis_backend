import { Request, Response, NextFunction } from "express";
import authenticationService from "../Service/Authentication/AuthenticationService";
import employeeService from "../Service/Employee/EmployeeService";
import { ErrorMessages } from "../Utils/Error/ErrorsEnum";
import { DepartmentEnum } from "../Utils/DepartmentAndRoles";
import { EmployeeTypeEnum } from "../Utils/employeeType";
import IEmployeeModel from "../Model/Employee/IEmployeeModel";
import systemError from "../Utils/Error/SystemError";
import RouterEnum from "../Utils/Routes";



declare module 'express' {
    export interface Request {
        currentUser?: IEmployeeModel;
    }
}

const checkAuthority = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authorizationHeader = req.headers["authorization"];
        const token = authorizationHeader && authorizationHeader.split(" ")[1];
        const result = await authenticationService.verifyToken(token as string);
        req.body.decodedToken = result;
        const employee = await employeeService.getOneEmployee(req.body.decodedToken._id);
        if (!employee || !(employee.token === token)) {
            throw ErrorMessages.USER_TOKEN_IS_INVALID
        }
        req.currentUser = employee;
        req.body.decodedToken = employee;
        if (employee.department.includes(DepartmentEnum.CEO))
            next();
        else {
            console.log(req.url);
            const knownUrl = req.url.split('/')[1]
            console.log({ knownUrl });
            const checkAuth = (() => {
                switch (knownUrl) {
                    case EmployeeTypeEnum.ADMIN:
                    case EmployeeTypeEnum.USER:
                        return checkTypeAuthority(employee.type, knownUrl);
                    case RouterEnum.checkAuth:
                    case RouterEnum.logout:
                        return true
                    default:
                        return checkDepartmentAuthority(employee.department, knownUrl);
                }
            })
            if (checkAuth())
                next();
            else
                return systemError.setStatus(401).setMessage(ErrorMessages.USER_TOKEN_IS_INVALID).throw();
        }

    } catch (error) {
        res.status(401).json({
            message: error,
        });
        return;
    }
}

const checkDepartmentAuthority = (userDepartments: string[], endpointDepartment: string): boolean => {
    return userDepartments.includes(endpointDepartment);
}

const checkTypeAuthority = (userType: string, endpointType: string): boolean => {
    return userType === endpointType;
}

export { checkAuthority };