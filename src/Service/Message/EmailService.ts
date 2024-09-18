import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import systemError from '../../Utils/Error/SystemError';
import { ErrorMessages } from '../../Utils/Error/ErrorsEnum';
export interface MailOptions {
    to: string;
    subject: string;
    html: string;
}
export default class EmailService {
    transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    email: string
    constructor() {
        this.email = (process.env.EMAIL_ACCOUNT) as string;
        const pass = (process.env.EMAIL_PASS) as string;
        const host = (process.env.EMAIL_HOST) as string;
        const port = parseInt(process.env.EMAIL_PORT as string) || 465;
        this.transporter = nodemailer.createTransport({
            host: host,
            port,
            secure: true,
            auth: {
                user: this.email,
                pass: pass
            }
        })
    }

    async sendEmail(options: MailOptions): Promise<void> {
        try {
            const { to, subject, html } = options;
            await this.transporter.sendMail({
                from: this.email,
                to,
                subject,
                html
            });
        } catch (error) {
            return systemError.setStatus(402).setMessage(ErrorMessages.CAN_NOT_SEND_EMAIL).setData({ error }).throw();
        }
    }

}
