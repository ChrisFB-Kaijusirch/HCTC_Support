import { Ticket, KnowledgeBaseArticle, User, TicketReply, InternalNote, Client, App, FeatureRequest } from '../types';

export const mockApps: App[] = [
  {
    id: '1',
    name: 'Portfolio Manager',
    version: '2.1.0',
    description: 'Advanced portfolio management and tracking system',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Analytics Dashboard',
    version: '1.5.2',
    description: 'Comprehensive analytics and reporting platform',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Task Manager',
    version: '3.0.1',
    description: 'Project and task management solution',
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '4',
    name: 'Financial Tracker',
    version: '1.2.0',
    description: 'Personal and business financial tracking',
    isActive: true,
    createdAt: new Date('2024-02-15'),
  },
];

export const mockClients: Client[] = [
  {
    id: '1',
    companyName: 'TechCorp Solutions',
    contactName: 'John Doe',
    email: 'john@techcorp.com',
    phone: '+1 (555) 123-4567',
    subscribedApps: ['1', '2'],
    registrationDate: new Date('2024-01-15'),
    qrCode: 'QR_TECHCORP_001',
    twoFactorEnabled: true,
    status: 'Active',
    lastActivity: new Date('2024-12-20'),
    totalTickets: 5,
    totalFeatureRequests: 2,
  },
  {
    id: '2',
    companyName: 'StartupHub Inc',
    contactName: 'Sarah Smith',
    email: 'sarah@startuphub.com',
    phone: '+1 (555) 234-5678',
    subscribedApps: ['2', '3'],
    registrationDate: new Date('2024-02-01'),
    qrCode: 'QR_STARTUPHUB_002',
    twoFactorEnabled: false,
    status: 'Active',
    lastActivity: new Date('2024-12-19'),
    totalTickets: 3,
    totalFeatureRequests: 1,
  },
  {
    id: '3',
    companyName: 'Enterprise Dynamics',
    contactName: 'Mike Johnson',
    email: 'mike@enterprise.com',
    phone: '+1 (555) 345-6789',
    subscribedApps: ['1', '3', '4'],
    registrationDate: new Date('2024-03-01'),
    qrCode: 'QR_ENTERPRISE_003',
    twoFactorEnabled: true,
    status: 'Active',
    lastActivity: new Date('2024-12-18'),
    totalTickets: 8,
    totalFeatureRequests: 4,
  },
];

export const mockFeatureRequests: FeatureRequest[] = [
  {
    id: '1',
    clientId: '1',
    appId: '2',
    title: 'Export data to Excel functionality',
    description: 'It would be great to have an option to export the analytics data to Excel format for further analysis and reporting.',
    status: 'In Development',
    priority: 'Medium',
    upvotes: 8,
    upvotedBy: ['1', '2', '3'],
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15'),
    estimatedCompletion: new Date('2025-01-15'),
    isPinned: true,
    adminNotes: 'High demand feature, prioritized for next release',
  },
  {
    id: '2',
    clientId: '2',
    appId: '1',
    title: 'Dark mode theme',
    description: 'Add a dark mode option for better user experience during night time usage.',
    status: 'Planned',
    priority: 'Low',
    upvotes: 12,
    upvotedBy: ['1', '2', '3'],
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-10'),
    isPinned: false,
  },
  {
    id: '3',
    clientId: '3',
    appId: '3',
    title: 'Mobile app version',
    description: 'Develop a mobile application for iOS and Android to access task management on the go.',
    status: 'Under Review',
    priority: 'High',
    upvotes: 15,
    upvotedBy: ['1', '2', '3'],
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-12-05'),
    isPinned: true,
    adminNotes: 'Requires significant development resources, evaluating feasibility',
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@holdingsctc.com',
    role: 'admin',
    twoFactorEnabled: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@techcorp.com',
    role: 'client',
    clientId: '1',
    twoFactorEnabled: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Sarah Smith',
    email: 'sarah@startuphub.com',
    role: 'client',
    clientId: '2',
    twoFactorEnabled: false,
    createdAt: new Date('2024-02-01'),
  },
];

