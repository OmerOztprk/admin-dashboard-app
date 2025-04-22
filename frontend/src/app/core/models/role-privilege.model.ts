export interface Privilege {
  key: string;
  name: string;
  group: string;
  description?: string;
}

export interface PrivilegeGroup {
  id: string;
  name: string;
}

export interface GroupedPrivilege {
  groupId: string;
  groupName: string;
  permissions: {
    key: string;
    name: string;
  }[];
}

export interface RolePrivilege {
  _id?: string;
  role_id: string;
  permission: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}
