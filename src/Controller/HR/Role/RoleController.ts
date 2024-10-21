import IRoleModel from "../../../Model/HR/Role/IRoleModel";
import IRoleService from "../../../Service/HR/Role/IRoleService";
import RoleService from "../../../Service/HR/Role/RoleService";
import { IRoleController } from "./IRoleController";

class RoleController implements IRoleController {
    roleService: IRoleService;
    constructor() {
        this.roleService = new RoleService();
    }

    async addNewRole(roleData: IRoleModel) {
        const result = await this.roleService.addRole(roleData);
        return result;
    }

    async getAllRoles() {
        const result = await this.roleService.getAllRoles();
        return result;
    }

    async getRoleByDepartment(departmentId: string) {
        const result = await this.roleService.getRoleByDepartment(departmentId);
        return result;
    }
}

export default RoleController;