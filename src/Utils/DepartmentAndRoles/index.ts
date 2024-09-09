enum DepartmentEnum {
    HR = "hr",
    ContentCreator = "content-creation",
    Administrative = "administrative",
    CEO = "CEO"
}

enum RoleEnum {
    ContentWriter = "ContentWriter",
    Payroll = "Payroll",
    Administrative = "administrative",
    CEO = "CEO"
}



const DepartmentRoles = {
    Departments: ["Recruiter", "Payroll", "Training", "Employee Relations"],
    "content-creation": ["ContentWriter"],
    CEO: ['CEO'],
    administrative: ['administrative'],
} as const;

const Departments = Object.keys(DepartmentRoles)
const Roles = Object.keys(RoleEnum);

type DepartmentType = keyof typeof DepartmentRoles;
type RoleType = typeof DepartmentRoles[DepartmentType][number];

export {
    Departments,
    DepartmentRoles,
    Roles,
    RoleEnum,
    DepartmentType,
    RoleType,
    DepartmentEnum
}