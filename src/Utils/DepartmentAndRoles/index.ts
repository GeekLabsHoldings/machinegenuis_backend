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
    ReactNative = 'React Native'
}

const DepartmentRoles = {
    'hr': ["Recruiter", "Training", "Employee Relations"],
    "content-creation": ["Content Writer"],
    ceo: ['CEO'],
    "social-media": ["Social Media"],
    administrative: ['Administrative'],
    accounting: ['Payroll'],
    "video-editing": ['Video Editor'],
    'customer-service': ['Customer Service'],
    development: ['Back End Php', 'Back End .Net', 'Mean Stack', 'DevOps', 'Front End', 'React Native'],
} as const;

const Departments = Object.keys(DepartmentRoles)
const Roles = Object.values(RoleEnum);

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