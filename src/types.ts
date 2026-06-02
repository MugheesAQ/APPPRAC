export interface User {
  id: string;
  email: string;
  name: string;
  role: "Citizen" | "Officer" | "Admin";
  phone?: string;
  nric?: string;
  address?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  code: string;
  name: string;
  department: string;
  description: string;
  requirements: string[];
  estimatedDays: number;
  fee: number;
  popularity: number;
}

export interface Application {
  id: string;
  serviceId: string;
  serviceName: string;
  citizenId: string;
  citizenName: string;
  status: "Submitted" | "Under Review" | "Processing" | "Approved" | "Rejected";
  formData: Record<string, any>;
  documents: { name: string; type: string; url: string }[];
  remarks: string;
  statusLogs: { status: string; date: string; remarks: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: "info" | "success" | "warning";
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  ipAddress: string;
  timestamp: string;
}

export interface AdminAnalytics {
  totalApplications: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalRegisteredCitizens: number;
  departmentDistribution: Record<string, number>;
  systemStatus: {
    serverTime: string;
    hostUptimeSeconds: number;
    databaseState: string;
    nodeVersion: string;
    redisState: {
      keysInStore: number;
      hitRatio: string;
      totalHits: number;
      cacheSystemStatus: string;
    };
  };
  auditLogs: AuditLog[];
}
