import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { subDays, isAfter } from 'date-fns';
import Button from '../../components/UI/Button';
import StatsGrid from '../../components/Dashboard/StatsGrid';
import RecentTickets from '../../components/Dashboard/RecentTickets';
import QuickActions from '../../components/Dashboard/QuickActions';
import PriorityBreakdown from '../../components/Dashboard/PriorityBreakdown';
import SystemStatus from '../../components/Dashboard/SystemStatus';
import { useTickets, useClients, useApps } from '../../hooks/useDynamoDB';
import { TicketStatus } from '../../types';
import {
  calculateTicketStats,
  filterTicketsByDateRange,
  filterTicketsByStatus,
  getSortedRecentTickets,
} from '../../utils/dashboard';

const AdminDashboard: React.FC = () => {
  const { tickets, loading: ticketsLoading } = useTickets();
  const { clients } = useClients();
  const { apps } = useApps();
  
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');

  const dateRangeStart = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    return subDays(new Date(), days);
  }, [dateRange]);

  const dateFilteredTickets = useMemo(() => 
    filterTicketsByDateRange(tickets, dateRangeStart), 
    [tickets, dateRangeStart]
  );

  const filteredTickets = useMemo(() => 
    filterTicketsByStatus(dateFilteredTickets, statusFilter), 
    [dateFilteredTickets, statusFilter]
  );

  const stats = useMemo(() => 
    calculateTicketStats(filteredTickets), 
    [filteredTickets]
  );

  const recentTickets = useMemo(() => 
    getSortedRecentTickets(tickets, 5), 
    [tickets]
  );



  if (ticketsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage support tickets and monitor system performance
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="rounded-lg border-gray-300 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Link to="/submit-ticket">
            <Button icon={Plus}>New Ticket</Button>
          </Link>
        </div>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentTickets
            tickets={recentTickets}
            apps={apps}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>

        <div className="space-y-6">
          <QuickActions />
          <PriorityBreakdown tickets={filteredTickets} />
          <SystemStatus clients={clients} apps={apps} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;