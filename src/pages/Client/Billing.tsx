import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Download, 
  Eye, 
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail
} from 'lucide-react';
import { format, addMonths } from 'date-fns';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import { BillingInfo, Invoice, InvoiceStatus } from '../../types';

// Mock billing data
const mockBillingInfo: BillingInfo = {
  plan: 'Professional',
  monthlyRate: 299.99,
  currency: 'USD',
  billingCycle: 'monthly',
  nextBillingDate: '2025-01-20T00:00:00.000Z',
  paymentMethod: 'credit_card',
  billingAddress: {
    street: '123 Business Ave',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States'
  },
  taxId: 'TAX123456789'
};

const mockInvoices: Invoice[] = [
  {
    id: 'inv_001',
    clientId: 'client_1',
    invoiceNumber: 'INV-2024-001',
    issueDate: '2024-12-01T00:00:00.000Z',
    dueDate: '2024-12-31T00:00:00.000Z',
    status: 'paid',
    items: [
      {
        id: 'item_1',
        description: 'Portfolio Manager - Professional Plan',
        quantity: 1,
        unitPrice: 199.99,
        total: 199.99,
        appId: '1'
      },
      {
        id: 'item_2',
        description: 'Analytics Dashboard - Professional Plan',
        quantity: 1,
        unitPrice: 100.00,
        total: 100.00,
        appId: '2'
      }
    ],
    subtotal: 299.99,
    tax: 24.00,
    total: 323.99,
    currency: 'USD',
    paymentTerms: 'Net 30',
    notes: 'Thank you for your business!',
    paidDate: '2024-12-15T00:00:00.000Z',
    createdBy: 'system',
    createdAt: '2024-12-01T00:00:00.000Z'
  },
  {
    id: 'inv_002',
    clientId: 'client_1',
    invoiceNumber: 'INV-2024-002',
    issueDate: '2024-11-01T00:00:00.000Z',
    dueDate: '2024-11-30T00:00:00.000Z',
    status: 'paid',
    items: [
      {
        id: 'item_3',
        description: 'Portfolio Manager - Professional Plan',
        quantity: 1,
        unitPrice: 199.99,
        total: 199.99,
        appId: '1'
      },
      {
        id: 'item_4',
        description: 'Analytics Dashboard - Professional Plan',
        quantity: 1,
        unitPrice: 100.00,
        total: 100.00,
        appId: '2'
      }
    ],
    subtotal: 299.99,
    tax: 24.00,
    total: 323.99,
    currency: 'USD',
    paymentTerms: 'Net 30',
    paidDate: '2024-11-20T00:00:00.000Z',
    createdBy: 'system',
    createdAt: '2024-11-01T00:00:00.000Z'
  },
  {
    id: 'inv_003',
    clientId: 'client_1',
    invoiceNumber: 'INV-2025-001',
    issueDate: '2025-01-01T00:00:00.000Z',
    dueDate: '2025-01-31T00:00:00.000Z',
    status: 'sent',
    items: [
      {
        id: 'item_5',
        description: 'Portfolio Manager - Professional Plan',
        quantity: 1,
        unitPrice: 199.99,
        total: 199.99,
        appId: '1'
      },
      {
        id: 'item_6',
        description: 'Analytics Dashboard - Professional Plan',
        quantity: 1,
        unitPrice: 100.00,
        total: 100.00,
        appId: '2'
      }
    ],
    subtotal: 299.99,
    tax: 24.00,
    total: 323.99,
    currency: 'USD',
    paymentTerms: 'Net 30',
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00.000Z'
  }
];

