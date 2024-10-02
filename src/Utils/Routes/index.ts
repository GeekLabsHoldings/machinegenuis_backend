
import { DepartmentEnum } from "../DepartmentAndRoles";

enum RouterEnum {
    authentication = "authentication",
    checkAuth = "check-auth",
    logout = "logout",
    unAuthorizer = "un-authorized",
    calendly = "calendly",
    admin = "admin",
    user = "user",
    hr = DepartmentEnum.HR,
    ContentCreation = DepartmentEnum.ContentCreator,
    Administrative = DepartmentEnum.Administrative,
    socialMedia = DepartmentEnum.SocialMedia,
    Accounting = DepartmentEnum.Accounting,
    VideoEditing = DepartmentEnum.VideoEditing,
    CEO = DepartmentEnum.CEO,
<<<<<<< HEAD

=======
>>>>>>> 2ea8074ce92cf411db9e64961b0167c097e0c10c
}

export default RouterEnum;
