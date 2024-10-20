import IRoleModel from "../../../Model/HR/Role/IRoleModel";

export interface IRoleController {
    addNewRole(roleData: IRoleModel): Promise<IRoleModel>;
    getAllRoles(): Promise<IRoleModel[]>;
    getRoleByDepartment(departmentId: string): Promise<IRoleModel[]>;
}