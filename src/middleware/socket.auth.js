import employeeModel from "../Model/Employee/EmployeeModel";
import authenticationService from "../Service/Authentication/AuthenticationService";

export const isAuthenticated = async (socket, next) => {
  try {
    console.log("from authentication: ", socket.id);
    let token =
      socket.handshake.auth.token || socket.handshake.headers.authorization;

    if (!token) {
      socket.emit("checkAuth", "Authentication failed: Token is required!");
      return next(new Error("Authentication failed: Token is required!"));
    }

    token = token.split(" ")[1];
    const decoded = await authenticationService.verifyToken(token);
    const user = await employeeModel.findById(decoded._id);
    if (!user || !(user.token === token)) {
      socket.emit(
        "checkAuth",
        "Authentication failed: Invalid token or user not found!"
      );
      return next(
        new Error("Authentication failed: Invalid token or user not found!")
      );
    }

    socket.handshake.user = user;
    return next();
  } catch (error) {
    socket.emit("checkAuth", "Authentication failed");
    return next(new Error("Authentication failed"));
  }
};
