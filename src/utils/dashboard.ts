import { TicketStatus, Priority, Ticket } from '../types';

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  urgent: number;
  avgResponseTime: string;
  satisfactionRate: string;
}

export function calculateTicketStats(tickets: Ticket[]): TicketStats {
  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'Open').length;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;
  const urgent = tickets.filter(t => t.priority === 'Urgent').length;
  
  // Mock data for now - could be calculated from actual ticket data
  const avgResponseTime = '1.5 hours';
  const satisfactionRate = '98.5%';

  return {
    total,
    open,
    inProgress,
    resolved,
    urgent,
    avgResponseTime,
    satisfactionRate,
  };
}

export function getStatusColor(status: TicketStatus): 'info' | 'warning' | 'success' | 'default' | 'error' {
  switch (status) {
    case 'Open': return 'info';
    case 'In Progress': return 'warning';
    case 'Waiting for Response': return 'warning';
    case 'Resolved': return 'success';
    case 'Closed': return 'default';
    default: return 'default';
  }
}

export function getPriorityColor(priority: Priority): 'default' | 'info' | 'warning' | 'error' {
  switch (priority) {
    case 'Low': return 'default';
    case 'Medium': return 'info';
    case 'High': return 'warning';
    case 'Urgent': return 'error';
    default: return 'default';
  }
}

export function calculatePriorityPercentage(tickets: Ticket[], priority: Priority): number {
  const count = tickets.filter(t => t.priority === priority).length;
  return tickets.length > 0 ? (count / tickets.length) * 100 : 0;
}

export function filterTicketsByDateRange(
  tickets: Ticket[], 
  dateRangeStart: Date
): Ticket[] {
  return tickets.filter(ticket => {
    const ticketDate = new Date(ticket.createdAt);
    return ticketDate >= dateRangeStart;
  });
}

export function filterTicketsByStatus(
  tickets: Ticket[], 
  statusFilter: TicketStatus | 'all'
): Ticket[] {
  if (statusFilter === 'all') return tickets;
  return tickets.filter(ticket => ticket.status === statusFilter);
}

export function getSortedRecentTickets(tickets: Ticket[], limit: number = 5): Ticket[] {
  return [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
