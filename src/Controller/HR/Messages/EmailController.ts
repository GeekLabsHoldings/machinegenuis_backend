import { ClientSession } from "mongoose";
import candidateService from "../../../Service/HR/Candidate/CandidateService";
import EmailService, { MailOptions } from "../../../Service/HR/Template/Message/EmailService";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import systemError from "../../../Utils/Error/SystemError";
import CandidateController from "../Candidate/CandidateController";
import SuccessMessage from "../../../Utils/SuccessMessages";

export default class EmailController {
    session: ClientSession
    constructor(session: ClientSession) {
        this.session = session;
    }
    async sendCandidateMessage(candidate_id: string, subject: string, emailContent: string): Promise<string> {
        const candidate = await candidateService.getCandidate(candidate_id, this.session);
        if (!candidate)
            return systemError.setStatus(404).setMessage(ErrorMessages.CANDIDATE_NOT_FOUND).throw();
        const candidateController = new CandidateController();
        await candidateController.changeMessageStatus(candidate_id, candidate, this.session);
        const { email } = candidate;
        return await this.sendEmail(email, subject, emailContent);
    }
    async sendEmail(email: string, subject: string, html: string): Promise<string> {
        const emailDetails: MailOptions = {
            to: email,
            subject,
            html
        }
        const emailService = new EmailService();
        await emailService.sendEmail(emailDetails);
        return SuccessMessage.MESSAGE_SENDED;
    }
}