export const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'HTC-2024-001',
    clientId: '1',
    name: 'John Doe',
    email: 'john@techcorp.com',
    appId: '1',
    appVersion: '2.1.0',
    issueType: 'Bug Report',
    priority: 'High',
    status: 'Open',
    subject: 'Unable to save portfolio changes',
    description: 'When I try to save changes to my portfolio, the application shows a loading spinner but never completes the save operation. This has been happening for the past 2 days.',
    createdAt: new Date('2024-12-20T10:30:00'),
    updatedAt: new Date('2024-12-20T10:30:00'),
    replies: [],
    internalNotes: [],
  },
  {
    id: '2',
    ticketNumber: 'HTC-2024-002',
    clientId: '2',
    name: 'Sarah Smith',
    email: 'sarah@startuphub.com',
    appId: '2',
    appVersion: '1.5.2',
    issueType: 'Feature Request',
    priority: 'Medium',
    status: 'In Progress',
    subject: 'Export data to Excel functionality',
    description: 'It would be great to have an option to export the analytics data to Excel format for further analysis and reporting.',
    createdAt: new Date('2024-12-19T14:15:00'),
    updatedAt: new Date('2024-12-20T09:00:00'),
    assignedTo: 'Admin User',
    replies: [
      {
        id: '1',
        ticketId: '2',
        author: 'Admin User',
        authorType: 'admin',
        message: 'Thank you for the suggestion! We are currently working on implementing Excel export functionality. This feature is planned for the next release.',
        createdAt: new Date('2024-12-20T09:00:00'),
      },
    ],
    internalNotes: [
      {
        id: '1',
        ticketId: '2',
        author: 'Admin User',
        note: 'Feature already in development pipeline. ETA: 2 weeks.',
        createdAt: new Date('2024-12-20T09:05:00'),
      },
    ],
  },
  {
    id: '3',
    ticketNumber: 'HTC-2024-003',
    clientId: '3',
    name: 'Mike Johnson',
    email: 'mike@enterprise.com',
    appId: '3',
    appVersion: '3.0.1',
    issueType: 'Login Issue',
    priority: 'Urgent',
    status: 'Resolved',
    subject: 'Cannot access account after password reset',
    description: 'I reset my password yesterday but still cannot log into my account. The system says my credentials are invalid.',
    createdAt: new Date('2024-12-18T16:45:00'),
    updatedAt: new Date('2024-12-19T11:30:00'),
    assignedTo: 'Admin User',
    replies: [
      {
        id: '2',
        ticketId: '3',
        author: 'Admin User',
        authorType: 'admin',
        message: 'I have reset your account and sent you a new temporary password. Please check your email and try logging in again.',
        createdAt: new Date('2024-12-19T11:30:00'),
      },
      {
        id: '3',
        ticketId: '3',
        author: 'Mike Johnson',
        authorType: 'client',
        message: 'Perfect! I can now access my account. Thank you for the quick resolution.',
        createdAt: new Date('2024-12-19T12:15:00'),
      },
    ],
    internalNotes: [],
  },
];

