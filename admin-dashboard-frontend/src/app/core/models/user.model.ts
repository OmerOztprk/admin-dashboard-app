export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  permissions: string[];
  profileImage?: string;
  createdAt?: string;  // Opsiyonel
  updatedAt?: string;  // Opsiyonel
}