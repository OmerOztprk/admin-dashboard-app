export interface AuditLog {
    _id: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
    email: string;
    location: string;
    proc_type: string;
    log: any;
    created_at: string;
    updated_at: string;
  }
  