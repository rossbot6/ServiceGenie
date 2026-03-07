import React, { useState } from 'react';
import { RotateCcw, DollarSign, Search, Filter, Download, Eye, CheckCircle, AlertCircle, Clock, Calendar, Users, CreditCard, TrendingDown, FileText, AlertTriangle } from 'lucide-react';

const RefundManagement = () => {
  const [refunds] = useState([
    {
      id: 'ref_001',
      originalPaymentId: 'pay_005',
      customerName: 'Lisa Rodriguez',
      customerEmail: 'lisa@email.com',
      originalAmount: 50.00,
      refundAmount: 50.00,
      refundMethod: 'Original Payment Method',
      status: 'completed',
      reason: 'service_not_provided',
      reasonText: 'Customer cancelled appointment 30 minutes prior',
      service: 'Hair Extension Consultation',
      provider: 'Michael Chen',
      appointmentDate: '2026-03-06',
      appointmentTime: '11:00 AM',
      refundRequestedBy: 'Customer',
      refundRequestedAt: '2026-03-06T09:30:00Z',
      processedBy: 'Sarah Johnson (Front Desk)',
      processedAt: '2026-03-06T10:00:00Z',
      refundProcessedAt: '2026-03-06T10:15:00Z',
      transactionId: 'ch_3M0z6A3rT7',
      refundTransactionId: 're_3N1a7B4sU6',
      notes: 'Customer called to request refund for early cancellation',
      refundFee: 1.50,
      netRefundAmount: 48.50,
      businessImpact: 'low'
    },
    {
      id: 'ref_002',
      originalPaymentId: 'pay_010',
      customerName: 'Robert Kim',
      customerEmail: 'robert@email.com',
      originalAmount: 220.00,
      refundAmount: 220.00,
      refundMethod: 'Store Credit',
      status: 'pending',
      reason: 'unsatisfactory_service',
      reasonText: 'Customer complained about hair cut',
      service: "Women's Haircut & Style",
      provider: 'James Brown',
      appointmentDate: '2026-03-07',
      appointmentTime: '2:00 PM',
      refundRequestedBy: 'Customer',
      refundRequestedAt: '2026-03-07T15:30:00Z',
      processedBy: null,
      processedAt: null,
      refundProcessedAt: null,
      transactionId: 'ch_3P2b8C5tV7',
      refundTransactionId: null,
      notes: 'Customer returned within 2 hours requesting full refund',
      refundFee: 0,
      netRefundAmount: 220.00,
      businessImpact: 'medium'
    },
    {
      id: 'ref_003',
      originalPaymentId: 'pay_015',
      customerName: 'Amanda Foster',
      customerEmail: 'amanda@email.com',
      originalAmount: 150.00,
      refundAmount: 75.00,
      refundMethod: 'Partial Refund - Credit Card',
      status: 'approved',
      reason: 'partial_service',
      reasonText: 'Service partially completed due to time constraints',
      service: 'Balayage & Cut',
      provider: 'Emma Wilson',
      appointmentDate: '2026-03-07',
      appointmentTime: '10:00 AM',
      refundRequestedBy: 'Front Desk',
      refundRequestedAt: '2026-03-07T12:00:00Z',
      processedBy: 'David Lee (Manager)',
      processedAt: '2026-03-07T12:30:00Z',
      refundProcessedAt: null,
      transactionId: 'ch_3Q3c9D6uW8',
      refundTransactionId: null,
      notes: 'Provider was called away for emergency, offered partial refund',
      refundFee: 2.25,
      netRefundAmount: 72.75,
      businessImpact: 'low'
    },
    {
      id: 'ref_004',
      originalPaymentId: 'pay_020',
      customerName: 'John Martinez',
      customerEmail: 'john@email.com',
      originalAmount: 85.00,
      refundAmount: 85.00,
      refundMethod: 'Gift Card',
      status: 'rejected',
      reason: 'late_request',
      reasonText: 'Requested refund 5 days after service',
      service: "Men's Beard Trim",
      provider: 'Michael Chen',
      appointmentDate: '2026-03-02',
      appointmentTime: '1:00 PM',
      refundRequestedBy: 'Customer',
      refundRequestedAt: '2026-03-07T11:00:00Z',
      processedBy: 'Carlos Mendez (Manager)',
      processedAt: '2026-03-07T11:15:00Z',
      refundProcessedAt: null,
      transactionId: 'ch_3R4d0E7vX9',
      refundTransactionId: null,
      notes: 'Outside 48-hour refund window, policy enforced',
      refundFee: 0,
      netRefundAmount: 85.00,
      businessImpact: 'none'
    },
    {
      id: 'ref_005',
      originalPaymentId: 'pay_025',
      customerName: 'Sophia Turner',
      customerEmail: 'sophia@email.com',
      originalAmount: 300.00,
      refundAmount: 300.00,
      refundMethod: 'Original Payment Method',
      status: 'processing',
      reason: 'double_charge',
      reasonText: 'Customer was charged twice for same service',
      service: 'Complete Makeover Package',
      provider: 'Sofia Garcia',
      appointmentDate: '2026-03-08',
      appointmentTime: '9:00 AM',
      refundRequestedBy: 'Customer',
      refundRequestedAt: '2026-03-07T14:00:00Z',
      processedBy: 'Lisa Martinez (Front Desk)',
      processedAt: '2026-03-07T16:00:00Z',
      refundProcessedAt: null,
      transactionId: 'ch_3S5e1F8wY0',
      refundTransactionId: 're_4T6f2G9xZ1',
      notes: 'Confirmed duplicate charge in payment system',
      refundFee: 9.00,
      netRefundAmount: 291.00,
      businessImpact: 'medium'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [reasonFilter, setReasonFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showAddRefund, setShowAddRefund] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showRefundDetails, setShowRefundDetails] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={16} className="text-green-600" />;
      case 'approved': return <FileText size={16} className="text-blue-600" />;
      case 'processing': return <RotateCcw size={16} className="text-yellow-600" />;
      case 'pending': return <Clock size={16} className="text-orange-600" />;
      case 'rejected': return <AlertTriangle size={16} className="text-red-600" />;
      default: return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getReasonIcon = (reason) => {
    switch(reason) {
      case 'service_not_provided': return <Calendar size={16} className="text-blue-600" />;
      case 'unsatisfactory_service': return <AlertTriangle size={16} className="text-red-600" />;
      case 'partial_service': return <TrendingDown size={16} className="text-orange-600" />;
      case 'late_request': return <Clock size={16} className="text-gray-600" />;
      case 'double_charge': return <CreditCard size={16} className="text-purple-600" />;
      default: return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getImpactColor = (impact) => {
    switch(impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      case 'none': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const filteredRefunds = refunds.filter(refund => {
    return (
      (!searchQuery || 
       refund.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       refund.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
       refund.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
       refund.reasonText.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!statusFilter || refund.status === statusFilter) &&
      (!reasonFilter || refund.reason === reasonFilter) &&
      (!dateFilter || new Date(refund.refundRequestedAt).toISOString().split('T')[0] === dateFilter)
    );
  });

  const stats = {
    totalRefunds: refunds.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.refundAmount, 0),
    totalFees: refunds.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.refundFee, 0),
    netRefunds: refunds.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.netRefundAmount, 0),
    pendingCount: refunds.filter(r => ['pending', 'approved', 'processing'].includes(r.status)).length,
    completedCount: refunds.filter(r => r.status === 'completed').length,
    rejectedCount: refunds.filter(r => r.status === 'rejected').length,
    averageRefund: refunds.length > 0 ? (refunds.reduce((sum, r) => sum + r.refundAmount, 0) / refunds.length) : 0
  };

  const statsByProvider = [...new Set(refunds.map(r => r.provider))].map(provider => {
    const providerRefunds = refunds.filter(r => r.provider === provider);
    const total = providerRefunds.reduce((sum, r) => sum + r.refundAmount, 0);
    return {
      provider,
      count: providerRefunds.length,
      total,
      average: providerRefunds.length > 0 ? total / providerRefunds.length : 0
    };
  }).sort((a, b) => b.total - a.total);

  const handleViewDetails = (refund) => {
    setSelectedRefund(refund);
    setShowRefundDetails(true);
  };

  const handleApproveRefund = (refundId) => {
    if (confirm('Are you sure you want to approve this refund?')) {
      console.log(`Approving refund: ${refundId}`);
      // In real implementation, this would call the approve refund API
    }
  };

  const handleRejectRefund = (refundId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason && confirm(`Are you sure you want to reject this refund?\nReason: ${reason}`)) {
      console.log(`Rejecting refund: ${refundId}, Reason: ${reason}`);
      // In real implementation, this would call the reject refund API
    }
  };

  const RefundRow = ({ refund }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getStatusIcon(refund.status)}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{refund.id}</div>
            <div className="text-sm text-gray-500">{new Date(refund.refundRequestedAt).toLocaleDateString()}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{refund.customerName}</div>
          <div className="text-sm text-gray-500">{refund.customerEmail}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getReasonIcon(refund.reason)}
          <div className="ml-2">
            <div className="text-sm font-medium text-gray-900">{refund.service}</div>
            <div className="text-sm text-gray-500">{refund.reasonText}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="text-lg font-bold text-red-600">-${refund.refundAmount.toFixed(2)}</div>
        {refund.refundFee > 0 && (
          <div className="text-xs text-gray-500">Fee: ${refund.refundFee.toFixed(2)}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${refund.netRefundAmount.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{refund.provider}</div>
          <div className="text-sm text-gray-500">{refund.refundMethod}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(refund.status)}`}>
          {refund.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-xs font-medium ${getImpactColor(refund.businessImpact)}`}>
          {refund.businessImpact}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button
          onClick={() => handleViewDetails(refund)}
          className="text-blue-600 hover:text-blue-900"
        >
          <Eye size={16} />
        </button>
        {['pending', 'approved'].includes(refund.status) && (
          <>
            <button
              onClick={() => handleApproveRefund(refund.id)}
              className="text-green-600 hover:text-green-900"
              title="Approve"
            >
              <CheckCircle size={16} />
            </button>
            <button
              onClick={() => handleRejectRefund(refund.id)}
              className="text-red-600 hover:text-red-900"
              title="Reject"
            >
              <AlertTriangle size={16} />
            </button>
          </>
        )}
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Refund Management</h3>
          <p className="text-sm text-gray-600">Process and track customer refunds and service adjustments</p>
        </div>
        <button
          onClick={() => setShowAddRefund(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <RotateCcw size={16} />
          New Refund
        </button>
      </div>

      {/* Refund Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Total Refunds</p>
              <p className="text-2xl font-bold text-red-700">${stats.totalRefunds.toFixed(2)}</p>
            </div>
            <RotateCcw className="text-red-600" size={24} />
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Net Impact</p>
              <p className="text-2xl font-bold text-orange-700">${stats.netRefunds.toFixed(2)}</p>
            </div>
            <TrendingDown className="text-orange-600" size={24} />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Processing Fees</p>
              <p className="text-2xl font-bold text-yellow-700">${stats.totalFees.toFixed(2)}</p>
            </div>
            <DollarSign className="text-yellow-600" size={24} />
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Avg Refund</p>
              <p className="text-2xl font-bold text-blue-700">${stats.averageRefund.toFixed(2)}</p>
            </div>
            <Users className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <p className="text-sm text-yellow-600">Processing</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pendingCount}</p>
            </div>
            <RotateCcw className="text-yellow-600" size={24} />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-700">{stats.rejectedCount}</p>
            </div>
            <AlertTriangle className="text-red-600" size={24} />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Providers</p>
              <p className="text-2xl font-bold text-purple-700">{refunds.length}</p>
            </div>
            <Users className="text-purple-600" size={24} />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-700">{refunds.length}</p>
            </div>
            <FileText className="text-gray-600" size={24} />
          </div>
        </div>
      </div>

      {/* Refund Impact by Provider */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsByProvider.slice(0, 6).map((provider) => (
          <div key={provider.provider} className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-gray-900">{provider.provider}</h4>
              <span className="text-sm text-gray-500">{provider.count} refunds</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-red-600">Total Refunds:</span>
                <span className="font-medium text-red-600">${provider.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average:</span>
                <span className="font-medium text-gray-600">${provider.average.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
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
            placeholder="Search refunds by customer, service, provider, or reason..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Reasons</option>
            <option value="service_not_provided">Service Not Provided</option>
            <option value="unsatisfactory_service">Unsatisfactory Service</option>
            <option value="partial_service">Partial Service</option>
            <option value="late_request">Late Request</option>
            <option value="double_charge">Double Charge</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
            placeholder="Filter by date"
          />

          <select
            value=""
            className="px-3 py-2 border rounded-lg text-sm"
            disabled
          >
            <option value="">All Providers</option>
          </select>

          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Refund
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider/Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRefunds.map((refund) => (
                <RefundRow key={refund.id} refund={refund} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredRefunds.length === 0 && (
          <div className="text-center py-12">
            <RotateCcw size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No refunds found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter || reasonFilter || dateFilter 
                ? 'Try adjusting your search or filter criteria' 
                : 'No refunds have been processed yet'}
            </p>
          </div>
        )}
      </div>

      {/* Refund Details Modal */}
      {showRefundDetails && selectedRefund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Refund Details</h3>
              <button
                onClick={() => setShowRefundDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Refund Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Refund ID:</span>
                    <span className="font-medium">{selectedRefund.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Payment:</span>
                    <span className="font-medium">{selectedRefund.originalPaymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedRefund.status)}`}>
                      {selectedRefund.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Impact:</span>
                    <span className={`font-medium ${getImpactColor(selectedRefund.businessImpact)}`}>
                      {selectedRefund.businessImpact}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span className="font-medium">{selectedRefund.reasonText}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Requested By:</span>
                    <span className="font-medium">{selectedRefund.refundRequestedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Requested At:</span>
                    <span className="font-medium">{new Date(selectedRefund.refundRequestedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Customer & Service</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{selectedRefund.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedRefund.customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{selectedRefund.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium">{selectedRefund.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Appointment:</span>
                    <span className="font-medium">{selectedRefund.appointmentDate} at {selectedRefund.appointmentTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Refund Method:</span>
                    <span className="font-medium">{selectedRefund.refundMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Refund Summary</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Amount:</span>
                    <span className="font-medium">${selectedRefund.originalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Refund Amount:</span>
                    <span className="font-bold text-red-600">-${selectedRefund.refundAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee:</span>
                    <span className="text-red-600">-${selectedRefund.refundFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-medium">Net Refund:</span>
                    <span className="font-bold text-red-600">-${selectedRefund.netRefundAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedRefund.notes && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Notes</h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedRefund.notes}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {['pending', 'approved'].includes(selectedRefund.status) && (
                <>
                  <button
                    onClick={() => {
                      handleApproveRefund(selectedRefund.id);
                      setShowRefundDetails(false);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve Refund
                  </button>
                  <button
                    onClick={() => {
                      handleRejectRefund(selectedRefund.id);
                      setShowRefundDetails(false);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject Refund
                  </button>
                </>
              )}
              <button
                onClick={() => setShowRefundDetails(false)}
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

export default RefundManagement;