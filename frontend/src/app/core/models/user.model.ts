// src/app/core/models/user.model.ts
export interface User {
    id?: string;
    email: string;
    password?: string;   // opsiyonel
    first_name?: string;
    last_name?: string;
    roles?: string[];    // veya permissions?: string[];
    // Diğer alanlar...
  }
  