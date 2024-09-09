enum DepartmentEnum {
    HR = "hr",
    ContentCreator = "content-creation",
    CEO = "CEO",
    SocialMedia = "social-media",
}

enum RoleEnum {
    ContentWriter = "ContentWriter",
    Payroll = "Payroll",
    CEO = "CEO",
    SocialMedia = "SocialMedia"
}



const DepartmentRoles = {
    hr: ["Recruiter", "Payroll", "Training", "Employee Relations"],
    "content-creation": ["ContentWriter"],
    CEO: ['CEO'],
    "social-media": ["SocialMedia"]
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