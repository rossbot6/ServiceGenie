import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert, SafeAreaView, Platform, Dimensions } from 'react-native';
import { useState } from 'react';
import { Building2, Users, UserCircle, Calendar, CreditCard, Settings, BarChart3, Bell, Plus, Search, Edit, Trash2, ChevronRight, MapPin, Phone, DollarSign, Clock, XCircle, RefreshCw, Download, User, UserCheck, Shield, Check, X, Smartphone, Mail, Star, Map, Gift, Award, QrCode, Users as UsersIcon, List, Clock3, CardIcon, Lock, Package, Image as ImageIcon, MoreHorizontal } from 'lucide-react-native';
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

const convertTime = (time, fromTz, toTz) => {
  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    return new Intl.DateTimeFormat('en-US', {
      timeStyle: 'short',
      timeZone: toTz
    }).format(date);
  } catch (e) {
    return time;
  }
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [providerModal, setProviderModal] = useState({ visible: false, mode: 'add', data: null });
  const [serviceModal, setServiceModal] = useState({ visible: false, mode: 'add', data: null });
  const [locationModal, setLocationModal] = useState({ visible: false, mode: 'add', data: null });
  const [aptFilter, setAptFilter] = useState('all');
  const [aptProviderFilter, setAptProviderFilter] = useState('all');
  const [customerSegment, setCustomerSegment] = useState('all');
  const [userRole, setUserRole] = useState('admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];
  
  const isMobile = Dimensions.get('window').width < 768;

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

  const exportAppointments = () => {
    const headers = ['Date', 'Time', 'Customer', 'Service', 'Provider', 'Status', 'Walk-in'];
    const rows = mockData.appointments.map(apt => [
      apt.date,
      apt.time,
      apt.customerName || mockData.customers.find(c => c.id === apt.customerId)?.name || 'Unknown',
      apt.serviceName || apt.service || 'Service',
      mockData.stylists.find(s => s.id === apt.stylistId)?.name || 'Unknown',
      apt.status,
      apt.isWalkIn ? 'Yes' : 'No'
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderAppointments = () => {
    const filteredApts = mockData.appointments.filter(apt => {
      const matchesStatus = aptFilter === 'all' || apt.status === aptFilter;
      const matchesProvider = aptProviderFilter === 'all' || apt.stylistId === aptProviderFilter;
      const matchesSearch = (apt.customerName || mockData.customers.find(c => c.id === apt.customerId)?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesProvider && matchesSearch;
    });

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#64748b" />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search appointments..." 
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={styles.exportButton} onPress={exportAppointments}>
              <Download size={18} color="#94a3b8" /><Text style={styles.exportButtonText}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          <TouchableOpacity 
            style={[styles.filterChip, aptFilter === 'all' && styles.filterChipActive]}
            onPress={() => setAptFilter('all')}
          >
            <Text style={[styles.filterChipText, aptFilter === 'all' && styles.filterChipTextActive]}>All</Text>
          </TouchableOpacity>
          {['pending', 'confirmed', 'completed', 'cancelled'].map(status => (
            <TouchableOpacity 
              key={status}
              style={[styles.filterChip, aptFilter === status && styles.filterChipActive]}
              onPress={() => setAptFilter(status)}
            >
              <Text style={[styles.filterChipText, aptFilter === status && styles.filterChipTextActive]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterBar, { marginTop: 8 }]}>
          <TouchableOpacity 
            style={[styles.filterChip, aptProviderFilter === 'all' && styles.filterChipActive]}
            onPress={() => setAptProviderFilter('all')}
          >
            <Text style={[styles.filterChipText, aptProviderFilter === 'all' && styles.filterChipTextActive]}>All Providers</Text>
          </TouchableOpacity>
          {mockData.stylists.map(s => (
            <TouchableOpacity 
              key={s.id}
              style={[styles.filterChip, aptProviderFilter === s.id && styles.filterChipActive]}
              onPress={() => setAptProviderFilter(s.id)}
            >
              <Text style={[styles.filterChipText, aptProviderFilter === s.id && styles.filterChipTextActive]}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.statsRow}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{filteredApts.length}</Text>
            <Text style={styles.miniStatLabel}>Filtered</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{filteredApts.filter(a => a.status === 'confirmed').length}</Text>
            <Text style={styles.miniStatLabel}>Confirmed</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{filteredApts.filter(a => a.isWalkIn).length}</Text>
            <Text style={styles.miniStatLabel}>Walk-ins</Text>
          </View>
        </View>

        {filteredApts.map((apt) => (
          <View key={apt.id} style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentCustomer}>{apt.customerName || mockData.customers.find(c => c.id === apt.customerId)?.name || 'Unknown'}</Text>
                <Text style={styles.appointmentService}>{apt.serviceName || apt.service || 'Service'}</Text>
              </View>
              <View style={[
                styles.statusBadge, 
                apt.status === 'confirmed' ? styles.confirmedBadge : 
                apt.status === 'completed' ? styles.activeBadge :
                apt.status === 'cancelled' ? styles.inactiveBadge :
                styles.pendingBadge
              ]}>
                <Text style={[
                  styles.statusText, 
                  apt.status === 'confirmed' ? styles.confirmedText : 
                  apt.status === 'completed' ? styles.activeStatusText :
                  apt.status === 'cancelled' ? styles.inactiveStatusText :
                  styles.pendingText
                ]}>{apt.status}</Text>
              </View>
            </View>
            <View style={styles.appointmentDetails}>
              <View style={styles.appointmentDetail}>
                <Calendar size={14} color="#94a3b8" />
                <Text style={styles.appointmentDetailText}>{apt.date}</Text>
              </View>
              <View style={styles.appointmentDetail}>
                <Clock size={14} color="#94a3b8" />
                <Text style={styles.appointmentDetailText}>
                  {apt.time}
                  {apt.locationId && mockData.locations.find(l => l.id === apt.locationId)?.timezone !== Intl.DateTimeFormat().resolvedOptions().timeZone && (
                    <Text style={{ fontSize: 10, color: '#6366f1' }}>
                      {` (${convertTime(apt.time, mockData.locations.find(l => l.id === apt.locationId).timezone, Intl.DateTimeFormat().resolvedOptions().timeZone)} local)`}
                    </Text>
                  )}
                </Text>
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
  };

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

          <View style={styles.crossTrainingSection}>
            <View style={styles.crossTrainingHeader}>
              <Award size={14} color="#10b981" />
              <Text style={styles.crossTrainingTitle}>Cross-Training Skills</Text>
            </View>
            <View style={styles.skillTags}>
              {['Haircut', 'Coloring', 'Styling', 'Treatments'].map((skill) => (
                <View key={skill} style={styles.skillTag}>
                  <Check size={10} color="#10b981" />
                  <Text style={styles.skillTagText}>{skill}</Text>
                </View>
              ))}
              {['Nails', 'Makeup'].map((skill) => (
                <View key={skill} style={[styles.skillTag, styles.skillTagLearning]}>
                  <Clock size={10} color="#f59e0b" />
                  <Text style={styles.skillTagTextLearning}>{skill} (Learning)</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.publicReviewsSection}>
            <View style={styles.reviewsHeader}>
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.reviewsTitle}>Public Reviews ({Math.floor(Math.random() * 50) + 20})</Text>
              <TouchableOpacity style={styles.publicReviewsButton}>
                <Text style={styles.publicReviewsButtonText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.publicReviewCard}>
              <View style={styles.publicReviewHeader}>
                <View style={styles.publicReviewAvatar}>
                  <Text style={styles.publicReviewAvatarText}>JD</Text>
                </View>
                <View style={styles.publicReviewInfo}>
                  <Text style={styles.publicReviewName}>John D.</Text>
                  <View style={styles.publicReviewStars}>
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} size={12} color="#f59e0b" fill={star <= 5 ? "#f59e0b" : "transparent"} />
                    ))}
                  </View>
                </View>
                <Text style={styles.publicReviewDate}>2 days ago</Text>
              </View>
              <Text style={styles.publicReviewText}>Had an amazing haircut! Will definitely be coming back. {provider.name.split(' ')[0]} is a true professional.</Text>
              <View style={styles.publicReviewService}>
                <Text style={styles.publicReviewServiceText}>Service: Haircut & Style</Text>
              </View>
              <View style={styles.publicReviewActions}>
                <TouchableOpacity style={styles.publicReviewHelpful}>
                  <Text style={styles.publicReviewHelpfulText}>👍 Helpful ({Math.floor(Math.random() * 10) + 1})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.publicReviewResponse}>
                  <Text style={styles.publicReviewResponseText}>💬 Respond</Text>
                </TouchableOpacity>
              </View>
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
      {locations.map((location) => (
        <View key={location.id} style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={styles.locationIcon}><Building2 size={24} color="#6366f1" /></View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{location.name}</Text>
              <View style={styles.locationDetail}><MapPin size={14} color="#94a3b8" /><Text style={styles.locationAddress}>{location.address}</Text></View>
              <View style={styles.locationDetail}><Phone size={14} color="#94a3b8" /><Text style={styles.locationPhone}>{location.phone}</Text></View>
              <View style={styles.locationDetail}><Map size={14} color="#94a3b8" /><Text style={styles.locationTimezone}>{location.timezone}</Text></View>
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
              <View style={styles.policyItem}>
                <X size={14} color="#ef4444" />
                <Text style={styles.policyLabel}>No-show Fee</Text>
                <Text style={styles.policyValue}>${location.bookingPolicies?.noShowFee || 25}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const exportCustomers = () => {
    const headers = ['Name', 'Phone', 'Email', 'Notes', 'Tags'];
    const filteredCustomers = customerSegment === 'all' 
      ? mockData.customers 
      : mockData.customers.filter(c => (c.tags || []).includes(customerSegment));

    const rows = filteredCustomers.map(c => [
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
    link.download = `customers_${customerSegment}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderPayments = () => {
    const totalRevenue = mockData.customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);
    const avgPerVisit = mockData.customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0) / Math.max(1, mockData.customers.reduce((sum, c) => sum + (c.visitCount || 0), 0));
    const cashCollected = 1250;
    const pendingDeposits = 450;
    
    const recentTransactions = [
      { id: 't1', customer: 'Sarah P.', amount: 75, type: 'payment', method: 'Card', status: 'completed', date: '2026-02-10' },
      { id: 't2', customer: 'John D.', amount: 25, type: 'tip', method: 'Cash', status: 'completed', date: '2026-02-10' },
      { id: 't3', customer: 'Emily W.', amount: 50, type: 'deposit', method: 'Card', status: 'pending', date: '2026-02-09' },
      { id: 't4', customer: 'Michael B.', amount: 75, type: 'payment', method: 'Cash', status: 'completed', date: '2026-02-09' },
      { id: 't5', customer: 'Jessica D.', amount: 150, type: 'payment', method: 'Apple Pay', status: 'refunded', date: '2026-02-08' },
    ];

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <Text style={styles.sectionTitle}>Revenue & Payments</Text>
          <TouchableOpacity style={styles.addButton}>
            <DollarSign size={18} color="#fff" /><Text style={styles.addButtonText}>Add Record</Text>
          </TouchableOpacity>
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
              <DollarSign size={24} color="#6366f1" />
            </View>
            <Text style={styles.statValue}>${cashCollected.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Cash Collected</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
              <Lock size={24} color="#f97316" />
            </View>
            <Text style={styles.statValue}>${pendingDeposits}</Text>
            <Text style={styles.statLabel}>Pending Deposits</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <View style={styles.transactionList}>
          {recentTransactions.map((tx) => (
            <View key={tx.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Text style={styles.transactionTypeEmoji}>{tx.type === 'tip' ? '💰' : tx.type === 'deposit' ? '🔐' : '💇'}</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionCustomer}>{tx.customer}</Text>
                <Text style={styles.transactionDate}>{tx.date} • {tx.method}</Text>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>${tx.amount}</Text>
                <View style={[
                  styles.statusBadge, 
                  tx.status === 'completed' ? styles.activeBadge : 
                  tx.status === 'refunded' ? styles.inactiveBadge :
                  styles.pendingBadge
                ]}>
                  <Text style={[
                    styles.statusText, 
                    tx.status === 'completed' ? styles.activeStatusText : 
                    tx.status === 'refunded' ? styles.inactiveStatusText :
                    styles.pendingText
                  ]}>{tx.status}</Text>
                </View>
                {tx.status === 'completed' && (
                  <TouchableOpacity style={styles.refundButton} onPress={() => alert(`Initiating refund for ${tx.customer}...`)}>
                    <Text style={styles.refundButtonText}>Refund</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
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
            {mockData.staff.filter(s => s.teamId === team.id).map((member) => (
              <View key={member.id} style={styles.teamMember}>
                <View style={styles.teamMemberHeader}>
                  <Text style={styles.teamMemberName}>{member.name}</Text>
                  {member.isTeamLead && (
                    <View style={styles.teamLeadBadge}>
                      <Star size={10} color="#fff" fill="#fff" />
                      <Text style={styles.teamLeadText}>LEAD</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.teamMemberRole}>{member.role}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderLoyalty = () => {
    const tiers = [
      { name: 'Bronze', points: 0, discount: 0, color: '#cd7f32', members: 12 },
      { name: 'Silver', points: 500, discount: 5, color: '#c0c0c0', members: 8 },
      { name: 'Gold', points: 1000, discount: 10, color: '#ffd700', members: 4 },
      { name: 'Platinum', points: 2500, discount: 15, color: '#e5e4e2', members: 2 },
    ];
    
    const recentRedemptions = [
      { customer: 'Sarah P.', tier: 'Gold', reward: '$20 Off', date: '2026-02-08', pointsUsed: 200 },
      { customer: 'Michael B.', tier: 'Silver', reward: 'Free Blowout', date: '2026-02-05', pointsUsed: 150 },
      { customer: 'Jessica D.', tier: 'Platinum', reward: 'VIP Treatment', date: '2026-02-03', pointsUsed: 500 },
    ];

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <Text style={styles.sectionTitle}>Loyalty & Rewards</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Add Tier</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>26</Text>
            <Text style={styles.miniStatLabel}>Total Members</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>15,420</Text>
            <Text style={styles.miniStatLabel}>Points Issued</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>8,150</Text>
            <Text style={styles.miniStatLabel}>Points Redeemed</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Reward Tiers</Text>
        <View style={styles.tiersGrid}>
          {tiers.map((tier) => (
            <View key={tier.name} style={[styles.tierCard, { borderColor: tier.color }]}>
              <View style={[styles.tierBadge, { backgroundColor: tier.color }]}>
                <Text style={styles.tierName}>{tier.name}</Text>
              </View>
              <View style={styles.tierInfo}>
                <Text style={styles.tierPoints}>{tier.points.toLocaleString()} pts</Text>
                <Text style={styles.tierDiscount}>{tier.discount}% off</Text>
                <Text style={styles.tierMembers}>{tier.members} members</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Redemptions</Text>
        {recentRedemptions.map((redemption, idx) => (
          <View key={idx} style={styles.redemptionCard}>
            <View style={styles.redemptionInfo}>
              <Text style={styles.redemptionCustomer}>{redemption.customer}</Text>
              <Text style={styles.redemptionTier}>{redemption.tier} Member</Text>
            </View>
            <View style={styles.redemptionReward}>
              <Text style={styles.redemptionItem}>{redemption.reward}</Text>
              <Text style={styles.redemptionPoints}>-{redemption.pointsUsed} pts</Text>
            </View>
            <Text style={styles.redemptionDate}>{redemption.date}</Text>
          </View>
        ))}

        <View style={styles.loyaltySettings}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Points per $1 spent</Text>
            <View style={styles.pointsInput}>
              <TextInput 
                style={styles.pointsInputText} 
                defaultValue="10" 
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Birthday Bonus Points</Text>
            <View style={styles.pointsInput}>
              <TextInput 
                style={styles.pointsInputText} 
                defaultValue="100" 
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderQRCheckIn = () => {
    const recentCheckIns = [
      { id: 1, customer: 'Sarah P.', time: '10:15 AM', service: 'Haircut & Style', provider: 'Elena Rodriguez', method: 'QR Code' },
      { id: 2, customer: 'John D.', time: '10:45 AM', service: 'Beard Trim', provider: 'Marcus Chen', method: 'Manual' },
      { id: 3, customer: 'Emily W.', time: '11:00 AM', service: 'Color & Highlights', provider: 'Elena Rodriguez', method: 'QR Code' },
    ];

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <Text style={styles.sectionTitle}>QR Code Check-In</Text>
          <TouchableOpacity style={styles.addButton}>
            <Download size={18} color="#fff" /><Text style={styles.addButtonText}>Export Logs</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>127</Text>
            <Text style={styles.miniStatLabel}>Total Check-Ins</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>89</Text>
            <Text style={styles.miniStatLabel}>QR Scans</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>38</Text>
            <Text style={styles.miniStatLabel}>Manual</Text>
          </View>
        </View>

        <View style={styles.qrPreviewSection}>
          <Text style={styles.sectionTitle}>Your Check-In QR Code</Text>
          <View style={styles.qrCodeDisplay}>
            <View style={styles.qrCodePlaceholder}>
              <Text style={styles.qrCodeText}>📱</Text>
              <Text style={styles.qrCodeLabel}>Scan to Check In</Text>
              <Text style={styles.qrCodeUrl}>servicegenie.app/checkin</Text>
            </View>
          </View>
          <View style={styles.qrActions}>
            <TouchableOpacity style={styles.qrButton}>
              <Download size={16} color="#fff" /><Text style={styles.qrButtonText}>Download QR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.qrButton}>
              <RefreshCw size={16} color="#fff" /><Text style={styles.qrButtonText}>Refresh Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Check-Ins</Text>
        {recentCheckIns.map((checkIn) => (
          <View key={checkIn.id} style={styles.checkInCard}>
            <View style={styles.checkInInfo}>
              <View style={styles.checkInAvatar}>
                <Text style={styles.checkInAvatarText}>{checkIn.customer[0]}</Text>
              </View>
              <View style={styles.checkInDetails}>
                <Text style={styles.checkInCustomer}>{checkIn.customer}</Text>
                <Text style={styles.checkInService}>{checkIn.service} with {checkIn.provider}</Text>
              </View>
            </View>
            <View style={styles.checkInMeta}>
              <Text style={styles.checkInTime}>{checkIn.time}</Text>
              <View style={[styles.checkInBadge, checkIn.method === 'QR Code' ? styles.qrBadge : styles.manualBadge]}>
                <Text style={styles.checkInBadgeText}>{checkIn.method}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderSubscriptions = () => {
    const activeSubs = [
      { id: 'sub1', customer: 'Sarah P.', plan: 'Luxe Hair Care', price: 49.99, status: 'active', nextShipment: '2026-03-01' },
      { id: 'sub2', customer: 'John D.', plan: 'Grooming Kit', price: 29.99, status: 'active', nextShipment: '2026-02-25' },
      { id: 'sub3', customer: 'Emily W.', plan: 'Luxe Hair Care', price: 49.99, status: 'cancelled', nextShipment: '-' },
    ];

    const plans = [
      { name: 'Luxe Hair Care', price: 49.99, frequency: 'Monthly', subscribers: 12 },
      { name: 'Grooming Kit', price: 29.99, frequency: 'Monthly', subscribers: 8 },
      { name: 'Essential Mani-Pedi', price: 39.99, frequency: 'Bi-monthly', subscribers: 5 },
    ];

    const membershipTiers = [
      { name: 'Gold Member', price: 199.99, benefits: 'Unlimited Haircuts, 20% off Products', members: 15 },
      { name: 'Silver Member', price: 99.99, benefits: '2 Haircuts/month, 10% off Products', members: 42 },
    ];

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <Text style={styles.sectionTitle}>Subscription Boxes</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Add Plan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{activeSubs.filter(s => s.status === 'active').length + 57}</Text>
            <Text style={styles.miniStatLabel}>Total Recurring</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>$7,240</Text>
            <Text style={styles.miniStatLabel}>MRR</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>25</Text>
            <Text style={styles.miniStatLabel}>Total Shipments</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Membership Tiers</Text>
        <View style={styles.plansGrid}>
          {membershipTiers.map((tier, idx) => (
            <View key={idx} style={[styles.planCard, { borderColor: '#ffd700' }]}>
              <View style={[styles.planIcon, { backgroundColor: 'rgba(255, 215, 0, 0.1)' }]}>
                <Award size={24} color="#ffd700" />
              </View>
              <Text style={styles.planName}>{tier.name}</Text>
              <Text style={styles.planPrice}>${tier.price} / mo</Text>
              <Text style={styles.planSubscribers}>{tier.members} members</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Subscription Plans</Text>
        <View style={styles.plansGrid}>
          {plans.map((plan, idx) => (
            <View key={idx} style={styles.planCard}>
              <View style={styles.planIcon}>
                <Package size={24} color="#6366f1" />
              </View>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>${plan.price} / {plan.frequency}</Text>
              <Text style={styles.planSubscribers}>{plan.subscribers} subscribers</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Active Subscribers</Text>
        {activeSubs.map((sub) => (
          <View key={sub.id} style={styles.subCard}>
            <View style={styles.subInfo}>
              <Text style={styles.subCustomer}>{sub.customer}</Text>
              <Text style={styles.subPlan}>{sub.plan}</Text>
            </View>
            <View style={styles.subStatus}>
              <Text style={[styles.subStatusText, sub.status === 'active' ? styles.activeStatusText : styles.inactiveStatusText]}>
                {sub.status.toUpperCase()}
              </Text>
              <Text style={styles.subNextDate}>Next: {sub.nextShipment}</Text>
            </View>
            <TouchableOpacity style={styles.subAction}>
              <ChevronRight size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderWaitlist = () => {
    const waitlist = [
      { id: 'w1', name: 'Michael Brown', phone: '+15550300', requestedDate: '2026-02-15', preferredTime: '2:00 PM', service: 'Haircut & Style', status: 'waiting', position: 1 },
      { id: 'w2', name: 'Sophia Martinez', phone: '+15550600', requestedDate: '2026-02-15', preferredTime: '10:00 AM', service: 'Manicure + Pedicure', status: 'notified', position: 2 },
      { id: 'w3', name: 'David Wilson', phone: '+15550500', requestedDate: '2026-02-16', preferredTime: 'Any morning', service: 'Color & Highlights', status: 'waiting', position: 3 },
      { id: 'w4', name: 'James Taylor', phone: '+15550700', requestedDate: '2026-02-20', preferredTime: 'After 5 PM', service: 'Haircut & Style', status: 'waiting', position: 4 },
    ];

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#64748b" />
            <TextInput style={styles.searchInput} placeholder="Search waitlist..." placeholderTextColor="#64748b" />
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Add to Waitlist</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{waitlist.length}</Text>
            <Text style={styles.miniStatLabel}>Total Waiting</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>1</Text>
            <Text style={styles.miniStatLabel}>Notified</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>3</Text>
            <Text style={styles.miniStatLabel}>Available Slots</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Waitlist Queue</Text>
        {waitlist.map((item) => (
          <View key={item.id} style={styles.waitlistCard}>
            <View style={styles.waitlistPosition}>
              <Text style={styles.waitlistPositionText}>#{item.position}</Text>
            </View>
            <View style={styles.waitlistInfo}>
              <View style={styles.waitlistHeader}>
                <Text style={styles.waitlistName}>{item.name}</Text>
                <View style={[styles.waitlistStatus, item.status === 'waiting' ? styles.waitingBadge : styles.notifiedBadge]}>
                  <Text style={styles.waitlistStatusText}>{item.status === 'waiting' ? 'Waiting' : 'Notified'}</Text>
                </View>
              </View>
              <Text style={styles.waitlistService}>{item.service}</Text>
              <View style={styles.waitlistDetails}>
                <View style={styles.waitlistDetail}>
                  <Calendar size={12} color="#94a3b8" />
                  <Text style={styles.waitlistDetailText}>{item.requestedDate}</Text>
                </View>
                <View style={styles.waitlistDetail}>
                  <Clock3 size={12} color="#94a3b8" />
                  <Text style={styles.waitlistDetailText}>{item.preferredTime}</Text>
                </View>
                <View style={styles.waitlistDetail}>
                  <Phone size={12} color="#94a3b8" />
                  <Text style={styles.waitlistDetailText}>{item.phone}</Text>
                </View>
              </View>
            </View>
            <View style={styles.waitlistActions}>
              <TouchableOpacity style={styles.waitlistActionButton} onPress={() => alert(`Notifying ${item.name}...`)}>
                <Bell size={14} color="#10b981" /><Text style={styles.waitlistActionText}>Notify</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.waitlistActionButton} onPress={() => alert(`Booking ${item.name}...`)}>
                <Calendar size={14} color="#6366f1" /><Text style={styles.waitlistActionText}>Book</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.waitlistActionButton} onPress={() => alert(`Removing ${item.name}...`)}>
                <X size={14} color="#ef4444" /><Text style={styles.waitlistActionText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

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

  const renderPOS = () => {
    const transactions = [
      { id: 'txn_001', type: 'Sale', amount: 125.50, items: 'Haircut + Style', paymentMethod: 'Square', date: '2 min ago' },
      { id: 'txn_002', type: 'Tip', amount: 20.00, items: 'Tip', paymentMethod: 'Cash', date: '15 min ago' },
      { id: 'txn_003', type: 'Refund', amount: -25.00, items: 'Product Return', paymentMethod: 'Original Card', date: '1 hour ago' },
    ];

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <View>
            <Text style={styles.headerTitle}>POS Systems</Text>
            <Text style={styles.headerSubtitle}>Manage payment terminals and transactions</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Add Terminal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.posStatsRow}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>3</Text>
            <Text style={styles.miniStatLabel}>Active Terminals</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>$2,847</Text>
            <Text style={styles.miniStatLabel}>Today</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>156</Text>
            <Text style={styles.miniStatLabel}>Transactions</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Connected Terminals</Text>
        </View>

        <View style={styles.integrationList}>
          <View style={styles.integrationItem}>
            <View style={styles.integrationHeader}>
              <View style={[styles.integrationIcon, { backgroundColor: '#006AFF' }]}>
                <CreditCard size={24} color="#fff" />
              </View>
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Square</Text>
                <Text style={styles.integrationDesc}>Terminal #1 - Front Desk</Text>
              </View>
              <View style={styles.posStatusIndicator}>
                <View style={styles.statusDot} />
                <Text style={styles.statusDotText}>Online</Text>
              </View>
            </View>
            <View style={styles.posTerminalDetails}>
              <View style={styles.posDetailRow}>
                <Text style={styles.posDetailLabel}>Device ID</Text>
                <Text style={styles.posDetailValue}>SQ-001-FRONT</Text>
              </View>
              <View style={styles.posDetailRow}>
                <Text style={styles.posDetailLabel}>Last Transaction</Text>
                <Text style={styles.posDetailValue}>$125.50 - 2 min ago</Text>
              </View>
            </View>
          </View>

          <View style={styles.integrationItem}>
            <View style={styles.integrationHeader}>
              <View style={[styles.integrationIcon, { backgroundColor: '#006AFF' }]}>
                <CreditCard size={24} color="#fff" />
              </View>
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Square</Text>
                <Text style={styles.integrationDesc}>Terminal #2 - Station 4</Text>
              </View>
              <View style={styles.posStatusIndicator}>
                <View style={styles.statusDot} />
                <Text style={styles.statusDotText}>Online</Text>
              </View>
            </View>
            <View style={styles.posTerminalDetails}>
              <View style={styles.posDetailRow}>
                <Text style={styles.posDetailLabel}>Device ID</Text>
                <Text style={styles.posDetailValue}>SQ-002-STAT4</Text>
              </View>
              <View style={styles.posDetailRow}>
                <Text style={styles.posDetailLabel}>Last Transaction</Text>
                <Text style={styles.posDetailValue}>$85.00 - 32 min ago</Text>
              </View>
            </View>
          </View>

          <View style={styles.integrationItem}>
            <View style={styles.integrationHeader}>
              <View style={[styles.integrationIcon, { backgroundColor: '#F22F46' }]}>
                <CreditCard size={24} color="#fff" />
              </View>
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Clover</Text>
                <Text style={styles.integrationDesc}>Terminal #3 - Station 7</Text>
              </View>
              <View style={[styles.posStatusIndicator, styles.offlineIndicator]}>
                <View style={[styles.statusDot, styles.offlineDot]} />
                <Text style={[styles.statusDotText, styles.offlineText]}>Offline</Text>
              </View>
            </View>
            <View style={styles.posTerminalDetails}>
              <View style={styles.posDetailRow}>
                <Text style={styles.posDetailLabel}>Device ID</Text>
                <Text style={styles.posDetailValue}>CL-003-STAT7</Text>
              </View>
              <View style={styles.posDetailRow}>
                <Text style={styles.posDetailLabel}>Last Transaction</Text>
                <Text style={styles.posDetailValue}>$210.00 - 2 hours ago</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        
        {transactions.map((txn) => (
          <View key={txn.id} style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Text style={styles.transactionTypeEmoji}>{txn.type === 'Refund' ? '↩️' : txn.type === 'Tip' ? '💰' : '💳'}</Text>
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionCustomer}>{txn.items}</Text>
              <Text style={styles.transactionDate}>{txn.paymentMethod} • {txn.date}</Text>
            </View>
            <View style={styles.transactionRight}>
              <Text style={[styles.transactionAmount, txn.amount < 0 && styles.refundAmount]}>{txn.amount < 0 ? '-' : ''}${Math.abs(txn.amount).toFixed(2)}</Text>
              <TouchableOpacity style={styles.refundButton}>
                <Text style={styles.refundButtonText}>Receipt</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderMarketing = () => {
    const campaigns = [
      { id: 1, name: 'Spring Hair Refresh', type: 'Email', status: 'Active', sent: 1247, openRate: 42, clicks: 234 },
      { id: 2, name: 'Loyalty Program Launch', type: 'SMS + Email', status: 'Scheduled', sent: 0, openRate: 0, clicks: 0 },
      { id: 3, name: 'VIP Early Access', type: 'Email', status: 'Draft', sent: 0, openRate: 0, clicks: 0 },
      { id: 4, name: 'Birthday Club', type: 'Automated', status: 'Active', sent: 89, openRate: 68, clicks: 156 },
    ];

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#64748b" />
            <TextInput style={styles.searchInput} placeholder="Search campaigns..." placeholderTextColor="#64748b" />
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={18} color="#fff" /><Text style={styles.addButtonText}>New Campaign</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.marketingStatsRow}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>4</Text>
            <Text style={styles.miniStatLabel}>Campaigns</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>1,336</Text>
            <Text style={styles.miniStatLabel}>Total Sent</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>47%</Text>
            <Text style={styles.miniStatLabel}>Avg Open Rate</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>390</Text>
            <Text style={styles.miniStatLabel}>Total Clicks</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Marketing Integrations</Text>
          <Text style={styles.sectionSubtitle}>Connect your marketing tools</Text>
        </View>

        <View style={styles.integrationList}>
          <View style={styles.integrationItem}>
            <View style={styles.integrationHeader}>
              <View style={[styles.integrationIcon, { backgroundColor: '#FFE01B' }]}>
                <Mail size={24} color="#000" />
              </View>
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Mailchimp</Text>
                <Text style={styles.integrationDesc}>Email marketing & automation</Text>
              </View>
              <TouchableOpacity style={[styles.connectButton, styles.connectedButton]}>
                <Check size={14} color="#10b981" />
                <Text style={styles.connectedButtonText}>Connected</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.integrationItem}>
            <View style={styles.integrationHeader}>
              <View style={[styles.integrationIcon, { backgroundColor: '#4B5563' }]}>
                <Mail size={24} color="#fff" />
              </View>
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Klaviyo</Text>
                <Text style={styles.integrationDesc}>E-commerce email marketing</Text>
              </View>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.integrationItem}>
            <View style={styles.integrationHeader}>
              <View style={[styles.integrationIcon, { backgroundColor: '#F22F46' }]}>
                <Smartphone size={24} color="#fff" />
              </View>
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Twilio</Text>
                <Text style={styles.integrationDesc}>SMS & Voice messaging</Text>
              </View>
              <TouchableOpacity style={[styles.connectButton, styles.connectedButton]}>
                <Check size={14} color="#10b981" />
                <Text style={styles.connectedButtonText}>Connected</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>Recent Campaigns</Text>
        
        {campaigns.map((campaign) => (
          <View key={campaign.id} style={styles.campaignCard}>
            <View style={styles.campaignHeader}>
              <View style={styles.campaignInfo}>
                <Text style={styles.campaignName}>{campaign.name}</Text>
                <View style={styles.campaignMeta}>
                  <View style={[styles.campaignTypeBadge, campaign.type.includes('SMS') && styles.smsBadge]}>
                    <Smartphone size={12} color={campaign.type.includes('SMS') ? '#fff' : '#6366f1'} />
                    <Text style={[styles.campaignTypeText, campaign.type.includes('SMS') && styles.smsBadgeText]}>{campaign.type}</Text>
                  </View>
                  <View style={[styles.statusBadge, campaign.status === 'Active' ? styles.activeBadge : campaign.status === 'Scheduled' ? styles.pendingBadge : styles.inactiveBadge]}>
                    <Text style={[styles.statusText, campaign.status === 'Active' ? styles.activeStatusText : campaign.status === 'Scheduled' ? styles.pendingText : styles.inactiveStatusText]}>{campaign.status}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.campaignActionsButton}>
                <MoreHorizontal size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            {campaign.status === 'Active' && (
              <View style={styles.campaignStats}>
                <View style={styles.campaignStat}>
                  <Text style={styles.campaignStatValue}>{campaign.sent}</Text>
                  <Text style={styles.campaignStatLabel}>Sent</Text>
                </View>
                <View style={styles.campaignStat}>
                  <Text style={styles.campaignStatValue}>{campaign.openRate}%</Text>
                  <Text style={styles.campaignStatLabel}>Open Rate</Text>
                </View>
                <View style={styles.campaignStat}>
                  <Text style={styles.campaignStatValue}>{campaign.clicks}</Text>
                  <Text style={styles.campaignStatLabel}>Clicks</Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderSettings = () => {
    const [templates, setTemplates] = useState({
      confirmation: 'Hi {name}! Your appointment at {location} is confirmed for {date} at {time}. Reply HELP for assistance.',
      reminder: 'Reminder: You have an appointment at {location} tomorrow at {time}. Reply CANCEL to cancel.',
      cancellation: 'Your appointment at {location} on {date} at {time} has been cancelled.',
      emailConfirmation: 'Dear {name},\n\nYour appointment has been confirmed:\n\n📅 Date: {date}\n⏰ Time: {time}\n📍 Location: {location}\n💇 Service: {service}\n\nThank you for choosing ServiceGenie!',
      emailReminder: 'Dear {name},\n\nThis is a friendly reminder about your upcoming appointment:\n\n📅 Date: {date}\n⏰ Time: {time}\n📍 Location: {location}\n💇 Service: {service}\n\nWe look forward to seeing you!',
      emailCancellation: 'Dear {name},\n\nYour appointment has been cancelled:\n\n📅 Date: {date}\n⏰ Time: {time}\n📍 Location: {location}\n💇 Service: {service}\n\nIf you did not request this cancellation, please contact us.',
      emailMarketing: 'Dear {name},\n\n{content}\n\n---\n\nTo manage your communication preferences, visit your account settings or reply STOP to opt out.'
    });
    
    const [languageSettings, setLanguageSettings] = useState({
      defaultLanguage: 'en',
      supportedLanguages: ['en', 'es', 'fr'],
      autoDetect: false
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
            value={templates.emailConfirmation}
            onChangeText={(text) => setTemplates({ ...templates, emailConfirmation: text })}
            placeholder="Enter email content..."
            placeholderTextColor="#64748b"
          />
        </View>

        <View style={styles.templateCard}>
          <Text style={styles.templateLabel}>Booking Reminder Email</Text>
          <TextInput
            style={styles.templateInput}
            multiline
            numberOfLines={6}
            value={templates.emailReminder}
            onChangeText={(text) => setTemplates({ ...templates, emailReminder: text })}
            placeholder="Enter reminder email content..."
            placeholderTextColor="#64748b"
          />
          <Text style={styles.templateHint}>Available: {'{name}'}, {'{date}'}, {'{time}'}, {'{location}'}, {'{service}'}</Text>
        </View>

        <View style={styles.templateCard}>
          <Text style={styles.templateLabel}>Cancellation Email</Text>
          <TextInput
            style={styles.templateInput}
            multiline
            numberOfLines={6}
            value={templates.emailCancellation}
            onChangeText={(text) => setTemplates({ ...templates, emailCancellation: text })}
            placeholder="Enter cancellation email content..."
            placeholderTextColor="#64748b"
          />
          <Text style={styles.templateHint}>Available: {'{name}'}, {'{date}'}, {'{time}'}, {'{location}'}, {'{service}'}</Text>
        </View>

        <View style={styles.templateCard}>
          <Text style={styles.templateLabel}>Marketing Email Template</Text>
          <TextInput
            style={styles.templateInput}
            multiline
            numberOfLines={6}
            value={templates.emailMarketing}
            onChangeText={(text) => setTemplates({ ...templates, emailMarketing: text })}
            placeholder="Enter marketing email template..."
            placeholderTextColor="#64748b"
          />
          <Text style={styles.templateHint}>Available: {'{name}'}, {'{content}'} (for campaign content)</Text>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Templates</Text>
        </TouchableOpacity>

        <View style={styles.sectionDivider} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Marketing Campaigns</Text>
          <Text style={styles.sectionSubtitle}>Send one-time email or SMS blasts</Text>
        </View>

        <View style={styles.campaignList}>
          <TouchableOpacity style={styles.createCampaignBtn}>
            <Plus size={20} color="#fff" />
            <Text style={styles.createCampaignText}>Create New Campaign</Text>
          </TouchableOpacity>

          <View style={styles.campaignItem}>
            <View style={styles.campaignInfo}>
              <Text style={styles.campaignName}>Spring Sale Blast</Text>
              <Text style={styles.campaignMeta}>Sent to 120 customers • 2 days ago</Text>
            </View>
            <View style={[styles.statusBadge, styles.activeBadge]}>
              <Text style={[styles.statusText, styles.activeStatusText]}>SENT</Text>
            </View>
          </View>

          <View style={styles.campaignItem}>
            <View style={styles.campaignInfo}>
              <Text style={styles.campaignName}>New Service: Scalp Massage</Text>
              <Text style={styles.campaignMeta}>Draft • Last edited 1 hour ago</Text>
            </View>
            <View style={[styles.statusBadge, styles.pendingBadge]}>
              <Text style={[styles.statusText, styles.pendingText]}>DRAFT</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Third-Party Integrations</Text>
          <Text style={styles.sectionSubtitle}>Connect with your favorite business tools</Text>
        </View>

        <View style={styles.integrationList}>
          <View style={styles.integrationItem}>
            <View style={styles.integrationHeader}>
              <View style={[styles.integrationIcon, { backgroundColor: '#2ca01c' }]}>
                <Building2 size={24} color="#fff" />
              </View>
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>QuickBooks Online</Text>
                <Text style={styles.integrationDesc}>Sync revenue and expenses automatically</Text>
              </View>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.integrationItem}>
            <View style={styles.integrationHeader}>
              <View style={[styles.integrationIcon, { backgroundColor: '#13b5ea' }]}>
                <CreditCard size={24} color="#fff" />
              </View>
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Xero</Text>
                <Text style={styles.integrationDesc}>Cloud accounting and financial reporting</Text>
              </View>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.integrationItem}>
            <View style={styles.integrationHeader}>
              <View style={[styles.integrationIcon, { backgroundColor: '#4285F4' }]}>
                <Calendar size={24} color="#fff" />
              </View>
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Google Calendar</Text>
                <Text style={styles.integrationDesc}>Two-way sync for provider schedules</Text>
              </View>
              <View style={[styles.statusBadge, styles.activeBadge]}>
                <Text style={[styles.statusText, styles.activeStatusText]}>Linked</Text>
              </View>
            </View>
          </View>

          <View style={styles.integrationItem}>
            <View style={styles.integrationHeader}>
              <View style={[styles.integrationIcon, { backgroundColor: '#000' }]}>
                <CreditCard size={24} color="#fff" />
              </View>
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Square POS</Text>
                <Text style={styles.integrationDesc}>Sync in-person payments and inventory</Text>
              </View>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.integrationItem}>
            <View style={styles.integrationHeader}>
              <View style={[styles.integrationIcon, { backgroundColor: '#009a22' }]}>
                <Building2 size={24} color="#fff" />
              </View>
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Clover</Text>
                <Text style={styles.integrationDesc}>Process payments with Clover hardware</Text>
              </View>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.integrationItem}>
            <View style={styles.integrationHeader}>
              <View style={[styles.integrationIcon, { backgroundColor: '#F22F46' }]}>
                <Smartphone size={24} color="#fff" />
              </View>
              <View style={styles.integrationInfo}>
                <Text style={styles.integrationName}>Twilio</Text>
                <Text style={styles.integrationDesc}>Carrier-direct SMS and Voice alerts</Text>
              </View>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>API for Third-Party Apps</Text>
          <Text style={styles.sectionSubtitle}>Generate API keys to integrate with external applications</Text>
        </View>

        <View style={styles.apiSection}>
          <View style={styles.apiKeyCard}>
            <View style={styles.apiKeyHeader}>
              <Key size={20} color="#6366f1" />
              <Text style={styles.apiKeyTitle}>Production API Key</Text>
            </View>
            <View style={styles.apiKeyRow}>
              <Text style={styles.apiKeyLabel}>Key:</Text>
              <Text style={styles.apiKeyValue}>sg_live_••••••••••••••••</Text>
              <TouchableOpacity style={styles.copyButton} onPress={() => alert("API key copied!")}>
                <Copy size={14} color="#6366f1" />
              </TouchableOpacity>
            </View>
            <View style={styles.apiKeyMeta}>
              <Text style={styles.apiKeyCreated}>Created: Jan 15, 2026</Text>
              <Text style={styles.apiKeyExpiry}>Expires: Jan 15, 2027</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.generateApiButton}>
            <Plus size={18} color="#fff" />
            <Text style={styles.generateApiButtonText}>Generate New API Key</Text>
          </TouchableOpacity>

          <View style={styles.apiDocsSection}>
            <Text style={styles.apiDocsTitle}>API Endpoints</Text>
            <View style={styles.apiEndpoint}>
              <Text style={styles.apiMethod}>GET</Text>
              <Text style={styles.apiPath}>/api/v1/appointments</Text>
            </View>
            <View style={styles.apiEndpoint}>
              <Text style={styles.apiMethod}>POST</Text>
              <Text style={styles.apiPath}>/api/v1/appointments</Text>
            </View>
            <View style={styles.apiEndpoint}>
              <Text style={styles.apiMethod}>GET</Text>
              <Text style={styles.apiPath}>/api/v1/services</Text>
            </View>
            <View style={styles.apiEndpoint}>
              <Text style={styles.apiMethod}>GET</Text>
              <Text style={styles.apiPath}>/api/v1/providers</Text>
            </View>
            <View style={styles.apiEndpoint}>
              <Text style={styles.apiMethod}>GET</Text>
              <Text style={styles.apiPath}>/api/v1/customers</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewDocsButton}>
            <Text style={styles.viewDocsButtonText}>View Full API Documentation →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Loyalty & Rewards Program</Text>
          <Text style={styles.sectionSubtitle}>Boost customer retention with points and rewards</Text>
        </View>

        <View style={styles.loyaltyStatsRow}>
          <View style={styles.loyaltyStatCard}>
            <Text style={styles.loyaltyStatValue}>2,847</Text>
            <Text style={styles.loyaltyStatLabel}>Active Members</Text>
          </View>
          <View style={styles.loyaltyStatCard}>
            <Text style={styles.loyaltyStatValue}>45.2K</Text>
            <Text style={styles.loyaltyStatLabel}>Points Issued</Text>
          </View>
          <View style={styles.loyaltyStatCard}>
            <Text style={styles.loyaltyStatValue}>$12.4K</Text>
            <Text style={styles.loyaltyStatLabel}>Rewards Redeemed</Text>
          </View>
        </View>

        <View style={styles.loyaltyTiersSection}>
          <Text style={styles.loyaltySectionTitle}>Reward Tiers</Text>
          
          <View style={styles.loyaltyTierCard}>
            <View style={styles.tierHeader}>
              <View style={[styles.tierBadge, { backgroundColor: '#94a3b4' }]}>
                <Text style={styles.tierBadgeText}>BRONZE</Text>
              </View>
              <Text style={styles.tierPoints}>1 point/$1</Text>
            </View>
            <Text style={styles.tierDesc}>Entry level - 0 to 499 points</Text>
            <Text style={styles.tierPerk}>• 1 point per dollar spent</Text>
          </View>

          <View style={styles.loyaltyTierCard}>
            <View style={styles.tierHeader}>
              <View style={[styles.tierBadge, { backgroundColor: '#f59e0b' }]}>
                <Text style={styles.tierBadgeText}>SILVER</Text>
              </View>
              <Text style={styles.tierPoints}>1.5 points/$1</Text>
            </View>
            <Text style={styles.tierDesc}>Mid level - 500 to 1,499 points</Text>
            <Text style={styles.tierPerk}>• 1.5 points per dollar spent</Text>
            <Text style={styles.tierPerk}>• Birthday bonus: 50 points</Text>
          </View>

          <View style={styles.loyaltyTierCard}>
            <View style={styles.tierHeader}>
              <View style={[styles.tierBadge, { backgroundColor: '#10b981' }]}>
                <Text style={styles.tierBadgeText}>GOLD</Text>
              </View>
              <Text style={styles.tierPoints}>2 points/$1</Text>
            </View>
            <Text style={styles.tierDesc}>Top level - 1,500+ points</Text>
            <Text style={styles.tierPerk}>• 2 points per dollar spent</Text>
            <Text style={styles.tierPerk}>• Birthday bonus: 100 points</Text>
            <Text style={styles.tierPerk}>• Priority booking</Text>
            <Text style={styles.tierPerk}>• Free add-on with each visit</Text>
          </View>
        </View>

        <View style={styles.loyaltyRewardsSection}>
          <Text style={styles.loyaltySectionTitle}>Available Rewards</Text>
          
          <View style={styles.rewardItem}>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardName}>$5 Off</Text>
              <Text style={styles.rewardCost}>500 points</Text>
            </View>
            <Text style={styles.rewardRedemptions}>234 redeemed this month</Text>
          </View>

          <View style={styles.rewardItem}>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardName}>Free Scalp Treatment</Text>
              <Text style={styles.rewardCost}>1,000 points</Text>
            </View>
            <Text style={styles.rewardRedemptions}>89 redeemed this month</Text>
          </View>

          <View style={styles.rewardItem}>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardName}>$25 Off</Text>
              <Text style={styles.rewardCost}>2,500 points</Text>
            </View>
            <Text style={styles.rewardRedemptions}>156 redeemed this month</Text>
          </View>

          <View style={styles.rewardItem}>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardName}>Free Haircut</Text>
              <Text style={styles.rewardCost}>3,000 points</Text>
            </View>
            <Text style={styles.rewardRedemptions}>45 redeemed this month</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addRewardButton}>
          <Plus size={18} color="#fff" />
          <Text style={styles.addRewardButtonText}>Add New Reward</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderCustomers = () => {
    const filteredCustomers = mockData.customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.phone || "").includes(searchQuery);
      const matchesSegment = customerSegment === "all" || (c.tags || []).includes(customerSegment);
      return matchesSearch && matchesSegment;
    });

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.tabHeader}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#64748b" />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search customers..." 
              placeholderTextColor="#64748b" 
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity style={styles.exportButton} onPress={() => alert("Opening Bulk Message composer...")}>
              <Mail size={18} color="#94a3b8" /><Text style={styles.exportButtonText}>Bulk Msg</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton} onPress={() => exportCustomers()}>
              <Download size={18} color="#94a3b8" /><Text style={styles.exportButtonText}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton}><Plus size={18} color="#fff" /><Text style={styles.addButtonText}>Add</Text></TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          <TouchableOpacity 
            style={[styles.filterChip, customerSegment === "all" && styles.filterChipActive]}
            onPress={() => setCustomerSegment("all")}
          >
            <Text style={[styles.filterChipText, customerSegment === "all" && styles.filterChipTextActive]}>All Clients</Text>
          </TouchableOpacity>
          {["VIP", "Regular", "New", "Referral"].map(tag => (
            <TouchableOpacity 
              key={tag}
              style={[styles.filterChip, customerSegment === tag && styles.filterChipActive]}
              onPress={() => setCustomerSegment(tag)}
            >
              <Text style={[styles.filterChipText, customerSegment === tag && styles.filterChipTextActive]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredCustomers.map((customer) => (
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

          {customer.photos && (
            <View style={styles.customerPhotos}>
              <Text style={styles.photoLabel}>Latest Work:</Text>
              <View style={styles.photoRow}>
                <View style={styles.photoItem}>
                  <Image source={{ uri: customer.photos[0].before }} style={styles.photoThumb} />
                  <Text style={styles.photoSub}>Before</Text>
                </View>
                <View style={styles.photoItem}>
                  <Image source={{ uri: customer.photos[0].after }} style={styles.photoThumb} />
                  <Text style={styles.photoSub}>After</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );

  };
  const renderGiftCards = () => {
    const giftCards = [
      { id: 'gc_001', code: 'GIFT50', value: 50, balance: 50, purchasedBy: 'Sarah P.', date: '2026-01-15', status: 'active', recipient: 'Emily R.', expires: '2027-01-15' },
      { id: 'gc_002', code: 'HOLIDAY100', value: 100, balance: 75, purchasedBy: 'John D.', date: '2025-12-20', status: 'partial', recipient: 'Michael T.', expires: '2026-12-20' },
      { id: 'gc_003', code: 'BIRTHDAY25', value: 25, balance: 0, purchasedBy: 'Emily W.', date: '2025-11-10', status: 'redeemed', recipient: 'Lisa K.', expires: '2026-05-10' },
      { id: 'gc_004', code: 'WELCOME75', value: 75, balance: 75, purchasedBy: 'James B.', date: '2026-02-01', status: 'active', recipient: 'Amanda C.', expires: '2027-02-01' },
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
          <View style={styles.miniStat}>
            <Text style={styles.miniStatValue}>${giftCards.filter(g => g.balance === 0).length}</Text>
            <Text style={styles.miniStatLabel}>Redeemed</Text>
          </View>
        </View>

        <View style={styles.giftCardTemplates}>
          <Text style={styles.giftSectionTitle}>Popular Templates</Text>
          <View style={styles.giftTemplateGrid}>
            <TouchableOpacity style={styles.giftTemplateCard}>
              <Gift size={24} color="#6366f1" />
              <Text style={styles.giftTemplatePrice}>$25</Text>
              <Text style={styles.giftTemplateLabel}>Birthday</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.giftTemplateCard}>
              <Gift size={24} color="#10b981" />
              <Text style={styles.giftTemplatePrice}>$50</Text>
              <Text style={styles.giftTemplateLabel}>Thank You</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.giftTemplateCard}>
              <Gift size={24} color="#f59e0b" />
              <Text style={styles.giftTemplatePrice}>$100</Text>
              <Text style={styles.giftTemplateLabel}>Holiday</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.giftTemplateCard}>
              <Gift size={24} color="#ec4899" />
              <Text style={styles.giftTemplatePrice}>Custom</Text>
              <Text style={styles.giftTemplateLabel}>Any Amount</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Active Gift Cards</Text>
        {giftCards.map((card) => (
          <View key={card.id} style={styles.giftCard}>
            <View style={styles.giftCardHeader}>
              <View style={styles.giftCardInfo}>
                <Text style={styles.giftCardCode}>{card.code}</Text>
                <Text style={styles.giftCardPurchasedBy}>To: {card.recipient} | From: {card.purchasedBy}</Text>
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
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Expires</Text>
                <Text style={styles.balanceValue}>{card.expires}</Text>
              </View>
            </View>
            <View style={styles.giftCardActions}>
              <TouchableOpacity style={styles.giftCardButton}>
                <Edit size={14} color="#6366f1" /><Text style={styles.giftCardButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.giftCardButton}>
                <Mail size={14} color="#94a3b8" /><Text style={styles.giftCardButtonTextEmail}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.giftCardButton}>
                <DollarSign size={14} color="#10b981" /><Text style={styles.giftCardButtonText}>Redeem</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.sectionDivider} />
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Accessibility Settings</Text>
          <Text style={styles.sectionSubtitle}>Configure accessibility options for all users</Text>
        </View>

        <View style={styles.templateCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.templateLabel}>Large Text Mode</Text>
              <Text style={styles.templateHint}>Increase text size throughout the app for better readability</Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggleButton, true && styles.toggleButtonActive]}
              accessibilityLabel="Toggle large text"
              accessibilityRole="button"
            >
              <View style={[styles.toggleKnob, true && styles.toggleKnobActive]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.templateCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.templateLabel}>High Contrast Mode</Text>
              <Text style={styles.templateHint}>Increase contrast for better visibility in bright environments</Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggleButton, false && styles.toggleButtonActive]}
              accessibilityLabel="Toggle high contrast"
              accessibilityRole="button"
            >
              <View style={[styles.toggleKnob, false && styles.toggleKnobActive]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.templateCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.templateLabel}>Reduce Motion</Text>
              <Text style={styles.templateHint}>Minimize animations and transitions</Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggleButton, false && styles.toggleButtonActive]}
              accessibilityLabel="Toggle reduce motion"
              accessibilityRole="button"
            >
              <View style={[styles.toggleKnob, false && styles.toggleKnobActive]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.templateCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.templateLabel}>Screen Reader Support</Text>
              <Text style={styles.templateHint}>Optimize for VoiceOver and TalkBack accessibility features</Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggleButton, true && styles.toggleButtonActive]}
              accessibilityLabel="Toggle screen reader support"
              accessibilityRole="button"
            >
              <View style={[styles.toggleKnob, true && styles.toggleKnobActive]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionDivider} />
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Language Settings</Text>
          <Text style={styles.sectionSubtitle}>Configure supported languages for your customers</Text>
        </View>

        <View style={styles.templateCard}>
          <Text style={styles.templateLabel}>Default App Language</Text>
          <View style={styles.languageGrid}>
            {languages.slice(0, 6).map((lang) => (
              <TouchableOpacity 
                key={lang.code}
                style={[
                  styles.languageButton,
                  languageSettings.defaultLanguage === lang.code && styles.languageButtonActive
                ]}
                onPress={() => setLanguageSettings({ ...languageSettings, defaultLanguage: lang.code })}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[styles.languageName, languageSettings.defaultLanguage === lang.code && styles.languageNameActive]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.templateCard}>
          <Text style={styles.templateLabel}>Supported Languages</Text>
          <Text style={styles.templateHint}>Select languages your customers can choose from</Text>
          <View style={styles.languageGrid}>
            {languages.map((lang) => {
              const isSupported = languageSettings.supportedLanguages.includes(lang.code);
              return (
                <TouchableOpacity 
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    isSupported && styles.languageButtonActive
                  ]}
                  onPress={() => {
                    if (isSupported) {
                      setLanguageSettings({
                        ...languageSettings,
                        supportedLanguages: languageSettings.supportedLanguages.filter(l => l !== lang.code)
                      });
                    } else {
                      setLanguageSettings({
                        ...languageSettings,
                        supportedLanguages: [...languageSettings.supportedLanguages, lang.code]
                      });
                    }
                  }}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[styles.languageName, isSupported && styles.languageNameActive]}>
                    {lang.name}
                  </Text>
                  {isSupported && <Text style={styles.languageCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.templateCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.templateLabel}>Auto-Detect User Language</Text>
              <Text style={styles.templateHint}>Automatically detect and use customer's device language setting</Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggleButton, languageSettings.autoDetect && styles.toggleButtonActive]}
              accessibilityLabel="Toggle auto-detect language"
              accessibilityRole="button"
              onPress={() => setLanguageSettings({ ...languageSettings, autoDetect: !languageSettings.autoDetect })}
            >
              <View style={[styles.toggleKnob, languageSettings.autoDetect && styles.toggleKnobActive]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.templateCard}>
          <Text style={styles.templateLabel}>Translation Progress</Text>
          <View style={styles.translationProgress}>
            {languages.slice(0, 5).map((lang) => {
              const progress = Math.floor(Math.random() * 30) + 70; // Mock progress
              return (
                <View key={lang.code} style={styles.translationRow}>
                  <Text style={styles.translationFlag}>{lang.flag}</Text>
                  <Text style={styles.translationLang}>{lang.name}</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{progress}%</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  };

  const NAV_ITEMS = [
    { id: 'overview', icon: BarChart3, label: 'Overview', roles: ['admin', 'manager'] },
    { id: 'appointments', icon: Calendar, label: 'Appointments', roles: ['admin', 'manager', 'receptionist'] },
    { id: 'payments', icon: DollarSign, label: 'Payments', roles: ['admin', 'manager'] },
    { id: 'giftcards', icon: Gift, label: 'Gift Cards', roles: ['admin', 'manager', 'receptionist'] },
    { id: 'loyalty', icon: Award, label: 'Loyalty', roles: ['admin', 'manager'] },
    { id: 'qrcheckin', icon: QrCode, label: 'Check-In', roles: ['admin', 'manager', 'receptionist'] },
    { id: 'subscriptions', icon: Package, label: 'Subscriptions', roles: ['admin', 'manager'] },
    { id: 'waitlist', icon: List, label: 'Waitlist', roles: ['admin', 'manager', 'receptionist'] },
    { id: 'teams', icon: Users, label: 'Teams', roles: ['admin', 'manager'] },
    { id: 'roles', icon: Shield, label: 'Roles', roles: ['admin'] },
    { id: 'providers', icon: UserCircle, label: 'Staff', roles: ['admin', 'manager'] },
    { id: 'customers', icon: User, label: 'Customers', roles: ['admin', 'manager', 'receptionist'] },
    { id: 'services', icon: CreditCard, label: 'Services', roles: ['admin', 'manager'] },
    { id: 'locations', icon: Building2, label: 'Locations', roles: ['admin'] },
    { id: 'marketing', icon: Mail, label: 'Marketing', roles: ['admin', 'manager'] },
    { id: 'pos', icon: CreditCard, label: 'POS', roles: ['admin', 'manager'] },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', roles: ['admin'] },
    { id: 'settings', icon: Settings, label: 'Settings', roles: ['admin'] },
  ].filter(item => item.roles.includes(userRole));

  return (
    <SafeAreaView style={styles.container}>
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <TouchableOpacity style={styles.sidebarOverlay} activeOpacity={1} onPress={() => setSidebarOpen(false)}>
          <View style={styles.mobileSidebar}>
            <View style={styles.logo}><Building2 size={28} color="#6366f1" /><Text style={styles.logoText}>Admin</Text></View>
            <ScrollView style={styles.nav} showsVerticalScrollIndicator={false}>
              {NAV_ITEMS.map((item) => (
                <TouchableOpacity key={item.id} style={[styles.navItem, activeTab === item.id && styles.activeNavItem]} onPress={() => { setActiveTab(item.id); setSidebarOpen(false); }}>
                  <item.icon size={20} color={activeTab === item.id ? '#fff' : '#94a3b8'} />
                  <Text style={[styles.navText, activeTab === item.id && styles.activeNavText]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.roleSwitcher}>
              <Text style={styles.roleLabel}>Active Role:</Text>
              <View style={styles.roleButtons}>
                {['admin', 'manager', 'receptionist'].map(role => (
                  <TouchableOpacity key={role} onPress={() => setUserRole(role)} style={[styles.roleBtn, userRole === role && styles.roleBtnActive]}>
                    <Text style={[styles.roleBtnText, userRole === role && styles.roleBtnTextActive]}>{role[0].toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <View style={styles.sidebar}>
          <View style={styles.logo}><Building2 size={28} color="#6366f1" /><Text style={styles.logoText}>Admin</Text></View>
          <ScrollView style={styles.nav} showsVerticalScrollIndicator={false}>
            {NAV_ITEMS.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.navItem, activeTab === item.id && styles.activeNavItem]} onPress={() => setActiveTab(item.id)}>
                <item.icon size={20} color={activeTab === item.id ? '#fff' : '#94a3b8'} />
                <Text style={[styles.navText, activeTab === item.id && styles.activeNavText]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.roleSwitcher}>
            <Text style={styles.roleLabel}>Active Role:</Text>
            <View style={styles.roleButtons}>
              {['admin', 'manager', 'receptionist'].map(role => (
                <TouchableOpacity key={role} onPress={() => { setUserRole(role); if (!NAV_ITEMS.find(i => i.id === activeTab)) setActiveTab('appointments'); }} style={[styles.roleBtn, userRole === role && styles.roleBtnActive]}>
                  <Text style={[styles.roleBtnText, userRole === role && styles.roleBtnTextActive]}>{role[0].toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      <View style={styles.main}>
        <View style={styles.header}>
          {isMobile && (
            <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)}>
              <List size={24} color="#fff" />
            </TouchableOpacity>
          )}
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
        {activeTab === 'loyalty' && renderLoyalty()}
        {activeTab === 'qrcheckin' && renderQRCheckIn()}
        {activeTab === 'subscriptions' && renderSubscriptions()}
        {activeTab === 'waitlist' && renderWaitlist()}
        {activeTab === 'teams' && renderTeams()}
        {activeTab === 'roles' && renderRoles()}
        {activeTab === 'providers' && renderProviders()}
        {activeTab === 'customers' && renderCustomers()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'locations' && renderLocations()}
        {activeTab === 'pos' && renderPOS()}
        {activeTab === 'marketing' && renderMarketing()}
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

              <Text style={styles.inputLabel}>Timezone</Text>
              <TextInput style={styles.modalInput} placeholder="America/New_York" placeholderTextColor="#64748b" defaultValue={locationModal.data?.timezone} />

              <View style={styles.sectionDivider} />
              <Text style={styles.sectionTitle}>Booking Policies</Text>

              <Text style={styles.inputLabel}>Min Lead Time (hours)</Text>
              <TextInput style={styles.modalInput} placeholder="24" placeholderTextColor="#64748b" keyboardType="numeric" defaultValue={locationModal.data?.bookingPolicies?.minLeadHours?.toString()} />

              <Text style={styles.inputLabel}>Buffer Time (minutes)</Text>
              <TextInput style={styles.modalInput} placeholder="15" placeholderTextColor="#64748b" keyboardType="numeric" defaultValue={locationModal.data?.bookingPolicies?.bufferMinutes?.toString()} />

              <Text style={styles.inputLabel}>Cancellation Window (hours)</Text>
              <TextInput style={styles.modalInput} placeholder="24" placeholderTextColor="#64748b" keyboardType="numeric" defaultValue={locationModal.data?.bookingPolicies?.cancellationWindowHours?.toString()} />

              <Text style={styles.inputLabel}>Cancellation Fee (%)</Text>
              <TextInput style={styles.modalInput} placeholder="50" placeholderTextColor="#64748b" keyboardType="numeric" defaultValue={locationModal.data?.bookingPolicies?.cancellationFeePercent?.toString()} />

              <Text style={styles.inputLabel}>No-show Fee ($)</Text>
              <TextInput style={styles.modalInput} placeholder="25" placeholderTextColor="#64748b" keyboardType="numeric" defaultValue={locationModal.data?.bookingPolicies?.noShowFee?.toString()} />

              <Text style={styles.inputLabel}>No-show Ban Threshold (count)</Text>
              <TextInput style={styles.modalInput} placeholder="3" placeholderTextColor="#64748b" keyboardType="numeric" defaultValue={locationModal.data?.bookingPolicies?.noShowBanThreshold?.toString()} />

              <View style={styles.prefRow}>
                <CreditCard size={20} color="#94a3b8" />
                <Text style={styles.prefLabel}>Require Deposit</Text>
                {/* Note: In a real app we'd use a state-controlled Switch here */}
                <View style={{ width: 50, height: 26, backgroundColor: locationModal.data?.bookingPolicies?.requireDeposit ? '#10b981' : '#334155', borderRadius: 13, justifyContent: 'center', paddingHorizontal: 2 }}>
                   <View style={{ width: 22, height: 22, backgroundColor: '#fff', borderRadius: 11, alignSelf: locationModal.data?.bookingPolicies?.requireDeposit ? 'flex-end' : 'flex-start' }} />
                </View>
              </View>

              {locationModal.data?.bookingPolicies?.requireDeposit && (
                <>
                  <Text style={styles.inputLabel}>Deposit Amount ($)</Text>
                  <TextInput style={styles.modalInput} placeholder="25" placeholderTextColor="#64748b" keyboardType="numeric" defaultValue={locationModal.data?.bookingPolicies?.depositAmount?.toString()} />
                </>
              )}

              <TouchableOpacity style={styles.modalSubmitButton} onPress={() => setLocationModal({ ...locationModal, visible: false })}>
                <Text style={styles.modalSubmitText}>{locationModal.mode === 'add' ? 'Add Location' : 'Save Changes'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#0f172a' },
  sidebar: { width: 240, backgroundColor: '#1e293b', borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.05)', paddingVertical: 24, height: '100%' },
  logo: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 32, gap: 12 },
  logoText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  nav: { flex: 1, gap: 4, paddingHorizontal: 12 },
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
  transactionList: { gap: 12, marginBottom: 24 },
  transactionItem: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  transactionIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(99, 102, 241, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  transactionTypeEmoji: { fontSize: 20 },
  transactionInfo: { flex: 1 },
  transactionCustomer: { color: '#fff', fontSize: 15, fontWeight: '700' },
  transactionDate: { color: '#64748b', fontSize: 12, marginTop: 2 },
  transactionRight: { alignItems: 'flex-end' },
  transactionAmount: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  refundButton: { marginTop: 8, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  refundButtonText: { color: '#ef4444', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  filterBar: { flexDirection: 'row', marginBottom: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1e293b', marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  filterChipActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  filterChipText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },
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
  tiersGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 24 },
  tierCard: { flex: 1, minWidth: 140, backgroundColor: '#1e293b', borderRadius: 16, padding: 16, borderWidth: 2, borderColor: 'transparent', alignItems: 'center' },
  tierBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  tierName: { color: '#000', fontWeight: '800', fontSize: 14 },
  tierInfo: { alignItems: 'center' },
  tierPoints: { color: '#fff', fontSize: 18, fontWeight: '800' },
  tierDiscount: { color: '#10b981', fontSize: 14, marginTop: 4 },
  tierMembers: { color: '#64748b', fontSize: 12, marginTop: 8 },
  redemptionCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  redemptionInfo: { flex: 1 },
  redemptionCustomer: { color: '#fff', fontSize: 15, fontWeight: '700' },
  redemptionTier: { color: '#64748b', fontSize: 12, marginTop: 2 },
  redemptionReward: { alignItems: 'flex-end', marginRight: 16 },
  redemptionItem: { color: '#6366f1', fontSize: 14, fontWeight: '600' },
  redemptionPoints: { color: '#ef4444', fontSize: 12, marginTop: 2 },
  redemptionDate: { color: '#64748b', fontSize: 12 },
  loyaltySettings: { marginTop: 24, paddingTop: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  settingLabel: { color: '#94a3b8', fontSize: 14 },
  pointsInput: { backgroundColor: '#0f172a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, width: 80 },
  pointsInputText: { color: '#fff', fontSize: 14, textAlign: 'center' },
  qrPreviewSection: { backgroundColor: '#1e293b', borderRadius: 16, padding: 24, marginBottom: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  qrCodeDisplay: { marginBottom: 16 },
  qrCodePlaceholder: { width: 180, height: 180, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  qrCodeText: { fontSize: 48, marginBottom: 8 },
  qrCodeLabel: { color: '#0f172a', fontSize: 14, fontWeight: '600' },
  qrCodeUrl: { color: '#64748b', fontSize: 12, marginTop: 4 },
  qrActions: { flexDirection: 'row', gap: 12 },
  qrButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#6366f1', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  qrButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  checkInCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  checkInInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  checkInAvatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center' },
  checkInAvatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  checkInDetails: { flex: 1 },
  checkInCustomer: { color: '#fff', fontSize: 15, fontWeight: '700' },
  checkInService: { color: '#64748b', fontSize: 13, marginTop: 2 },
  checkInMeta: { alignItems: 'flex-end' },
  checkInTime: { color: '#94a3b8', fontSize: 13 },
  checkInBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 4 },
  qrBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  manualBadge: { backgroundColor: 'rgba(249, 115, 22, 0.1)' },
  checkInBadgeText: { fontSize: 10, fontWeight: '700' },
  waitlistCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  waitlistPosition: { width: 50, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  waitlistPositionText: { color: '#6366f1', fontSize: 20, fontWeight: '800' },
  waitlistInfo: { flex: 1 },
  waitlistHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  waitlistName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  waitlistStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  waitingBadge: { backgroundColor: 'rgba(99, 102, 241, 0.1)' },
  notifiedBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  waitlistStatusText: { fontSize: 11, fontWeight: '700' },
  waitlistService: { color: '#94a3b8', fontSize: 14, marginBottom: 8 },
  waitlistDetails: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  waitlistDetail: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  waitlistDetailText: { color: '#64748b', fontSize: 12 },
  waitlistActions: { justifyContent: 'space-between', gap: 8 },
  waitlistActionButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8 },
  waitlistActionText: { fontSize: 12, fontWeight: '600' },
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
  teamMemberHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  teamLeadBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f59e0b', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  teamLeadText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  teamMemberRole: { color: '#64748b', fontSize: 10, marginTop: 2 },
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
  locationTimezone: { color: '#64748b', fontSize: 11, marginTop: 2 },
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
  customerPhotos: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  photoLabel: { color: '#64748b', fontSize: 11, fontWeight: '700', marginBottom: 8 },
  photoRow: { flexDirection: 'row', gap: 12 },
  photoItem: { alignItems: 'center' },
  photoThumb: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#0f172a' },
  photoSub: { color: '#64748b', fontSize: 9, marginTop: 4 },
  comingSoon: { color: '#64748b', fontSize: 16, textAlign: 'center', marginTop: 100 },
  plansGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  planCard: { flex: 1, backgroundColor: '#1e293b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  planIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(99, 102, 241, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  planName: { color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  planPrice: { color: '#10b981', fontSize: 12, fontWeight: '600', marginTop: 4 },
  planSubscribers: { color: '#64748b', fontSize: 10, marginTop: 4 },
  subCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  subInfo: { flex: 1 },
  subCustomer: { color: '#fff', fontSize: 15, fontWeight: '700' },
  subPlan: { color: '#64748b', fontSize: 13, marginTop: 2 },
  subStatus: { alignItems: 'flex-end', marginRight: 16 },
  subStatusText: { fontSize: 10, fontWeight: '800' },
  subNextDate: { color: '#64748b', fontSize: 11, marginTop: 4 },
  subAction: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  roleSwitcher: { padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', marginTop: 'auto' },
  roleLabel: { color: '#64748b', fontSize: 11, fontWeight: '700', marginBottom: 12, textTransform: 'uppercase' },
  roleButtons: { flexDirection: 'row', gap: 8 },
  roleBtn: { flex: 1, height: 36, borderRadius: 10, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  roleBtnActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  roleBtnText: { color: '#64748b', fontSize: 12, fontWeight: '700' },
  roleBtnTextActive: { color: '#fff' },
  campaignList: { gap: 12, marginBottom: 32 },
  createCampaignBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#6366f1', padding: 16, borderRadius: 16, marginBottom: 8, justifyContent: 'center' },
  createCampaignText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  campaignItem: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  campaignInfo: { flex: 1 },
  campaignName: { color: '#fff', fontSize: 15, fontWeight: '700' },
  campaignMeta: { color: '#64748b', fontSize: 12, marginTop: 4 },
  integrationList: { gap: 16, marginBottom: 32 },
  integrationItem: { backgroundColor: '#1e293b', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  integrationHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  integrationIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  integrationInfo: { flex: 1 },
  integrationName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  integrationDesc: { color: '#64748b', fontSize: 13, marginTop: 4 },
  connectButton: { backgroundColor: 'rgba(99, 102, 241, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  connectButtonText: { color: '#6366f1', fontSize: 13, fontWeight: '700' },
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
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  settingInfo: { flex: 1, paddingRight: 16 },
  toggleButton: { width: 52, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', padding: 2 },
  toggleButtonActive: { backgroundColor: '#6366f1' },
  toggleKnob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' },
  toggleKnobActive: { backgroundColor: '#fff', marginLeft: 24 },
  languageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  languageButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#0f172a', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', minWidth: 90, justifyContent: 'center' },
  languageButtonActive: { backgroundColor: 'rgba(99, 102, 241, 0.2)', borderColor: '#6366f1' },
  languageFlag: { fontSize: 18, marginRight: 6 },
  languageName: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  languageNameActive: { color: '#fff' },
  languageCheck: { fontSize: 10, color: '#10b981', marginLeft: 4 },
  translationProgress: { marginTop: 12 },
  translationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  translationFlag: { fontSize: 16, width: 30 },
  translationLang: { fontSize: 13, color: '#fff', width: 80 },
  progressBar: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginHorizontal: 10 },
  progressFill: { height: 6, backgroundColor: '#10b981', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#94a3b8', width: 40, textAlign: 'right' },
  apiSection: { marginTop: 8 },
  apiKeyCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  apiKeyHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  apiKeyTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  apiKeyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#0f172a', padding: 12, borderRadius: 10, marginBottom: 12 },
  apiKeyLabel: { color: '#64748b', fontSize: 13 },
  apiKeyValue: { color: '#94a3b8', fontSize: 13, fontFamily: 'monospace', flex: 1 },
  copyButton: { padding: 4 },
  apiKeyMeta: { flexDirection: 'row', gap: 16 },
  apiKeyCreated: { color: '#64748b', fontSize: 12 },
  apiKeyExpiry: { color: '#f59e0b', fontSize: 12 },
  generateApiButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#6366f1', paddingVertical: 14, borderRadius: 12, marginBottom: 20 },
  generateApiButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  apiDocsSection: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 16 },
  apiDocsTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 16 },
  apiEndpoint: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  apiMethod: { color: '#10b981', fontSize: 12, fontWeight: '700', width: 60 },
  apiPath: { color: '#94a3b8', fontSize: 13, fontFamily: 'monospace' },
  viewDocsButton: { alignItems: 'center', paddingVertical: 12 },
  viewDocsButtonText: { color: '#6366f1', fontSize: 14, fontWeight: '600' },
  loyaltyStatsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  loyaltyStatCard: { flex: 1, backgroundColor: '#1e293b', borderRadius: 16, padding: 16, alignItems: 'center' },
  loyaltyStatValue: { color: '#fff', fontSize: 24, fontWeight: '800' },
  loyaltyStatLabel: { color: '#64748b', fontSize: 12, marginTop: 4 },
  loyaltyTiersSection: { marginBottom: 24 },
  loyaltySectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 16 },
  loyaltyTierCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 12 },
  tierHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  tierBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  tierBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  tierPoints: { color: '#10b981', fontSize: 14, fontWeight: '600' },
  tierDesc: { color: '#64748b', fontSize: 13, marginBottom: 8 },
  tierPerk: { color: '#94a3b8', fontSize: 13, marginBottom: 4 },
  loyaltyRewardsSection: { marginBottom: 24 },
  rewardItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 10 },
  rewardInfo: {},
  rewardName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  rewardCost: { color: '#6366f1', fontSize: 13, marginTop: 4 },
  rewardRedemptions: { color: '#64748b', fontSize: 12 },
  addRewardButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#6366f1', paddingVertical: 14, borderRadius: 12 },
  addRewardButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  sidebarOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100 },
  mobileSidebar: { width: 280, backgroundColor: '#1e293b', height: '100%', paddingVertical: 24 },
  menuButton: { width: 44, height: 44, backgroundColor: '#1e293b', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  giftCardTemplates: { marginBottom: 24 },
  giftSectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 16 },
  giftTemplateGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  giftTemplateCard: { width: '23%', minWidth: 80, backgroundColor: '#1e293b', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  giftTemplatePrice: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 8 },
  giftTemplateLabel: { color: '#64748b', fontSize: 12, marginTop: 4 },
  giftCardPurchasedBy: { color: '#64748b', fontSize: 12, marginTop: 4 },
  giftCardActions: { flexDirection: 'row', marginTop: 12, gap: 8 },
  giftCardButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8 },
  giftCardButtonText: { color: '#6366f1', fontSize: 13, fontWeight: '600' },
  giftCardButtonTextEmail: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  crossTrainingSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  crossTrainingHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  crossTrainingTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
  skillTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 8 },
  skillTagText: { color: '#10b981', fontSize: 12, fontWeight: '600' },
  skillTagLearning: { backgroundColor: 'rgba(245, 158, 11, 0.1)' },
  skillTagTextLearning: { color: '#f59e0b', fontSize: 12, fontWeight: '600' },
  marketingStatsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  campaignCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 12 },
  campaignHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  campaignInfo: { flex: 1 },
  campaignName: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  campaignMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  campaignTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 6 },
  campaignTypeText: { color: '#6366f1', fontSize: 11, fontWeight: '600' },
  smsBadge: { backgroundColor: 'rgba(242, 47, 70, 0.1)' },
  smsBadgeText: { color: '#F22F46' },
  campaignActionsButton: { padding: 4 },
  campaignStats: { flexDirection: 'row', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  campaignStat: { flex: 1, alignItems: 'center' },
  campaignStatValue: { color: '#fff', fontSize: 18, fontWeight: '700' },
  campaignStatLabel: { color: '#64748b', fontSize: 11, marginTop: 4 },
  connectedButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  connectedButtonText: { color: '#10b981', fontSize: 13, fontWeight: '600' },
  posStatsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  posStatusIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' },
  statusDotText: { color: '#10b981', fontSize: 12, fontWeight: '600' },
  offlineIndicator: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  offlineDot: { backgroundColor: '#ef4444' },
  offlineText: { color: '#ef4444' },
  posTerminalDetails: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  posDetailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  posDetailLabel: { color: '#64748b', fontSize: 13 },
  posDetailValue: { color: '#94a3b8', fontSize: 13 },
  refundAmount: { color: '#ef4444' },
  refundButtonText: { color: '#94a3b8', fontSize: 11 },
});
