import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, CreditCard, Clock, Check, Plus, Search, Filter, Download, TrendingDown, Users, Briefcase, PieChart } from 'lucide-react-native';
import { supabaseHelpers } from '../../lib/supabase';

const { width } = Dimensions.get('window');

export default function PayoutsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  
  // Mock data for providers with commission
  const [providers] = useState([
    { id: 'prov_001', name: 'Elena Rodriguez', specialty: 'Color Specialist', commissionRate: 40, baseSalary: 2000, appointments: 45, revenue: 8750, commission: 3500, paid: 2800, pending: 700 },
    { id: 'prov_002', name: 'Marcus Chen', specialty: 'Nail Technician', commissionRate: 35, baseSalary: 1800, appointments: 62, revenue: 5890, commission: 2061.50, paid: 1649.20, pending: 412.30 },
    { id: 'prov_003', name: 'Jessica Taylor', specialty: 'Senior Stylist', commissionRate: 45, baseSalary: 2200, appointments: 38, revenue: 9200, commission: 4140, paid: 3312, pending: 828 },
    { id: 'prov_004', name: 'Michael Brown', specialty: 'Hair Stylist', commissionRate: 38, baseSalary: 1900, appointments: 51, revenue: 7420, commission: 2819.60, paid: 2255.68, pending: 563.92 },
    { id: 'prov_005', name: 'Sarah Davis', specialty: 'Esthetician', commissionRate: 42, baseSalary: 2100, appointments: 29, revenue: 5800, commission: 2436, paid: 1948.80, pending: 487.20 },
  ]);

  const [payouts] = useState([
    { id: 'pay_001', provider: 'Elena Rodriguez', amount: 1400, date: '2026-02-05', status: 'completed', method: 'Direct Deposit' },
    { id: 'pay_002', provider: 'Marcus Chen', amount: 824.60, date: '2026-02-05', status: 'completed', method: 'Direct Deposit' },
    { id: 'pay_003', provider: 'Jessica Taylor', amount: 1656, date: '2026-02-05', status: 'completed', method: 'Direct Deposit' },
  ]);

  const totalRevenue = providers.reduce((sum, p) => sum + p.revenue, 0);
  const totalCommission = providers.reduce((sum, p) => sum + p.commission, 0);
  const totalPaid = providers.reduce((sum, p) => sum + p.paid, 0);
  const totalPending = providers.reduce((sum, p) => sum + p.pending, 0);

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
            <DollarSign size={20} color="#10b981" />
          </View>
          <Text style={styles.statValue}>${totalRevenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
            <TrendingUp size={20} color="#8b5cf6" />
          </View>
          <Text style={styles.statValue}>${totalCommission.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Commission</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
            <Check size={20} color="#3b82f6" />
          </View>
          <Text style={styles.statValue}>${totalPaid.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Paid Out</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
            <Clock size={20} color="#f59e0b" />
          </View>
          <Text style={styles.statValue}>${totalPending.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Provider Breakdown</Text>
          <TouchableOpacity style={styles.exportButton}>
            <Download size={16} color="#6366f1" />
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        </View>
        
        {providers.map((provider) => (
          <View key={provider.id} style={styles.providerCard}>
            <View style={styles.providerInfo}>
              <View style={styles.providerAvatar}>
                <Text style={styles.providerInitial}>{provider.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
              </View>
            </View>
            <View style={styles.providerStats}>
              <Text style={styles.providerRevenue}>${provider.revenue.toLocaleString()}</Text>
              <Text style={styles.providerCommission}>{provider.commissionRate}% = ${provider.commission.toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => setActiveTab('payouts')}>
          <DollarSign size={24} color="#6366f1" />
          <Text style={styles.quickActionText}>Process Payout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => setActiveTab('providers')}>
          <Users size={24} color="#10b981" />
          <Text style={styles.quickActionText}>Manage Rates</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderProviders = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#64748b" />
          <TextInput style={styles.searchInput} placeholder="Search providers..." placeholderTextColor="#64748b" />
        </View>
      </View>

      {providers.map((provider) => (
        <View key={provider.id} style={styles.providerDetailCard}>
          <View style={styles.providerDetailHeader}>
            <View style={styles.providerAvatarLarge}>
              <Text style={styles.providerInitialLarge}>{provider.name.charAt(0)}</Text>
            </View>
            <View style={styles.providerDetailInfo}>
              <Text style={styles.providerDetailName}>{provider.name}</Text>
              <Text style={styles.providerDetailSpecialty}>{provider.specialty}</Text>
              <View style={styles.commissionBadge}>
                <Text style={styles.commissionBadgeText}>{provider.commissionRate}% Commission</Text>
              </View>
            </View>
          </View>

          <View style={styles.providerDetailStats}>
            <View style={styles.providerDetailStat}>
              <Text style={styles.providerDetailStatValue}>{provider.appointments}</Text>
              <Text style={styles.providerDetailStatLabel}>Appointments</Text>
            </View>
            <View style={styles.providerDetailStat}>
              <Text style={styles.providerDetailStatValue}>${provider.revenue.toLocaleString()}</Text>
              <Text style={styles.providerDetailStatLabel}>Revenue</Text>
            </View>
            <View style={styles.providerDetailStat}>
              <Text style={[styles.providerDetailStatValue, { color: '#8b5cf6' }]}>${provider.commission.toLocaleString()}</Text>
              <Text style={styles.providerDetailStatLabel}>Commission</Text>
            </View>
          </View>

          <View style={styles.payoutBreakdown}>
            <View style={styles.payoutBreakdownRow}>
              <Text style={styles.payoutBreakdownLabel}>Base Salary</Text>
              <Text style={styles.payoutBreakdownValue}>${provider.baseSalary.toLocaleString()}</Text>
            </View>
            <View style={styles.payoutBreakdownRow}>
              <Text style={styles.payoutBreakdownLabel}>Commission</Text>
              <Text style={[styles.payoutBreakdownValue, { color: '#8b5cf6' }]}>+${provider.commission.toLocaleString()}</Text>
            </View>
            <View style={styles.payoutBreakdownDivider} />
            <View style={styles.payoutBreakdownRow}>
              <Text style={styles.payoutBreakdownLabel}>Total</Text>
              <Text style={[styles.payoutBreakdownValue, { fontWeight: '600', color: '#10b981' }]}>${(provider.baseSalary + provider.commission).toLocaleString()}</Text>
            </View>
            <View style={styles.payoutBreakdownRow}>
              <Text style={styles.payoutBreakdownLabel}>Pending</Text>
              <Text style={[styles.payoutBreakdownValue, { color: '#f59e0b' }]}>${provider.pending.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderPayouts = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Pending Payouts</Text>
        <TouchableOpacity style={styles.processButton}>
          <Check size={18} color="#fff" />
          <Text style={styles.processButtonText}>Process All</Text>
        </TouchableOpacity>
      </View>

      {providers.map((provider) => (
        <View key={provider.id} style={styles.pendingPayoutCard}>
          <View style={styles.pendingPayoutInfo}>
            <Text style={styles.pendingPayoutProvider}>{provider.name}</Text>
            <Text style={styles.pendingPayoutDetail}>${provider.pending.toLocaleString()} pending</Text>
          </View>
          <TouchableOpacity style={styles.payoutActionButton}>
            <Text style={styles.payoutActionText}>Pay</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Payouts</Text>
        {payouts.map((payout) => (
          <View key={payout.id} style={styles.recentPayoutItem}>
            <View>
              <Text style={styles.recentPayoutProvider}>{payout.provider}</Text>
              <Text style={styles.recentPayoutMethod}>{payout.date} • {payout.method}</Text>
            </View>
            <Text style={styles.recentPayoutAmount}>${payout.amount.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Payout Settings</Text>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>Schedule</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Payout Frequency</Text>
          <Text style={styles.settingValue}>Weekly</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Minimum Payout</Text>
          <Text style={styles.settingValue}>$100</Text>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>Default Rates</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Junior Stylist</Text>
          <Text style={styles.settingValue}>30%</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Stylist</Text>
          <Text style={styles.settingValue}>40%</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Senior Stylist</Text>
          <Text style={styles.settingValue}>45%</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ marginTop: 16, color: '#64748b' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Provider Payouts</Text>
        <Text style={styles.subtitle}>${totalPending.toLocaleString()} pending</Text>
      </View>

      <View style={styles.tabs}>
        {['overview', 'providers', 'payouts', 'settings'].map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'providers' && renderProviders()}
      {activeTab === 'payouts' && renderPayouts()}
      {activeTab === 'settings' && renderSettings()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  subtitle: { fontSize: 16, color: '#f59e0b', marginTop: 4 },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingHorizontal: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#6366f1' },
  tabLabel: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  activeTabLabel: { color: '#6366f1' },
  tabContent: { flex: 1, padding: 16 },
  tabHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  statCard: { width: (width - 44) / 2, backgroundColor: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', elevation: 2 },
  statIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', elevation: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 12 },
  providerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#f8fafc', borderRadius: 10, marginBottom: 8 },
  providerInfo: { flexDirection: 'row', alignItems: 'center' },
  providerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  providerInitial: { fontSize: 16, fontWeight: '600', color: '#fff' },
  providerName: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  providerSpecialty: { fontSize: 12, color: '#64748b' },
  providerStats: { alignItems: 'flex-end' },
  providerRevenue: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  providerCommission: { fontSize: 12, color: '#8b5cf6' },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickActionButton: { width: (width - 60) / 2, backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  quickActionText: { fontSize: 13, fontWeight: '500', color: '#1e293b', marginTop: 8 },
  exportButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, gap: 6 },
  exportButtonText: { fontSize: 13, color: '#6366f1', fontWeight: '500' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, flex: 1, marginRight: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1e293b' },
  providerDetailCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', elevation: 2 },
  providerDetailHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  providerAvatarLarge: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  providerInitialLarge: { fontSize: 24, fontWeight: '600', color: '#fff' },
  providerDetailInfo: { flex: 1 },
  providerDetailName: { fontSize: 18, fontWeight: '600', color: '#1e293b' },
  providerDetailSpecialty: { fontSize: 14, color: '#64748b', marginTop: 2 },
  commissionBadge: { backgroundColor: '#f3e8ff', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 8, marginTop: 8, alignSelf: 'flex-start' },
  commissionBadgeText: { fontSize: 12, color: '#8b5cf6', fontWeight: '500' },
  providerDetailStats: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', marginBottom: 16 },
  providerDetailStat: { alignItems: 'center', flex: 1 },
  providerDetailStatValue: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  providerDetailStatLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  payoutBreakdown: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 12 },
  payoutBreakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  payoutBreakdownLabel: { fontSize: 13, color: '#64748b' },
  payoutBreakdownValue: { fontSize: 13, color: '#1e293b' },
  payoutBreakdownDivider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 8 },
  processButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b981', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, gap: 6 },
  processButtonText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  pendingPayoutCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  pendingPayoutInfo: { flex: 1 },
  pendingPayoutProvider: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  pendingPayoutDetail: { fontSize: 13, color: '#64748b', marginTop: 2 },
  payoutActionButton: { backgroundColor: '#6366f1', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  payoutActionText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  recentSection: { marginTop: 24 },
  recentPayoutItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  recentPayoutProvider: { fontSize: 14, fontWeight: '500', color: '#1e293b' },
  recentPayoutMethod: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  recentPayoutAmount: { fontSize: 14, fontWeight: '600', color: '#10b981' },
  settingsSection: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  settingsSectionTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  settingLabel: { fontSize: 14, color: '#64748b' },
  settingValue: { fontSize: 14, fontWeight: '500', color: '#1e293b' },
  saveButton: { backgroundColor: '#6366f1', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
