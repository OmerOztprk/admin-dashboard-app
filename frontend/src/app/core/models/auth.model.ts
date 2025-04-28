export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface Login2FAResponse {
  step: '2fa';
  userId: string;
}

export interface VerifyCodeRequest {
  userId: string;
  code: string;
}
