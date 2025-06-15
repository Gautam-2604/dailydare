import { useAuth } from '@/context/AuthContext';
import { Dare } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const DailyDareHome = () => {
  const [userStats, setUserStats] = useState({
    streak: 7,
    points: 1250,
    completedDares: 23,
    friendsConnected: 12,
  });

  const {...state} = useAuth()

  const [activeDares] = useState([
    {
      id: 1,
      title: "Learn 10 Spanish Words",
      category: "Language",
      difficulty: "Easy",
      points: 50,
      timeLimit: "2 hours",
      participants: 3,
    },
    {
      id: 2,
      title: "Code a Mini Game",
      category: "Programming",
      difficulty: "Hard",
      points: 200,
      timeLimit: "1 day",
      participants: 5,
    },
    {
      id: 3,
      title: "Master a Piano Piece",
      category: "Music",
      difficulty: "Medium",
      points: 100,
      timeLimit: "3 days",
      participants: 2,
    },
  ]);

  const getDifficultyColor = (difficulty: any) => {
    switch (difficulty) {
      case 'Easy': return '#4FFFB0';
      case 'Medium': return '#FFD700';
      case 'Hard': return '#FF6B6B';
      default: return '#4FFFB0';
    }
  };

  interface StatCardProps {
    title: string;
    value: number | string;
    color: string;
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  

  const DareCard: React.FC<{ dare: Dare }> = ({ dare }) => (
    <TouchableOpacity style={styles.dareCard}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.dareGradient}
      >
        <View style={styles.dareHeader}>
          <Text style={styles.dareTitle}>{dare.title}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(dare.difficulty) }]}>
            <Text style={styles.difficultyText}>{dare.difficulty}</Text>
          </View>
        </View>
        
        <Text style={styles.dareCategory}>{dare.category}</Text>
        
        <View style={styles.dareInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Points</Text>
            <Text style={styles.infoValue}>{dare.points}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{dare.timeLimit}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Friends</Text>
            <Text style={styles.infoValue}>{dare.participants}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.joinButton}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.joinGradient}
          >
            <Text style={styles.joinText}>Join Dare</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good Evening! 🌟</Text>
              <Text style={styles.username}>Ready for today's challenge?</Text>
            </View>
            <TouchableOpacity style={styles.profileButton} onPress={() => router.replace('/settings')}>
              <LinearGradient
                colors={['#4FFFB0', '#00D4AA']}
                style={styles.profileGradient}
              >
                <Text style={styles.profileText}>JD</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.statsGrid}>
              <StatCard title="Streak Days" value={userStats.streak} color="#4FFFB0" />
              <StatCard title="Total Points" value={userStats.points} color="#FFD700" />
              <StatCard title="Completed" value={userStats.completedDares} color="#FF6B6B" />
              <StatCard title="Friends" value={userStats.friendsConnected} color="#8A2BE2" />
            </View>
          </View>

          {/* Daily Challenge */}
          <View style={styles.dailyChallengeContainer}>
            <Text style={styles.sectionTitle}>Today's Featured Challenge</Text>
            <TouchableOpacity style={styles.featuredChallenge}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E8E', '#FFB3BA']}
                style={styles.featuredGradient}
              >
                <Text style={styles.featuredTitle}>Master React Native Navigation</Text>
                <Text style={styles.featuredDescription}>
                  Challenge your friends to build a complete navigation system
                </Text>
                <View style={styles.featuredStats}>
                  <Text style={styles.featuredStat}>💎 300 Points</Text>
                  <Text style={styles.featuredStat}>⏰ 6 Hours</Text>
                  <Text style={styles.featuredStat}>👥 8 Friends Joined</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Active Dares */}
          <View style={styles.daresContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Dares</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {activeDares.map((dare) => (
              <DareCard key={dare.id} dare={dare} />
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickAction}>
                <LinearGradient
                  colors={['rgba(79, 255, 176, 0.2)', 'rgba(79, 255, 176, 0.1)']}
                  style={styles.quickActionGradient}
                >
                  <Text style={styles.quickActionIcon}>🎯</Text>
                  <Text style={styles.quickActionText}>Create Dare</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickAction} onPress={()=>router.replace('/friends')}>
                <LinearGradient
                  colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 215, 0, 0.1)']}
                  style={styles.quickActionGradient}
                >
                  <Text style={styles.quickActionIcon}>👥</Text>
                  <Text style={styles.quickActionText}>Find Friends</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickAction}>
                <LinearGradient
                  colors={['rgba(138, 43, 226, 0.2)', 'rgba(138, 43, 226, 0.1)']}
                  style={styles.quickActionGradient}
                >
                  <Text style={styles.quickActionIcon}>🏆</Text>
                  <Text style={styles.quickActionText}>Leaderboard</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  profileButton: {
    width: 50,
    height: 50,
  },
  profileGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  statsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    backdropFilter: 'blur(10px)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  dailyChallengeContainer: {
    marginBottom: 30,
  },
  featuredChallenge: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredGradient: {
    padding: 25,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  featuredDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 20,
  },
  featuredStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredStat: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  daresContainer: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 16,
    color: '#4FFFB0',
    fontWeight: '600',
  },
  dareCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  dareGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  dareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  dareTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  dareCategory: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 15,
  },
  dareInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  joinButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  joinGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  joinText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quickActionsContainer: {
    marginBottom: 30,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (width - 80) / 3,
    borderRadius: 15,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default DailyDareHome;