import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Send,
  Download,
  Eye,
  Calendar,
  DollarSign,
  Mail,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Textarea from '../../components/UI/Textarea';
import { Invoice, InvoiceStatus, InvoiceItem, Client } from '../../types';
import { useClients, useApps } from '../../hooks/useDynamoDB';

// Mock invoice data
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
      }
    ],
    subtotal: 199.99,
    tax: 16.00,
    total: 215.99,
    currency: 'USD',
    paymentTerms: 'Net 30',
    paidDate: '2024-12-15T00:00:00.000Z',
    createdBy: 'admin',
    createdAt: '2024-12-01T00:00:00.000Z'
  }
];

const InvoiceManagement: React.FC = () => {
  const { clients } = useClients();
  const { apps } = useApps();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [formData, setFormData] = useState({
    clientId: '',
    dueDate: '',
    paymentTerms: 'Net 30',
    notes: '',
    items: [] as InvoiceItem[],
  });

  const filteredInvoices = useMemo(() => {
    let filtered = [...invoices];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(term) ||
        clients.find(c => c.id === invoice.clientId)?.companyName.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    // Client filter
    if (clientFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.clientId === clientFilter);
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [invoices, searchTerm, statusFilter, clientFilter, clients]);

  const stats = useMemo(() => {
    const total = invoices.length;
    const draft = invoices.filter(inv => inv.status === 'draft').length;
    const sent = invoices.filter(inv => inv.status === 'sent').length;
    const paid = invoices.filter(inv => inv.status === 'paid').length;
    const overdue = invoices.filter(inv => inv.status === 'overdue').length;
    const totalRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    return { total, draft, sent, paid, overdue, totalRevenue };
  }, [invoices]);

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `INV-${year}-${count.toString().padStart(3, '0')}`;
  };

  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { subtotal, tax, total } = calculateTotals(formData.items);
      
      if (editingInvoice) {
        // Update existing invoice
        setInvoices(prev => prev.map(inv => 
          inv.id === editingInvoice.id 
            ? { 
                ...inv, 
                ...formData,
                subtotal,
                tax,
                total,
                dueDate: formData.dueDate + 'T00:00:00.000Z'
              }
            : inv
        ));
      } else {
        // Create new invoice
        const newInvoice: Invoice = {
          id: `inv_${Date.now()}`,
          invoiceNumber: generateInvoiceNumber(),
          issueDate: new Date().toISOString(),
          dueDate: formData.dueDate + 'T00:00:00.000Z',
          status: 'draft',
          ...formData,
          subtotal,
          tax,
          total,
          currency: 'USD',
          createdBy: 'admin',
          createdAt: new Date().toISOString()
        };
        setInvoices(prev => [...prev, newInvoice]);
      }
      
      // Reset form
      setFormData({
        clientId: '',
        dueDate: '',
        paymentTerms: 'Net 30',
        notes: '',
        items: [],
      });
      setShowForm(false);
      setEditingInvoice(null);
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      clientId: invoice.clientId,
      dueDate: invoice.dueDate.split('T')[0],
      paymentTerms: invoice.paymentTerms,
      notes: invoice.notes || '',
      items: invoice.items,
    });
    setShowForm(true);
  };

  const handleStatusChange = (invoiceId: string, newStatus: InvoiceStatus) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { 
            ...inv, 
            status: newStatus,
            paidDate: newStatus === 'paid' ? new Date().toISOString() : undefined
          }
        : inv
    ));
  };

  const handleSendInvoice = (invoice: Invoice) => {
    const client = clients.find(c => c.id === invoice.clientId);
    if (client) {
      // In real app, this would send an email
      alert(`Invoice ${invoice.invoiceNumber} sent to ${client.email}`);
      handleStatusChange(invoice.id, 'sent');
    }
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item_${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Management</h1>
          <p className="text-gray-600">
            Create, manage, and track client invoices
          </p>
        </div>
        <Button 
          icon={Plus} 
          onClick={() => {
            setShowForm(true);
            setEditingInvoice(null);
            setFormData({
              clientId: '',
              dueDate: '',
              paymentTerms: 'Net 30',
              notes: '',
              items: [],
            });
          }}
        >
          Create Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Draft</p>
            <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Sent</p>
            <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Paid</p>
            <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Overdue</p>
            <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Revenue</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
            </h2>
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowForm(false);
                setEditingInvoice(null);
              }}
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Client *"
                value={formData.clientId}
                onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                options={[
                  { value: '', label: 'Select Client' },
                  ...clients.map(client => ({ 
                    value: client.id, 
                    label: client.companyName 
                  }))
                ]}
                required
              />
              
              <Input
                label="Due Date *"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
              
              <Select
                label="Payment Terms"
                value={formData.paymentTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                options={[
                  { value: 'Net 15', label: 'Net 15' },
                  { value: 'Net 30', label: 'Net 30' },
                  { value: 'Net 60', label: 'Net 60' },
                  { value: 'Due on Receipt', label: 'Due on Receipt' },
                ]}
              />
            </div>

            {/* Invoice Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="md:col-span-2">
                      <Input
                        label="Description"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                        placeholder="Item description"
                        required
                      />
                    </div>
                    
                    <Input
                      label="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      required
                    />
                    
                    <Input
                      label="Unit Price"
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      required
                    />
                    
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total
                        </label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleRemoveItem(index)}
                        className="text-error-600 hover:text-error-700"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {formData.items.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-900">
                          {formatCurrency(calculateTotals(formData.items).subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax (8%):</span>
                        <span className="text-gray-900">
                          {formatCurrency(calculateTotals(formData.items).tax)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-gray-900">
                          {formatCurrency(calculateTotals(formData.items).total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Textarea
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or terms..."
              rows={3}
            />

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingInvoice(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'draft', label: 'Draft' },
              { value: 'sent', label: 'Sent' },
              { value: 'paid', label: 'Paid' },
              { value: 'overdue', label: 'Overdue' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
          
          <Select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Clients' },
              ...clients.map(client => ({ 
                value: client.id, 
                label: client.companyName 
              }))
            ]}
          />
          
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-500">
              {filteredInvoices.length} of {invoices.length} invoices
            </span>
          </div>
        </div>
      </Card>

      {/* Invoice List */}
      <Card>
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => {
            const StatusIcon = getStatusIcon(invoice.status);
            const client = clients.find(c => c.id === invoice.clientId);
            
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
                      <span>{client?.companyName}</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatCurrency(invoice.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {invoice.status === 'draft' && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Send}
                      onClick={() => handleSendInvoice(invoice)}
                    >
                      Send
                    </Button>
                  )}
                  
                  {invoice.status === 'sent' && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={CheckCircle}
                      onClick={() => handleStatusChange(invoice.id, 'paid')}
                    >
                      Mark Paid
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    View
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Edit}
                    onClick={() => handleEdit(invoice)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No invoices found
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first invoice to get started.
            </p>
            <Button onClick={() => setShowForm(true)}>Create Invoice</Button>
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
                  Invoice Preview
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedInvoice(null)}
                >
                  ×
                </Button>
              </div>

              {/* Invoice content similar to client billing page */}
              <div className="space-y-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedInvoice.invoiceNumber}
                    </h3>
                    <p className="text-gray-600">
                      Client: {clients.find(c => c.id === selectedInvoice.clientId)?.companyName}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusColor(selectedInvoice.status)}>
                      {selectedInvoice.status}
                    </Badge>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(selectedInvoice.total)}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    icon={Download}
                    onClick={() => alert('Downloading PDF...')}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    icon={Mail}
                    onClick={() => handleSendInvoice(selectedInvoice)}
                  >
                    Send to Client
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

export default InvoiceManagement;