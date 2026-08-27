export interface AuditLogMetadata {
  params?: Record<string, any>;
  query?: Record<string, any>;
  body?: Record<string, any>;
  responseSummary?: Record<string, any>;
  error?: any;
  [key: string]: any;
}

export interface AuditLog {
  _id: string;
  eventId: string;
  userId?: string | number;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  isAdmin: boolean;
  action: string;
  module: string;
  entityType?: string;
  entityId?: string;
  description?: string;
  details?: string;
  status: "SUCCESS" | "FAILURE" | "IN_PROGRESS" | string;
  method: string;
  endpoint: string;
  statusCode?: number;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
  metadata?: AuditLogMetadata;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditLogStats {
  total: number;
  adminLogsCount: number;
  nonAdminLogsCount: number;
  successCount: number;
  failureCount: number;
  inProgressCount: number;
  averageDuration: number;
  successPercentage: number;
  failurePercentage: number;
  inProgressPercentage: number;
  moduleDistribution?: Array<{
    module: string;
    count: number;
  }>;
}

export interface AuditLogFilters {
  modules: string[];
  actions: string[];
  entityTypes: string[];
  roles: string[];
  methods: string[];
  statuses: string[];
}

export interface AuditLogFiltersResponse {
  modules: string[];
  actions: string[];
  entityTypes: string[];
  roles: string[];
  methods: string[];
  statuses: string[];
}

export interface AuditLogQueryParams {
  isAdmin?: boolean;
  search?: string;
  startDate?: string;
  endDate?: string;
  module?: string;
  action?: string;
  status?: string;
  userRole?: string;
  entityType?: string;
  method?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface AuditLogsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedAuditLogsResponse {
  data: AuditLog[];
  meta: AuditLogsMeta;
}
