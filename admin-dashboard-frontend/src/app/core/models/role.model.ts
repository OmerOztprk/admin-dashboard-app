export interface Permission {
    id: string;
    name: string;
    description?: string;
  }
  
  export interface Role {
    id: string;
    role_name: string;
    description?: string;
    permissions?: string[] | Permission[];
    created_at?: Date;
    updated_at?: Date;
  }
  
  export enum SystemPermissions {
    USER_VIEW = 'user_view',
    USER_ADD = 'user_add',
    USER_EDIT = 'user_edit',
    USER_DELETE = 'user_delete',
    
    ROLE_VIEW = 'role_view',
    ROLE_ADD = 'role_add',
    ROLE_EDIT = 'role_edit',
    ROLE_DELETE = 'role_delete',
    
    CATEGORY_VIEW = 'category_view',
    CATEGORY_ADD = 'category_add',
    CATEGORY_EDIT = 'category_edit',
    CATEGORY_DELETE = 'category_delete',
    
    AUDITLOGS_VIEW = 'auditlogs_view'
  }
  
  export interface RoleListResponse {
    roles: Role[];
    total: number;
    page: number;
    limit: number;
  }
  
  export interface RoleCreateRequest {
    role_name: string;
    description?: string;
    permissions: string[];
  }
  
  export interface RoleUpdateRequest {
    id: string;
    role_name?: string;
    description?: string;
    permissions?: string[];
  }