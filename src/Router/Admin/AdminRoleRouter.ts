import { Router, Request, Response } from "express";
import systemError from "../../Utils/Error/SystemError";
import RoleController from "../../Controller/HR/Role/RoleController";

const AdminRoleRouter = Router();


AdminRoleRouter.get("/getByDepartment", async (req: Request, res: Response) => {
    try {
        const department = req.query.department as string || req.body.currentUser.department[0];
        const roleController = new RoleController();
        const result = await roleController.getRoleByDepartment(department);
        return res.status(200).send(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

export default AdminRoleRouter;