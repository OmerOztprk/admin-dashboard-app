export interface Role {
  _id: string;
  role_name: string;
  permissions: string[];
  is_active: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}
