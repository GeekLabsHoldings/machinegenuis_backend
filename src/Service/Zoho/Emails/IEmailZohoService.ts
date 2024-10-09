export interface ISendEmailData {
    fromAddress: string,
    toAddress: string,
    subject: string,
    content: string
    askReceipt: string,


}

export interface IAllEmailData {
    summary: string,
    sentDateInGMT: string,
    calendarType: 0,
    subject: string,
    messageId: string,
    flagid: string,
    status2: string,
    priority: string,
    hasInline: string,
    toAddress: string,
    folderId: string,
    ccAddress: string,
    hasAttachment: string,
    size: string,
    sender: string,
    receivedTime: string,
    fromAddress: string,
    status: string
}
export interface IEmailData {
    messageId: string,
    content: string,
    header: object
}
export default interface IZohoEmailService {
    sendEmail(emailData: ISendEmailData): Promise<string>
    replayEmail(emailData: ISendEmailData, action: string, accountId: string): Promise<string>
    getAllEmails(): Promise<IAllEmailData[]>
    getEmailById(folderId: string, emailId: string): Promise<IEmailData>
    getEmailHeaders(folderId: string, messageId: string): Promise<object>

}