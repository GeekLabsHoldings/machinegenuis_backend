enum OfficeCleaningEnum {
    Done = 'Done',
    Missed = 'Missed',
    CheckList = 'CheckList'
}

enum SuppliesEnum {
    Snacks = 'Snacks',
    Drinks = 'Drinks',
    Cleaning = 'Cleaning'
}

enum SuppliesTypeEnum {
    Food = 'Food',
    Cleaning = 'Cleaning',
}

enum TicketTypeEnum {
    IT = 'IT',
    SystemIssue = 'System Issue',
    Request = 'Request',
}

enum SuppliesStatusEnum {
    CheckList = "CheckList",
    Available = "Available",
    Repurchase = "Repurchase"
}



const OfficeCleaningEnumArray = Object.values(OfficeCleaningEnum);
const SuppliesEnumArray = Object.values(SuppliesEnum);
const SuppliesTypeArr = Object.values(SuppliesTypeEnum);
const ticketTypeEnumArray = Object.values(TicketTypeEnum);
const SuppliesStatusEnumArray = Object.values(SuppliesStatusEnum);
export { OfficeCleaningEnum, SuppliesEnum, SuppliesTypeEnum, SuppliesStatusEnum, OfficeCleaningEnumArray, SuppliesEnumArray, SuppliesTypeArr, ticketTypeEnumArray, SuppliesStatusEnumArray };