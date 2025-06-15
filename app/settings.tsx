import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


const AccountSettingsPage = () => {
  const router  =useRouter()
  const [activeSection, setActiveSection] = useState('account');
  const {signOut} = useAuth()

  const handleSignOut = async()=>{
    signOut()
    router.push('/sign-in')
  }
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe_dev',
    bio: 'Passionate developer who loves challenges!',
    streak: 7,
    totalPoints: 1250,
    level: 'Intermediate',
    joinDate: 'January 2024',
  });

  type SettingKey =
    | 'notifications'
    | 'soundEffects'
    | 'darkMode'
    | 'publicProfile'
    | 'friendRequests'
    | 'challengeReminders'
    | 'weeklyReport'
    | 'dataSync';

  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    darkMode: true,
    publicProfile: true,
    friendRequests: true,
    challengeReminders: true,
    weeklyReport: false,
    dataSync: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const toggleSetting = (key: SettingKey) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveProfile = () => {
    setUserProfile(editedProfile);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const ProfileSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.profileHeader}>
        <LinearGradient
          colors={['#4FFFB0', '#00D4AA']}
          style={styles.avatarContainer}
        >
          <Text style={styles.avatarText}>
            {userProfile.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </LinearGradient>
        
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileLevel}>{userProfile.level} Challenger</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <LinearGradient
            colors={isEditing ? ['#FF6B6B', '#FF8E8E'] : ['rgba(79, 255, 176, 0.2)', 'rgba(79, 255, 176, 0.1)']}
            style={styles.editGradient}
          >
            <Text style={styles.editText}>{isEditing ? 'Cancel' : 'Edit'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.totalPoints}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>23</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {isEditing ? (
        <View style={styles.editForm}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={editedProfile.name}
              onChangeText={(text) => setEditedProfile({...editedProfile, name: text})}
              placeholderTextColor="#B0B0B0"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.textInput}
              value={editedProfile.username}
              onChangeText={(text) => setEditedProfile({...editedProfile, username: text})}
              placeholderTextColor="#B0B0B0"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={editedProfile.bio}
              onChangeText={(text) => setEditedProfile({...editedProfile, bio: text})}
              multiline
              numberOfLines={3}
              placeholderTextColor="#B0B0B0"
            />
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <LinearGradient
                colors={['#4FFFB0', '#00D4AA']}
                style={styles.saveGradient}
              >
                <Text style={styles.saveText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.profileDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{userProfile.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Username</Text>
            <Text style={styles.detailValue}>@{userProfile.username}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bio</Text>
            <Text style={styles.detailValue}>{userProfile.bio}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Member Since</Text>
            <Text style={styles.detailValue}>{userProfile.joinDate}</Text>
          </View>
        </View>

      )}

      <View style={styles.dangerZone}>
        
        <TouchableOpacity style={styles.dangerButton} onPress={()=>handleSignOut()}>
          <Text style={styles.dangerText}>SignOut</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );

  const SettingsSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.settingsGroup}>
        <Text style={styles.groupTitle}>Notifications</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Receive updates about challenges</Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={() => toggleSetting('notifications')}
            trackColor={{ false: '#767577', true: '#4FFFB0' }}
            thumbColor={settings.notifications ? '#00D4AA' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Challenge Reminders</Text>
            <Text style={styles.settingDescription}>Get reminded about active dares</Text>
          </View>
          <Switch
            value={settings.challengeReminders}
            onValueChange={() => toggleSetting('challengeReminders')}
            trackColor={{ false: '#767577', true: '#4FFFB0' }}
            thumbColor={settings.challengeReminders ? '#00D4AA' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Weekly Report</Text>
            <Text style={styles.settingDescription}>Weekly progress summary</Text>
          </View>
          <Switch
            value={settings.weeklyReport}
            onValueChange={() => toggleSetting('weeklyReport')}
            trackColor={{ false: '#767577', true: '#4FFFB0' }}
            thumbColor={settings.weeklyReport ? '#00D4AA' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.settingsGroup}>
        <Text style={styles.groupTitle}>Privacy</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Public Profile</Text>
            <Text style={styles.settingDescription}>Allow others to see your profile</Text>
          </View>
          <Switch
            value={settings.publicProfile}
            onValueChange={() => toggleSetting('publicProfile')}
            trackColor={{ false: '#767577', true: '#4FFFB0' }}
            thumbColor={settings.publicProfile ? '#00D4AA' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Friend Requests</Text>
            <Text style={styles.settingDescription}>Accept requests from other users</Text>
          </View>
          <Switch
            value={settings.friendRequests}
            onValueChange={() => toggleSetting('friendRequests')}
            trackColor={{ false: '#767577', true: '#4FFFB0' }}
            thumbColor={settings.friendRequests ? '#00D4AA' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.settingsGroup}>
        <Text style={styles.groupTitle}>App Preferences</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Sound Effects</Text>
            <Text style={styles.settingDescription}>Play sounds for actions</Text>
          </View>
          <Switch
            value={settings.soundEffects}
            onValueChange={() => toggleSetting('soundEffects')}
            trackColor={{ false: '#767577', true: '#4FFFB0' }}
            thumbColor={settings.soundEffects ? '#00D4AA' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Data Sync</Text>
            <Text style={styles.settingDescription}>Sync progress across devices</Text>
          </View>
          <Switch
            value={settings.dataSync}
            onValueChange={() => toggleSetting('dataSync')}
            trackColor={{ false: '#767577', true: '#4FFFB0' }}
            thumbColor={settings.dataSync ? '#00D4AA' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.dangerZone}>
        <Text style={styles.groupTitle}>Danger Zone</Text>
        
        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerText}>Reset All Progress</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={()=>router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account & Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeSection === 'account' && styles.activeTab]}
            onPress={() => setActiveSection('account')}
          >
            <Text style={[styles.tabText, activeSection === 'account' && styles.activeTabText]}>
              Account
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeSection === 'settings' && styles.activeTab]}
            onPress={() => setActiveSection('settings')}
          >
            <Text style={[styles.tabText, activeSection === 'settings' && styles.activeTabText]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {activeSection === 'account' ? <ProfileSection /> : <SettingsSection />}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#4FFFB0',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B0B0B0',
  },
  activeTabText: {
    color: '#0A0A0A',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    paddingBottom: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileLevel: {
    fontSize: 14,
    color: '#4FFFB0',
  },
  editButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  editGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  profileDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  detailRow: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  editForm: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  saveButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  settingsGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  dangerZone: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  dangerButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  dangerText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AccountSettingsPage;