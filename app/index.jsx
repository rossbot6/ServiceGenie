import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Scissors, Sparkles, ChevronRight, Star } from 'lucide-react-native';
import mockData from '../data/mockData.json';

export default function Home() {
  const router = useRouter();

  const renderStylist = ({ item }) => (
    <Link href={`/book/${item.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.cardInfo}>
          <Text style={styles.stylistName}>{item.name}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
          <View style={styles.ratingRow}>
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.rating}>4.9 (120+ reviews)</Text>
          </View>
        </View>
        <ChevronRight color="#475569" size={20} />
      </TouchableOpacity>
    </Link>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Sparkles size={14} color="#818cf8" />
          <Text style={styles.badgeText}>AI-Powered Scheduling</Text>
        </View>
        <Text style={styles.heroTitle}>Book Your Perfect Service</Text>
        <Text style={styles.heroSubtitle}>Professional hair and nail care at your fingertips.</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Professionals</Text>
          <Link href="/stylist/dashboard" style={styles.adminLink}>
            <Text style={styles.adminLinkText}>Provider Login</Text>
          </Link>
        </View>
        
        {mockData.stylists.map((stylist) => (
          <View key={stylist.id}>
            {renderStylist({ item: stylist })}
          </View>
        ))}
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Genie Reminders Active</Text>
        <Text style={styles.statsBody}>You'll receive a text at 8:00 PM the night before your appointment to confirm.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  hero: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(129, 140, 248, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
    gap: 6,
  },
  badgeText: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 8,
    lineHeight: 24,
  },
  section: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  adminLinkText: {
    color: '#818cf8',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 16,
  },
  stylistName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  specialty: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  rating: {
    color: '#64748b',
    fontSize: 12,
  },
  statsCard: {
    margin: 24,
    padding: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  statsTitle: {
    color: '#818cf8',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  statsBody: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  }
});
