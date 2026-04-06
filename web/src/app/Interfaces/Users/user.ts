export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  registrationDate: Date;
  avatarPath: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface UsernameRequest {
  username: string;
}


