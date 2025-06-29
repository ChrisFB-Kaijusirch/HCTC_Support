export interface Ticket {
  id: string;
  ticketNumber: string;
  clientId: string;
  name: string;
  email: string;
  appId: string;
  appVersion: string;
  issueType: IssueType;
  priority: Priority;
  status: TicketStatus;
  subject: string;
  description: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  replies: TicketReply[];
  internalNotes: InternalNote[];
}

export interface TicketReply {
  id: string;
  ticketId: string;
  author: string;
  authorType: 'client' | 'admin';
  message: string;
  createdAt: Date;
  attachments?: string[];
}

export interface InternalNote {
  id: string;
  ticketId: string;
  author: string;
  note: string;
  createdAt: Date;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  appId: string;
  tags: string[];
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  subscribedApps: string[];
  registrationDate: string;
  qrCode: string;
  twoFactorEnabled: boolean;
  status: 'Active' | 'Inactive' | 'Archived';
  lastActivity: string;
  totalTickets: number;
  totalFeatureRequests: number;
}

export interface App {
  id: string;
  name: string;
  version: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export interface FeatureRequest {
  id: string;
  clientId: string;
  appId: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  priority: Priority;
  upvotes: number;
  upvotedBy: string[];
  createdAt: Date;
  updatedAt: Date;
  estimatedCompletion?: Date;
  isPinned: boolean;
  adminNotes?: string;
}

export type IssueType = 
  | 'Bug Report'
  | 'Feature Request'
  | 'Login Issue'
  | 'Performance Issue'
  | 'Data Issue'
  | 'General Question'
  | 'Other';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TicketStatus = 'Open' | 'In Progress' | 'Waiting for Response' | 'Resolved' | 'Closed';

export type FeatureRequestStatus = 'Submitted' | 'Under Review' | 'Planned' | 'In Development' | 'Completed' | 'Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  clientId?: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
}

export interface TicketFilters {
  status?: TicketStatus[];
  priority?: Priority[];
  issueType?: IssueType[];
  appId?: string[];
  clientId?: string[];
  assignedTo?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ClientFilters {
  status?: ('Active' | 'Inactive' | 'Archived')[];
  subscribedApps?: string[];
  registrationDateRange?: {
    start: Date;
    end: Date;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  client: Client | null;
  loading: boolean;
}