module.exports = {
  privGroups: [
    { id: "USERS", name: "User Permissions" },
    { id: "ROLES", name: "Role Permissions" },
    { id: "CATEGORIES", name: "Category Permissions" },
    { id: "AUDITLOGS", name: "AuditLogs Permissions" },
    { id: "CUSTOMERS", name: "Customer Permissions" },
    { id: "STATS", name: "Statistics Permissions" },
    { id: "AIFLOW", name: "AIFlow Permissions" },
  ],

  privileges: [
    // Users
    { key: "user_view", name: "User View", group: "USERS", description: "View all users" },
    { key: "user_add", name: "User Add", group: "USERS", description: "Create new user" },
    { key: "user_update", name: "User Update", group: "USERS", description: "Update user information" },
    { key: "user_delete", name: "User Delete", group: "USERS", description: "Delete user" },

    // Roles
    { key: "role_view", name: "Role View", group: "ROLES", description: "View roles" },
    { key: "role_add", name: "Role Add", group: "ROLES", description: "Create role" },
    { key: "role_update", name: "Role Update", group: "ROLES", description: "Edit role" },
    { key: "role_delete", name: "Role Delete", group: "ROLES", description: "Delete role" },

    // Categories
    { key: "category_view", name: "Category View", group: "CATEGORIES", description: "List categories" },
    { key: "category_add", name: "Category Add", group: "CATEGORIES", description: "Add new category" },
    { key: "category_update", name: "Category Update", group: "CATEGORIES", description: "Update category" },
    { key: "category_delete", name: "Category Delete", group: "CATEGORIES", description: "Remove category" },
    { key: "category_export", name: "Category Export", group: "CATEGORIES", description: "Export categories to Excel" },

    // Audit Logs
    { key: "auditlogs_view", name: "AuditLogs View", group: "AUDITLOGS", description: "View system activity logs" },

    // Customers
    { key: "customer_view", name: "Customer View", group: "CUSTOMERS", description: "View all customers" },
    { key: "customer_add", name: "Customer Add", group: "CUSTOMERS", description: "Add new customer" },
    { key: "customer_update", name: "Customer Update", group: "CUSTOMERS", description: "Update customer information" },
    { key: "customer_delete", name: "Customer Delete", group: "CUSTOMERS", description: "Delete customer" },

    // Stats
    { key: "stats_view", name: "Statistics View", group: "STATS", description: "View platform statistics" },

    // AIFlow
    { key: "aiflow_chat", name: "AIFlow Chat", group: "AIFLOW", description: "Interact with AI chatbot" },
  ]
};
