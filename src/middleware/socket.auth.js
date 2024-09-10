import employeeModel from "../Model/Employee/EmployeeModel";
import authenticationService from "../Service/Authentication/AuthenticationService";

export const isAuthenticated = async (socket, next) => {
  try {
    console.log("from authentication: ", socket.id);
    let token =
      socket.handshake.auth.token || socket.handshake.headers.authorization;
    console.log({ token });
    if (!token) return next(new Error("Token is required!"));

    token = token.split(" ")[1];
    const decoded = await authenticationService.verifyToken(token);
    const user = await employeeModel.findById(decoded._id);
    console.log({ user });
    if (!user) return next(new Error("User not found!"));

    socket.handshake.user = user;

    return next();
  } catch (error) {
    console.log(error);
  }
};
