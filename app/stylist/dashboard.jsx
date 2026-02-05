import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, FlatList, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, User, Settings, MoreHorizontal, Plus, Users, Ban, LayoutGrid } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import mockData from '../../data/mockData.json';
import WeeklyCalendar from '../../components/WeeklyCalendar';
import { format, parseISO, getDay, startOfWeek, addDays } from 'date-fns';

const DAY_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function StylistDashboard() {
  const router = useRouter();
  const [activeView, setActiveView] = useState('schedule');
  const [pendingApprovals, setPendingApprovals] = useState([]);
  
  const stylist = mockData.stylists[0]; 
  
  // Manage appointments in local state for immediate feedback
  const [localAppointments, setLocalAppointments] = useState(mockData.appointments);

  const appointmentsForStylist = useMemo(() => 
    localAppointments.filter(a => a.stylistId === stylist.id),
  [localAppointments, stylist.id]);

  const myCustomers = mockData.customers.filter(c => c.linkedStylists.includes(stylist.id));
  const blockedSlots = mockData.blockedSlots.filter(b => b.stylistId === stylist.id).map(block => ({
    ...block,
    day: DAY_MAP[getDay(parseISO(block.date))]
  }));

  // Map backend-style appointments to calendar-style objects
  const calendarAppointments = useMemo(() => {
    return appointmentsForStylist.map(app => {
      const date = parseISO(app.date);
      const dayName = DAY_MAP[getDay(date)];
      const customer = mockData.customers.find(c => c.id === app.customerId);
      
      return {
        id: app.id,
        name: customer?.name || "Private Appt",
        day: dayName,
        start: app.time,
        duration: app.duration
      };
    });
  }, [appointmentsForStylist]);

  const handleSchedule = (data) => {
    // Map day name (Mon, Tue, etc.) to the actual date in the current week
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const dayOffset = DAY_MAP.indexOf(data.day);
    const actualDate = format(addDays(weekStart, dayOffset - 1), 'yyyy-MM-dd');

    const newApp = {
      id: 'app_' + Math.random().toString(36).substr(2, 9),
      stylistId: stylist.id,
      customerId: data.customerId || null,
      clientName: data.name, 
      date: actualDate,
      time: data.start,
      duration: data.duration,
      status: 'pending'
    };

    setLocalAppointments(prev => [...prev, newApp]);
    Alert.alert("Success", `Scheduled ${data.name} for ${data.day} at ${data.start}`);
  };

  const handleRequestApproval = (data) => {
    const approvalId = 'approval_' + Date.now();
    setPendingApprovals(prev => [...prev, {
      id: approvalId,
      ...data,
      stylistId: stylist.id,
      requestedAt: new Date().toISOString()
    }]);
    Alert.alert(
      "Approval Request Sent",
      `Request to book during blocked time (${data.blockedSlot?.reason || 'Unknown'}) has been sent to the provider.`
    );
  };

  const approveBooking = (approval) => {
    // Remove from pending approvals
    setPendingApprovals(prev => prev.filter(a => a.id !== approval.id));
    
    // Add the appointment
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const dayOffset = DAY_MAP.indexOf(approval.day);
    const actualDate = format(addDays(weekStart, dayOffset - 1), 'yyyy-MM-dd');

    const newApp = {
      id: 'app_' + Math.random().toString(36).substr(2, 9),
      stylistId: stylist.id,
      customerId: approval.customerId || null,
      clientName: approval.name,
      date: actualDate,
      time: approval.start,
      duration: approval.duration,
      status: 'approved',
      approvedFromBlocked: true
    };

    setLocalAppointments(prev => [...prev, newApp]);
    Alert.alert("Approved", `Booking approved for ${approval.name} on ${approval.day} at ${approval.start}`);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Elena Rodriguez</Text>
            <Text style={styles.name}>Management</Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn}>
            <Settings size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
            <TouchableOpacity 
              style={[styles.tab, activeView === 'schedule' && styles.activeTab]} 
              onPress={() => setActiveView('schedule')}
            >
              <Clock size={16} color={activeView === 'schedule' ? '#fff' : '#94a3b8'} />
              <Text style={[styles.tabText, activeView === 'schedule' && styles.activeTabText]}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeView === 'calendar' && styles.activeTab]} 
              onPress={() => setActiveView('calendar')}
            >
              <LayoutGrid size={16} color={activeView === 'calendar' ? '#fff' : '#94a3b8'} />
              <Text style={[styles.tabText, activeView === 'calendar' && styles.activeTabText]}>Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeView === 'contacts' && styles.activeTab]} 
              onPress={() => setActiveView('contacts')}
            >
              <Users size={16} color={activeView === 'contacts' ? '#fff' : '#94a3b8'} />
              <Text style={[styles.tabText, activeView === 'contacts' && styles.activeTabText]}>Contacts</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeView === 'blocked' && styles.activeTab]} 
              onPress={() => setActiveView('blocked')}
            >
              <Ban size={16} color={activeView === 'blocked' ? '#fff' : '#94a3b8'} />
              <Text style={[styles.tabText, activeView === 'blocked' && styles.activeTabText]}>Blocked</Text>
            </TouchableOpacity>
            {pendingApprovals.length > 0 && (
              <TouchableOpacity 
                style={[styles.tab, activeView === 'approvals' && styles.activeTab]} 
                onPress={() => setActiveView('approvals')}
              >
                <Clock size={16} color={activeView === 'approvals' ? '#fff' : '#94a3b8'} />
                <Text style={[styles.tabText, activeView === 'approvals' && styles.activeTabText]}>Approvals</Text>
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{pendingApprovals.length}</Text>
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {activeView === 'approvals' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Approvals</Text>
            {pendingApprovals.length === 0 ? (
              <Text style={{ color: '#64748b', fontSize: 14, textAlign: 'center', marginTop: 20 }}>
                No pending approval requests
              </Text>
            ) : (
              pendingApprovals.map((approval) => (
                <View key={approval.id} style={styles.card}>
                  <View style={styles.timeInfo}>
                    <Text style={styles.appTime}>{approval.day}</Text>
                    <Text style={styles.appDuration}>{approval.start}</Text>
                  </View>
                  <View style={styles.cardMain}>
                    <Text style={styles.clientName}>{approval.name}</Text>
                    <Text style={styles.serviceType}>
                      {approval.duration} mins • Overrides: {approval.blockedSlot?.reason || 'Unknown'}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => approveBooking(approval)}
                    >
                      <Text style={styles.actionBtnText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.denyBtn]}
                      onPress={() => setPendingApprovals(prev => prev.filter(a => a.id !== approval.id))}
                    >
                      <Text style={[styles.actionBtnText, styles.denyBtnText]}>Deny</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeView === 'calendar' ? (
          <WeeklyCalendar 
            onSchedule={handleSchedule} 
            customers={myCustomers} 
            appointments={calendarAppointments}
            blockedSlots={blockedSlots}
            onRequestApproval={handleRequestApproval}
          />
        ) : (
          <ScrollView style={{ flex: 1 }}>
            {activeView === 'schedule' && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Today's Appointments</Text>
                  <TouchableOpacity style={styles.addBtn}>
                    <Plus size={16} color="#fff" />
                    <Text style={styles.addBtnText}>Book Client</Text>
                  </TouchableOpacity>
                </View>

                {appointmentsForStylist.map((app) => {
                  const customer = mockData.customers.find(c => c.id === app.customerId);
                  return (
                    <View key={app.id} style={styles.card}>
                      <View style={styles.timeInfo}>
                        <Text style={styles.appTime}>{app.time}</Text>
                        <Text style={styles.appDuration}>{app.duration}m</Text>
                      </View>
                      <View style={styles.cardMain}>
                        <Text style={styles.clientName}>{customer?.name || app.clientName || "Unknown"}</Text>
                        <Text style={styles.serviceType}>Hair Cut & Blowout</Text>
                      </View>
                      <View style={[styles.badge, app.status === 'confirmed' ? styles.badgeConfirmed : styles.badgePending]}>
                        <Text style={styles.badgeText}>{app.status}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {activeView === 'contacts' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>My Client List</Text>
                {myCustomers.map((cust) => (
                  <View key={cust.id} style={styles.card}>
                    <View style={styles.avatarSmall}>
                      <Text style={styles.avatarText}>{cust.name[0]}</Text>
                    </View>
                    <View style={styles.cardMain}>
                      <Text style={styles.clientName}>{cust.name}</Text>
                      <Text style={styles.serviceType}>{cust.phone}</Text>
                    </View>
                    <TouchableOpacity style={styles.bookSmallBtn}>
                      <Text style={styles.bookSmallText}>Book</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {activeView === 'blocked' && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Unavailable Times</Text>
                  <TouchableOpacity style={[styles.addBtn, { backgroundColor: '#ef4444' }]}>
                    <Plus size={16} color="#fff" />
                    <Text style={styles.addBtnText}>Block Time</Text>
                  </TouchableOpacity>
                </View>
                {blockedSlots.map((block) => (
                  <View key={block.id} style={styles.card}>
                    <View style={[styles.timeInfo, { borderRightColor: '#ef444433' }]}>
                      <Ban size={16} color="#ef4444" />
                    </View>
                    <View style={styles.cardMain}>
                      <Text style={styles.clientName}>{block.reason}</Text>
                      <Text style={styles.serviceType}>{block.date} • {block.startTime} - {block.endTime}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  welcome: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  settingsBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  activeTab: {
    backgroundColor: '#6366f1',
    borderColor: '#818cf8',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#fff',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366f1',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  timeInfo: {
    alignItems: 'center',
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
    minWidth: 50,
  },
  appTime: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  appDuration: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  cardMain: {
    flex: 1,
    paddingLeft: 12,
  },
  clientName: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  serviceType: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeConfirmed: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  badgePending: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: '#fff',
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
  },
  bookSmallBtn: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 7,
  },
  bookSmallText: {
    color: '#818cf8',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeCount: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  badgeCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: '#10b981',
  },
  denyBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  denyBtnText: {
    color: '#ef4444',
  }
});
