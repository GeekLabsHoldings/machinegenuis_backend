import axios from "axios";

class WuzzufService {
    axiosSetup: any;
    constructor(token: string) {
        this.axiosSetup = axios.create({
            baseURL: 'https://wuzzuf.net',
            headers: {
                "Content-Type": "application/vnd.api+json",
                "Authorization": "Bearer " + token
            }
        });
    }

}