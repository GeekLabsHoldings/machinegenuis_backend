enum DepartmentEnum {
    HR = "hr",
    ContentCreator = "content-creation",
    SocialMedia = "social-media",
    Administrative = "administrative",
    Accounting = "accounting",
    CEO = "ceo",
    VideoEditing = "video-editing",
    CustomerService = 'customer-service',
    Development = 'development',
}
enum RoleEnum {
    ContentWriter = "Content Writer",
    Payroll = "Payroll",
    CEO = "CEO",
    SocialMedia = "Social Media",
    Administrative = "Administrative",
    VideoEditor = "Video Editor",
    CustomerService = 'Customer Service',
    BackEndPhp = 'Back End PHP',
    BackEndDotNet = 'Back End .NET',
    MeanStack = 'MEAN Stack',
    DevOps = 'DevOps',
    FrontEnd = 'Front End',
}

const DepartmentRoles = {
    'hr': ["Recruiter", "Training", "Employee Relations"],
    "content-creation": ["ContentWriter"],
    ceo: ['ceo'],
    "social-media": ["SocialMedia"],
    administrative: ['administrative'],
    accounting: ['Payroll'],
    "video-editing": ['VideoEditor'],
    'customer-service': ['CustomerService'],
    development: ['Back End Php', 'Back End .Net', 'Mean Stack', 'DevOps', 'Front End'],
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