export interface Customer {
    _id: string;
    name: string;
    slug: string;
    custom_Prompt?: string;
    email?: string;
    phone?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
  }
  