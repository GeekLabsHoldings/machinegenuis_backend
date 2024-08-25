enum EmployeeTypeEnum {
    ADMIN = "admin",
    USER = "user"
}

const EmployeeType = Object.values(EmployeeTypeEnum);

export { EmployeeType, EmployeeTypeEnum }