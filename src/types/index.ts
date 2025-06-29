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
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  attachments?: string[];
}

export interface InternalNote {
  id: string;
  ticketId: string;
  author: string;
  note: string;
  createdAt: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  appId: string;
  appName: string;
  tags: string[];
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
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
  qrCodeData: QRCodeData;
  twoFactorEnabled: boolean;
  status: 'Active' | 'Inactive' | 'Archived';
  lastActivity: string;
  totalTickets: number;
  totalFeatureRequests: number;
  billingInfo?: BillingInfo;
  primaryUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface App {
  id: string;
  name: string;
  version: string;
  description: string;
  isActive: boolean;
  createdAt: string;
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
  createdAt: string;
  updatedAt: string;
  estimatedCompletion?: string;
  isPinned: boolean;
  adminNotes?: string;
}

export interface User {
  id: string;
  clientId: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: UserPermission[];
  isActive: boolean;
  isPrimary: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

export interface QRCodeData {
  clientId: string;
  companyName: string;
  contactName: string;
  email: string;
  qrCode: string;
  generatedAt: string;
  expiresAt?: string;
  isValid: boolean;
}

export interface BillingInfo {
  plan: 'Basic' | 'Professional' | 'Enterprise';
  monthlyRate: number;
  currency: 'USD' | 'EUR' | 'GBP';
  billingCycle: 'monthly' | 'quarterly' | 'annually';
  nextBillingDate: string;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'invoice';
  billingAddress: Address;
  taxId?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  paymentTerms: string;
  notes?: string;
  paidDate?: string;
  createdBy: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  appId?: string;
}

// Content Management Types
export interface RecentUpdate {
  id: string;
  title: string;
  description: string;
  type: 'update' | 'maintenance' | 'content' | 'feature';
  date: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PopularTopic {
  id: string;
  title: string;
  articleId: string;
  views: number;
  isActive: boolean;
  order: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
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

export type UserRole = 'primary' | 'admin' | 'user' | 'viewer';

export type UserPermission = 
  | 'tickets.create'
  | 'tickets.view'
  | 'tickets.manage'
  | 'users.create'
  | 'users.view'
  | 'users.manage'
  | 'billing.view'
  | 'billing.manage'
  | 'features.create'
  | 'features.view'
  | 'features.vote';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  client: Client | null;
  loading: boolean;
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