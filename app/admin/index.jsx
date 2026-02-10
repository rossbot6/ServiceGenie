import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Switch, Alert, SafeAreaView, Platform } from 'react-native';
import { useState } from 'react';
import { Building2, Users, UserCircle, Calendar, CreditCard, Settings, BarChart3, Bell, Plus, Search, Edit, Trash2, ChevronRight, MapPin, Phone, DollarSign, Clock, XCircle, RefreshCw, Download, User, UserCheck, Shield, Check, X, Smartphone, Mail, Star, Map, Mail as MailIcon, Gift } from 'lucide-react-native';
import mockData from '../../data/mockData.json';

const INITIAL_PROVIDERS = mockData.stylists.map((s) => ({
  ...s,
  status: 'active',
  appointmentsToday: Math.floor(Math.random() * 8) + 1,
  revenueMonth: Math.floor(Math.random() * 5000) + 2000,
  rating: (4 + Math.random()).toFixed(1)
}));

const INITIAL_SERVICES = [
  { 
    id: 'svc_001', 
    name: 'Haircut & Style', 
    price: 75, 
    duration: 60, 
    category: 'Hair',
    addOns: [
      { name: 'Deep Conditioning', price: 15 },
      { name: 'Scalp Massage', price: 20 }
    ],
    variants: [
      { name: 'Short Hair', price: 60 },
      { name: 'Long Hair', price: 85 }
    ]
  },
  { 
    id: 'svc_002', 
    name: 'Color & Highlights', 
    price: 150, 
    duration: 120, 
    category: 'Hair',
    addOns: [
      { name: 'Gloss Treatment', price: 30 },
      { name: 'Bond Builder', price: 25 }
    ]
  },
  { 
    id: 'svc_003', 
    name: 'Manicure', 
    price: 45, 
    duration: 45, 
    category: 'Nails',
    variants: [
      { name: 'Gel Polish', price: 15 },
      { name: 'Nail Art', price: 10 }
    ]
  },
  { id: 'svc_004', name: 'Pedicure', price: 55, duration: 60, category: 'Nails' },
  { id: 'svc_005', name: 'Blowout', price: 50, duration: 30, category: 'Hair' },
];

const INITIAL_LOCATIONS = mockData.locations || [];

