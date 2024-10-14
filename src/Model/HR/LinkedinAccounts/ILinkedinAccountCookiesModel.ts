import { Cookie } from "puppeteer";

export default interface ILinkedinAccountCookiesModel {
    cookies: Cookie[];
    email: string;
    password: string;
    isBusy: boolean;
}