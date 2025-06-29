# Holdings CTC Support Portal

A comprehensive client support portal for managing technical support requests, feature requests, and client relationships.

## 🔐 Login Credentials

### Admin Access
- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `admin123`
- **Features**: No 2FA required for admin login

### Client Access
- **URL**: `/client/login`
- **Test Email**: `john@techcorp.com`
- **Password**: Any password
- **2FA**: Required for some clients (any 6-digit code for demo)

## 🚀 Features

### Admin Dashboard
- **Ticket Management**: View, assign, and respond to support tickets
- **Client Management**: CRM-style client database with company info and subscription details
- **App Management**: Manage supported applications and their details
- **Knowledge Base**: Create and manage help articles
- **Feature Requests**: Track and manage client feature requests

### Client Portal
- **Ticket Submission**: Submit support tickets with app-specific details
- **Ticket Tracking**: Track ticket status and view conversation history
- **Feature Requests**: Submit and vote on feature requests
- **Knowledge Base**: Search and browse help articles
- **QR Code Setup**: New client onboarding with 2FA setup

### Security Features
- **Admin**: Simple username/password authentication
- **Clients**: Email-based login with optional 2FA
- **QR Code Access**: Secure client onboarding process

## 🗄️ Database Integration

### Current Implementation
- Mock data for development and testing
- In-memory data storage

### Recommended Production Database
Since Amazon SimpleDB has been deprecated (2018), we recommend:

#### **Amazon DynamoDB** (Recommended)
- Modern NoSQL database service
- Serverless and fully managed
- Better performance and features than SimpleDB
- Seamless AWS integration

#### **Alternative NoSQL Options**
- **MongoDB Atlas**: Cloud-hosted MongoDB
- **Firebase Firestore**: Google's NoSQL database
- **Supabase**: PostgreSQL with real-time features

### Database Schema Design
The application is designed with the following entities:
- **Clients**: Company info, contact details, subscriptions
- **Tickets**: Support requests with status tracking
- **Apps**: Supported applications and versions
- **Feature Requests**: Client suggestions and voting
- **Knowledge Base**: Help articles and documentation
- **Users**: Authentication and access control

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📱 Mobile Responsive
The portal is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Configuration

### Environment Variables
For production deployment, configure:
- Database connection strings
- Email service credentials
- Authentication providers
- File upload storage

### Customization
- Update branding in `src/components/Layout/Header.tsx`
- Modify color scheme in `tailwind.config.js`
- Add custom business logic in respective page components

## 📞 Support
For technical support or questions about this portal, contact the development team.