const CATEGORIES = ['Hair', 'Nails', 'Spa', 'Beauty', 'Massage'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [providerModal, setProviderModal] = useState({ visible: false, mode: 'add', data: null });
  const [serviceModal, setServiceModal] = useState({ visible: false, mode: 'add', data: null });
  const [locationModal, setLocationModal] = useState({ visible: false, mode: 'add', data: null });

  const stats = {
    totalProviders: providers.length,
    totalServices: services.length,
    totalLocations: locations.length,
    totalRevenue: providers.reduce((sum, p) => sum + p.revenueMonth, 0),
    appointmentsToday: providers.reduce((sum, p) => sum + p.appointmentsToday, 0),
  };

  const filteredProviders = providers.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.statsGrid}>
        <TouchableOpacity style={styles.statCard} onPress={() => setActiveTab('providers')}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}><Users size={24} color="#6366f1" /></View>
          <Text style={styles.statValue}>{stats.totalProviders}</Text>
          <Text style={styles.statLabel}>Providers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => setActiveTab('services')}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}><CreditCard size={24} color="#10b981" /></View>
          <Text style={styles.statValue}>{stats.totalServices}</Text>
          <Text style={styles.statLabel}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => setActiveTab('locations')}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}><Building2 size={24} color="#f59e0b" /></View>
          <Text style={styles.statValue}>{stats.totalLocations}</Text>
          <Text style={styles.statLabel}>Locations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}><DollarSign size={24} color="#ef4444" /></View>
          <Text style={styles.statValue}>${stats.totalRevenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Revenue (Month)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} onPress={() => setProviderModal({ visible: true, mode: 'add', data: null })}>
            <Plus size={20} color="#6366f1" /><Text style={styles.actionText}>Add Provider</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => setServiceModal({ visible: true, mode: 'add', data: null })}>
            <CreditCard size={20} color="#10b981" /><Text style={styles.actionText}>Add Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => setLocationModal({ visible: true, mode: 'add', data: null })}>
            <Building2 size={20} color="#f59e0b" /><Text style={styles.actionText}>Add Location</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {providers.slice(0, 3).map((provider) => (
          <View key={provider.id} style={styles.activityItem}>
            <View style={styles.activityAvatar}><Text style={styles.avatarText}>{provider.name[0]}</Text></View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityText}><Text style={styles.activityName}>{provider.name}</Text> completed {provider.appointmentsToday} appointments</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderAppointments = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#64748b" />
          <TextInput style={styles.searchInput} placeholder="Search appointments..." placeholderTextColor="#64748b" />
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Book</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.miniStat}>
          <Text style={styles.miniStatValue}>{mockData.appointments.length}</Text>
          <Text style={styles.miniStatLabel}>Total</Text>
        </View>
        <View style={styles.miniStat}>
          <Text style={styles.miniStatValue}>1</Text>
          <Text style={styles.miniStatLabel}>Today</Text>
        </View>
        <View style={styles.miniStat}>
          <Text style={styles.miniStatValue}>1</Text>
          <Text style={styles.miniStatLabel}>Confirmed</Text>
        </View>
      </View>
      {mockData.appointments.map((apt) => (
        <View key={apt.id} style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentCustomer}>{apt.customerName || mockData.customers.find(c => c.id === apt.customerId)?.name || 'Unknown'}</Text>
              <Text style={styles.appointmentService}>{apt.serviceName || apt.service || 'Service'}</Text>
            </View>
            <View style={[styles.statusBadge, apt.status === 'confirmed' ? styles.confirmedBadge : styles.pendingBadge]}>
              <Text style={[styles.statusText, apt.status === 'confirmed' ? styles.confirmedText : styles.pendingText]}>{apt.status}</Text>
            </View>
          </View>
          <View style={styles.appointmentDetails}>
            <View style={styles.appointmentDetail}>
              <Calendar size={14} color="#94a3b8" />
              <Text style={styles.appointmentDetailText}>{apt.date}</Text>
            </View>
            <View style={styles.appointmentDetail}>
              <Clock size={14} color="#94a3b8" />
              <Text style={styles.appointmentDetailText}>{apt.time}</Text>
            </View>
            <View style={styles.appointmentDetail}>
              <User size={14} color="#94a3b8" />
              <Text style={styles.appointmentDetailText}>{mockData.stylists.find(s => s.id === apt.stylistId)?.name || 'Unknown'}</Text>
            </View>
          </View>
          {apt.isWalkIn && (
            <View style={styles.walkInIndicator}>
              <Text style={styles.walkInText}>WALK-IN</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );

  const renderProviders = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#64748b" />
          <TextInput style={styles.searchInput} placeholder="Search providers..." placeholderTextColor="#64748b" value={searchQuery} onChangeText={setSearchQuery} />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setProviderModal({ visible: true, mode: 'add', data: null })}>
          <Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Add Provider</Text>
        </TouchableOpacity>
      </View>
      {filteredProviders.map((provider) => (
        <View key={provider.id} style={styles.providerCard}>
          <View style={styles.providerHeader}>
            <Image source={{ uri: provider.image }} style={styles.providerAvatar} />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
              <View style={[styles.statusBadge, provider.status === 'active' ? styles.activeBadge : styles.inactiveBadge]}>
                <Text style={[styles.statusText, provider.status === 'active' ? styles.activeStatusText : styles.inactiveStatusText]}>{provider.status}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => setProviderModal({ visible: true, mode: 'edit', data: provider })}>
              <Edit size={16} color="#6366f1" />
            </TouchableOpacity>
          </View>
          <View style={styles.providerStats}>
            <View style={styles.providerStat}><Calendar size={14} color="#94a3b8" /><Text style={styles.providerStatText}>{provider.appointmentsToday} today</Text></View>
            <View style={styles.providerStat}><DollarSign size={14} color="#10b981" /><Text style={styles.providerStatText}>${provider.revenueMonth}/mo</Text></View>
            <View style={styles.providerStat}><Star size={14} color="#f59e0b" /><Text style={styles.providerStatText}>{provider.rating}</Text></View>
          </View>
          <View style={styles.providerReviews}>
            <View style={styles.reviewsHeader}>
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.reviewsTitle}>Recent Reviews</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewText}>"Amazing service! {provider.name.split(' ')[0]} always does an excellent job."</Text>
              <Text style={styles.reviewAuthor}>- Sarah P.</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderServices = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#64748b" />
          <TextInput style={styles.searchInput} placeholder="Search services..." placeholderTextColor="#64748b" />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setServiceModal({ visible: true, mode: 'add', data: null })}>
          <Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Add Service</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryFilter}>
        <TouchableOpacity style={[styles.categoryChip, styles.activeCategory]}><Text style={styles.activeCategoryText}>All</Text></TouchableOpacity>
        {CATEGORIES.map((cat) => (<TouchableOpacity key={cat} style={styles.categoryChip}><Text style={styles.categoryText}>{cat}</Text></TouchableOpacity>))}
      </ScrollView>
      {services.map((service) => (
        <View key={service.id} style={styles.serviceCard}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <View style={styles.serviceMeta}>
              <View style={styles.serviceBadge}><Clock size={12} color="#6366f1" /><Text style={styles.serviceMetaText}>{service.duration} min</Text></View>
              <View style={styles.serviceBadge}><CreditCard size={12} color="#10b981" /><Text style={styles.serviceMetaText}>${service.price}</Text></View>
            </View>
          </View>
          <View style={styles.serviceActions}>
            <TouchableOpacity style={styles.smallEditButton} onPress={() => setServiceModal({ visible: true, mode: 'edit', data: service })}><Edit size={14} color="#fff" /></TouchableOpacity>
            <TouchableOpacity style={styles.smallDeleteButton} onPress={() => Alert.alert('Delete Service', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => setServices(services.filter(s => s.id !== service.id)) }])}>
              <Trash2 size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          {(service.addOns?.length > 0 || service.variants?.length > 0) && (
            <View style={styles.serviceExtras}>
              {service.addOns?.map((addon, idx) => (
                <View key={idx} style={styles.extraChip}>
                  <Text style={styles.extraChipText}>+ {addon.name} (+${addon.price})</Text>
                </View>
              ))}
              {service.variants?.map((variant, idx) => (
                <View key={idx} style={[styles.extraChip, styles.variantChip]}>
                  <Text style={styles.extraChipText}>{variant.name} ${variant.price}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );

  const renderLocations = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#64748b" />
          <TextInput style={styles.searchInput} placeholder="Search locations..." placeholderTextColor="#64748b" />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setLocationModal({ visible: true, mode: 'add', data: null })}>
          <Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Add Location</Text>
        </TouchableOpacity>
      </View>
      {mockData.locations.map((location) => (
        <View key={location.id} style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={styles.locationIcon}><Building2 size={24} color="#6366f1" /></View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{location.name}</Text>
              <View style={styles.locationDetail}><MapPin size={14} color="#94a3b8" /><Text style={styles.locationAddress}>{location.address}</Text></View>
              <View style={styles.locationDetail}><Phone size={14} color="#94a3b8" /><Text style={styles.locationPhone}>{location.phone}</Text></View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => setLocationModal({ visible: true, mode: 'edit', data: location })}>
              <Edit size={16} color="#6366f1" />
            </TouchableOpacity>
          </View>
          <View style={styles.policiesSection}>
            <Text style={styles.policiesTitle}>Booking Policies</Text>
            <View style={styles.policiesGrid}>
              <View style={styles.policyItem}>
                <Clock size={14} color="#f59e0b" />
                <Text style={styles.policyLabel}>Min Lead Time</Text>
                <Text style={styles.policyValue}>{location.bookingPolicies?.minLeadHours || 24}h</Text>
              </View>
              <View style={styles.policyItem}>
                <Clock size={14} color="#10b981" />
                <Text style={styles.policyLabel}>Buffer Time</Text>
                <Text style={styles.policyValue}>{location.bookingPolicies?.bufferMinutes || 15}m</Text>
              </View>
              <View style={styles.policyItem}>
                <Calendar size={14} color="#6366f1" />
                <Text style={styles.policyLabel}>Cancel Window</Text>
                <Text style={styles.policyValue}>{location.bookingPolicies?.cancellationWindowHours || 24}h</Text>
              </View>
              <View style={styles.policyItem}>
                <DollarSign size={14} color="#10b981" />
                <Text style={styles.policyLabel}>Cancel Fee</Text>
                <Text style={styles.policyValue}>{location.bookingPolicies?.cancellationFeePercent || 50}%</Text>
              </View>
              <View style={styles.policyItem}>
                <CreditCard size={14} color="#ec4899" />
                <Text style={styles.policyLabel}>Deposit</Text>
                <Text style={styles.policyValue}>{location.bookingPolicies?.requireDeposit ? `$${location.bookingPolicies?.depositAmount || 25}` : 'None'}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const exportCustomers = () => {
    const headers = ['Name', 'Phone', 'Email', 'Notes', 'Tags'];
    const rows = mockData.customers.map(c => [
      c.name,
      c.phone || '',
      c.email || '',
      c.notes || '',
      (c.tags || []).join('; ')
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderPayments = () => {
    const totalRevenue = mockData.customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);
    const avgPerVisit = mockData.customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0) / Math.max(1, mockData.customers.reduce((sum, c) => sum + (c.visitCount || 0), 0));
    
    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <Text style={styles.sectionTitle}>Revenue & Payments</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <DollarSign size={24} color="#10b981" />
            </View>
            <Text style={styles.statValue}>${totalRevenue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <CreditCard size={24} color="#6366f1" />
            </View>
            <Text style={styles.statValue}>${avgPerVisit.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Avg Per Visit</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
              <Users size={24} color="#f97316" />
            </View>
            <Text style={styles.statValue}>{mockData.customers.filter(c => c.visitCount > 0).length}</Text>
            <Text style={styles.statLabel}>Active Clients</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Provider Compensation</Text>
        {mockData.stylists.map((provider) => {
          const providerRevenue = mockData.customers
            .flatMap(c => (c.visitHistory || []).filter(v => v.provider === provider.name))
            .reduce((sum, v) => sum + (v.amount || 0), 0);
          const commission = provider.commission?.rate || 0;
          const payout = (providerRevenue * commission / 100) + (provider.baseSalary || 0);
          
          return (
            <View key={provider.id} style={styles.commissionCard}>
              <View style={styles.commissionHeader}>
                <Image source={{ uri: provider.image }} style={styles.commissionAvatar} />
                <View style={styles.commissionInfo}>
                  <Text style={styles.commissionName}>{provider.name}</Text>
                  <Text style={styles.commissionSpecialty}>{provider.specialty}</Text>
                </View>
                <View style={styles.commissionBadge}>
                  <Text style={styles.commissionBadgeText}>
                    {provider.paymentMethod === 'commission_only' ? 'Commission Only' : 
                     provider.paymentMethod === 'salary_plus_commission' ? 'Salary + Commission' : 'Percentage'}
                  </Text>
                </View>
              </View>
              <View style={styles.commissionDetails}>
                <View style={styles.commissionRow}>
                  <Text style={styles.commissionLabel}>Revenue Generated</Text>
                  <Text style={styles.commissionValue}>${providerRevenue.toFixed(2)}</Text>
                </View>
                <View style={styles.commissionRow}>
                  <Text style={styles.commissionLabel}>Commission Rate</Text>
                  <Text style={styles.commissionValue}>{commission}%</Text>
                </View>
                {provider.baseSalary > 0 && (
                  <View style={styles.commissionRow}>
                    <Text style={styles.commissionLabel}>Base Salary</Text>
                    <Text style={styles.commissionValue}>${provider.baseSalary}</Text>
                  </View>
                )}
                <View style={[styles.commissionRow, styles.totalRow]}>
                  <Text style={styles.commissionTotalLabel}>Est. Payout</Text>
                  <Text style={styles.commissionTotalValue}>${payout.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          );
        })}

        <TouchableOpacity style={styles.exportButton} onClick={() => alert('Payout report exported!')}>
          <Download size={18} color="#94a3b8" /><Text style={styles.exportButtonText}>Export Payout Report</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderAnalytics = () => {
    const totalCustomers = mockData.customers.length;
    const activeCustomers = mockData.customers.filter(c => c.visitCount > 0).length;
    const retentionRate = totalCustomers > 0 ? ((activeCustomers / totalCustomers) * 100).toFixed(1) : 0;
    const avgVisits = totalCustomers > 0 ? (mockData.customers.reduce((sum, c) => sum + (c.visitCount || 0), 0) / totalCustomers).toFixed(1) : 0;
    const avgLifetimeValue = totalCustomers > 0 ? (mockData.customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0) / totalCustomers).toFixed(2) : 0;
    
    const locationStats = mockData.locations.map(loc => ({
      ...loc,
      customerCount: mockData.customers.filter(c => c.linkedStylists.length > 0).length,
      revenue: mockData.customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0) / mockData.locations.length
    }));

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <Text style={styles.sectionTitle}>Analytics Dashboard</Text>
        </View>

        <Text style={styles.analyticsSectionTitle}>Customer Insights</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <Users size={24} color="#6366f1" />
            </View>
            <Text style={styles.statValue}>{totalCustomers}</Text>
            <Text style={styles.statLabel}>Total Customers</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <UserCircle size={24} color="#10b981" />
            </View>
            <Text style={styles.statValue}>{retentionRate}%</Text>
            <Text style={styles.statLabel}>Retention Rate</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
              <BarChart3 size={24} color="#f97316" />
            </View>
            <Text style={styles.statValue}>{avgVisits}</Text>
            <Text style={styles.statLabel}>Avg Visits</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
              <DollarSign size={24} color="#ec4899" />
            </View>
            <Text style={styles.statValue}>${avgLifetimeValue}</Text>
            <Text style={styles.statLabel}>Avg Lifetime Value</Text>
          </View>
        </View>

        <Text style={styles.analyticsSectionTitle}>Location Comparison</Text>
        {locationStats.map((loc) => (
          <View key={loc.id} style={styles.locationComparisonCard}>
            <View style={styles.locationComparisonHeader}>
              <Building2 size={20} color="#6366f1" />
              <Text style={styles.locationComparisonName}>{loc.name}</Text>
            </View>
            <View style={styles.locationComparisonMetrics}>
              <View style={styles.comparisonMetric}>
                <Text style={styles.comparisonValue}>{loc.customerCount}</Text>
                <Text style={styles.comparisonLabel}>Customers</Text>
              </View>
              <View style={styles.comparisonMetric}>
                <Text style={styles.comparisonValue}>${loc.revenue.toFixed(0)}</Text>
                <Text style={styles.comparisonLabel}>Revenue</Text>
              </View>
              <View style={styles.comparisonMetric}>
                <Text style={styles.comparisonValue}>{(loc.revenue / Math.max(1, loc.customerCount)).toFixed(0)}</Text>
                <Text style={styles.comparisonLabel}>Per Customer</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.exportButtonsRow}>
          <TouchableOpacity style={styles.exportButton}>
            <Download size={18} color="#94a3b8" /><Text style={styles.exportButtonText}>Export Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderTeams = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#64748b" />
          <TextInput style={styles.searchInput} placeholder="Search teams..." placeholderTextColor="#64748b" />
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Add Team</Text>
        </TouchableOpacity>
      </View>
      {mockData.teams.map((team) => (
        <View key={team.id} style={styles.teamCard}>
          <View style={styles.teamHeader}>
            <View style={[styles.teamColor, { backgroundColor: team.color }]} />
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.teamCount}>{mockData.stylists.filter(s => s.id.includes('001') || s.id.includes('002')).length} members</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={16} color="#6366f1" />
            </TouchableOpacity>
          </View>
          <View style={styles.teamMembers}>
            {mockData.stylists.slice(0, 2).map((member) => (
              <View key={member.id} style={styles.teamMember}>
                <Image source={{ uri: member.image }} style={styles.teamMemberAvatar} />
                <Text style={styles.teamMemberName}>{member.name}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderRoles = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.sectionTitle}>Staff Roles & Permissions</Text>
      </View>
      <View style={styles.rolesSection}>
        <View style={styles.roleCard}>
          <View style={styles.roleHeader}>
            <Shield size={24} color="#6366f1" />
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>Admin</Text>
              <Text style={styles.roleDescription}>Full access to all features and settings</Text>
            </View>
            <View style={styles.roleBadgeAdmin}>
              <Text style={styles.roleBadgeText}>1</Text>
            </View>
          </View>
          <View style={styles.permissionsList}>
            <Text style={styles.permissionsTitle}>Can access:</Text>
            <View style={styles.permissionItem}><Check size={14} color="#10b981" /><Text style={styles.permissionText}>All features</Text></View>
            <View style={styles.permissionItem}><Check size={14} color="#10b981" /><Text style={styles.permissionText}>All locations</Text></View>
            <View style={styles.permissionItem}><Check size={14} color="#10b981" /><Text style={styles.permissionText}>Financial settings</Text></View>
          </View>
        </View>

        <View style={styles.roleCard}>
          <View style={styles.roleHeader}>
            <Building2 size={24} color="#f59e0b" />
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>Location Manager</Text>
              <Text style={styles.roleDescription}>Full access to assigned locations only</Text>
            </View>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>1</Text>
            </View>
          </View>
          <View style={styles.permissionsList}>
            <Text style={styles.permissionsTitle}>Can access:</Text>
            <View style={styles.permissionItem}><Check size={14} color="#10b981" /><Text style={styles.permissionText}>Assigned location(s)</Text></View>
            <View style={styles.permissionItem}><Check size={14} color="#10b981" /><Text style={styles.permissionText}>Staff management</Text></View>
            <View style={styles.permissionItem}><X size={14} color="#ef4444" /><Text style={styles.permissionText}>Other locations</Text></View>
          </View>
        </View>

        <View style={styles.roleCard}>
          <View style={styles.roleHeader}>
            <UserCircle size={24} color="#10b981" />
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>Provider / Stylist</Text>
              <Text style={styles.roleDescription}>Own schedule and appointments only</Text>
            </View>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>2</Text>
            </View>
          </View>
          <View style={styles.permissionsList}>
            <Text style={styles.permissionsTitle}>Can access:</Text>
            <View style={styles.permissionItem}><Check size={14} color="#10b981" /><Text style={styles.permissionText}>Own schedule</Text></View>
            <View style={styles.permissionItem}><Check size={14} color="#10b981" /><Text style={styles.permissionText}>Own appointments</Text></View>
            <View style={styles.permissionItem}><X size={14} color="#ef4444" /><Text style={styles.permissionText}>Financial settings</Text></View>
          </View>
        </View>

        <View style={styles.roleCard}>
          <View style={styles.roleHeader}>
            <Phone size={24} color="#ec4899" />
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>Front Desk / Receptionist</Text>
              <Text style={styles.roleDescription}>Book appointments, view customer notes</Text>
            </View>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>1</Text>
            </View>
          </View>
          <View style={styles.permissionsList}>
            <Text style={styles.permissionsTitle}>Can access:</Text>
            <View style={styles.permissionItem}><Check size={14} color="#10b981" /><Text style={styles.permissionText}>Book appointments</Text></View>
            <View style={styles.permissionItem}><Check size={14} color="#10b981" /><Text style={styles.permissionText}>Customer notes</Text></View>
            <View style={styles.permissionItem}><X size={14} color="#ef4444" /><Text style={styles.permissionText}>Financial settings</Text></View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderSettings = () => {
    const [templates, setTemplates] = useState({
      confirmation: 'Hi {name}! Your appointment at {location} is confirmed for {date} at {time}. Reply HELP for assistance.',
      reminder: 'Reminder: You have an appointment at {location} tomorrow at {time}. Reply CANCEL to cancel.',
      cancellation: 'Your appointment at {location} on {date} at {time} has been cancelled.'
    });

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notification Templates</Text>
          <Text style={styles.sectionSubtitle}>Customize SMS messages sent to customers</Text>
        </View>

        <View style={styles.templateCard}>
          <Text style={styles.templateLabel}>Confirmation Message</Text>
          <TextInput
            style={styles.templateInput}
            multiline
            numberOfLines={4}
            value={templates.confirmation}
            onChangeText={(text) => setTemplates({ ...templates, confirmation: text })}
            placeholder="Enter confirmation message..."
            placeholderTextColor="#64748b"
          />
          <Text style={styles.templateHint}>Available: {'{name}'}, {'{date}'}, {'{time}'}, {'{location}'}, {'{service}'}</Text>
        </View>

        <View style={styles.templateCard}>
          <Text style={styles.templateLabel}>Reminder Message</Text>
          <TextInput
            style={styles.templateInput}
            multiline
            numberOfLines={4}
            value={templates.reminder}
            onChangeText={(text) => setTemplates({ ...templates, reminder: text })}
            placeholder="Enter reminder message..."
            placeholderTextColor="#64748b"
          />
        </View>

        <View style={styles.templateCard}>
          <Text style={styles.templateLabel}>Cancellation Message</Text>
          <TextInput
            style={styles.templateInput}
            multiline
            numberOfLines={4}
            value={templates.cancellation}
            onChangeText={(text) => setTemplates({ ...templates, cancellation: text })}
            placeholder="Enter cancellation message..."
            placeholderTextColor="#64748b"
          />
        </View>

        <View style={styles.sectionDivider} />
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Email Templates</Text>
          <Text style={styles.sectionSubtitle}>Customize email sent to customers</Text>
        </View>

        <View style={styles.templateCard}>
          <Text style={styles.templateLabel}>Booking Confirmation Email</Text>
          <TextInput
            style={styles.templateInput}
            multiline
            numberOfLines={6}
            value={templates.emailConfirmation || 'Dear {name},\n\nYour appointment has been confirmed:\n\n📅 Date: {date}\n⏰ Time: {time}\n📍 Location: {location}\n💇 Service: {service}\n\nThank you for choosing ServiceGenie!'}
            placeholder="Enter email content..."
            placeholderTextColor="#64748b"
          />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Templates</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderCustomers = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#64748b" />
          <TextInput style={styles.searchInput} placeholder="Search customers..." placeholderTextColor="#64748b" />
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={styles.exportButton} onPress={() => exportCustomers()}>
            <Download size={18} color="#94a3b8" /><Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}><Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Add</Text></TouchableOpacity>
        </View>
      </View>
      {mockData.customers.map((customer) => (
        <View key={customer.id} style={styles.customerCard}>
          <View style={styles.customerHeader}>
            <View style={styles.customerAvatar}><Text style={styles.customerAvatarText}>{customer.name[0]}</Text></View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{customer.name}</Text>
              <Text style={styles.customerPhone}>{customer.phone}</Text>
              {customer.notes ? <Text style={styles.customerNotes} numberOfLines={2}>{customer.notes}</Text> : null}
            </View>
            <View style={styles.customerRight}>
              <View style={styles.customerTags}>
                {customer.tags.map((tag) => (
                  <View key={tag} style={[styles.customerTag, tag === 'VIP' ? styles.tagVIP : tag === 'New' ? styles.tagNew : styles.tagDefault]}>
                    <Text style={styles.customerTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <ChevronRight size={20} color="#64748b" />
            </View>
          </View>
          <View style={styles.customerPrefs}>
            <View style={styles.prefIndicator}>
              <Smartphone size={12} color={customer.smsEnabled ? '#10b981' : '#64748b'} />
              <Text style={[styles.prefText, customer.smsEnabled && styles.prefActive]}>SMS</Text>
            </View>
            <View style={styles.prefIndicator}>
              <Mail size={12} color={customer.emailEnabled ? '#10b981' : '#64748b'} />
              <Text style={[styles.prefText, customer.emailEnabled && styles.prefActive]}>Email</Text>
            </View>
            <View style={styles.prefIndicator}>
              <Bell size={12} color={customer.marketingOptIn ? '#6366f1' : '#64748b'} />
              <Text style={[styles.prefText, customer.marketingOptIn && { color: '#6366f1' }]}>Marketing</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderGiftCards = () => {
    const giftCards = [
      { id: 'gc_001', code: 'GIFT50', value: 50, balance: 50, purchasedBy: 'Sarah P.', date: '2026-01-15', status: 'active' },
      { id: 'gc_002', code: 'HOLIDAY100', value: 100, balance: 75, purchasedBy: 'John D.', date: '2025-12-20', status: 'partial' },
      { id: 'gc_003', code: 'BIRTHDAY25', value: 25, balance: 0, purchasedBy: 'Emily W.', date: '2025-11-10', status: 'redeemed' },
    ];

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#64748b" />
            <TextInput style={styles.searchInput} placeholder="Search gift cards..." placeholderTextColor="#64748b" />
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Create Gift Card</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{giftCards.length}</Text>
            <Text style={styles.miniStatLabel}>Total Cards</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>${giftCards.reduce((s, g) => s + g.value, 0)}</Text>
            <Text style={styles.miniStatLabel}>Total Value</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>${giftCards.reduce((s, g) => s + g.balance, 0)}</Text>
            <Text style={styles.miniStatLabel}>Remaining</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Active Gift Cards</Text>
        {giftCards.map((card) => (
          <View key={card.id} style={styles.giftCard}>
            <View style={styles.giftCardHeader}>
              <View style={styles.giftCardInfo}>
                <Text style={styles.giftCardCode}>{card.code}</Text>
                <Text style={styles.giftCardPurchasedBy}>Purchased by {card.purchasedBy} on {card.date}</Text>
              </View>
              <View style={[styles.statusBadge, card.status === 'active' ? styles.activeBadge : card.status === 'partial' ? styles.pendingBadge : styles.inactiveBadge]}>
                <Text style={[styles.statusText, card.status === 'active' ? styles.activeStatusText : card.status === 'partial' ? styles.pendingText : styles.inactiveStatusText]}>{card.status}</Text>
              </View>
            </View>
            <View style={styles.giftCardBalance}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Value</Text>
                <Text style={styles.balanceValue}>${card.value}</Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Remaining</Text>
                <Text style={[styles.balanceValue, card.balance === 0 && styles.balanceZero]}>${card.balance}</Text>
              </View>
            </View>
            <View style={styles.giftCardActions}>
              <TouchableOpacity style={styles.giftCardButton}>
                <Edit size={14} color="#6366f1" /><Text style={styles.giftCardButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.giftCardButton}>
                <DollarSign size={14} color="#10b981" /><Text style={styles.giftCardButtonText}>Redeem</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sidebar}>
        <View style={styles.logo}><Building2 size={28} color="#6366f1" /><Text style={styles.logoText}>Admin</Text></View>
        <View style={styles.nav}>
          {[
            { id: 'overview', icon: BarChart3, label: 'Overview' },
            { id: 'appointments', icon: Calendar, label: 'Appointments' },
            { id: 'payments', icon: DollarSign, label: 'Payments' },
            { id: 'giftcards', icon: Gift, label: 'Gift Cards' },
            { id: 'teams', icon: Users, label: 'Teams' },
            { id: 'roles', icon: Shield, label: 'Roles' },
            { id: 'providers', icon: UserCircle, label: 'Staff' },
            { id: 'customers', icon: User, label: 'Customers' },
            { id: 'services', icon: CreditCard, label: 'Services' },
            { id: 'locations', icon: Building2, label: 'Locations' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <TouchableOpacity key={item.id} style={[styles.navItem, activeTab === item.id && styles.activeNavItem]} onPress={() => setActiveTab(item.id)}>
              <item.icon size={20} color={activeTab === item.id ? '#fff' : '#94a3b8'} />
              <Text style={[styles.navText, activeTab === item.id && styles.activeNavText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Text>
            <Text style={styles.headerSubtitle}>Manage your salon operations</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}><Bell size={20} color="#94a3b8" /></TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}><RefreshCw size={20} color="#94a3b8" /></TouchableOpacity>
          </View>
        </View>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'giftcards' && renderGiftCards()}
        {activeTab === 'teams' && renderTeams()}
        {activeTab === 'roles' && renderRoles()}
        {activeTab === 'providers' && renderProviders()}
        {activeTab === 'customers' && renderCustomers()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'locations' && renderLocations()}
        {activeTab === 'analytics' && <View style={styles.tabContent}><Text style={styles.comingSoon}>Analytics - Coming Soon</Text></View>}
        {activeTab === 'settings' && renderSettings()}
      </View>

      <Modal visible={providerModal.visible} animationType="slide" transparent={true} onRequestClose={() => setProviderModal({ ...providerModal, visible: false })}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{providerModal.mode === 'add' ? 'Add Provider' : 'Edit Provider'}</Text>
              <TouchableOpacity onPress={() => setProviderModal({ ...providerModal, visible: false })}><XCircle size={24} color="#94a3b8" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput style={styles.modalInput} placeholder="Provider name" placeholderTextColor="#64748b" defaultValue={providerModal.data?.name} />
              <Text style={styles.inputLabel}>Specialty</Text>
              <TextInput style={styles.modalInput} placeholder="e.g., Master Hair Stylist" placeholderTextColor="#64748b" defaultValue={providerModal.data?.specialty} />
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput style={styles.modalInput} placeholder="email@example.com" placeholderTextColor="#64748b" keyboardType="email-address" />
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput style={styles.modalInput} placeholder="(555) 123-4567" placeholderTextColor="#64748b" keyboardType="phone-pad" />
              <TouchableOpacity style={styles.modalSubmitButton}><Text style={styles.modalSubmitText}>{providerModal.mode === 'add' ? 'Add Provider' : 'Save Changes'}</Text></TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={serviceModal.visible} animationType="slide" transparent={true} onRequestClose={() => setServiceModal({ ...serviceModal, visible: false })}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{serviceModal.mode === 'add' ? 'Add Service' : 'Edit Service'}</Text>
              <TouchableOpacity onPress={() => setServiceModal({ ...serviceModal, visible: false })}><XCircle size={24} color="#94a3b8" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Service Name</Text>
              <TextInput style={styles.modalInput} placeholder="e.g., Haircut & Style" placeholderTextColor="#64748b" defaultValue={serviceModal.data?.name} />
              <Text style={styles.inputLabel}>Price ($)</Text>
              <TextInput style={styles.modalInput} placeholder="75" placeholderTextColor="#64748b" keyboardType="numeric" defaultValue={serviceModal.data?.price?.toString()} />
              <Text style={styles.inputLabel}>Duration (minutes)</Text>
              <TextInput style={styles.modalInput} placeholder="60" placeholderTextColor="#64748b" keyboardType="numeric" defaultValue={serviceModal.data?.duration?.toString()} />
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => (<TouchableOpacity key={cat} style={[styles.categoryButton, serviceModal.data?.category === cat && styles.categoryButtonActive]}><Text style={[styles.categoryButtonText, serviceModal.data?.category === cat && styles.categoryButtonTextActive]}>{cat}</Text></TouchableOpacity>))}
              </View>
              <TouchableOpacity style={styles.modalSubmitButton}><Text style={styles.modalSubmitText}>{serviceModal.mode === 'add' ? 'Add Service' : 'Save Changes'}</Text></TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={locationModal.visible} animationType="slide" transparent={true} onRequestClose={() => setLocationModal({ ...locationModal, visible: false })}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{locationModal.mode === 'add' ? 'Add Location' : 'Edit Location'}</Text>
              <TouchableOpacity onPress={() => setLocationModal({ ...locationModal, visible: false })}><XCircle size={24} color="#94a3b8" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Location Name</Text>
              <TextInput style={styles.modalInput} placeholder="e.g., Downtown Salon" placeholderTextColor="#64748b" defaultValue={locationModal.data?.name} />
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput style={styles.modalInput} placeholder="123 Main St, City, State" placeholderTextColor="#64748b" defaultValue={locationModal.data?.address} />
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput style={styles.modalInput} placeholder="(555) 123-4567" placeholderTextColor="#64748b" keyboardType="phone-pad" defaultValue={locationModal.data?.phone} />
              <TouchableOpacity style={styles.modalSubmitButton}><Text style={styles.modalSubmitText}>{locationModal.mode === 'add' ? 'Add Location' : 'Save Changes'}</Text></TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#0f172a' },
  sidebar: { width: 240, backgroundColor: '#1e293b', borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.05)', paddingVertical: 24 },
  logo: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 32, gap: 12 },
  logoText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  nav: { gap: 4, paddingHorizontal: 12 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12 },
  activeNavItem: { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
  navText: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  activeNavText: { color: '#fff' },
  main: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
  headerSubtitle: { color: '#64748b', fontSize: 14, marginTop: 4 },
  headerActions: { flexDirection: 'row', gap: 12 },
  headerButton: { width: 40, height: 40, backgroundColor: '#1e293b', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tabContent: { flex: 1, padding: 24 },
  tabHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 12, paddingHorizontal: 16, flex: 1, gap: 12 },
  searchInput: { flex: 1, color: '#fff', fontSize: 14, paddingVertical: 12 },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#6366f1', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  addButtonText: { color: '#fff', fontWeight: '700' },
  exportButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1e293b', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  exportButtonText: { color: '#94a3b8', fontWeight: '600' },
  giftCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  giftCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  giftCardInfo: { flex: 1 },
  giftCardCode: { color: '#fff', fontSize: 18, fontWeight: '800' },
  giftCardPurchasedBy: { color: '#64748b', fontSize: 13, marginTop: 4 },
  giftCardBalance: { flexDirection: 'row', gap: 24, marginBottom: 16, padding: 16, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12 },
  balanceItem: { flex: 1 },
  balanceLabel: { color: '#64748b', fontSize: 12, marginBottom: 4 },
  balanceValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  balanceZero: { color: '#ef4444' },
  giftCardActions: { flexDirection: 'row', gap: 12 },
  giftCardButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 10 },
  giftCardButtonText: { color: '#6366f1', fontWeight: '600', fontSize: 13 },
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 32, flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: 180, backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { color: '#fff', fontSize: 28, fontWeight: '800' },
  statLabel: { color: '#64748b', fontSize: 13, marginTop: 4 },
  section: { marginBottom: 32 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  sectionHeader: { marginBottom: 24 },
  sectionSubtitle: { color: '#64748b', fontSize: 14, marginTop: 4 },
  templateCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  templateLabel: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  templateInput: { backgroundColor: '#0f172a', borderRadius: 12, padding: 16, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', minHeight: 100, textAlignVertical: 'top' },
  templateHint: { color: '#64748b', fontSize: 12, marginTop: 8 },
  saveButton: { backgroundColor: '#6366f1', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  sectionDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  miniStat: { flex: 1, backgroundColor: '#1e293b', borderRadius: 12, padding: 16, alignItems: 'center' },
  miniStatValue: { color: '#fff', fontSize: 24, fontWeight: '800' },
  miniStatLabel: { color: '#64748b', fontSize: 12, marginTop: 4 },
  appointmentCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  appointmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  appointmentInfo: { flex: 1 },
  appointmentCustomer: { color: '#fff', fontSize: 16, fontWeight: '700' },
  appointmentService: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  appointmentDetails: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  appointmentDetail: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  appointmentDetailText: { color: '#94a3b8', fontSize: 13 },
  walkInIndicator: { backgroundColor: '#f59e0b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 12, alignSelf: 'flex-start' },
  walkInText: { color: '#000', fontSize: 10, fontWeight: '900' },
  confirmedBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  pendingBadge: { backgroundColor: 'rgba(251, 191, 36, 0.1)' },
  confirmedText: { color: '#10b981' },
  pendingText: { color: '#fbbf24' },
  commissionCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  commissionHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  commissionAvatar: { width: 50, height: 50, borderRadius: 12 },
  commissionInfo: { flex: 1 },
  commissionName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  commissionSpecialty: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  commissionBadge: { backgroundColor: 'rgba(99, 102, 241, 0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  commissionBadgeText: { color: '#6366f1', fontSize: 11, fontWeight: '700' },
  commissionDetails: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16 },
  commissionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  commissionLabel: { color: '#94a3b8', fontSize: 14 },
  commissionValue: { color: '#fff', fontSize: 14, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 12, marginBottom: 0 },
  commissionTotalLabel: { color: '#fff', fontSize: 15, fontWeight: '700' },
  commissionTotalValue: { color: '#10b981', fontSize: 18, fontWeight: '800' },
  analyticsSectionTitle: { color: '#94a3b8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 16, marginTop: 24 },
  locationComparisonCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  locationComparisonHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  locationComparisonName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  locationComparisonMetrics: { flexDirection: 'row', justifyContent: 'space-around' },
  comparisonMetric: { alignItems: 'center' },
  comparisonValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  comparisonLabel: { color: '#64748b', fontSize: 12, marginTop: 4 },
  exportButtonsRow: { marginTop: 20 },
  teamCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  teamHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  teamColor: { width: 12, height: 40, borderRadius: 6 },
  teamInfo: { flex: 1 },
  teamName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  teamCount: { color: '#64748b', fontSize: 13, marginTop: 4 },
  teamMembers: { flexDirection: 'row', gap: 12 },
  teamMember: { alignItems: 'center', gap: 6 },
  teamMemberAvatar: { width: 40, height: 40, borderRadius: 10 },
  teamMemberName: { color: '#94a3b8', fontSize: 12 },
  rolesSection: { gap: 16 },
  roleCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  roleHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  roleInfo: { flex: 1 },
  roleName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  roleDescription: { color: '#64748b', fontSize: 13, marginTop: 4 },
  roleBadge: { backgroundColor: 'rgba(99, 102, 241, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  roleBadgeAdmin: { backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  roleBadgeText: { color: '#6366f1', fontSize: 14, fontWeight: '700' },
  permissionsList: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16 },
  permissionsTitle: { color: '#94a3b8', fontSize: 12, fontWeight: '700', marginBottom: 12 },
  permissionItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  permissionText: { color: '#fff', fontSize: 14 },
  exportButtonsRow: { marginTop: 20 },
  quickActions: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  actionCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#1e293b', borderRadius: 12, padding: 16, minWidth: 140, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  activityItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  activityAvatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  activityInfo: { flex: 1 },
  activityName: { color: '#fff', fontWeight: '700' },
  activityText: { color: '#94a3b8', fontSize: 14 },
  activityTime: { color: '#64748b', fontSize: 12, marginTop: 4 },
  providerList: { gap: 16 },
  providerCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  providerHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  providerAvatar: { width: 60, height: 60, borderRadius: 15 },
  providerInfo: { flex: 1 },
  providerName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  providerSpecialty: { color: '#94a3b8', fontSize: 14, marginTop: 2 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  activeBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  inactiveBadge: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  activeStatusText: { color: '#10b981' },
  inactiveStatusText: { color: '#ef4444' },
  editButton: { width: 36, height: 36, backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  providerStats: { flexDirection: 'row', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', gap: 24 },
  providerStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  providerStatText: { color: '#94a3b8', fontSize: 13 },
  providerReviews: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  reviewsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  reviewsTitle: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  reviewItem: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, marginBottom: 6 },
  reviewText: { color: '#fff', fontSize: 13, fontStyle: 'italic' },
  reviewAuthor: { color: '#64748b', fontSize: 11, marginTop: 4, textAlign: 'right' },
  categoryFilter: { gap: 8, marginBottom: 20 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#1e293b', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  activeCategory: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  categoryText: { color: '#94a3b8', fontWeight: '600', fontSize: 13 },
  activeCategoryText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  serviceList: { gap: 12 },
  serviceCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1e293b', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  serviceInfo: { flex: 1 },
  serviceName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  serviceMeta: { flexDirection: 'row', gap: 16, marginTop: 8 },
  serviceBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  serviceMetaText: { color: '#94a3b8', fontSize: 13 },
  serviceActions: { flexDirection: 'row', gap: 8 },
  smallEditButton: { width: 32, height: 32, backgroundColor: '#6366f1', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  smallDeleteButton: { width: 32, height: 32, backgroundColor: '#ef4444', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  serviceExtras: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  extraChip: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  variantChip: { backgroundColor: 'rgba(99, 102, 241, 0.1)' },
  extraChipText: { fontSize: 11, color: '#10b981' },
  prefRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  locationList: { gap: 16 },
  locationCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  locationHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  locationIcon: { width: 56, height: 56, borderRadius: 14, backgroundColor: 'rgba(99, 102, 241, 0.1)', alignItems: 'center', justifyContent: 'center' },
  locationInfo: { flex: 1 },
  locationName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  locationDetail: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  locationAddress: { color: '#94a3b8', fontSize: 13 },
  locationPhone: { color: '#94a3b8', fontSize: 13 },
  policiesSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  policiesTitle: { color: '#94a3b8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 12 },
  policiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  policyItem: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 100 },
  policyLabel: { color: '#64748b', fontSize: 12 },
  policyValue: { color: '#fff', fontSize: 14, fontWeight: '600' },
  customerList: { gap: 12 },
  customerCard: { backgroundColor: '#1e293b', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  customerHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  customerAvatar: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#ec4899', alignItems: 'center', justifyContent: 'center' },
  customerAvatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  customerInfo: { flex: 1 },
  customerName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  customerPhone: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  customerNotes: { color: '#64748b', fontSize: 12, marginTop: 6, fontStyle: 'italic' },
  customerRight: { alignItems: 'flex-end', gap: 8 },
  customerTags: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' },
  customerTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagVIP: { backgroundColor: 'rgba(251, 191, 36, 0.2)' },
  tagNew: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  tagDefault: { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
  customerTagText: { fontSize: 10, fontWeight: '600' },
  customerPrefs: { flexDirection: 'row', gap: 12, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  prefIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  prefText: { fontSize: 11, color: '#64748b' },
  prefActive: { color: '#10b981' },
  comingSoon: { color: '#64748b', fontSize: 16, textAlign: 'center', marginTop: 100 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 450, backgroundColor: '#1e293b', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  modalForm: { flexGrow: 0 },
  inputLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
  modalInput: { backgroundColor: '#0f172a', borderRadius: 12, padding: 16, color: '#fff', fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalSubmitButton: { backgroundColor: '#6366f1', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  modalSubmitText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  categoryButton: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#0f172a', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  categoryButtonActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  categoryButtonText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  categoryButtonTextActive: { color: '#fff' },
});
