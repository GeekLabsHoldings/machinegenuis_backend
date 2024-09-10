enum DepartmentEnum {
    HR = "hr",
    ContentCreator = "content-creation",
    SocialMedia = "social-media",
    Administrative = "administrative",
    CEO = "CEO"
}

enum RoleEnum {
    ContentWriter = "ContentWriter",
    Payroll = "Payroll",
    CEO = "CEO",
    SocialMedia = "SocialMedia",
    Administrative = "administrative",
}



const DepartmentRoles = {
    Departments: ["Recruiter", "Payroll", "Training", "Employee Relations"],
    "content-creation": ["ContentWriter"],
    CEO: ['CEO'],
    "social-media": ["SocialMedia"],
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