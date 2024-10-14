import { model, Schema } from "mongoose";
import ILinkedinAccountCookiesModel from "./ILinkedinAccountCookiesModel";
const LinkedinAccountCookiesSchema = new Schema<ILinkedinAccountCookiesModel>({
    cookies: Object,
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    isBusy: { type: Boolean, default: false },

});

const LinkedinAccountCookiesModel = model<ILinkedinAccountCookiesModel>("LinkedinAccountCookies", LinkedinAccountCookiesSchema);

export default LinkedinAccountCookiesModel;