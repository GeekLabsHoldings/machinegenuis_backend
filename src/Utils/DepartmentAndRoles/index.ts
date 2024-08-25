enum DepartmentEnum {
    Development = "Development",
    Graphic = "Graphic",
    HR = "HR",
    ContentCreator = "ContentCreator",
    CEO = "CEO"
}

enum RoleEnum {
    Backend = "Backend",
    Frontend = "Frontend",
    Full_Stack = "Full_Stack",
    ContentWriter = "ContentWriter",
    Payroll = "Payroll",
    CEO = "CEO"
}



const DepartmentRoles = {
    Development: ["Backend", "Frontend", "Full-stack"],
    Graphic: ["Video-editor", "photoShop"],
    HR: ["Recruiter", "Payroll", "Training", "Employee Relations"],
    ContentCreator: ["Video-editor", "photoShop"],
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