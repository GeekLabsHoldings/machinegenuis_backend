enum AnalyticsType {
    CLICK = 'click',
    OPEN = 'open'
}

enum UserSubscriptionClass {
    FirstClass = 'first-class',
    SecondClass = 'second-class',
    ThirdClass = 'third-class'
}
const AnalyticsTypeArray = Object.values(AnalyticsType);

export {
    AnalyticsType,
    UserSubscriptionClass,
    AnalyticsTypeArray
}