export interface Category {
    _id: string;
    name: string;
    description?: string;
    parent_id?: string;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
    created_by?: string;
    updated_by?: string;
  }