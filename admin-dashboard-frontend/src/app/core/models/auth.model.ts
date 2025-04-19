export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  username?: string;
  password: string;
  first_name?: string;  // Backend'e uygun alan adları
  last_name?: string;   // Backend'e uygun alan adları
  fullName?: string;    // Frontend'de kullanım için
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    roles?: string[];
  };
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}