export const mockKnowledgeBase: KnowledgeBaseArticle[] = [
  {
    id: '1',
    title: 'How to Reset Your Password',
    content: `# How to Reset Your Password

If you've forgotten your password or need to reset it for security reasons, follow these simple steps:

## Step 1: Navigate to Login Page
Go to the login page of your application and click on "Forgot Password?"

## Step 2: Enter Your Email
Enter the email address associated with your account and click "Send Reset Link"

## Step 3: Check Your Email
You'll receive an email with a password reset link within 5 minutes. Check your spam folder if you don't see it.

## Step 4: Create New Password
Click the link in the email and create a new secure password. Make sure it's at least 8 characters long and includes numbers and special characters.

## Still Having Issues?
If you continue to experience problems, please submit a support ticket and we'll help you resolve the issue quickly.`,
    category: 'Account Management',
    appId: '0',
    tags: ['password', 'login', 'account', 'security'],
    views: 245,
    helpful: 32,
    notHelpful: 3,
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-01'),
    published: true,
  },
  {
    id: '2',
    title: 'Portfolio Manager: Adding New Assets',
    content: `# Adding New Assets to Your Portfolio

Learn how to add and manage assets in Portfolio Manager.

## Adding Individual Assets

1. Navigate to the "Assets" section in your dashboard
2. Click the "Add Asset" button
3. Fill in the required information:
   - Asset name
   - Asset type (Stock, Bond, Crypto, etc.)
   - Purchase price
   - Quantity
   - Purchase date

## Bulk Import Assets

For adding multiple assets at once:

1. Download the CSV template from the "Import" section
2. Fill in your asset data following the template format
3. Upload the completed CSV file
4. Review and confirm the import

## Asset Categories

Portfolio Manager supports these asset types:
- Stocks
- Bonds
- Mutual Funds
- ETFs
- Cryptocurrencies
- Real Estate
- Commodities

## Tips for Better Organization

- Use consistent naming conventions
- Add tags to group related assets
- Set up automatic price updates for supported assets
- Regular review and rebalancing`,
    category: 'Portfolio Management',
    appId: '1',
    tags: ['assets', 'portfolio', 'stocks', 'investment'],
    views: 189,
    helpful: 28,
    notHelpful: 2,
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-12-05'),
    published: true,
  },
  {
    id: '3',
    title: 'Analytics Dashboard: Understanding Your Reports',
    content: `# Understanding Your Analytics Reports

Get the most out of your Analytics Dashboard with this comprehensive guide.

## Key Metrics Overview

### Performance Indicators
- **Total Return**: Overall performance of your investments
- **Risk Score**: Calculated risk level of your portfolio
- **Diversification Index**: How well-diversified your portfolio is

### Time-based Analysis
- Daily, weekly, monthly, and yearly performance views
- Comparison with market benchmarks
- Historical trend analysis

## Customizing Your Dashboard

### Widget Configuration
1. Click the "Customize" button in the top right
2. Drag and drop widgets to rearrange
3. Resize widgets by dragging corners
4. Add or remove widgets using the widget library

### Setting Up Alerts
- Performance thresholds
- Risk level changes
- Market condition alerts
- Rebalancing recommendations

## Exporting Data

Currently supported formats:
- PDF reports
- CSV data export
- Image exports for presentations

*Note: Excel export functionality is coming soon!*

## Advanced Features

### Custom Calculations
Create your own metrics using our formula builder

### Comparative Analysis
Compare your portfolio against:
- Market indices
- Peer portfolios
- Custom benchmarks`,
    category: 'Analytics',
    appId: '2',
    tags: ['analytics', 'reports', 'dashboard', 'metrics'],
    views: 156,
    helpful: 22,
    notHelpful: 1,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-10'),
    published: true,
  },
];

// Utility functions for mock data
export const generateTicketNumber = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `HTC-${year}-${randomNum}`;
};

export const generateQRCode = (clientId: string): string => {
  return `QR_${clientId}_${Date.now()}`;
};

export const getTicketById = (id: string): Ticket | undefined => {
  return mockTickets.find(ticket => ticket.id === id);
};

export const getTicketByNumber = (ticketNumber: string): Ticket | undefined => {
  return mockTickets.find(ticket => ticket.ticketNumber === ticketNumber);
};

export const getClientById = (id: string): Client | undefined => {
  return mockClients.find(client => client.id === id);
};

export const getClientByEmail = (email: string): Client | undefined => {
  return mockClients.find(client => client.email.toLowerCase() === email.toLowerCase());
};

export const getAppById = (id: string): App | undefined => {
  return mockApps.find(app => app.id === id);
};

export const getKnowledgeBaseArticleById = (id: string): KnowledgeBaseArticle | undefined => {
  return mockKnowledgeBase.find(article => article.id === id);
};

export const getFeatureRequestById = (id: string): FeatureRequest | undefined => {
  return mockFeatureRequests.find(request => request.id === id);
};

export const getTicketsByClientId = (clientId: string): Ticket[] => {
  return mockTickets.filter(ticket => ticket.clientId === clientId);
};

export const getFeatureRequestsByClientId = (clientId: string): FeatureRequest[] => {
  return mockFeatureRequests.filter(request => request.clientId === clientId);
};

export const getFeatureRequestsByAppId = (appId: string): FeatureRequest[] => {
  return mockFeatureRequests.filter(request => request.appId === appId);
};