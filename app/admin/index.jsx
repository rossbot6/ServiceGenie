import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Switch, Alert, SafeAreaView, Platform } from 'react-native';
import { useState } from 'react';
import { Building2, Users, UserCircle, Calendar, CreditCard, Settings, BarChart3, Bell, Plus, Search, Edit, Trash2, ChevronRight, MapPin, Phone, DollarSign, Clock, XCircle, RefreshCw } from 'lucide-react-native';
import mockData from '../../data/mockData.json';

const INITIAL_PROVIDERS = mockData.stylists.map((s) => ({
  ...s,
  status: 'active',
  appointmentsToday: Math.floor(Math.random() * 8) + 1,
  revenueMonth: Math.floor(Math.random() * 5000) + 2000,
  rating: (4 + Math.random()).toFixed(1)
}));

const INITIAL_SERVICES = [
  { id: 'svc_001', name: 'Haircut & Style', price: 75, duration: 60, category: 'Hair' },
  { id: 'svc_002', name: 'Color & Highlights', price: 150, duration: 120, category: 'Hair' },
  { id: 'svc_003', name: 'Manicure', price: 45, duration: 45, category: 'Nails' },
  { id: 'svc_004', name: 'Pedicure', price: 55, duration: 60, category: 'Nails' },
  { id: 'svc_005', name: 'Blowout', price: 50, duration: 30, category: 'Hair' },
];

const INITIAL_LOCATIONS = [
  { id: 'loc_001', name: 'Downtown Salon', address: '123 Main St, New York, NY', phone: '(555) 123-4567' },
];

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
            <View style={styles.providerStat}><Clock size={14} color="#f59e0b" /><Text style={styles.providerStatText}>{provider.rating} rating</Text></View>
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
      {locations.map((location) => (
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
        </View>
      ))}
    </ScrollView>
  );

  const renderCustomers = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#64748b" />
          <TextInput style={styles.searchInput} placeholder="Search customers..." placeholderTextColor="#64748b" />
        </View>
        <TouchableOpacity style={styles.addButton}><Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Add Customer</Text></TouchableOpacity>
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
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sidebar}>
        <View style={styles.logo}><Building2 size={28} color="#6366f1" /><Text style={styles.logoText}>Admin</Text></View>
        <View style={styles.nav}>
          {[
            { id: 'overview', icon: BarChart3, label: 'Overview' },
            { id: 'providers', icon: Users, label: 'Providers' },
            { id: 'customers', icon: UserCircle, label: 'Customers' },
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
        {activeTab === 'providers' && renderProviders()}
        {activeTab === 'customers' && renderCustomers()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'locations' && renderLocations()}
        {activeTab === 'analytics' && <View style={styles.tabContent}><Text style={styles.comingSoon}>Analytics - Coming Soon</Text></View>}
        {activeTab === 'settings' && <View style={styles.tabContent}><Text style={styles.comingSoon}>Settings - Coming Soon</Text></View>}
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
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 32, flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: 180, backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { color: '#fff', fontSize: 28, fontWeight: '800' },
  statLabel: { color: '#64748b', fontSize: 13, marginTop: 4 },
  section: { marginBottom: 32 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
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
  locationList: { gap: 16 },
  locationCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  locationHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  locationIcon: { width: 56, height: 56, borderRadius: 14, backgroundColor: 'rgba(99, 102, 241, 0.1)', alignItems: 'center', justifyContent: 'center' },
  locationInfo: { flex: 1 },
  locationName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  locationDetail: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  locationAddress: { color: '#94a3b8', fontSize: 13 },
  locationPhone: { color: '#94a3b8', fontSize: 13 },
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
