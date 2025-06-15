import { useAuth } from '@/context/AuthContext';
import { categoriesArray, difficultyDetails, timeLimitsArray } from '@/enums';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
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

const CreateDarePage = () => {
  const [dareTitle, setDareTitle] = useState('');
  const [dareDescription, setDareDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [points, setPoints] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const {...state} = useAuth()

  const calculateEndDate = (startDate: Date, timeLimit: string): Date => {
  const end = new Date(startDate);
  
  switch (timeLimit) {
    case '1 hour':
      end.setHours(end.getHours() + 1);
      break;
    case '3 hours':
      end.setHours(end.getHours() + 3);
      break;
    case '6 hours':
      end.setHours(end.getHours() + 6);
      break;
    case '1 day':
      end.setDate(end.getDate() + 1);
      break;
    case '3 days':
      end.setDate(end.getDate() + 3);
      break;
    case '1 week':
      end.setDate(end.getDate() + 7);
      break;
    default:
      end.setHours(end.getHours() + 24); // Default to 1 day
  }
  return end}

  const handleCreateDare = async() => {
    const startDate = new Date();
    const endDate = calculateEndDate(startDate, timeLimit);
    const response = await fetch(`http://localhost:7001/api/v1/dare/${state.user?.id}`,{
      method: 'POST',
      headers: {
        'authorization': `Bearer ${state.token}`,
        'Content-Type': 'application/json'  
      },
      body: JSON.stringify({
        title: dareTitle,
        description: dareDescription,
        difficulty: selectedDifficulty,
        startDate: startDate.toISOString(),
        endDate:endDate.toISOString(),
        categories: selectedCategory,
        points: parseInt(points)
      })
    });

    if (response.ok) {
      router.replace('/'); // Redirect to home on success
    }
};

  const CategoryModal = () => (
    <Modal visible={showCategoryModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Category</Text>
          {categoriesArray.map((category) => (
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setSelectedCategory(category);
                setShowCategoryModal(false);
              }}
            >
              <Text style={styles.modalOptionText}>{category}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowCategoryModal(false)}
          >
            <Text style={styles.modalCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const DifficultyModal = () => (
    <Modal visible={showDifficultyModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Difficulty</Text>
          {difficultyDetails.map((difficulty) => (
            <TouchableOpacity
              key={difficulty.name}
              style={styles.modalOption}
              onPress={() => {
                setSelectedDifficulty(difficulty.name);
                setPoints(difficulty.points.toString());
                setShowDifficultyModal(false);
              }}
            >
              <View style={[styles.difficultyDot, { backgroundColor: difficulty.color }]} />
              <Text style={styles.modalOptionText}>{difficulty.name}</Text>
              <Text style={styles.difficultyPoints}>{difficulty.points} pts</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowDifficultyModal(false)}
          >
            <Text style={styles.modalCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
            <TouchableOpacity style={styles.backButton} onPress={()=>router.replace('/')}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Create New Dare</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Dare Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dare Title *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="What's the challenge?"
                placeholderTextColor="#666"
                value={dareTitle}
                onChangeText={setDareTitle}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Describe the dare in detail..."
                placeholderTextColor="#666"
                value={dareDescription}
                onChangeText={setDareDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={selectedCategory ? styles.selectedText : styles.placeholderText}>
                  {selectedCategory || 'Select a category'}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Difficulty */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Difficulty *</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowDifficultyModal(true)}
              >
                <Text style={selectedDifficulty ? styles.selectedText : styles.placeholderText}>
                  {selectedDifficulty || 'Select difficulty'}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Time Limit */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time Limit</Text>
              <View style={styles.timeLimitContainer}>
                {timeLimitsArray.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeChip,
                      timeLimit === time && styles.selectedChip
                    ]}
                    onPress={() => setTimeLimit(time)}
                  >
                    <Text style={[
                      styles.timeChipText,
                      timeLimit === time && styles.selectedChipText
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Points */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Points</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Auto-calculated based on difficulty"
                placeholderTextColor="#666"
                value={points}
                onChangeText={setPoints}
                keyboardType="numeric"
              />
            </View>

            {/* Preview Card */}
            {dareTitle && selectedCategory && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Preview</Text>
                <View style={styles.previewCard}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                    style={styles.previewGradient}
                  >
                    <View style={styles.previewHeader}>
                      <Text style={styles.previewDareTitle}>{dareTitle}</Text>
                      {selectedDifficulty && (
                        <View style={[
                          styles.previewDifficultyBadge,
                          { backgroundColor: difficultyDetails.find(d => d.name === selectedDifficulty)?.color }
                        ]}>
                          <Text style={styles.previewDifficultyText}>{selectedDifficulty}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.previewCategory}>{selectedCategory}</Text>
                    {dareDescription && (
                      <Text style={styles.previewDescription}>{dareDescription}</Text>
                    )}
                  </LinearGradient>
                </View>
              </View>
            )}

            {/* Create Button */}
            <TouchableOpacity
              style={[
                styles.createButton,
                (!dareTitle || !selectedCategory || !selectedDifficulty) && styles.disabledButton
              ]}
              onPress={handleCreateDare}
              disabled={!dareTitle || !selectedCategory || !selectedDifficulty}
            >
              <LinearGradient
                colors={
                  (!dareTitle || !selectedCategory || !selectedDifficulty)
                    ? ['#666', '#555']
                    : ['#FF6B6B', '#FF8E8E']
                }
                style={styles.createGradient}
              >
                <Text style={styles.createText}>Create Dare</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <CategoryModal />
        <DifficultyModal />
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
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
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
  placeholder: {
    width: 40,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
  chevron: {
    fontSize: 20,
    color: '#4FFFB0',
    fontWeight: 'bold',
  },
  timeLimitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedChip: {
    backgroundColor: '#4FFFB0',
  },
  timeChipText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  selectedChipText: {
    color: '#0A0A0A',
    fontWeight: '600',
  },
  previewContainer: {
    marginBottom: 30,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  previewCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  previewGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  previewDareTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
  },
  previewDifficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  previewDifficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  previewCategory: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 10,
  },
  previewDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  createButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 30,
  },
  disabledButton: {
    opacity: 0.6,
  },
  createGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  createText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A2E',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    maxHeight: height * 0.7,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  difficultyDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 15,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  difficultyPoints: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default CreateDarePage;