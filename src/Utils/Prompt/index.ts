const ReplacePrompt = (prompt: string, variables: string[]) => {
    const newPrompt = prompt.replace('[[1]]', variables.join('\n'));
    return newPrompt;
}


enum promptServiceTypeEnum {
    NewsLetterTitle = "NewsLetterTitle",
    NewsLetterSubjectLineAndOpeningLine = "NewsLetterSubjectLineAndOpeningLine"
}

enum systemPromptEnum {
    Array = "You are an assistant that always returns answers in an array format. don't start with special characters.",
    JSON = "You are an assistant that always returns answers in a JSON format. don't start with special characters.",
    HTML = "You are an assistant that always returns answers in an html format. don't start with special characters."
}
export default ReplacePrompt;
export { promptServiceTypeEnum, systemPromptEnum };