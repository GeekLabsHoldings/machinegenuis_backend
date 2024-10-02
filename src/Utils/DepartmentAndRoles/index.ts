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
>>>>>>> 2ea8074ce92cf411db9e64961b0167c097e0c10c
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