export interface Role {
    _id: string;
    role_name: string;
    is_active: boolean;
    created_by?: string; // user ID
    created_at?: string;
    updated_at?: string;
  }
  