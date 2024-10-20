import IRoleModel from "../../../Model/HR/Role/IRoleModel";

export default interface IRoleService {
    addRole(roleData: IRoleModel): Promise<IRoleModel>;
    getRoleByDepartment(department: string): Promise<IRoleModel[]>;
    getAllRoles(): Promise<IRoleModel[]>;
}