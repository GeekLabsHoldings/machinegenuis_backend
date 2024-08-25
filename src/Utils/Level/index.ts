enum UrgencyLevelEnum {
    LOW = "LOW",
    MID = "MID",
    HIGH = "HIGH"
}

const UrgencyLevel = Object.values(UrgencyLevelEnum);

enum LevelEnum {
    FRESH = "FreshGraduation",
    JUNIOR = "Junior",
    MID = "Mid-level",
    SENIOR = "Senior",
    EXPERT = "Expert"
}

const JobLevel = Object.values(LevelEnum);
export {
    UrgencyLevelEnum,
    UrgencyLevel,
    JobLevel,
    LevelEnum
}