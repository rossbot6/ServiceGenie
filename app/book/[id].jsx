import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar as CalendarIcon, Clock, ChevronLeft, CheckCircle2 } from 'lucide-react-native';
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

  const timeSlots = getTimeSlots();

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
                onPress={() => setSelectedDate(date)}
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
        <View style={styles.timeGrid}>
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <TouchableOpacity 
                key={time} 
                style={[styles.timeSlot, isSelected && styles.selectedTimeSlot]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.timeText, isSelected && styles.selectedText]}>{time}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {timeSlots.length === 0 && (
          <Text style={{ color: '#64748b', fontSize: 14 }}>No availability on this date.</Text>
        )}
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
  timeText: {
    color: '#fff',
    fontWeight: '600',
  },
  selectedText: {
    color: '#fff',
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
  }
});
