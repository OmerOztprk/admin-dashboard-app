export interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  is_active: boolean;
  roles: string[]; // Backend'den role_name listesi geliyor (örnek: ["ADMIN", "EDITOR"])
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}
