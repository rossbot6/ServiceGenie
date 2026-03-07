import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Search, Filter, Download, Eye, Edit, Trash2, Calendar, Users, CheckCircle, AlertCircle, Clock, PieChart, BarChart3 } from 'lucide-react';

const CashTracking = () => {
  const [cashTransactions] = useState([
    {
      id: 'cash_001',
      type: 'receipt',
      amount: 185.00,
      customerName: 'Emma Thompson',
      service: 'Full Balayage + Cut',
      provider: 'Emma Wilson',
      location: 'Downtown Salon',
      employee: 'Sarah Johnson (Front Desk)',
      timestamp: '2026-03-07T10:30:00Z',
      paymentMethod: 'Cash',
      appointmentId: 'apt_001',
      receiptNumber: 'R001',
      denominationBreakdown: {
        '100': 1,
        '50': 1,
        '20': 1,
        '10': 1,
        '5': 1,
        '1': 0,
        '0.25': 0,
        '0.10': 0,
        '0.05': 0
      },
      changeGiven: 0,
      notes: 'Customer paid exact amount',
      reconciled: true
    },
    {
      id: 'cash_002',
      type: 'receipt',
      amount: 75.00,
      customerName: 'Michael Chen',
      service: "Men's Haircut",
      provider: 'James Brown',
      location: 'Brooklyn Branch',
      employee: 'Lisa Martinez (Front Desk)',
      timestamp: '2026-03-07T11:15:00Z',
      paymentMethod: 'Cash',
      appointmentId: 'apt_002',
      receiptNumber: 'R002',
      denominationBreakdown: {
        '100': 0,
        '50': 1,
        '20': 1,
        '10': 0,
        '5': 1,
        '1': 0,
        '0.25': 0,
        '0.10': 0,
        '0.05': 0
      },
      changeGiven: 0,
      notes: 'Customer paid with $100 bill, exact amount',
      reconciled: false
    },
    {
      id: 'cash_003',
      type: 'expense',
      amount: 25.00,
      customerName: null,
      service: null,
      provider: null,
      location: 'Downtown Salon',
      employee: 'David Lee (Manager)',
      timestamp: '2026-03-07T12:00:00Z',
      paymentMethod: 'Cash',
      appointmentId: null,
      receiptNumber: 'EXP001',
      denominationBreakdown: {
        '100': 0,
        '50': 0,
        '20': 1,
        '10': 0,
        '5': 1,
        '1': 0,
        '0.25': 0,
        '0.10': 0,
        '0.05': 0
      },
      changeGiven: 0,
      notes: 'Bought cleaning supplies - receipts attached',
      reconciled: true,
      category: 'Supplies'
    },
    {
      id: 'cash_004',
      type: 'receipt',
      amount: 150.00,
      customerName: 'Sofia Garcia',
      service: 'Keratin Treatment',
      provider: 'Sofia Garcia',
      location: 'Brooklyn Branch',
      employee: 'Maria Rodriguez (Front Desk)',
      timestamp: '2026-03-07T13:45:00Z',
      paymentMethod: 'Cash',
      appointmentId: 'apt_003',
      receiptNumber: 'R003',
      denominationBreakdown: {
        '100': 1,
        '50': 1,
        '0': 0,
        '10': 0,
        '5': 0,
        '1': 0,
        '0.25': 0,
        '0.10': 0,
        '0.05': 0
      },
      changeGiven: 0,
      notes: 'Customer paid with $100 & $50 bills',
      reconciled: false
    },
    {
      id: 'cash_005',
      type: 'receipt',
      amount: 95.00,
      customerName: 'David Lee',
      service: 'Color Consultation',
      provider: 'Emma Wilson',
      location: 'Downtown Salon',
      employee: 'Sarah Johnson (Front Desk)',
      timestamp: '2026-03-07T14:20:00Z',
      paymentMethod: 'Cash',
      appointmentId: 'apt_004',
      receiptNumber: 'R004',
      denominationBreakdown: {
        '100': 0,
        '50': 1,
        '20': 2,
        '10': 0,
        '5': 1,
        '1': 0,
        '0.25': 0,
        '0.10': 0,
        '0.05': 0
      },
      changeGiven: 0,
      notes: 'Customer paid with $50 bill, received consultation',
      reconciled: false
    },
    {
      id: 'cash_006',
      type: 'expense',
      amount: 12.50,
      customerName: null,
      service: null,
      provider: null,
      location: 'Brooklyn Branch',
      employee: 'Carlos Mendez (Manager)',
      timestamp: '2026-03-07T15:00:00Z',
      paymentMethod: 'Cash',
      appointmentId: null,
      receiptNumber: 'EXP002',
      denominationBreakdown: {
        '100': 0,
        '50': 0,
        '20': 0,
        '10': 1,
        '5': 0,
        '1': 2,
        '0.25': 2,
        '0.10': 0,
        '0.05': 0
      },
      changeGiven: 0,
      notes: 'Employee lunch allowance',
      reconciled: true,
      category: 'Employee Benefits'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showCashCount, setShowCashCount] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  const locations = [...new Set(cashTransactions.map(t => t.location))];
  const employees = [...new Set(cashTransactions.map(t => t.employee))];

  const getTypeIcon = (type) => {
    return type === 'receipt' 
      ? <TrendingUp size={16} className="text-green-600" />
      : <TrendingDown size={16} className="text-red-600" />;
  };

  const getTypeColor = (type) => {
    return type === 'receipt' 
      ? 'text-green-600' 
      : 'text-red-600';
  };

  const getLocationCashCount = (location) => {
    const locationTransactions = cashTransactions.filter(t => t.location === location && t.type === 'receipt' && t.reconciled);
    
    let total = 0;
    let denominationCount = {
      '100': 0, '50': 0, '20': 0, '10': 0, '5': 0, '1': 0, '0.25': 0, '0.10': 0, '0.05': 0
    };

    locationTransactions.forEach(transaction => {
      total += transaction.amount;
      Object.entries(transaction.denominationBreakdown).forEach(([denom, count]) => {
        denominationCount[denom] += count;
      });
    });

    return { total, denominationCount };
  };

  const filteredTransactions = cashTransactions.filter(transaction => {
    return (
      (!searchQuery || 
       transaction.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       transaction.service?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       transaction.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
       transaction.employee.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!typeFilter || transaction.type === typeFilter) &&
      (!locationFilter || transaction.location === locationFilter) &&
      (!employeeFilter || transaction.employee === employeeFilter) &&
      (!dateFilter || new Date(transaction.timestamp).toISOString().split('T')[0] === dateFilter)
    );
  });

  const stats = {
    totalReceipts: cashTransactions.filter(t => t.type === 'receipt').reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: cashTransactions.filter(t => t.type === 'expense').reduce((sum, t) => t.amount, 0),
    netCash: cashTransactions.filter(t => t.type === 'receipt').reduce((sum, t) => sum + t.amount, 0) - 
              cashTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    pendingReconciliation: cashTransactions.filter(t => !t.reconciled).length,
    transactionsToday: cashTransactions.filter(t => 
      new Date(t.timestamp).toDateString() === new Date().toDateString()).length,
    averageTransaction: cashTransactions.length > 0 ? 
      (cashTransactions.reduce((sum, t) => sum + t.amount, 0) / cashTransactions.length) : 0
  };

  const statsByLocation = locations.map(location => {
    const locationTransactions = cashTransactions.filter(t => t.location === location);
    const receipts = locationTransactions.filter(t => t.type === 'receipt').reduce((sum, t) => sum + t.amount, 0);
    const expenses = locationTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return {
      location,
      receipts,
      expenses,
      net: receipts - expenses,
      transactions: locationTransactions.length
    };
  });

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const handleCountCash = () => {
    if (confirm('This will help you reconcile your cash drawer. Continue?')) {
      console.log('Starting cash count process...');
      // In real implementation, this would open a cash count interface
    }
  };

  const TransactionRow = ({ transaction }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getTypeIcon(transaction.type)}
          <span className={`ml-2 text-sm font-medium ${getTypeColor(transaction.type)}`}>
            {transaction.type === 'receipt' ? 'RECEIPT' : 'EXPENSE'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{transaction.receiptNumber}</div>
          <div className="text-sm text-gray-500">{new Date(transaction.timestamp).toLocaleDateString()}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {transaction.customerName || 'N/A'}
        </div>
        {transaction.service && (
          <div className="text-sm text-gray-500">{transaction.service}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {transaction.employee}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
          {transaction.type === 'receipt' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{transaction.location}</div>
          {transaction.category && (
            <div className="text-xs text-gray-500">{transaction.category}</div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {transaction.reconciled ? (
            <CheckCircle size={16} className="text-green-600" />
          ) : (
            <AlertCircle size={16} className="text-yellow-600" />
          )}
          <span className="ml-2 text-sm text-gray-900">
            {transaction.reconciled ? 'Reconciled' : 'Pending'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => handleViewDetails(transaction)}
          className="text-blue-600 hover:text-blue-900 mr-2"
        >
          <Eye size={16} />
        </button>
        <button
          className="text-green-600 hover:text-green-900"
          onClick={handleCountCash}
        >
          <BarChart3 size={16} />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Cash Tracking</h3>
          <p className="text-sm text-gray-600">Track cash receipts, expenses, and reconciliation</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCashCount(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <BarChart3 size={16} />
            Count Cash
          </button>
          <button
            onClick={() => setShowAddTransaction(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Total Receipts</p>
              <p className="text-2xl font-bold text-green-700">${stats.totalReceipts.toFixed(2)}</p>
            </div>
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700">${stats.totalExpenses.toFixed(2)}</p>
            </div>
            <TrendingDown className="text-red-600" size={24} />
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Net Cash</p>
              <p className={`text-2xl font-bold ${stats.netCash >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                ${stats.netCash.toFixed(2)}
              </p>
            </div>
            <DollarSign className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pendingReconciliation}</p>
            </div>
            <AlertCircle className="text-yellow-600" size={24} />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Today</p>
              <p className="text-2xl font-bold text-purple-700">{stats.transactionsToday}</p>
            </div>
            <Calendar className="text-purple-600" size={24} />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg</p>
              <p className="text-2xl font-bold text-gray-700">${stats.averageTransaction.toFixed(2)}</p>
            </div>
            <PieChart className="text-gray-600" size={24} />
          </div>
        </div>
      </div>

      {/* Cash Status by Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsByLocation.map((location) => (
          <div key={location.location} className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-gray-900">{location.location}</h4>
              <span className="text-sm text-gray-500">{location.transactions} transactions</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-green-600">Receipts:</span>
                <span className="font-medium text-green-600">${location.receipts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-red-600">Expenses:</span>
                <span className="font-medium text-red-600">${location.expenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">Net:</span>
                <span className={`font-bold ${location.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${location.net.toFixed(2)}
                </span>
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
            placeholder="Search by customer, service, location, or employee..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Types</option>
            <option value="receipt">Receipts</option>
            <option value="expense">Expenses</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Employees</option>
            {employees.map((employee) => (
              <option key={employee} value={employee}>{employee}</option>
            ))}
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

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ref/Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer/Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
              {filteredTransactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || typeFilter || locationFilter || employeeFilter || dateFilter 
                ? 'Try adjusting your search or filter criteria' 
                : 'No cash transactions have been recorded yet'}
            </p>
          </div>
        )}
      </div>

      {/* Cash Count Modal */}
      {showCashCount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Cash Count by Location</h3>
              <button
                onClick={() => setShowCashCount(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {statsByLocation.map((location) => {
                const { total, denominationCount } = getLocationCashCount(location.location);
                return (
                  <div key={location.location} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">{location.location}</h4>
                    <div className="mb-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Cash:</span>
                        <span className="font-bold text-green-600">${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {Object.entries(denominationCount).map(([denom, count]) => (
                        count > 0 && (
                          <div key={denom} className="flex justify-between">
                            <span>{denom === '0.25' ? '25¢' : denom === '0.10' ? '10¢' : denom === '0.05' ? '5¢' : `$${denom}`}</span>
                            <span className="font-medium">{count}x</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCashCount(false)}
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

export default CashTracking;