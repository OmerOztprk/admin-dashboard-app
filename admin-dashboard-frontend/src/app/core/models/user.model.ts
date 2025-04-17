import { Role } from './role.model';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  roles?: string[] | Role[];
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  last_login?: Date;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  password?: string;
  current_password?: string;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  roles?: string[];
  is_active?: boolean;
}

export interface UserUpdateRequest {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  roles?: string[];
  is_active?: boolean;
}