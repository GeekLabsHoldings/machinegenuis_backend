import { Request, Response, NextFunction } from "express";
import authenticationService from "../Service/Authentication/AuthenticationService";
import employeeService from "../Service/Employee/EmployeeService";
import { ErrorMessages } from "../Utils/Error/ErrorsEnum";
import { DepartmentEnum } from "../Utils/DepartmentAndRoles";
import { EmployeeTypeEnum } from "../Utils/employeeType";

const checkEmployeeAuthority = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authorizationHeader = req.headers["authorization"];
        const token = authorizationHeader && authorizationHeader.split(" ")[1];
        const result = await authenticationService.verifyToken(token as string);
        req.body.decodedToken = result;
        const employee = await employeeService.getOneEmployee(req.body.decodedToken._id);
        if (!employee || !(employee.token === token)) {
            throw ErrorMessages.USER_TOKEN_IS_INVALID
        }
        req.body.decodedToken = employee;
        next();
    } catch (err) {
        res.status(401).json({
            message: err,
        });
        return;
    }
};



const check_HR_Authority = async (
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
        req.body.decodedToken = employee;
        if (!employee || !(employee.token === token)) {
            throw ErrorMessages.USER_TOKEN_IS_INVALID
        }
        if (employee.department[0] === DepartmentEnum.CEO)
            return next();
        if (!employee.department.includes((DepartmentEnum.HR)))
            throw ErrorMessages.USER_TOKEN_IS_INVALID
        return next();
    } catch (err) {
        res.status(401).json({
            message: err,
        });
        return;
    }
}


const checkAdminAuthority = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authorizationHeader = req.headers["authorization"];
        const token = authorizationHeader && authorizationHeader.split(" ")[1];
        const result = await authenticationService.verifyToken(token as string);
        req.body.decodedToken = result;
        const employee = await employeeService.getOneEmployee(req.body.decodedToken._id);
        req.body.decodedToken = employee;
        if (!employee || !(employee.token === token)) {
            throw ErrorMessages.USER_TOKEN_IS_INVALID
        }
        if (employee.department[0] === DepartmentEnum.CEO)
            return next();
        if (!(employee.type === EmployeeTypeEnum.ADMIN))
            throw ErrorMessages.USER_TOKEN_IS_INVALID
        next();
    } catch (err) {
        res.status(401).json({
            message: err,
        });
        return;
    }
};

export { checkEmployeeAuthority, check_HR_Authority, checkAdminAuthority };