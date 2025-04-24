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

/** 2FA adımı gerekiyorsa AuthService.login() bunu döndürür */
export interface Login2FAResponse {
  step: '2fa';
  userId: string;
}

/** Back-end’den kod doğrulamak için gönderilen istek */
export interface VerifyCodeRequest {
  userId: string;
  code: string;
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