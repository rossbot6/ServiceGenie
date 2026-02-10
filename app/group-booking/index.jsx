import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Link } from 'expo-router';
import { ArrowLeft, Users, Calendar, MapPin, Phone, Mail, ChevronDown, Check } from 'lucide-react-native';

const GROUP_TYPES = [
  { id: 'bridal', name: 'Bridal Party', icon: '💒', description: 'Wedding day hair & makeup', minPeople: 4 },
  { id: 'birthday', name: 'Birthday', icon: '🎂', description: 'Celebrate together', minPeople: 3 },
  { id: 'girls', name: 'Girls Day', icon: '👭', description: 'Spa & salon day out', minPeople: 3 },
  { id: 'corporate', name: 'Corporate Event', icon: '💼', description: 'Team grooming', minPeople: 5 },
  { id: 'other', name: 'Other', icon: '✨', description: 'Custom group booking', minPeople: 2 },
];

export default function GroupBooking() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Link href="/">
          <TouchableOpacity style={styles.backButton}>
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.headerTitle}>Group Bookings</Text>
      </View>

      <View style={styles.hero}>
        <Users size={48} color="#fff" />
        <Text style={styles.heroTitle}>Book Together</Text>
        <Text style={styles.heroSubtitle}>Perfect for weddings, birthdays, and special events</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select Occasion</Text>
        
        {GROUP_TYPES.map((type) => (
          <TouchableOpacity key={type.id} style={styles.typeCard}>
            <View style={styles.typeIcon}>
              <Text style={styles.typeEmoji}>{type.icon}</Text>
            </View>
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>{type.name}</Text>
              <Text style={styles.typeDescription}>{type.description}</Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{type.minPeople}+ guests</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Event Details</Text>
        <View style={styles.formCard}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Event Date</Text>
            <View style={styles.inputWrapper}>
              <Calendar size={18} color="#94a3b8" />
              <TextInput 
                style={styles.formInput} 
                placeholder="Select date" 
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Number of Guests</Text>
            <View style={styles.inputWrapper}>
              <Users size={18} color="#94a3b8" />
              <TextInput 
                style={styles.formInput} 
                placeholder="How many people?" 
                placeholderTextColor="#64748b"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Preferred Location</Text>
            <View style={styles.inputWrapper}>
              <MapPin size={18} color="#94a3b8" />
              <TextInput 
                style={styles.formInput} 
                placeholder="Select location" 
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Contact Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.formInput} 
                placeholder="Your name" 
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Phone</Text>
            <View style={styles.inputWrapper}>
              <Phone size={18} color="#94a3b8" />
              <TextInput 
                style={styles.formInput} 
                placeholder="Your phone number" 
                placeholderTextColor="#64748b"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#94a3b8" />
              <TextInput 
                style={styles.formInput} 
                placeholder="Your email" 
                placeholderTextColor="#64748b"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Special Requests</Text>
            <View style={[styles.inputWrapper, { height: 100 }]}>
              <TextInput 
                style={styles.formInput} 
                placeholder="Any special requirements, parking needs, etc." 
                placeholderTextColor="#64748b"
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Group Booking Benefits</Text>
          <View style={styles.benefitItem}>
            <Check size={16} color="#10b981" />
            <Text style={styles.benefitText}>Coordinated appointments</Text>
          </View>
          <View style={styles.benefitItem}>
            <Check size={16} color="#10b981" />
            <Text style={styles.benefitText}>Dedicated group coordinator</Text>
          </View>
          <View style={styles.benefitItem}>
            <Check size={16} color="#10b981" />
            <Text style={styles.benefitText}>10% group discount (6+ guests)</Text>
          </View>
          <View style={styles.benefitItem}>
            <Check size={16} color="#10b981" />
            <Text style={styles.benefitText}>Complimentary champagne service</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Request Group Booking</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  hero: {
    backgroundColor: '#6366f1',
    marginHorizontal: 24,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    gap: 12,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    padding: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeEmoji: {
    fontSize: 24,
  },
  typeInfo: {
    flex: 1,
    marginLeft: 16,
  },
  typeName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  typeDescription: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  typeBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeBadgeText: {
    color: '#6366f1',
    fontSize: 11,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  formInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    paddingVertical: 14,
  },
  benefitsCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  benefitsTitle: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  benefitText: {
    color: '#fff',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
