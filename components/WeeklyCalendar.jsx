import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Modal, TextInput, PanResponder, Platform, KeyboardAvoidingView
} from 'react-native';
import { format, startOfWeek, addDays, isBefore, setHours, setMinutes, subWeeks, addWeeks } from 'date-fns';
import { X, Clock, User, AlertTriangle, Check, ChevronLeft, ChevronRight } from 'lucide-react-native';

const TIME_COLUMN_WIDTH = 50;
const CELL_HEIGHT = 40; 
const SLOT_HEIGHT = CELL_HEIGHT / 2; 
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); 
const DAY_COLUMN_WIDTH = 70;

export default function WeeklyCalendar({ onSchedule, customers = [], appointments = [], blockedSlots = [], onRequestApproval }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [clientName, setClientName] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isOverBlockedTime, setIsOverBlockedTime] = useState(false);
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const [dragSelection, setDragSelection] = useState(null); 
  const [isDragging, setIsDragging] = useState(false);
  const [containerLayout, setContainerLayout] = useState({ width: 0, height: 0, pageX: 0, pageY: 0 });

  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  // Navigate weeks
  const goToPreviousWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
  const goToNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
  const goToToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const getDateForDay = (dayIndex) => addDays(currentWeekStart, dayIndex);
  const isToday = (dayIndex) => format(getDateForDay(dayIndex), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  // Sync layout info periodically or on change
  const updateLayout = () => {
    containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      if (width > 0) {
        setContainerLayout({ width, height, pageX, pageY });
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(updateLayout, 500);
    return () => clearTimeout(timer);
  }, []);

  const suggestedCustomers = useMemo(() => {
    if (!clientName || selectedCustomer) return [];
    return customers.filter(c => 
      c.name.toLowerCase().includes(clientName.toLowerCase())
    );
  }, [clientName, customers, selectedCustomer]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderGrant: (evt) => {
      const touchX = evt.nativeEvent.pageX - containerLayout.pageX;
      const touchY = evt.nativeEvent.pageY - containerLayout.pageY;
      
      const dayWidth = containerLayout.width / DAYS.length;
      const dayIdx = Math.floor(touchX / dayWidth);
      const slotIdx = Math.floor(touchY / SLOT_HEIGHT);

      if (dayIdx >= 0 && dayIdx < DAYS.length && slotIdx >= 0 && slotIdx < HOURS.length * 2) {
        const blocked = isTimeBlocked(dayIdx, slotIdx);
        if (!isPast(dayIdx, slotIdx) && !isTimeOccupied(dayIdx, slotIdx) && !blocked) {
          setIsOverBlockedTime(false);
          setApprovalRequested(false);
          setIsDragging(true);
          setDragSelection({ dayIdx, startSlot: slotIdx, endSlot: slotIdx });
        }
      }
    },

    onPanResponderMove: (evt) => {
      if (!isDragging || !dragSelection) return;
      const relativeY = evt.nativeEvent.pageY - containerLayout.pageY;
      const currentSlotIdx = Math.floor(relativeY / SLOT_HEIGHT);
      
      if (currentSlotIdx >= 0 && currentSlotIdx < HOURS.length * 2) {
        setDragSelection(prev => {
          if (!prev) return null;
          const newEndSlot = Math.max(prev.startSlot, currentSlotIdx);
          if (isPast(prev.dayIdx, newEndSlot) || isTimeOccupied(prev.dayIdx, newEndSlot)) return prev;
          return { ...prev, endSlot: newEndSlot };
        });
      }
    },

    onPanResponderRelease: () => {
      setIsDragging(false);
      if (dragSelection) {
        const blockedOverlap = checkBlockedOverlap();
        setIsOverBlockedTime(blockedOverlap);
        if (!blockedOverlap) setApprovalRequested(false);
        setModalVisible(true);
      }
    },
    onPanResponderTerminate: () => {
      setIsDragging(false);
      setDragSelection(null);
    },
  }), [dragSelection, isDragging, containerLayout, appointments, blockedSlots, currentWeekStart]);

  const isPast = (dayIdx, slotIdx) => {
    const slotDate = getDateForDay(dayIdx);
    const slotTotalMins = (8 * 60) + (slotIdx * 30);
    const slotH = Math.floor(slotTotalMins / 60);
    const slotM = slotTotalMins % 60;
    const slotDateTime = setMinutes(setHours(slotDate, slotH), slotM);
    return isBefore(slotDateTime, new Date());
  };

  const isTimeOccupied = (dayIdx, slotIdx) => {
    const dayName = DAYS[dayIdx];
    const slotStartMins = (8 * 60) + (slotIdx * 30);
    return appointments.some(app => {
      if (app.day !== dayName) return false;
      const appStartMins = timeToMins(app.start);
      const appEndMins = appStartMins + (app.duration || 60);
      return slotStartMins >= appStartMins && slotStartMins < appEndMins;
    });
  };

  const isTimeBlocked = (dayIdx, slotIdx) => {
    const dayName = DAYS[dayIdx];
    const slotStartMins = (8 * 60) + (slotIdx * 30);
    return blockedSlots.some(block => {
      if (block.day !== dayName) return false;
      const blockStartMins = timeToMins(block.startTime);
      const blockEndMins = timeToMins(block.endTime);
      return slotStartMins >= blockStartMins && slotStartMins < blockEndMins;
    });
  };

  const checkBlockedOverlap = () => {
    if (!dragSelection) return false;
    const dayName = DAYS[dragSelection.dayIdx];
    for (let slot = dragSelection.startSlot; slot <= dragSelection.endSlot; slot++) {
      if (isTimeBlocked(dragSelection.dayIdx, slot)) return true;
    }
    return false;
  };

  const getBlockedInfo = () => {
    if (!dragSelection) return null;
    const dayName = DAYS[dragSelection.dayIdx];
    for (let slot = dragSelection.startSlot; slot <= dragSelection.endSlot; slot++) {
      const block = blockedSlots.find(b => {
        if (b.day !== dayName) return false;
        const blockStartMins = timeToMins(b.startTime);
        const blockEndMins = timeToMins(b.endTime);
        const slotStartMins = (8 * 60) + (slot * 30);
        return slotStartMins >= blockStartMins && slotStartMins < blockEndMins;
      });
      if (block) return block;
    }
    return null;
  };

  const timeToMins = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const formatSlotTime = (slot) => {
    const totalMins = (8 * 60) + (slot * 30);
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h}:${m === 0 ? '00' : m}`;
  };

  const getDurationMins = (start, end) => (end - start + 1) * 30;

  const requestApproval = () => {
    if (onRequestApproval && dragSelection) {
      const block = getBlockedInfo();
      onRequestApproval({
        day: DAYS[dragSelection.dayIdx],
        start: formatSlotTime(dragSelection.startSlot),
        end: formatSlotTime(dragSelection.endSlot),
        blockedSlot: block
      });
    }
    setApprovalRequested(true);
    setModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setDragSelection(null);
    setClientName('');
    setSelectedCustomer(null);
  };

  return (
    <View style={styles.container}>
      {/* Week Navigation */}
      <View style={styles.weekNav}>
        <TouchableOpacity style={styles.navButton} onPress={goToPreviousWeek}>
          <ChevronLeft size={20} color="#94a3b8" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToToday}>
          <Text style={styles.weekTitle}>{format(currentWeekStart, 'MMMM yyyy')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={goToNextWeek}>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Day Headers */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.headerRow}
        scrollEnabled={false}
      >
        <View style={styles.timeColumnHeader}>
          <Text style={styles.timeColumnHeaderText}>Time</Text>
        </View>
        {DAYS.map((day, i) => {
          const today = isToday(i);
          return (
            <View key={day} style={[styles.dayHeader, today && styles.todayHeader]}>
              <Text style={[styles.dayText, today && styles.todayText]}>{day}</Text>
              <Text style={[styles.dateText, today && styles.todayDateText]}>{format(getDateForDay(i), 'd')}</Text>
              <Text style={styles.monthAbbrev}>{format(getDateForDay(i), 'MMM')}</Text>
            </View>
          );
        })}
      </ScrollView>
      
      {/* Grid with ScrollView for horizontal scrolling */}
      <ScrollView 
        ref={scrollRef}
        style={styles.gridScroll}
        scrollEnabled={!isDragging}
        onScroll={updateLayout}
        scrollEventThrottle={16}
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        >
          {/* Time Column - 2 rows per hour to match grid */}
          <View style={styles.timeColumn}>
            {HOURS.map(hour => (
              <View key={hour} style={styles.timeCell}>
                <Text style={styles.timeLabel}>{hour}:00</Text>
              </View>
            ))}
          </View>

          {/* Day Columns */}
          <View 
            ref={containerRef}
            style={styles.daysContainer} 
            onLayout={updateLayout}
            {...panResponder.panHandlers}
          >
            {DAYS.map((dayName, dayIdx) => (
              <View key={dayIdx} style={styles.dayColumn}>
                {Array.from({ length: HOURS.length * 2 }).map((_, slotIdx) => (
                  <View 
                    key={slotIdx} 
                    style={[
                      styles.cell, 
                      slotIdx % 2 !== 0 && styles.halfCell,
                      isPast(dayIdx, slotIdx) && styles.pastCell,
                      isTimeBlocked(dayIdx, slotIdx) && styles.blockedCell
                    ]} 
                  />
                ))}

                {/* Render Existing Appointments */}
                {appointments.filter(app => app.day === dayName).map((app, idx) => {
                  const startMins = timeToMins(app.start);
                  const offsetMins = startMins - (8 * 60);
                  const top = (offsetMins / 30) * SLOT_HEIGHT;
                  const height = (app.duration / 30) * SLOT_HEIGHT;

                  return (
                    <View key={idx} style={[styles.appointmentBlock, { top, height }]}>
                      <Text style={styles.appointmentText} numberOfLines={1}>{app.name}</Text>
                    </View>
                  );
                })}
                
                {/* Render Blocked Slots */}
                {blockedSlots.filter(block => block.day === dayName).map((block, idx) => {
                  const startMins = timeToMins(block.startTime);
                  const endMins = timeToMins(block.endTime);
                  const offsetMins = startMins - (8 * 60);
                  const height = ((endMins - startMins) / 30) * SLOT_HEIGHT;
                  const top = offsetMins;

                  return (
                    <View key={`blocked-${idx}`} style={[styles.blockedBlock, { top, height }]}>
                      <AlertTriangle size={12} color="#ef4444" />
                      <Text style={styles.blockedText} numberOfLines={1}>{block.reason}</Text>
                    </View>
                  );
                })}
                
                {/* Selection Overlay */}
                {dragSelection && dragSelection.dayIdx === dayIdx && (
                  <View 
                    style={[
                      styles.selectionOverlay,
                      {
                        top: dragSelection.startSlot * SLOT_HEIGHT,
                        height: (dragSelection.endSlot - dragSelection.startSlot + 1) * SLOT_HEIGHT
                      }
                    ]}
                  >
                    {isDragging && <View style={styles.dragHandle} />}
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Booking Modal */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={closeModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Appointment</Text>
              <TouchableOpacity onPress={closeModal}><X size={24} color="#94a3b8" /></TouchableOpacity>
            </View>

            <ScrollView style={styles.form} bounces={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Client Name</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Search or enter name"
                  placeholderTextColor="#64748b"
                  value={clientName}
                  onChangeText={(text) => {
                    setClientName(text);
                    setSelectedCustomer(null);
                  }}
                  autoFocus
                />
                {suggestedCustomers.length > 0 && (
                  <View style={styles.lookupList}>
                    {suggestedCustomers.map(cust => (
                      <TouchableOpacity 
                        key={cust.id} 
                        style={styles.lookupItem}
                        onPress={() => {
                          setClientName(cust.name);
                          setSelectedCustomer(cust);
                        }}
                      >
                        <User size={16} color="#818cf8" />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.lookupText}>{cust.name}</Text>
                          <Text style={styles.lookupPhone}>{cust.phone}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Selected Time</Text>
                <View style={styles.infoRow}>
                  <Clock size={16} color="#818cf8" />
                  <Text style={styles.infoText}>
                    {dragSelection ? (
                      DAYS[dragSelection.dayIdx] + ' ' + formatSlotTime(dragSelection.startSlot) + ' (' + getDurationMins(dragSelection.startSlot, dragSelection.endSlot) + ' mins)'
                    ) : ''}
                  </Text>
                </View>
              </View>

              {isOverBlockedTime && (
                <View style={styles.blockedWarning}>
                  <AlertTriangle size={20} color="#ef4444" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.blockedWarningTitle}>Blocked Time Period</Text>
                    <Text style={styles.blockedWarningText}>
                      This overlaps with a blocked slot ({getBlockedInfo()?.reason || 'Unavailable'})
                    </Text>
                  </View>
                </View>
              )}

              {approvalRequested ? (
                <View style={styles.approvalPending}>
                  <Check size={20} color="#10b981" />
                  <Text style={styles.approvalPendingText}>Approval request sent to provider</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  style={[styles.confirmBtn, !clientName && styles.disabledBtn]}
                  disabled={!clientName}
                  onPress={() => {
                    if (dragSelection) {
                      if (isOverBlockedTime) {
                        requestApproval();
                      } else {
                        onSchedule({ 
                          name: clientName, 
                          customerId: selectedCustomer?.id,
                          day: DAYS[dragSelection.dayIdx],
                          start: formatSlotTime(dragSelection.startSlot),
                          duration: getDurationMins(dragSelection.startSlot, dragSelection.endSlot)
                        });
                        closeModal();
                      }
                    }
                  }}
                >
                  <Text style={styles.confirmBtnText}>
                    {isOverBlockedTime ? 'Request Approval' : 'Confirm Booking'}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  weekNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  navButton: { padding: 8 },
  weekTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerRow: { flexDirection: 'row' },
  timeColumnHeader: { width: TIME_COLUMN_WIDTH, paddingVertical: 4, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 4 },
  timeColumnHeaderText: { color: '#64748b', fontSize: 10, fontWeight: '700' },
  dayHeader: { width: DAY_COLUMN_WIDTH, alignItems: 'center', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  todayHeader: { backgroundColor: 'rgba(99, 102, 241, 0.1)' },
  dayText: { color: '#94a3b8', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  todayText: { color: '#818cf8' },
  dateText: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 2 },
  todayDateText: { color: '#818cf8' },
  monthAbbrev: { color: '#6366f1', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginTop: 4 },
  gridScroll: { flex: 1 },
  gridContainer: { flexDirection: 'row' },
  timeColumn: { width: TIME_COLUMN_WIDTH, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.05)' },
  timeCell: { height: CELL_HEIGHT * 2, justifyContent: 'flex-start', paddingTop: 4, paddingRight: 8 },
  timeLabel: { color: '#64748b', fontSize: 9, fontWeight: '700' },
  daysContainer: { flexDirection: 'row' },
  dayColumn: { width: DAY_COLUMN_WIDTH, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.05)', position: 'relative' },
  cell: { height: SLOT_HEIGHT, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.02)' },
  halfCell: { borderBottomColor: 'rgba(255,255,255,0.05)' },
  pastCell: { backgroundColor: 'rgba(255,255,255,0.02)', opacity: 0.3 },
  blockedCell: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderBottomColor: 'rgba(239, 68, 68, 0.2)' },
  selectionOverlay: { position: 'absolute', left: 2, right: 2, backgroundColor: 'rgba(99, 102, 241, 0.4)', borderRadius: 6, borderWidth: 2, borderColor: '#818cf8', zIndex: 10 },
  dragHandle: { position: 'absolute', bottom: -4, left: '50%', marginLeft: -10, width: 20, height: 4, backgroundColor: '#fff', borderRadius: 2 },
  appointmentBlock: { position: 'absolute', left: 2, right: 2, backgroundColor: '#6366f1', borderRadius: 6, padding: 4, zIndex: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  appointmentText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  blockedBlock: { position: 'absolute', left: 2, right: 2, backgroundColor: 'rgba(239, 68, 68, 0.15)', borderRadius: 6, padding: 4, zIndex: 4, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', flexDirection: 'row', alignItems: 'center', gap: 4 },
  blockedText: { color: '#fca5a5', fontSize: 9, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 400, maxHeight: '80%', backgroundColor: '#1e293b', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  form: { flexGrow: 0 },
  inputGroup: { marginBottom: 20 },
  label: { color: '#94a3b8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: '#0f172a', borderRadius: 12, padding: 16, color: '#fff', fontSize: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  lookupList: { backgroundColor: '#0f172a', borderRadius: 12, marginTop: 8, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.4)', overflow: 'hidden' },
  lookupItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', gap: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
  lookupText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  lookupPhone: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(99, 102, 241, 0.05)', padding: 12, borderRadius: 12 },
  infoText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  blockedWarning: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', borderRadius: 12, padding: 14, marginBottom: 16 },
  blockedWarningTitle: { color: '#ef4444', fontSize: 14, fontWeight: '800', marginBottom: 4 },
  blockedWarningText: { color: '#fca5a5', fontSize: 12, lineHeight: 16 },
  approvalPending: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)', borderRadius: 12, padding: 14 },
  approvalPendingText: { color: '#10b981', fontSize: 14, fontWeight: '600' },
  confirmBtn: { backgroundColor: '#6366f1', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 10, marginBottom: 10 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  disabledBtn: { backgroundColor: '#334155', opacity: 0.5 },
});
