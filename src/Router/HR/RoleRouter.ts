import { Router, Request, Response } from "express";
import systemError from "../../Utils/Error/SystemError";
import IRoleModel from "../../Model/HR/Role/IRoleModel";
import RoleController from "../../Controller/HR/Role/RoleController";

const RoleRouter = Router();

RoleRouter.post("/create", async (req: Request, res: Response) => {
    try {
        const roleData: IRoleModel = {
            roleName: req.body.roleName,
            department: req.body.department
        }
        const roleController = new RoleController();
        const result = await roleController.addNewRole(roleData);
        return res.status(201).send(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

RoleRouter.get("/getAll", async (req: Request, res: Response) => {
    try {
        const roleController = new RoleController();
        const result = await roleController.getAllRoles();
        return res.status(200).send(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

RoleRouter.get("/getByDepartment/:department", async (req: Request, res: Response) => {
    try {
        const department = req.params.department;
        const roleController = new RoleController();
        const result = await roleController.getRoleByDepartment(department);
        return res.status(200).send(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

export default RoleRouter;