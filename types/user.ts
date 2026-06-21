export interface User {
  email: string;
  username: string;
  avatar: string;
}

export type RegisterUser = {
  email: string;
  password: string;
};