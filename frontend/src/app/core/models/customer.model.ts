export interface Customer {
  _id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  customPrompt?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
