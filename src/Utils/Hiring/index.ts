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

enum calendlyEnum {
    FaceToFace = 'FaceToFace',
    PhoneCall = 'PhoneCall'
}

const CalendlyInterviewDuration = {
    FaceToFace: 30,
    PhoneCall: 5
}

const CalendlyInterviewStartEndHour = {
    FaceToFace: { start: 14, end: 17 },
    PhoneCall: { start: 12, end: 14 }
}

const CalendlyAllowedDays = {
    FaceToFace: 5,
    PhoneCall: 3
}



const HiringStatusLevel = Object.values(HiringStatusLevelEnum);
const statusArr = Object.values(StatusEnum);
export {
    HiringStatus, calendlyEnum, HiringStatusLevelEnum, StatusEnum,
    CalendlyInterviewDuration, HiringStatusLevel, CalendlyInterviewStartEndHour,
    statusArr, CalendlyAllowedDays
};