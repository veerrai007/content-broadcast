export type Role = 'teacher' | 'principal';
export type ContentStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
}

export interface Content {
  _id: string;
  title: string;
  subject: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: User;
  status: ContentStatus;
  rejectionReason?: string | null;
  startTime: string;
  endTime: string;
  rotationDuration?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Approval {
  _id: string;
  content: string;
  reviewedBy: string;
  action: 'approved' | 'rejected';
  reason?: string | null;
  createdAt: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ContentFilters {
  status?: ContentStatus;
  search?: string;
}

export interface CreateContentPayload {
  title: string;
  subject: string;
  description?: string;
  fileUrl: string;
  startTime: string;
  endTime: string;
  rotationDuration?: number | null;
}