import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar as CalendarIcon, Clock, ChevronLeft, CheckCircle2, AlertTriangle, Star, User } from 'lucide-react-native';
import { useState } from 'react';
import { format, addDays } from 'date-fns';
import mockData from '../../data/mockData.json';

export default function BookAppointment() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const stylist = mockData.stylists.find(s => s.id === id);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  const dates = [new Date(), addDays(new Date(), 1), addDays(new Date(), 2), addDays(new Date(), 3), addDays(new Date(), 4)];
  
  // Get blocked slots for selected date
  const getBlockedSlotsForDate = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return mockData.blockedSlots.filter(block => 
      block.stylistId === stylist.id && 
      block.date === dateStr
    );
  };
  
  // Dynamic time slots based on working hours and blocked slots
  const getTimeSlots = () => {
    const dayName = format(selectedDate, 'eeee').toLowerCase();
    const hours = stylist?.workingHours[dayName];
    
    if (!hours) return []; // Not working today

    const slots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    return slots.filter(time => {
      // 1. Check if within working hours
      if (time < hours.start || time >= hours.end) return false;

      // 2. Check if blocked
      const isBlocked = mockData.blockedSlots.some(block => 
        block.stylistId === stylist.id && 
        block.date === dateStr && 
        time >= block.startTime && 
        time < block.endTime
      );
      
      return !isBlocked;
    });
  };

  // Check if a specific time is blocked
  const isTimeBlocked = (time) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return mockData.blockedSlots.some(block => 
      block.stylistId === stylist.id && 
      block.date === dateStr && 
      time >= block.startTime && 
      time < block.endTime
    );
  };

  const timeSlots = getTimeSlots();
  const blockedSlots = getBlockedSlotsForDate();

  const handleBook = () => {
    if (!selectedTime) {
      Alert.alert('Selection Required', 'Please choose a time slot.');
      return;
    }
    
    Alert.alert(
      'Success!',
      `Appointment booked with ${stylist.name} for ${format(selectedDate, 'MMM do')} at ${selectedTime}. You'll receive a confirmation text tonight!`,
      [{ text: 'Great!', onPress: () => router.back() }]
    );
  };

  if (!stylist) return <Text style={{ color: '#fff', padding: 20 }}>Stylist not found</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{stylist.name}</Text>
        <Text style={styles.subtitle}>{stylist.specialty}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
          {dates.map((date, idx) => {
            const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            return (
              <TouchableOpacity 
                key={idx} 
                style={[styles.dateCard, isSelected && styles.selectedDateCard]}
                onPress={() => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
              >
                <Text style={[styles.dateDay, isSelected && styles.selectedText]}>{format(date, 'EEE')}</Text>
                <Text style={[styles.dateNumber, isSelected && styles.selectedText]}>{format(date, 'd')}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Times</Text>
        
        {/* Show blocked times info */}
        {blockedSlots.length > 0 && (
          <View style={styles.blockedInfo}>
            <AlertTriangle size={14} color="#ef4444" />
            <Text style={styles.blockedInfoText}>
              Unavailable: {blockedSlots.map(b => `${b.startTime}-${b.endTime}`).join(', ')} ({blockedSlots[0]?.reason})
            </Text>
          </View>
        )}
        
        <View style={styles.timeGrid}>
          {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => {
            const isAvailable = timeSlots.includes(time);
            const isSelected = selectedTime === time;
            const isBlocked = !isAvailable && !isTimeWithinWorkingHours(time);
            
            return (
              <TouchableOpacity 
                key={time} 
                style={[
                  styles.timeSlot,
                  isSelected && styles.selectedTimeSlot,
                  !isAvailable && !isBlocked && styles.unavailableSlot,
                  isBlocked && styles.blockedSlot
                ]}
                onPress={() => {
                  if (isAvailable) {
                    setSelectedTime(time);
                  } else if (isBlocked) {
                    const block = blockedSlots.find(b => time >= b.startTime && time < b.endTime);
                    Alert.alert(
                      'Time Unavailable',
                      `This time is blocked (${block?.reason || 'Provider unavailable'}). Please choose another time.`
                    );
                  }
                }}
                disabled={!isAvailable}
              >
                <Text style={[
                  styles.timeText, 
                  isSelected && styles.selectedText,
                  !isAvailable && styles.unavailableText,
                  isBlocked && styles.blockedText
                ]}>
                  {time}
                </Text>
                {!isAvailable && (
                  <Text style={styles.slotStatus}>
                    {isBlocked ? 'Blocked' : 'Unavailable'}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        {timeSlots.length === 0 && !blockedSlots.length && (
          <Text style={{ color: '#64748b', fontSize: 14 }}>No availability on this date.</Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.headerRating}>
            <Star size={16} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.headerRatingText}>{stylist.rating || '4.9'}</Text>
          </View>
        </View>

        {[
          { id: 1, user: 'Sarah P.', rating: 5, comment: 'Best haircut I have ever had! Elena really listens.', date: '2 days ago' },
          { id: 2, user: 'Michael B.', rating: 4, comment: 'Great service, but appointment started 10 mins late.', date: '1 week ago' },
        ].map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewUser}>
                <View style={styles.userAvatar}>
                  <User size={16} color="#94a3b8" />
                </View>
                <Text style={styles.reviewUserName}>{review.user}</Text>
              </View>
              <View style={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} color={s <= review.rating ? '#fbbf24' : '#334155'} fill={s <= review.rating ? '#fbbf24' : 'transparent'} />
                ))}
              </View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.bookButton, !selectedTime && { opacity: 0.5 }]} 
          onPress={handleBook}
          disabled={!selectedTime}
        >
          <Text style={styles.bookButtonText}>Confirm Appointment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const isTimeWithinWorkingHours = (time, stylist) => {
  // Helper to check if time is within working hours
  return true; // Simplified for now
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 24,
    backgroundColor: '#1e293b',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  dateList: {
    gap: 12,
  },
  dateCard: {
    width: 65,
    height: 85,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  selectedDateCard: {
    backgroundColor: '#6366f1',
    borderColor: '#818cf8',
  },
  dateDay: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  blockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  blockedInfoText: {
    color: '#fca5a5',
    fontSize: 12,
    flex: 1,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    minWidth: '30%',
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#6366f1',
    borderColor: '#818cf8',
  },
  unavailableSlot: {
    backgroundColor: '#0f172a',
    borderColor: 'rgba(255,255,255,0.05)',
    opacity: 0.6,
  },
  blockedSlot: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  timeText: {
    color: '#fff',
    fontWeight: '600',
  },
  selectedText: {
    color: '#fff',
  },
  unavailableText: {
    color: '#64748b',
  },
  blockedText: {
    color: '#fca5a5',
  },
  slotStatus: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  footer: {
    padding: 24,
    marginTop: 20,
  },
  bookButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  headerRatingText: {
    color: '#fbbf24',
    fontWeight: '700',
    fontSize: 14,
  },
  reviewCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewUserName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
  },
  reviewDate: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 8,
  }
});
