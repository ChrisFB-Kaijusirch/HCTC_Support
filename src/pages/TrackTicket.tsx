import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Clock, User, MessageSquare, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Badge from '../components/UI/Badge';
import { Ticket } from '../types';
import { getTicketByNumber, mockTickets } from '../utils/mockData';

const TrackTicket: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ticketNumber, setTicketNumber] = useState(searchParams.get('ticket') || '');
  const [email, setEmail] = useState('');
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  useEffect(() => {
    const ticketParam = searchParams.get('ticket');
    if (ticketParam) {
      setTicketNumber(ticketParam);
      handleSingleTicketSearch(ticketParam);
    }
  }, [searchParams]);

  const handleSingleTicketSearch = async (searchTicketNumber?: string) => {
    const searchNumber = searchTicketNumber || ticketNumber;
    if (!searchNumber.trim()) {
      setError('Please enter a ticket number');
      return;
    }

    setIsSearching(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundTicket = getTicketByNumber(searchNumber.trim());
    if (foundTicket) {
      setTicket(foundTicket);
      setViewMode('single');
    } else {
      setError('Ticket not found. Please check your ticket number and try again.');
      setTicket(null);
    }

    setIsSearching(false);
  };

  const handleEmailSearch = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSearching(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundTickets = mockTickets.filter(t => 
      t.email.toLowerCase() === email.toLowerCase()
    );

    if (foundTickets.length > 0) {
      setUserTickets(foundTickets);
      setViewMode('all');
      setTicket(null);
    } else {
      setError('No tickets found for this email address.');
      setUserTickets([]);
    }

    setIsSearching(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'info';
      case 'In Progress': return 'warning';
      case 'Waiting for Response': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'default';
      case 'Medium': return 'info';
      case 'High': return 'warning';
      case 'Urgent': return 'error';
      default: return 'default';
    }
  };

  const renderTicketDetails = (ticketData: Ticket) => (
    <div className="space-y-6">
      {/* Ticket Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {ticketData.subject}
          </h2>
          <p className="text-gray-600">
            Ticket #{ticketData.ticketNumber}
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Badge variant={getStatusColor(ticketData.status)}>
            {ticketData.status}
          </Badge>
          <Badge variant={getPriorityColor(ticketData.priority)}>
            {ticketData.priority} Priority
          </Badge>
        </div>
      </div>

      {/* Ticket Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Submitted by</span>
          </div>
          <p className="text-gray-900">{ticketData.name}</p>
          <p className="text-sm text-gray-600">{ticketData.email}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Created</span>
          </div>
          <p className="text-gray-900">
            {format(ticketData.createdAt, 'MMM dd, yyyy')}
          </p>
          <p className="text-sm text-gray-600">
            {format(ticketData.createdAt, 'h:mm a')}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Application</span>
          </div>
          <p className="text-gray-900">{ticketData.appName}</p>
          {ticketData.appVersion && (
            <p className="text-sm text-gray-600">v{ticketData.appVersion}</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Issue Type</span>
          </div>
          <p className="text-gray-900">{ticketData.issueType}</p>
          {ticketData.assignedTo && (
            <p className="text-sm text-gray-600">Assigned to {ticketData.assignedTo}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{ticketData.description}</p>
      </Card>

      {/* Replies */}
      {ticketData.replies.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Conversation ({ticketData.replies.length})
          </h3>
          <div className="space-y-4">
            {ticketData.replies.map((reply) => (
              <div
                key={reply.id}
                className={`p-4 rounded-lg ${
                  reply.authorType === 'admin'
                    ? 'bg-primary-50 border-l-4 border-primary-500'
                    : 'bg-gray-50 border-l-4 border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {reply.author}
                    </span>
                    <Badge 
                      variant={reply.authorType === 'admin' ? 'info' : 'default'}
                      size="sm"
                    >
                      {reply.authorType === 'admin' ? 'Support Team' : 'Customer'}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(reply.createdAt, 'MMM dd, yyyy h:mm a')}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Status Timeline */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Ticket Created</p>
              <p className="text-sm text-gray-600">
                {format(ticketData.createdAt, 'MMM dd, yyyy h:mm a')}
              </p>
            </div>
          </div>
          
          {ticketData.replies.length > 0 && (
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Response Added</p>
                <p className="text-sm text-gray-600">
                  {format(ticketData.replies[ticketData.replies.length - 1].createdAt, 'MMM dd, yyyy h:mm a')}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              ticketData.status === 'Resolved' || ticketData.status === 'Closed'
                ? 'bg-success-500'
                : 'bg-gray-300'
            }`}></div>
            <div>
              <p className="font-medium text-gray-900">Current Status: {ticketData.status}</p>
              <p className="text-sm text-gray-600">
                Last updated: {format(ticketData.updatedAt, 'MMM dd, yyyy h:mm a')}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Tickets</h1>
        <p className="text-gray-600">
          Enter your ticket number or email address to view your support requests.
        </p>
      </div>

      {/* Search Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Search by Ticket Number
          </h2>
          <div className="space-y-4">
            <Input
              label="Ticket Number"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="e.g., HTC-2024-001"
              icon={Search}
            />
            <Button
              onClick={() => handleSingleTicketSearch()}
              loading={isSearching && viewMode === 'single'}
              className="w-full"
            >
              Search Ticket
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            View All Your Tickets
          </h2>
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              icon={User}
            />
            <Button
              onClick={handleEmailSearch}
              loading={isSearching && viewMode === 'all'}
              variant="outline"
              className="w-full"
            >
              View My Tickets
            </Button>
          </div>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="mb-6">
          <div className="flex items-center space-x-2 text-error-600">
            <Eye className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Single Ticket View */}
      {ticket && viewMode === 'single' && (
        <Card>
          {renderTicketDetails(ticket)}
        </Card>
      )}

      {/* All Tickets View */}
      {userTickets.length > 0 && viewMode === 'all' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Tickets ({userTickets.length})
            </h2>
          </div>
          
          <div className="grid gap-6">
            {userTickets.map((ticketItem) => (
              <Card key={ticketItem.id} hover>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {ticketItem.subject}
                    </h3>
                    <p className="text-gray-600">#{ticketItem.ticketNumber}</p>
                  </div>
                  <div className="flex items-center space-x-3 mt-2 md:mt-0">
                    <Badge variant={getStatusColor(ticketItem.status)}>
                      {ticketItem.status}
                    </Badge>
                    <Badge variant={getPriorityColor(ticketItem.priority)}>
                      {ticketItem.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Application</span>
                    <p className="text-gray-900">{ticketItem.appName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Created</span>
                    <p className="text-gray-900">
                      {format(ticketItem.createdAt, 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Last Updated</span>
                    <p className="text-gray-900">
                      {format(ticketItem.updatedAt, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {ticketItem.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{ticketItem.replies.length} replies</span>
                    <span>{ticketItem.issueType}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTicket(ticketItem);
                      setViewMode('single');
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      {!ticket && userTickets.length === 0 && !error && (
        <Card className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Need Help Finding Your Ticket?
          </h2>
          <p className="text-gray-600 mb-6">
            If you can't find your ticket, check your email for the confirmation message 
            we sent when you submitted your request.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit-ticket">
              <Button>Submit New Ticket</Button>
            </Link>
            <Link to="/knowledge-base">
              <Button variant="outline">Browse Knowledge Base</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TrackTicket;