import { User } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TokenPayload {
  sub: string; // user id
  email: string;
  roles: string[];
  permissions?: string[];
  iat: number; // issued at
  exp: number; // expiration time
}

export interface RefreshTokenResponse {
  token: string;
  user?: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}