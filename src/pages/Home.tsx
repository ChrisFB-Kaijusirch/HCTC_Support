import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TicketIcon, 
  Search, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  MessageSquare,
  LogIn,
  UserPlus
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const Home: React.FC = () => {
  const quickActions = [
    {
      title: 'Submit New Ticket',
      description: 'Report an issue or request help with any of our applications',
      icon: TicketIcon,
      link: '/client/login',
      color: 'bg-primary-500',
      loginRequired: true,
    },
    {
      title: 'Track Your Tickets',
      description: 'Check the status of your existing support requests',
      icon: Search,
      link: '/track-ticket',
      color: 'bg-success-500',
      loginRequired: false,
    },
    {
      title: 'Browse Knowledge Base',
      description: 'Find answers to common questions and learn how to use our apps',
      icon: BookOpen,
      link: '/knowledge-base',
      color: 'bg-warning-500',
      loginRequired: false,
    },
  ];

  const stats = [
    {
      label: 'Average Response Time',
      value: '< 2 hours',
      icon: Clock,
      color: 'text-primary-600',
    },
    {
      label: 'Resolution Rate',
      value: '98.5%',
      icon: CheckCircle,
      color: 'text-success-600',
    },
    {
      label: 'Customer Satisfaction',
      value: '4.9/5',
      icon: TrendingUp,
      color: 'text-warning-600',
    },
  ];

  const recentUpdates = [
    {
      title: 'Portfolio Manager v2.1.0 Released',
      description: 'New features include advanced analytics and improved performance',
      date: '2 days ago',
      type: 'update',
    },
    {
      title: 'Scheduled Maintenance - Analytics Dashboard',
      description: 'Brief maintenance window scheduled for this weekend',
      date: '1 week ago',
      type: 'maintenance',
    },
    {
      title: 'New Knowledge Base Articles Added',
      description: 'Added comprehensive guides for new users',
      date: '2 weeks ago',
      type: 'content',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Holdings CTC Support
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Get help with all your Holdings CTC applications. Submit tickets, track progress, 
          and find answers in our comprehensive knowledge base.
        </p>
        
        {/* Login Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/client/login">
            <Button size="lg" icon={LogIn}>
              Client Login
            </Button>
          </Link>
          <Link to="/admin/login">
            <Button variant="outline" size="lg" icon={UserPlus}>
              Admin Login
            </Button>
          </Link>
        </div>
        
        <p className="text-sm text-gray-500">
          New client? Contact us to get your QR code for account setup.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {quickActions.map((action, index) => (
          <Card key={index} className="text-center" hover>
            <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <action.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {action.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {action.description}
            </p>
            {action.loginRequired ? (
              <div className="space-y-2">
                <Link to={action.link}>
                  <Button variant="outline" className="w-full">
                    Login Required
                  </Button>
                </Link>
                <p className="text-xs text-gray-500">
                  Please log in to access this feature
                </p>
              </div>
            ) : (
              <Link to={action.link}>
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </Link>
            )}
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Our Support Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Updates */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Updates</h2>
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentUpdates.map((update, index) => (
              <div key={index} className="border-l-4 border-primary-200 pl-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {update.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {update.description}
                    </p>
                    <span className="text-xs text-gray-500">
                      {update.date}
                    </span>
                  </div>
                  <div className="ml-4">
                    {update.type === 'maintenance' ? (
                      <AlertCircle className="w-4 h-4 text-warning-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-success-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Popular Help Topics */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Popular Help Topics</h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <Link 
              to="/knowledge-base/1" 
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">How to Reset Your Password</span>
                <span className="text-sm text-gray-500">245 views</span>
              </div>
            </Link>
            <Link 
              to="/knowledge-base/2" 
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Adding New Assets to Portfolio</span>
                <span className="text-sm text-gray-500">189 views</span>
              </div>
            </Link>
            <Link 
              to="/knowledge-base/3" 
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Understanding Analytics Reports</span>
                <span className="text-sm text-gray-500">156 views</span>
              </div>
            </Link>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link to="/knowledge-base">
              <Button variant="outline" size="sm" className="w-full">
                View All Articles
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Authentication Required Notice */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <LogIn className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Account Required for Full Access
            </h3>
            <p className="text-blue-800 mb-4">
              To submit tickets and access personalized features, you'll need to log in to your account. 
              Some features like browsing the knowledge base and tracking tickets are available without login.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/client/login">
                <Button size="sm">
                  Client Login
                </Button>
              </Link>
              <Link to="/qr-setup">
                <Button variant="outline" size="sm">
                  New Client Setup
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Need Immediate Assistance?
        </h2>
        <p className="text-gray-600 mb-6">
          For urgent issues or if you can't find what you're looking for, 
          our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/client/login">
            <Button size="lg">
              Login to Submit Ticket
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            Email: support@holdingsctc.com
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;