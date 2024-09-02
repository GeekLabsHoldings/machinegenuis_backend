enum DepartmentEnum {
    HR = "hr",
    ContentCreator = "content-creation",
    CEO = "CEO"
}

enum RoleEnum {
    ContentWriter = "ContentWriter",
    Payroll = "Payroll",
    CEO = "CEO"
}



const DepartmentRoles = {
    hr: ["Recruiter", "Payroll", "Training", "Employee Relations"],
    "content-creation": ["ContentWriter"],
    CEO: ['CEO']
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