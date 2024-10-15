import { model, Schema } from "mongoose";
const LinkedinAccountCookiesSchema = new Schema({
    cookies: Object,
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    isBusy: { type: Boolean, default: false },

});

const LinkedinAccountCookiesModel = model("LinkedinAccountCookies", LinkedinAccountCookiesSchema);

export default LinkedinAccountCookiesModel;