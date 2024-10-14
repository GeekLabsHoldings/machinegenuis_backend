export interface ICreateUserBody {
    primaryEmailAddress: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName: string;
    oneTimePassword: boolean;
    employeeId: string;
    department: string;
    designation: string;
    mobileNumber: string;
}

export interface IZohoAddUserRes {
    accountId:string,
    country:string
    policyId: {zoid: number},
    mailboxAddress:string,
    emailAddress: [
            {
                isAlias: boolean,
                isPrimary: boolean,
                mailId: string,
                isConfirmed: boolean
            }
        ],
    timeZone:string,
    phoneNumer:string,
    displayName:string,
    accountName:string

}

export default interface IUserZohoService {
    generateAccessToken(refreshAccessToken: string): Promise<string>;
    generateAccessAndRefreshToken(code: string):Promise<{access_token:string, refresh_token:string}> ;
    setAccessToken(accessToken: string): Promise<void>
    addNewUser(userData: ICreateUserBody): Promise<IZohoAddUserRes>;
}