const Billing: React.FC = () => {
  const [billingInfo] = useState<BillingInfo>(mockBillingInfo);
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');

  const filteredInvoices = useMemo(() => {
    if (statusFilter === 'all') return invoices;
    return invoices.filter(invoice => invoice.status === statusFilter);
  }, [invoices, statusFilter]);

  const stats = useMemo(() => {
    const totalPaid = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
    
    const outstanding = invoices
      .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0);
    
    const overdue = invoices.filter(inv => inv.status === 'overdue').length;

    return { totalPaid, outstanding, overdue };
  }, [invoices]);

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'draft': return 'default';
      case 'sent': return 'info';
      case 'paid': return 'success';
      case 'overdue': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case 'draft': return FileText;
      case 'sent': return Mail;
      case 'paid': return CheckCircle;
      case 'overdue': return AlertCircle;
      case 'cancelled': return AlertCircle;
      default: return FileText;
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // In real app, this would generate and download a PDF
    console.log('Downloading invoice:', invoice.invoiceNumber);
    alert(`Downloading ${invoice.invoiceNumber}.pdf`);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Invoices</h1>
        <p className="text-gray-600">
          Manage your subscription and view billing history
        </p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
          <Badge variant="success" size="sm">
            {billingInfo.plan}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Rate</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(billingInfo.monthlyRate, billingInfo.currency)}
            </p>
            <p className="text-sm text-gray-500">per month</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Next Billing Date</h3>
            <p className="text-lg font-semibold text-gray-900">
              {format(new Date(billingInfo.nextBillingDate), 'MMM dd, yyyy')}
            </p>
            <p className="text-sm text-gray-500">Auto-renewal enabled</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h3>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900">•••• •••• •••• 4242</span>
            </div>
            <p className="text-sm text-gray-500">Expires 12/2027</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Billing Address</h3>
          <div className="text-sm text-gray-900">
            <p>{billingInfo.billingAddress.street}</p>
            <p>
              {billingInfo.billingAddress.city}, {billingInfo.billingAddress.state} {billingInfo.billingAddress.postalCode}
            </p>
            <p>{billingInfo.billingAddress.country}</p>
            {billingInfo.taxId && (
              <p className="mt-2">Tax ID: {billingInfo.taxId}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Billing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalPaid)}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.outstanding)}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
            <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-error-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Invoice List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Invoice History</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border-gray-300 text-sm"
          >
            <option value="all">All Invoices</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredInvoices.map((invoice) => {
            const StatusIcon = getStatusIcon(invoice.status);
            
            return (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <StatusIcon className="w-5 h-5 text-gray-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </h3>
                      <Badge variant={getStatusColor(invoice.status)} size="sm">
                        {invoice.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Issued: {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatCurrency(invoice.total, invoice.currency)}</span>
                      </div>
                      {invoice.paidDate && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Paid: {format(new Date(invoice.paidDate), 'MMM dd, yyyy')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => handleViewInvoice(invoice)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Download}
                    onClick={() => handleDownloadInvoice(invoice)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No invoices found for the selected filter.</p>
          </div>
        )}
      </Card>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Invoice Details
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedInvoice(null)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedInvoice.invoiceNumber}
                    </h3>
                    <p className="text-gray-600">
                      Issued: {format(new Date(selectedInvoice.issueDate), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-gray-600">
                      Due: {format(new Date(selectedInvoice.dueDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusColor(selectedInvoice.status)}>
                      {selectedInvoice.status}
                    </Badge>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(selectedInvoice.total, selectedInvoice.currency)}
                    </p>
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Description
                          </th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                            Qty
                          </th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                            Unit Price
                          </th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item) => (
                          <tr key={item.id} className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {item.description}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">
                              {formatCurrency(item.unitPrice, selectedInvoice.currency)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">
                              {formatCurrency(item.total, selectedInvoice.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Invoice Totals */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-900">
                          {formatCurrency(selectedInvoice.subtotal, selectedInvoice.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax:</span>
                        <span className="text-gray-900">
                          {formatCurrency(selectedInvoice.tax, selectedInvoice.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-gray-900">
                          {formatCurrency(selectedInvoice.total, selectedInvoice.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                {selectedInvoice.paidDate && (
                  <div className="bg-success-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-success-600" />
                      <span className="font-medium text-success-900">
                        Paid on {format(new Date(selectedInvoice.paidDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedInvoice.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    icon={Download}
                    onClick={() => handleDownloadInvoice(selectedInvoice)}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedInvoice(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;