export interface NavItemInter {
  path: string;
  text: string;
}

export interface User {
  fName?: String;
  lName?: String;
  password?: String;
  confirmPassword?: String;
  email?: String;
}

export interface flashMsg {
  state: Boolean;
  message: String;
}
