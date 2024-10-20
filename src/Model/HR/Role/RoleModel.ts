import { Schema, model } from 'mongoose';
import IRoleModel from './IRoleModel';
import { EnumStringRequired, RequiredUniqueString } from '../../../Utils/Schemas';
import { Departments } from '../../../Utils/DepartmentAndRoles';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const RoleSchema = new Schema<IRoleModel>({
    roleName: RequiredUniqueString,
    department: EnumStringRequired(Departments)
});

const RoleModel = model<IRoleModel>(SchemaTypesReference.Role, RoleSchema);

export default RoleModel;