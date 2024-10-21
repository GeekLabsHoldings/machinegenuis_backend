import IRoleModel from "../../../Model/HR/Role/IRoleModel";
import RoleModel from "../../../Model/HR/Role/RoleModel";
import IRoleService from "./IRoleService";

class RoleService implements IRoleService {
    async addRole(roleData: IRoleModel): Promise<IRoleModel> {
        const role = new RoleModel(roleData);
        const result = await role.save();
        return result;
    }

    async getRoleByDepartment(department: string): Promise<IRoleModel[]> {
        const result = await RoleModel.find({ department });
        return result;
    }

    async getAllRoles(): Promise<IRoleModel[]> {
        const result = await RoleModel.find();
        return result;
    }

}

export default RoleService;