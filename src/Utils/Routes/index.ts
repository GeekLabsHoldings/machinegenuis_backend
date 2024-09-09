import { DepartmentEnum } from "../DepartmentAndRoles";

enum RouterEnum {
  authentication = "authentication",
  checkAuth = "check-auth",
  logout = "logout",
  unAuthorizer = "un-authorized",
  calendly = "calendly",
  hr = "hr",
  admin = "admin",
  user = "user",
  ContentCreation = "content-creation",
  socialMedia = DepartmentEnum.SocialMedia,
}

export default RouterEnum;
