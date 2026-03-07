import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Search, Filter, Download, Eye, Edit, Plus, BarChart3, CheckCircle, AlertCircle, Clock, Calculator, Target, Award, Users, Percent, CreditCard } from 'lucide-react';

const SalaryCommission = () => {
  const [payroll] = useState([
    {
      id: 'payroll_001',
      month: '2026-03',
      providerId: 'prov_001',
      providerName: 'Emma Wilson',
      baseSalary: 2000.00,
      totalCommission: 2850.00,
      totalGrossPay: 4850.00,
      deductions: 387.50,
      taxDeductions: 970.00,
      insuranceDeductions: 150.00,
      otherDeductions: 25.00,
      netPay: 3832.50,
      payPeriod: 'March 2026',
      commissionRate: 0.25,
      servicesCompleted: 48,
      averageServiceValue: 237.50,
      commissionEligible: 2850.00,
      performanceBonus: 250.00,
      penaltyDeductions: 0,
      status: 'processed',
      processedDate: '2026-03-01',
      payDate: '2026-03-05',
      payMethod: 'Direct Deposit',
      bankAccount: '****4567',
      notes: 'Excellent performance this month'
    },
    {
      id: 'payroll_002',
      month: '2026-03',
      providerId: 'prov_002',
      providerName: 'Michael Chen',
      baseSalary: 2500.00,
      totalCommission: 3240.00,
      totalGrossPay: 5740.00,
      deductions: 459.20,
      taxDeductions: 1148.00,
      insuranceDeductions: 150.00,
      otherDeductions: 35.50,
      netPay: 4592.50,
      payPeriod: 'March 2026',
      commissionRate: 0.30,
      servicesCompleted: 42,
      averageServiceValue: 257.14,
      commissionEligible: 3240.00,
      performanceBonus: 400.00,
      penaltyDeductions: 0,
      status: 'calculated',
      processedDate: '2026-03-06',
      payDate: '2026-03-10',
      payMethod: 'Direct Deposit',
      bankAccount: '****8912',
      notes: 'Highest revenue performer this month'
    },
    {
      id: 'payroll_003',
      month: '2026-03',
      providerId: 'prov_003',
      providerName: 'James Brown',
      baseSalary: 1800.00,
      totalCommission: 1920.00,
      totalGrossPay: 3720.00,
      deductions: 297.60,
      taxDeductions: 744.00,
      insuranceDeductions: 150.00,
      otherDeductions: 15.00,
      netPay: 3177.90,
      payPeriod: 'March 2026',
      commissionRate: 0.20,
      servicesCompleted: 36,
      averageServiceValue: 266.67,
      commissionEligible: 1920.00,
      performanceBonus: 0.00,
      penaltyDeductions: 75.00,
      status: 'pending',
      processedDate: null,
      payDate: '2026-03-15',
      payMethod: 'Check',
      bankAccount: null,
      notes: 'Minor penalty for late cancellation policy violation'
    },
    {
      id: 'payroll_004',
      month: '2026-03',
      providerId: 'prov_004',
      providerName: 'Sofia Garcia',
      baseSalary: 2200.00,
      totalCommission: 2760.00,
      totalGrossPay: 4960.00,
      deductions: 396.80,
      taxDeductions: 992.00,
      insuranceDeductions: 150.00,
      otherDeductions: 48.50,
      netPay: 3912.70,
      payPeriod: 'March 2026',
      commissionRate: 0.28,
      servicesCompleted: 44,
      averageServiceValue: 245.45,
      commissionEligible: 2760.00,
      performanceBonus: 300.00,
      penaltyDeductions: 0,
      status: 'processed',
      processedDate: '2026-03-02',
      payDate: '2026-03-07',
      payMethod: 'Direct Deposit',
      bankAccount: '****2345',
      notes: 'Great team collaboration and customer satisfaction scores'
    },
    {
      id: 'payroll_005',
      month: '2026-02',
      providerId: 'prov_001',
      providerName: 'Emma Wilson',
      baseSalary: 2000.00,
      totalCommission: 2650.00,
      totalGrossPay: 4650.00,
      deductions: 372.00,
      taxDeductions: 930.00,
      insuranceDeductions: 150.00,
      otherDeductions: 20.00,
      netPay: 3697.00,
      payPeriod: 'February 2026',
      commissionRate: 0.25,
      servicesCompleted: 46,
      averageServiceValue: 226.09,
      commissionEligible: 2650.00,
      performanceBonus: 0.00,
      penaltyDeductions: 0,
      status: 'completed',
      processedDate: '2026-02-01',
      payDate: '2026-02-05',
      payMethod: 'Direct Deposit',
      bankAccount: '****4567',
      notes: 'Solid performance, consistent customer reviews'
    }
  ]);

  const [commissionData] = useState([
    {
      id: 'comp_001',
      providerId: 'prov_001',
      providerName: 'Emma Wilson',
      month: '2026-03',
      serviceId: 'service_001',
      serviceName: 'Full Balayage + Cut',
      serviceValue: 275.00,
      commissionRate: 0.25,
      commissionAmount: 68.75,
      customerName: 'Sarah Johnson',
      appointmentDate: '2026-03-07',
      paidDate: '2026-03-07',
      commissionType: 'percentage',
      status: 'approved',
      serviceLocation: 'Downtown'
    },
    {
      id: 'comp_002',
      providerId: 'prov_002',
      providerName: 'Michael Chen',
      month: '2026-03',
      serviceId: 'service_002',
      serviceName: "Men's Premium Cut",
      serviceValue: 85.00,
      commissionRate: 0.30,
      commissionAmount: 25.50,
      customerName: 'David Lee',
      appointmentDate: '2026-03-07',
      paidDate: '2026-03-07',
      commissionType: 'percentage',
      status: 'approved',
      serviceLocation: 'Brooklyn'
    },
    {
      id: 'comp_003',
      providerId: 'prov_003',
      providerName: 'James Brown',
      month: '2026-03',
      serviceId: 'service_003',
      serviceName: 'Color Touch-up',
      serviceValue: 125.00,
      commissionRate: 0.20,
      commissionAmount: 25.00,
      customerName: 'Lisa Martinez',
      appointmentDate: '2026-03-06',
      paidDate: '2026-03-07',
      commissionType: 'percentage',
      status: 'approved',
      serviceLocation: 'Downtown'
    },
    {
      id: 'comp_004',
      providerId: 'prov_004',
      providerName: 'Sofia Garcia',
      month: '2026-03',
      serviceId: 'service_004',
      serviceName: 'Keratin Treatment',
      serviceValue: 450.00,
      commissionRate: 0.28,
      commissionAmount: 126.00,
      customerName: 'Amanda Foster',
      appointmentDate: '2026-03-08',
      paidDate: null,
      commissionType: 'percentage',
      status: 'pending',
      serviceLocation: 'Brooklyn'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('2026-03');
  const [providerFilter, setProviderFilter] = useState('');
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [activeTab, setActiveTab] = useState('payroll');

  const providers = [...new Set(payroll.map(p => p.providerName))];

  const getStatusColor = (status) => {
    switch(status) {
      case 'processed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'calculated': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending_payment': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPayStatusIcon = (status) => {
    switch(status) {
      case 'processed': return <Clock size={16} className="text-blue-600" />;
      case 'calculated': return <Calculator size={16} className="text-yellow-600" />;
      case 'pending': return <AlertCircle size={16} className="text-orange-600" />;
      case 'completed': return <CheckCircle size={16} className="text-green-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getCommissionStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle size={16} className="text-green-600" />;
      case 'pending': return <AlertCircle size={16} className="text-orange-600" />;
      case 'processing': return <Clock size={16} className="text-yellow-600" />;
      default: return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const filteredPayroll = payroll.filter(entry => {
    return (
      (!searchQuery || 
       entry.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       entry.payPeriod.toLowerCase().includes(searchQuery.toLowerCase()) ||
       entry.notes.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!statusFilter || entry.status === statusFilter) &&
      (!monthFilter || entry.month === monthFilter) &&
      (!providerFilter || entry.providerName === providerFilter)
    );
  });

  const filteredCommission = commissionData.filter(entry => {
    return (
      (!searchQuery || 
       entry.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       entry.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       entry.customerName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!statusFilter || entry.status === statusFilter) &&
      (!monthFilter || entry.month === monthFilter) &&
      (!providerFilter || entry.providerName === providerFilter)
    );
  });

  const payrollStats = {
    totalGross: payroll.filter(p => p.status === 'completed' || p.status === 'processed').reduce((sum, p) => sum + p.totalGrossPay, 0),
    totalNet: payroll.filter(p => p.status === 'completed' || p.status === 'processed').reduce((sum, p) => sum + p.netPay, 0),
    totalCommission: payroll.filter(p => p.status === 'completed' || p.status === 'processed').reduce((sum, p) => sum + p.totalCommission, 0),
    totalSalaries: payroll.filter(p => p.status === 'completed' || p.status === 'processed').reduce((sum, p) => sum + p.baseSalary, 0),
    totalDeductions: payroll.filter(p => p.status === 'completed' || p.status === 'processed').reduce((sum, p) => sum + p.deductions, 0),
    employees: new Set(payroll.map(p => p.providerId)).size,
    averageCommission: payroll.length > 0 ? (payroll.reduce((sum, p) => sum + p.totalCommission, 0) / payroll.length) : 0,
    bonusPaid: payroll.filter(p => p.status === 'completed' || p.status === 'processed').reduce((sum, p) => sum + p.performanceBonus, 0),
    penalties: payroll.filter(p => p.status === 'completed' || p.status === 'processed').reduce((sum, p) => sum + p.penaltyDeductions, 0)
  };

  const commissionStats = {
    totalCommission: commissionData.reduce((sum, c) => sum + c.commissionAmount, 0),
    approved: commissionData.filter(c => c.status === 'approved').length,
    pending: commissionData.filter(c => c.status === 'pending').length,
    averageCommission: commissionData.length > 0 ? (commissionData.reduce((sum, c) => sum + c.commissionAmount, 0) / commissionData.length) : 0,
    topEarners: [...new Set(commissionData.map(c => c.providerName))].map(provider => {
      const providerCommissions = commissionData.filter(c => c.providerName === provider);
      const total = providerCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
      return { provider, total, count: providerCommissions.length };
    }).sort((a, b) => b.total - a.total).slice(0, 5)
  };

  const handleViewPayroll = (payroll) => {
    setSelectedPayroll(payroll);
    setShowPayrollModal(true);
  };

  const handleGeneratePayroll = () => {
    if (confirm('Generate payroll for current month?')) {
      console.log('Generating monthly payroll...');
      // In real implementation, this would call the payroll generation API
    }
  };

  const PayrollRow = ({ entry }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getPayStatusIcon(entry.status)}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{entry.payPeriod}</div>
            <div className="text-sm text-gray-500">{entry.providerName}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">${entry.baseSalary.toFixed(2)}</div>
        <div className="text-sm text-gray-500">Base Salary</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-green-600">${entry.totalCommission.toFixed(2)}</div>
        <div className="text-sm text-gray-500">@ {(entry.commissionRate * 100).toFixed(0)}%</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-lg font-bold text-gray-900">${entry.totalGrossPay.toFixed(2)}</div>
        <div className="text-sm text-gray-500">Gross Pay</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-red-600">-${entry.deductions.toFixed(2)}</div>
        <div className="text-sm text-gray-500">Taxes+Insurance</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-lg font-bold text-green-600">${entry.netPay.toFixed(2)}</div>
        <div className="text-sm text-gray-500">Net Pay</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(entry.status)}`}>
          {entry.status}
        </span>
        <div className="text-sm text-gray-500 mt-1">{entry.payDate}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button
          onClick={() => handleViewPayroll(entry)}
          className="text-blue-600 hover:text-blue-900"
        >
          <Eye size={16} />
        </button>
        <button className="text-green-600 hover:text-green-900" title="Download Paystub">
          <Download size={16} />
        </button>
      </td>
    </tr>
  );

  const CommissionRow = ({ entry }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getCommissionStatusIcon(entry.status)}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{entry.serviceName}</div>
            <div className="text-sm text-gray-500">{entry.appointmentDate}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{entry.providerName}</div>
        <div className="text-sm text-gray-500">{entry.serviceLocation}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {entry.customerName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">${entry.serviceValue.toFixed(2)}</div>
        <div className="text-sm text-gray-500">Service Value</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-green-600">{entry.commissionRate * 100}%</div>
        <div className="text-sm text-gray-500">Commission Rate</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-lg font-bold text-green-600">${entry.commissionAmount.toFixed(2)}</div>
        <div className="text-sm text-gray-500">Commission</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(entry.status)}`}>
          {entry.status}
        </span>
        <div className="text-sm text-gray-500 mt-1">{entry.paidDate || 'Pending'}</div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Salary + Commission Tracking</h3>
          <p className="text-sm text-gray-600">Manage provider salaries, commissions, and payroll processing</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab(activeTab === 'payroll' ? 'commission' : 'payroll')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {activeTab === 'payroll' ? 'View Commissions' : 'View Payroll'}
          </button>
          <button
            onClick={handleGeneratePayroll}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Calculator size={16} />
            Generate Payroll
          </button>
        </div>
      </div>

      {activeTab === 'payroll' ? (
        <>
          {/* Payroll Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Total Gross</p>
                  <p className="text-2xl font-bold text-green-700">${payrollStats.totalGross.toFixed(2)}</p>
                </div>
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total Net</p>
                  <p className="text-2xl font-bold text-blue-700">${payrollStats.totalNet.toFixed(2)}</p>
                </div>
                <CreditCard className="text-blue-600" size={24} />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Commissions</p>
                  <p className="text-2xl font-bold text-purple-700">${payrollStats.totalCommission.toFixed(2)}</p>
                </div>
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Salaries</p>
                  <p className="text-2xl font-bold text-orange-700">${payrollStats.totalSalaries.toFixed(2)}</p>
                </div>
                <DollarSign className="text-orange-600" size={24} />
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Deductions</p>
                  <p className="text-2xl font-bold text-red-700">${payrollStats.totalDeductions.toFixed(2)}</p>
                </div>
                <BarChart3 className="text-red-600" size={24} />
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Staff</p>
                  <p className="text-2xl font-bold text-yellow-700">{payrollStats.employees}</p>
                </div>
                <Users className="text-yellow-600" size={24} />
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600">Bonuses</p>
                  <p className="text-2xl font-bold text-indigo-700">${payrollStats.bonusPaid.toFixed(2)}</p>
                </div>
                <Award className="text-indigo-600" size={24} />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Commission</p>
                  <p className="text-2xl font-bold text-gray-700">${payrollStats.averageCommission.toFixed(2)}</p>
                </div>
                <Target className="text-gray-600" size={24} />
              </div>
            </div>
          </div>

          {/* Commission Top Performers */}
          {commissionStats.topEarners.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {commissionStats.topEarners.map((earner, index) => (
                <div key={earner.provider} className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{earner.provider}</h4>
                    <span className="text-2xl">#{index + 1}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Commission:</span>
                      <span className="font-medium text-green-600">${earner.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Services:</span>
                      <span className="font-medium text-gray-900">{earner.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Commission Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Total Commission</p>
                  <p className="text-2xl font-bold text-green-700">${commissionStats.totalCommission.toFixed(2)}</p>
                </div>
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Approved</p>
                  <p className="text-2xl font-bold text-blue-700">{commissionStats.approved}</p>
                </div>
                <CheckCircle className="text-blue-600" size={24} />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-700">{commissionStats.pending}</p>
                </div>
                <AlertCircle className="text-orange-600" size={24} />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Avg Commission</p>
                  <p className="text-2xl font-bold text-purple-700">${commissionStats.averageCommission.toFixed(2)}</p>
                </div>
                <BarChart3 className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab} by ${activeTab === 'payroll' ? 'provider or period' : 'service or provider'}...`}
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
            {activeTab === 'payroll' && (
              <>
                <option value="calculated">Calculated</option>
                <option value="processed">Processed</option>
                <option value="completed">Completed</option>
              </>
            )}
          </select>

          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Months</option>
            <option value="2026-03">March 2026</option>
            <option value="2026-02">February 2026</option>
            <option value="2026-01">January 2026</option>
          </select>

          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Providers</option>
            {providers.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>

          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Export
          </button>

          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
            <Plus size={16} />
            Add Manual
          </button>
        </div>
      </div>

      {/* {activeTab === 'payroll' ? PayrollTable : CommissionTable} */}
      {activeTab === 'payroll' ? (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period/Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Pay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Pay
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
                {filteredPayroll.map((entry) => (
                  <PayrollRow key={entry.id} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayroll.length === 0 && (
            <div className="text-center py-12">
              <Calculator size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payroll records found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter || monthFilter || providerFilter 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No payroll records have been created yet'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service/Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCommission.map((entry) => (
                  <CommissionRow key={entry.id} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>

          {filteredCommission.length === 0 && (
            <div className="text-center py-12">
              <Percent size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No commission records found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter || monthFilter || providerFilter 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No commission records have been created yet'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Payroll Details Modal */}
      {showPayrollModal && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Payroll Details - {selectedPayroll.providerName}</h3>
              <button
                onClick={() => setShowPayrollModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Pay Period</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Period:</span>
                    <span className="font-medium">{selectedPayroll.payPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processed:</span>
                    <span className="font-medium">{selectedPayroll.processedDate || 'Pending'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pay Date:</span>
                    <span className="font-medium">{selectedPayroll.payDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedPayroll.status)}`}>
                      {selectedPayroll.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Pay Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Salary:</span>
                    <span className="font-medium">${selectedPayroll.baseSalary.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission:</span>
                    <span className="font-medium text-green-600">${selectedPayroll.totalCommission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Performance Bonus:</span>
                    <span className="font-medium text-green-600">${selectedPayroll.performanceBonus.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-medium">Total Gross:</span>
                    <span className="font-bold text-lg">${selectedPayroll.totalGrossPay.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Deductions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes:</span>
                    <span className="font-medium">-${selectedPayroll.taxDeductions.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Insurance:</span>
                    <span className="font-medium">-${selectedPayroll.insuranceDeductions.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other:</span>
                    <span className="font-medium">-${selectedPayroll.otherDeductions.toFixed(2)}</span>
                  </div>
                  {selectedPayroll.penaltyDeductions > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Penalties:</span>
                      <span className="font-medium text-red-600">-${selectedPayroll.penaltyDeductions.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-medium">Total Deductions:</span>
                    <span className="font-bold">-${selectedPayroll.deductions.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium mb-3">Net Pay Calculation</h4>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Total Gross Pay</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">${selectedPayroll.totalGrossPay.toFixed(2)}</div>
                
                <div className="text-sm text-red-600 mb-1">Less: Total Deductions</div>
                <div className="text-xl font-bold text-red-600 mb-2">-${selectedPayroll.deductions.toFixed(2)}</div>
                
                <div className="border-t-2 border-gray-400 pt-2">
                  <div className="text-sm text-gray-900 mb-1">Net Pay</div>
                  <div className="text-3xl font-bold text-green-600">${selectedPayroll.netPay.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium mb-3">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Services Completed:</span>
                    <span className="font-medium">{selectedPayroll.servicesCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Service Value:</span>
                    <span className="font-medium">${selectedPayroll.averageServiceValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission Rate:</span>
                    <span className="font-medium">{(selectedPayroll.commissionRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission Eligible:</span>
                    <span className="font-medium">${selectedPayroll.commissionEligible.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Payment Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{selectedPayroll.payMethod}</span>
                  </div>
                  {selectedPayroll.bankAccount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank Account:</span>
                      <span className="font-medium">{selectedPayroll.bankAccount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission Rate:</span>
                    <span className="font-medium">{(selectedPayroll.commissionRate * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedPayroll.notes && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Notes</h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedPayroll.notes}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowPayrollModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Print Pay Stub
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryCommission;