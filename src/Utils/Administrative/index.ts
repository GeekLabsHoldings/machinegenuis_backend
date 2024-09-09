enum OfficeCleaningEnum {
    Done = 'Done',
    Missed = 'Missed',
}

enum SuppliesEnum {
    Snacks = 'Snacks',
    Drinks = 'Drinks',
    Cleaning = 'Cleaning'
}

enum QueryTypeEnum {
    Daily = 'Daily',
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    Yearly = 'Yearly'
}

enum TicketTypeEnum {
    IT = 'IT',
    SystemIssue = 'System Issue',
    Request = 'Request',
}



const OfficeCleaningEnumArray = Object.values(OfficeCleaningEnum);
const SuppliesEnumArray = Object.values(SuppliesEnum);
const queryTypeEnumArray = Object.values(QueryTypeEnum);
const ticketTypeEnumArray = Object.values(TicketTypeEnum);

export { OfficeCleaningEnumArray, SuppliesEnumArray, queryTypeEnumArray, ticketTypeEnumArray };