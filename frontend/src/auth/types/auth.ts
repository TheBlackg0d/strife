export interface Account {
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  account: Account;
}

export interface LoginCredential {
  email: string;
  password: string;
}

export interface RegisterCredential {
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
}
