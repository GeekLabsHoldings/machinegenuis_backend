enum HiringStatus {
    ALL = 'All',
    REQUEST = 'Request',
    OPENING = 'Opening',
    COMPLETE = 'Complete'
}

enum HiringStatusLevelEnum {
    START_HIRING = 'Start Hiring',
    COMPLETE = "Complete",
    CONTINUE = "Continue"
}

enum StatusEnum {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected'
}



const HiringStatusLevel = Object.values(HiringStatusLevelEnum);
const statusArr = Object.values(StatusEnum);
export { HiringStatus, HiringStatusLevel, HiringStatusLevelEnum, StatusEnum, statusArr };