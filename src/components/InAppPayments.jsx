import React, { useState } from 'react';
import { CreditCard, DollarSign, ShoppingCart, Plus, Search, Filter, Download, Eye, Edit, Trash2, Calendar, Users, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const InAppPayments = () => {
  const [payments] = useState([
    {
      id: 'pay_001',
      customerName: 'Emma Thompson',
      customerEmail: 'emma@email.com',
      amount: 185.00,
      method: 'Credit Card',
      status: 'completed',
      appointmentId: 'apt_001',
      appointmentDate: '2026-03-08',
      appointmentTime: '2:00 PM',
      provider: 'Emma Wilson',
      service: 'Full Balayage + Cut',
      processingFee: 5.55,
      netAmount: 179.45,
      transactionId: 'ch_3K8x2Y1pR9',
      createdAt: '2026-03-07T10:30:00Z',
      paymentType: 'deposit'
    },
    {
      id: 'pay_002',
      customerName: 'Michael Chen',
      customerEmail: 'michael@email.com',
      amount: 75.00,
      method: 'Cash',
      status: 'pending',
      appointmentId: 'apt_002',
      appointmentDate: '2026-03-08',
      appointmentTime: '10:00 AM',
      provider: 'James Brown',
      service: "Men's Haircut",
      processingFee: 0,
      netAmount: 75.00,
      transactionId: null,
      createdAt: '2026-03-07T09:15:00Z',
      paymentType: 'full'
    },
    {
      id: 'pay_003',
      customerName: 'Sofia Garcia',
      customerEmail: 'sofia@email.com',
      amount: 250.00,
      method: 'Debit Card',
      status: 'completed',
      appointmentId: 'apt_003',
      appointmentDate: '2026-03-09',
      appointmentTime: '1:00 PM',
      provider: 'Sofia Garcia',
      service: 'Keratin Treatment',
      processingFee: 7.50,
      netAmount: 242.50,
      transactionId: 'ch_3L9y5Z2qR8',
      createdAt: '2026-03-07T11:45:00Z',
      paymentType: 'full'
    },
    {
      id: 'pay_004',
      customerName: 'David Lee',
      customerEmail: 'david@email.com',
      amount: 95.00,
      method: 'Credit Card',
      status: 'failed',
      appointmentId: 'apt_004',
      appointmentDate: '2026-03-10',
      appointmentTime: '3:30 PM',
      provider: 'Emma Wilson',
      service: 'Color Correction',
      processingFee: 2.85,
      netAmount: 92.15,
      transactionId: 'ch_failed_001',
      createdAt: '2026-03-07T12:20:00Z',
      paymentType: 'partial'
    },
    {
      id: 'pay_005',
      customerName: 'Lisa Rodriguez',
      customerEmail: 'lisa@email.com',
      amount: 50.00,
      method: 'Credit Card',
      status: 'refunded',
      appointmentId: 'apt_005',
      appointmentDate: '2026-03-06',
      appointmentTime: '11:00 AM',
      provider: 'Michael Chen',
      service: 'Hair Extension Consultation',
      processingFee: 1.50,
      netAmount: 48.50,
      transactionId: 'ch_3M0z6A3rT7',
      createdAt: '2026-03-06T14:00:00Z',
      paymentType: 'consultation'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 border-red-300';
      case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={16} className="text-green-600" />;
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      case 'failed': return <AlertCircle size={16} className="text-red-600" />;
      case 'refunded': return <Download size={16} className="text-gray-600" />;
      default: return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getMethodIcon = (method) => {
    if (method.toLowerCase().includes('credit') || method.toLowerCase().includes('debit')) {
      return <CreditCard size={16} className="text-blue-600" />;
    }
    return <DollarSign size={16} className="text-green-600" />;
  };

  const filteredPayments = payments.filter(payment => {
    return (
      (!searchQuery || payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       payment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
       payment.provider.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!statusFilter || payment.status === statusFilter) &&
      (!methodFilter || payment.method.toLowerCase().includes(methodFilter.toLowerCase())) &&
      (!dateFilter || new Date(payment.createdAt).toISOString().split('T')[0] === dateFilter)
    );
  });

  const stats = {
    totalRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    netRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.netAmount, 0),
    totalFees: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.processingFee, 0),
    averagePayment: payments.length > 0 ? (payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0) / payments.filter(p => p.status === 'completed').length) : 0,
    completedCount: payments.filter(p => p.status === 'completed').length,
    failedCount: payments.filter(p => p.status === 'failed').length,
    pendingCount: payments.filter(p => p.status === 'pending').length
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  const handleProcessRefund = (paymentId) => {
    if (confirm('Are you sure you want to process a refund for this payment?')) {
      console.log(`Processing refund for payment: ${paymentId}`);
      // In real implementation, this would call the refund API
    }
  };

  const PaymentRow = ({ payment }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getStatusIcon(payment.status)}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{payment.id}</div>
            <div className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
          <div className="text-sm text-gray-500">{payment.customerEmail}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getMethodIcon(payment.method)}
          <span className="ml-2 text-sm text-gray-900">{payment.method}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
        {payment.processingFee > 0 && (
          <div className="text-xs text-gray-500">Fee: ${payment.processingFee.toFixed(2)}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${payment.netAmount.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{payment.service}</div>
          <div className="text-sm text-gray-500">{payment.provider}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
          {payment.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button
          onClick={() => handleViewDetails(payment)}
          className="text-blue-600 hover:text-blue-900"
        >
          <Eye size={16} />
        </button>
        {payment.status === 'completed' && (
          <button
            onClick={() => handleProcessRefund(payment.id)}
            className="text-red-600 hover:text-red-900"
          >
            <Download size={16} />
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">In-App Payments</h3>
          <p className="text-sm text-gray-600">Manage customer payments, transactions, and processing</p>
        </div>
        <button
          onClick={() => setShowAddPayment(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          New Payment
        </button>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Revenue</p>
              <p className="text-2xl font-bold">${stats.netRevenue.toFixed(2)}</p>
            </div>
            <CreditCard className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing Fees</p>
              <p className="text-2xl font-bold text-red-600">${stats.totalFees.toFixed(2)}</p>
            </div>
            <AlertCircle className="text-red-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Payment</p>
              <p className="text-2xl font-bold">${stats.averagePayment.toFixed(2)}</p>
            </div>
            <Users className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-700">{stats.completedCount}</p>
            </div>
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pendingCount}</p>
            </div>
            <Clock className="text-yellow-600" size={24} />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Failed</p>
              <p className="text-2xl font-bold text-red-700">{stats.failedCount}</p>
            </div>
            <AlertCircle className="text-red-600" size={24} />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-700">{payments.length}</p>
            </div>
            <ShoppingCart className="text-gray-600" size={24} />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payments by customer, service, or provider..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Methods</option>
            <option value="credit">Credit Card</option>
            <option value="debit">Debit Card</option>
            <option value="cash">Cash</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
            placeholder="Filter by date"
          />

          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <PaymentRow key={payment.id} payment={payment} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter || methodFilter || dateFilter 
                ? 'Try adjusting your search or filter criteria' 
                : 'No payments have been processed yet'}
            </p>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {showPaymentDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Payment Details</h3>
              <button
                onClick={() => setShowPaymentDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Transaction Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium">{selectedPayment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">{selectedPayment.transactionId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedPayment.status)}`}>
                      {selectedPayment.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Type:</span>
                    <span className="font-medium">{selectedPayment.paymentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{new Date(selectedPayment.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Customer & Service</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{selectedPayment.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedPayment.customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{selectedPayment.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium">{selectedPayment.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Appointment:</span>
                    <span className="font-medium">{selectedPayment.appointmentDate} at {selectedPayment.appointmentTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Payment Summary</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg">${selectedPayment.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee:</span>
                    <span className="text-red-600">-${selectedPayment.processingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-medium">Net Amount:</span>
                    <span className="font-bold text-green-600">${selectedPayment.netAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {selectedPayment.status === 'completed' && (
                <button
                  onClick={() => handleProcessRefund(selectedPayment.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Process Refund
                </button>
              )}
              <button
                onClick={() => setShowPaymentDetails(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InAppPayments;