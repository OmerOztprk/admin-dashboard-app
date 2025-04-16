module.exports = {
    privGroups: [
      {
        id: "USERS",
        name: "User Permissions"
      },
      {
        id: "ROLES",
        name: "Role Permissions"
      },
      {
        id: "CATEGORIES",
        name: "Category Permissions"
      },
      {
        id: "AUDITLOGS",
        name: "AuditLogs Permissions"
      }
    ],
  
    privileges: [
      // Users
      {
        key: "user_view",
        name: "User View",
        group: "USERS",
        description: "View all users"
      },
      {
        key: "user_add",
        name: "User Add",
        group: "USERS",
        description: "Create new user"
      },
      {
        key: "user_update",
        name: "User Update",
        group: "USERS",
        description: "Update user information"
      },
      {
        key: "user_delete",
        name: "User Delete",
        group: "USERS",
        description: "Delete user"
      },
  
      // Roles
      {
        key: "role_view",
        name: "Role View",
        group: "ROLES",
        description: "View roles"
      },
      {
        key: "role_add",
        name: "Role Add",
        group: "ROLES",
        description: "Create role"
      },
      {
        key: "role_update",
        name: "Role Update",
        group: "ROLES",
        description: "Edit role"
      },
      {
        key: "role_delete",
        name: "Role Delete",
        group: "ROLES",
        description: "Delete role"
      },
  
      // Categories
      {
        key: "category_view",
        name: "Category View",
        group: "CATEGORIES",
        description: "List categories"
      },
      {
        key: "category_add",
        name: "Category Add",
        group: "CATEGORIES",
        description: "Add new category"
      },
      {
        key: "category_update",
        name: "Category Update",
        group: "CATEGORIES",
        description: "Update category"
      },
      {
        key: "category_delete",
        name: "Category Delete",
        group: "CATEGORIES",
        description: "Remove category"
      },
      {
        key: "category_export",
        name: "Category Export",
        group: "CATEGORIES",
        description: "Export categories to Excel"
      },
  
      // Audit Logs
      {
        key: "auditlogs_view",
        name: "AuditLogs View",
        group: "AUDITLOGS",
        description: "View system activity logs"
      }
    ]
  };
  