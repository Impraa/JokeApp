import { Request } from "express";

export interface User {
  fName: String;
  lName: String;
  password: String | Buffer;
  confirmPassword?: String;
  email: String;
}

export interface UserRequest extends Request {
  user?: User;
}
