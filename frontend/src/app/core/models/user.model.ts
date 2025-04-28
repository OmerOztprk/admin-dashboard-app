export interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  is_active: boolean;
  language: string;
  roles: string[];
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}
