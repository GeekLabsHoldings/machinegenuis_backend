enum DepartmentEnum {
    HR = "hr",
    ContentCreator = "content-creation",
    SocialMedia = "social-media",
    Administrative = "administrative",
    Accounting = "accounting",
    CEO = "CEO",
    VideoEditing = "VideoEditing"
}

enum RoleEnum {
    ContentWriter = "ContentWriter",
    Payroll = "Payroll",
    CEO = "CEO",
    SocialMedia = "SocialMedia",
    Administrative = "administrative",
}



const DepartmentRoles = {
    Departments: ["Recruiter", "Training", "Employee Relations"],
    "content-creation": ["ContentWriter"],
    CEO: ['CEO'],
    "social-media": ["SocialMedia"],
    administrative: ['administrative'],
    accounting: ['Payroll']
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