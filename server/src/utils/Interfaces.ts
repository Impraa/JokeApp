export interface User {
  fName: String;
  lName: String;
  password: String | Buffer;
  confirmPassword?: String;
  email: String;
}
