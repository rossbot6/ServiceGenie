import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { Gift, Award, Star, TrendingUp, Users, DollarSign, Plus, Search, Edit, Trash2, Crown, ChevronRight } from 'lucide-react-native';
import { supabaseHelpers } from '../../lib/supabase';

const { width } = Dimensions.get('window');

export default function LoyaltyDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tiers, setTiers] = useState([
    { id: 'tier_bronze', name: 'Bronze', minPoints: 0, discountPercent: 0, color: '#cd7f32', memberCount: 45, totalSpent: 12500 },
    { id: 'tier_silver', name: 'Silver', minPoints: 500, discountPercent: 5, color: '#c0c0c0', memberCount: 28, totalSpent: 18750 },
    { id: 'tier_gold', name: 'Gold', minPoints: 1500, discountPercent: 10, color: '#ffd700', memberCount: 12, totalSpent: 25600 },
    { id: 'tier_platinum', name: 'Platinum', minPoints: 5000, discountPercent: 15, color: '#e5e4e2', memberCount: 5, totalSpent: 34200 },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 90,
    activeThisMonth: 67,
    pointsRedeemed: 15420,
    revenueGenerated: 91050,
  });

  // Fetch tiers from Supabase on mount
  useEffect(() => {
    const fetchTiers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabaseHelpers.getLoyaltyTiers();
        if (error || !data) return; // Keep defaults
        if (data.length > 0) setTiers(data);
      } catch (err) {
        console.warn('Error fetching loyalty tiers:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTiers();
  }, []);

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(147, 51, 234, 0.1)' }]}>
            <Users size={20} color="#9333ea" />
          </View>
          <Text style={styles.statValue}>{stats.totalMembers}</Text>
          <Text style={styles.statLabel}>Total Members</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
            <TrendingUp size={20} color="#10b981" />
          </View>
          <Text style={styles.statValue}>{stats.activeThisMonth}</Text>
          <Text style={styles.statLabel}>Active This Month</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
            <Star size={20} color="#f59e0b" />
          </View>
          <Text style={styles.statValue}>{stats.pointsRedeemed.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Points Redeemed</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
            <DollarSign size={20} color="#3b82f6" />
          </View>
          <Text style={styles.statValue}>${stats.revenueGenerated.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Revenue Generated</Text>
        </View>
      </View>

      {/* Tier Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tier Distribution</Text>
        <View style={styles.tierDistribution}>
          {tiers.map((tier, index) => (
            <View key={tier.id} style={styles.tierBar}>
              <View style={styles.tierBarHeader}>
                <View style={[styles.tierDot, { backgroundColor: tier.color }]} />
                <Text style={styles.tierName}>{tier.name}</Text>
                <Text style={styles.tierMemberCount}>{tier.memberCount} members</Text>
              </View>
              <View style={styles.tierProgressBar}>
                <View 
                  style={[
                    styles.tierProgressFill, 
                    { 
                      width: `${(tier.memberCount / stats.totalMembers) * 100}%`,
                      backgroundColor: tier.color 
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setActiveTab('tiers')}>
            <Crown size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Manage Tiers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => setActiveTab('rewards')}>
            <Gift size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Create Reward</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => setActiveTab('members')}>
            <Users size={20} color="#fff" />
            <Text style={styles.actionButtonText}>View Members</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => setActiveTab('settings')}>
            <Award size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {[
            { user: 'Sarah Johnson', action: 'Reached Gold tier', points: '+250 pts', time: '2 hours ago', icon: '🌟' },
            { user: 'Mike Davis', action: 'Redeemed $25 reward', points: '-500 pts', time: '5 hours ago', icon: '🎁' },
            { user: 'Emily Chen', action: 'New member signup', points: '+50 pts', time: '1 day ago', icon: '👋' },
            { user: 'James Wilson', action: 'Redeemed free service', points: '-2000 pts', time: '2 days ago', icon: '✂️' },
          ].map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>{activity.icon}</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityUser}>{activity.user}</Text>
                <Text style={styles.activityAction}>{activity.action}</Text>
              </View>
              <View style={styles.activityPoints}>
                <Text style={[styles.activityPointValue, { color: activity.points.startsWith('+') ? '#10b981' : '#ef4444' }]}>
                  {activity.points}
                </Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderTiers = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Loyalty Tiers</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={18} color="#fff" />
          <Text style={styles.addButtonText}>Add Tier</Text>
        </TouchableOpacity>
      </View>

      {tiers.map((tier) => (
        <View key={tier.id} style={styles.tierCard}>
          <View style={styles.tierCardHeader}>
            <View style={[styles.tierBadge, { backgroundColor: tier.color }]}>
              <Crown size={16} color="#fff" />
              <Text style={styles.tierCardName}>{tier.name}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={14} color="#6366f1" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.tierCardStats}>
            <View style={styles.tierCardStat}>
              <Text style={styles.tierCardStatValue}>{tier.minPoints.toLocaleString()}</Text>
              <Text style={styles.tierCardStatLabel}>Min Points</Text>
            </View>
            <View style={styles.tierCardStat}>
              <Text style={styles.tierCardStatValue}>{tier.discountPercent}%</Text>
              <Text style={styles.tierCardStatLabel}>Discount</Text>
            </View>
            <View style={styles.tierCardStat}>
              <Text style={styles.tierCardStatValue}>{tier.memberCount}</Text>
              <Text style={styles.tierCardStatLabel}>Members</Text>
            </View>
            <View style={styles.tierCardStat}>
              <Text style={styles.tierCardStatValue}>${tier.totalSpent.toLocaleString()}</Text>
              <Text style={styles.tierCardStatLabel}>Total Spent</Text>
            </View>
          </View>
          
          <View style={styles.tierCardBenefits}>
            <Text style={styles.tierCardBenefitsTitle}>Benefits:</Text>
            <Text style={styles.tierCardBenefit}>• {tier.discountPercent}% off all services</Text>
            <Text style={styles.tierCardBenefit}>• Priority booking</Text>
            <Text style={styles.tierCardBenefit}>• Birthday bonus: +{tier.minPoints * 0.1} points</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderRewards = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Rewards</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={18} color="#fff" />
          <Text style={styles.addButtonText}>Create Reward</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rewardsGrid}>
        {[
          { name: '$10 Off', pointsCost: 200, claimed: 34, color: '#10b981' },
          { name: '$25 Off', pointsCost: 500, claimed: 28, color: '#3b82f6' },
          { name: 'Free Add-On', pointsCost: 300, claimed: 19, color: '#f59e0b' },
          { name: 'Free Service ($50)', pointsCost: 1000, claimed: 12, color: '#8b5cf6' },
          { name: 'VIP Experience', pointsCost: 5000, claimed: 3, color: '#ec4899' },
          { name: 'Birthday Package', pointsCost: 2000, claimed: 8, color: '#ef4444' },
        ].map((reward, index) => (
          <View key={index} style={styles.rewardCard}>
            <View style={[styles.rewardIcon, { backgroundColor: reward.color }]}>
              <Gift size={24} color="#fff" />
            </View>
            <Text style={styles.rewardName}>{reward.name}</Text>
            <Text style={styles.rewardCost}>{reward.pointsCost.toLocaleString()} pts</Text>
            <Text style={styles.rewardClaimed}>{reward.claimed} claimed</Text>
            <TouchableOpacity style={styles.rewardEditButton}>
              <Edit size={12} color="#64748b" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderMembers = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#64748b" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search members..." 
            placeholderTextColor="#64748b"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {[
        { name: 'Sarah Johnson', tier: 'Gold', points: 2450, lifetime: 5200, visits: 15, spent: 3250 },
        { name: 'Mike Davis', tier: 'Silver', points: 890, lifetime: 2100, visits: 8, spent: 1875 },
        { name: 'Emily Chen', tier: 'Bronze', points: 320, lifetime: 580, visits: 4, spent: 750 },
        { name: 'James Wilson', tier: 'Platinum', points: 5200, lifetime: 12500, visits: 32, spent: 8500 },
        { name: 'Lisa Park', tier: 'Gold', points: 1890, lifetime: 4100, visits: 12, spent: 2800 },
      ].map((member, index) => (
        <View key={index} style={styles.memberCard}>
          <View style={styles.memberCardHeader}>
            <View style={[styles.memberAvatar, { 
              backgroundColor: member.tier === 'Platinum' ? '#e5e4e2' : 
                              member.tier === 'Gold' ? '#ffd700' : 
                              member.tier === 'Silver' ? '#c0c0c0' : '#cd7f32' 
            }]}>
              <Text style={styles.memberInitial}>{member.name.charAt(0)}</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <View style={styles.memberTier}>
                <Crown size={12} color={member.tier === 'Platinum' ? '#e5e4e2' : 
                                          member.tier === 'Gold' ? '#ffd700' : 
                                          member.tier === 'Silver' ? '#c0c0c0' : '#cd7f32'} />
                <Text style={styles.memberTierText}>{member.tier}</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </View>
          
          <View style={styles.memberCardStats}>
            <View style={styles.memberCardStat}>
              <Text style={styles.memberCardStatValue}>{member.points.toLocaleString()}</Text>
              <Text style={styles.memberCardStatLabel}>Available</Text>
            </View>
            <View style={styles.memberCardStat}>
              <Text style={styles.memberCardStatValue}>{member.lifetime.toLocaleString()}</Text>
              <Text style={styles.memberCardStatLabel}>Lifetime</Text>
            </View>
            <View style={styles.memberCardStat}>
              <Text style={styles.memberCardStatValue}>{member.visits}</Text>
              <Text style={styles.memberCardStatLabel}>Visits</Text>
            </View>
            <View style={styles.memberCardStat}>
              <Text style={styles.memberCardStatValue}>${member.spent.toLocaleString()}</Text>
              <Text style={styles.memberCardStatLabel}>Spent</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Settings</Text>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>Points Configuration</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Points per Dollar Spent</Text>
            <Text style={styles.settingHint}>How many points customers earn for every dollar spent</Text>
          </View>
          <TextInput 
            style={styles.settingInput} 
            defaultValue="10" 
            keyboardType="numeric"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Points Expiry (Months)</Text>
            <Text style={styles.settingHint}>Points expire after this many months of inactivity</Text>
          </View>
          <TextInput 
            style={styles.settingInput} 
            defaultValue="12" 
            keyboardType="numeric"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Welcome Points</Text>
            <Text style={styles.settingHint}>Points awarded to new members on signup</Text>
          </View>
          <TextInput 
            style={styles.settingInput} 
            defaultValue="50" 
            keyboardType="numeric"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Referral Bonus</Text>
            <Text style={styles.settingHint}>Points awarded when a referred member makes first purchase</Text>
          </View>
          <TextInput 
            style={styles.settingInput} 
            defaultValue="250" 
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>Birthday Rewards</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Birthday Bonus Points</Text>
            <Text style={styles.settingHint}>Bonus points awarded during birthday month</Text>
          </View>
          <TextInput 
            style={styles.settingInput} 
            defaultValue="200" 
            keyboardType="numeric"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Birthday Discount</Text>
            <Text style={styles.settingHint}>Discount percentage during birthday month</Text>
          </View>
          <TextInput 
            style={styles.settingInput} 
            defaultValue="15" 
            keyboardType="numeric"
          />
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
        <Text style={{ marginTop: 16, color: '#64748b' }}>Loading loyalty data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Loyalty Program</Text>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{stats.totalMembers}</Text>
            <Text style={styles.headerStatLabel}>Members</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{stats.pointsRedeemed.toLocaleString()}</Text>
            <Text style={styles.headerStatLabel}>Points</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'tiers', label: 'Tiers', icon: Award },
          { id: 'rewards', label: 'Rewards', icon: Gift },
          { id: 'members', label: 'Members', icon: Users },
          { id: 'settings', label: 'Settings', icon: Edit },
        ].map((tab) => (
          <TouchableOpacity 
            key={tab.id} 
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} color={activeTab === tab.id ? '#6366f1' : '#64748b'} />
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'tiers' && renderTiers()}
      {activeTab === 'rewards' && renderRewards()}
      {activeTab === 'members' && renderMembers()}
      {activeTab === 'settings' && renderSettings()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 24,
  },
  headerStat: {
    alignItems: 'center',
  },
  headerStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  headerStatLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6366f1',
  },
  tabLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#6366f1',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 44) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    
    
    
    
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  tierDistribution: {
    gap: 12,
  },
  tierBar: {
    gap: 8,
  },
  tierBarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  tierName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    flex: 1,
  },
  tierMemberCount: {
    fontSize: 12,
    color: '#64748b',
  },
  tierProgressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tierProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: (width - 60) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityEmoji: {
    fontSize: 18,
  },
  activityContent: {
    flex: 1,
  },
  activityUser: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  activityAction: {
    fontSize: 12,
    color: '#64748b',
  },
  activityPoints: {
    alignItems: 'flex-end',
  },
  activityPointValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1e293b',
  },
  filterButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  filterButtonText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
  },
  tierCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    
    
    
    
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    elevation: 2,
  },
  tierCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  tierCardName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  tierCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tierCardStat: {
    alignItems: 'center',
    flex: 1,
  },
  tierCardStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  tierCardStatLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  tierCardBenefits: {
    gap: 4,
  },
  tierCardBenefitsTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 4,
  },
  tierCardBenefit: {
    fontSize: 13,
    color: '#475569',
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rewardCard: {
    width: (width - 44) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    
    
    
    
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    elevation: 2,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  rewardCost: {
    fontSize: 13,
    color: '#6366f1',
    marginTop: 4,
  },
  rewardClaimed: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  rewardEditButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    
    
    
    
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    elevation: 2,
  },
  memberCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  memberTier: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  memberTierText: {
    fontSize: 12,
    color: '#64748b',
  },
  memberCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  memberCardStat: {
    alignItems: 'center',
    flex: 1,
  },
  memberCardStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  memberCardStatLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    
    
    
    
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    elevation: 2,
  },
  settingsSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  settingHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  settingInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1e293b',
    width: 80,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
