import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const FindDarePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');

  const categories = ['All', 'Programming', 'Language', 'Music', 'Art', 'Science', 'Fitness'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const sortOptions = ['Popular', 'Recent', 'Points', 'Time'];

  const [dares] = useState([
    {
      id: 1,
      title: "Build a Weather App",
      description: "Create a fully functional weather app with React Native using OpenWeather API",
      category: "Programming",
      difficulty: "Medium",
      points: 150,
      timeLimit: "2 days",
      participants: 24,
      creator: "Alex_Dev",
      tags: ["React Native", "API", "UI/UX"],
      trending: true,
  },
{
      id: 2,
      title: "Learn 50 Japanese Kanji",
      description: "Master 50 essential Japanese Kanji characters with proper stroke order",
      category: "Language",
      difficulty: "Hard",
      points: 200,
      timeLimit: "1 week",
      participants: 15,
      creator: "TokyoSensei",
      tags: ["Japanese", "Writing", "Memory"],
      trending: false,
    },
 {
      id: 3,
      title: "Compose a Melody",
      description: "Create an original 30-second melody using any instrument or digital tools",
      category: "Music",
      difficulty: "Easy",
      points: 75,
      timeLimit: "3 days",
      participants: 31,
      creator: "MelodyMaker",
      tags: ["Composition", "Creativity", "Audio"],
      trending: true,
    },
 {
      id: 4,
      title: "CSS Animation Challenge",
      description: "Create 5 smooth CSS animations without using JavaScript",
      category: "Programming",
      difficulty: "Easy",
      points: 100,
      timeLimit: "1 day",
      participants: 42,
      creator: "CSSGuru",
      tags: ["CSS", "Animation", "Frontend"],
      trending: false,
    },
{
      id: 5,
      title: "Digital Portrait Art",
      description: "Create a realistic digital portrait using any digital art software",
      category: "Art",
      difficulty: "Hard",
      points: 180,
      timeLimit: "5 days",
      participants: 18,
      creator: "PixelArtist",
      tags: ["Digital Art", "Portrait", "Design"],
      trending: true,
    },
    {
      id: 6,
      title: "Chemistry Experiment Video",
      description: "Document a safe chemistry experiment with detailed explanations",
      category: "Science",
      difficulty: "Medium",
      points: 120,
      timeLimit: "4 days",
      participants: 12,
      creator: "ScienceExplorer",
      tags: ["Chemistry", "Video", "Education"],
      trending: false,
    }]);

  const getDifficultyColor = (difficulty: any) => {
    switch (difficulty) {
      case 'Easy': return '#4FFFB0';
      case 'Medium': return '#FFD700';
      case 'Hard': return '#FF6B6B';
      default: return '#4FFFB0';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Programming: '#4FFFB0',
      Language: '#FFD700',
      Music: '#FF6B6B',
      Art: '#8A2BE2',
      Science: '#00D4AA',
      Fitness: '#FF8E8E',
    };
    return colors[category as keyof typeof colors] || '#FFFFFF';
  };

  const filteredDares = dares.filter(dare => {
    const matchesSearch = dare.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dare.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dare.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || dare.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || dare.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  type FilterChipProps = {
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
    color?: string;
  };

  const FilterChip: React.FC<FilterChipProps> = ({ options, selected, onSelect, color = '#4FFFB0' }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.filterChip,
            selected === option && { backgroundColor: color }
          ]}
          onPress={() => onSelect(option)}
        >
          <Text style={[
            styles.filterChipText,
            selected === option && { color: '#0A0A0A', fontWeight: 'bold' }
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  type Dare = {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    points: number;
    timeLimit: string;
    participants: number;
    creator: string;
    tags: string[];
    trending: boolean;
  };

  const DareCard: React.FC<{ dare: Dare }> = ({ dare }) => (
    <TouchableOpacity style={styles.dareCard}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.dareGradient}
      >
        {dare.trending && (
          <View style={styles.trendingBadge}>
            <Text style={styles.trendingText}>🔥 Trending</Text>
          </View>
        )}
        
        <View style={styles.dareHeader}>
          <Text style={styles.dareTitle}>{dare.title}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(dare.difficulty) }]}>
            <Text style={styles.difficultyText}>{dare.difficulty}</Text>
          </View>
        </View>
        
        <Text style={[styles.dareCategory, { color: getCategoryColor(dare.category) }]}>
          {dare.category}
        </Text>
        
        <Text style={styles.dareDescription} numberOfLines={2}>
          {dare.description}
        </Text>
        
        <View style={styles.tagsContainer}>
          {dare.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.dareFooter}>
          <View style={styles.dareStats}>
            <Text style={styles.statText}>💎 {dare.points}</Text>
            <Text style={styles.statText}>⏰ {dare.timeLimit}</Text>
            <Text style={styles.statText}>👥 {dare.participants}</Text>
          </View>
          <Text style={styles.creatorText}>by {dare.creator}</Text>
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Find New Dares</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search dares, tags, creators..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Category</Text>
          <FilterChip
            options={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            color="#4FFFB0"
          />
          
          <Text style={styles.filterLabel}>Difficulty</Text>
          <FilterChip
            options={difficulties}
            selected={selectedDifficulty}
            onSelect={setSelectedDifficulty}
            color="#FFD700"
          />
          
          <Text style={styles.filterLabel}>Sort By</Text>
          <FilterChip
            options={sortOptions}
            selected={sortBy}
            onSelect={setSortBy}
            color="#FF6B6B"
          />
        </View>

        {/* Results */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredDares.length} Dares Found
          </Text>
          {searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dares List */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {filteredDares.length > 0 ? (
            filteredDares.map((dare) => (
              <DareCard key={dare.id} dare={dare} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyTitle}>No Dares Found</Text>
              <Text style={styles.emptyDescription}>
                Try adjusting your filters or search terms
              </Text>
            </View>
          )}
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
  backText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#FFFFFF',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    marginTop: 15,
  },
  filterScroll: {
    marginBottom: 5,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterChipText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clearSearch: {
    fontSize: 16,
    color: '#4FFFB0',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  dareCard: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  dareGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    position: 'relative',
  },
  trendingBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  trendingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    marginTop: 5,
  },
  dareTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  dareCategory: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  dareDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(79, 255, 176, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 255, 176, 0.3)',
  },
  tagText: {
    fontSize: 12,
    color: '#4FFFB0',
    fontWeight: '500',
  },
  dareFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dareStats: {
    flexDirection: 'row',
    gap: 15,
  },
  statText: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  creatorText: {
    fontSize: 12,
    color: '#4FFFB0',
    fontWeight: '500',
  },
  joinButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  joinGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  joinText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 22,
  },
})

export default FindDarePage