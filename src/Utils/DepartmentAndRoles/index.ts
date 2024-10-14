enum DepartmentEnum {
    HR = "hr",
    ContentCreator = "content-creation",
    SocialMedia = "social-media",
    Administrative = "administrative",
    Accounting = "accounting",
    CEO = "ceo",
    VideoEditing = "video-editing",
    CustomerService = 'customer-service'
}
enum RoleEnum {
    ContentWriter = "ContentWriter",
    Payroll = "Payroll",
    CEO = "ceo",
    SocialMedia = "SocialMedia",
    Administrative = "administrative",
    VideoEditor = "VideoEditor",
    CustomerService = 'CustomerService'
}

const DepartmentRoles = {
    'hr': ["Recruiter", "Training", "Employee Relations"],
    "content-creation": ["ContentWriter"],
    ceo: ['ceo'],
    "social-media": ["SocialMedia"],
    administrative: ['administrative'],
    accounting: ['Payroll'],
    "video-editing": ['VideoEditor'],
    'customer-service': ['CustomerService']
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