enum DepartmentEnum {
    HR = "hr",
    ContentCreator = "content-creation",
    SocialMedia = "social-media",
    Administrative = "administrative",
    Accounting = "accounting",
<<<<<<< HEAD

    CEO = "ceo",
    VideoEditing = "VideoEditing"

=======
    CEO = "CEO",
    VideoEditing = "VideoEditing",
>>>>>>> 4d6243615bfb9fe89c985b6fd55d128099415d1e
}
enum RoleEnum {
    ContentWriter = "ContentWriter",
    Payroll = "Payroll",
    CEO = "ceo",
    SocialMedia = "SocialMedia",
    Administrative = "administrative",
    VideoEditor = "VideoEditor"
}

const DepartmentRoles = {
    Departments: ["Recruiter", "Training", "Employee Relations"],
    "content-creation": ["ContentWriter"],
    ceo: ['ceo'],
    "social-media": ["SocialMedia"],
    administrative: ['administrative'],
    accounting: ['Payroll'],
    VideoEditing: ['VideoEditor'],
   
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