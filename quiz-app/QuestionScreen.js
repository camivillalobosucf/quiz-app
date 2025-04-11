import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

export const Question = ({ navigation, route }) => {
  // Extract params
  const { data, index = 0, answers = [] } = route.params || {};
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const question = data[index];

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(answers[index] ?? (question.type === 'multiple-answer' ? [] : null));
  }, [index, question, answers]);
  

  // Handle selection for multiple-answer questions
  const handleMultipleAnswerSelect = (idx) => {
    setSelectedAnswer(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx);
      } else {
        return [...prev, idx];
      }
    });
  };

  // Handle the next button
  const handleNext = () => {
    try {
      // Create a new copy of answers
      const newAnswers = [...answers];
      
      // Save the current answer
      newAnswers[index] = selectedAnswer;
      
      // Move to next question or summary
      if (index < data.length - 1) {
        navigation.navigate('Question', {
          data,
          index: index + 1,
          answers: newAnswers
        });
      } else {
        // Final question - go to summary
        navigation.navigate('Summary', {
          data,
          answers: newAnswers
        });
      }
    } catch (error) {
      // Show any errors to help with debugging
      Alert.alert('Navigation Error', error.message);
    }
  };

  // Render button based on question type
  const renderChoices = () => {
    if (question.type === 'multiple-answer') {
      return (
        <View testID="choices">
          {question.choices.map((choice, idx) => (
            <TouchableOpacity 
              key={idx}
              style={[
                styles.choiceButton,
                Array.isArray(selectedAnswer) && selectedAnswer.includes(idx) ? styles.selectedChoice : {}
              ]}              
              onPress={() => handleMultipleAnswerSelect(idx)}
            >
              <Text>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      // For true/false and multiple-choice
      return (
        <ButtonGroup
          testID="choices"
          onPress={setSelectedAnswer}
          selectedIndex={typeof selectedAnswer === 'number' ? selectedAnswer : null}
          buttons={question.choices}
          containerStyle={styles.buttonGroup}
          vertical={true}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionCounter}>Question {index + 1} of {data.length}</Text>
      <Text style={styles.questionText}>{question.prompt}</Text>
      
      {renderChoices()}
      
      <TouchableOpacity 
        testID="next-question"
        style={[
          styles.nextButton,
          (selectedAnswer === null || 
           (question.type === 'multiple-answer' && selectedAnswer.length === 0)) 
            ? styles.disabledButton : {}
        ]}
        disabled={selectedAnswer === null || 
                 (question.type === 'multiple-answer' && selectedAnswer.length === 0)}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>
          {index === data.length - 1 ? 'View Results' : 'Next Question'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  questionCounter: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonGroup: {
    marginBottom: 20,
  },
  choiceButton: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedChoice: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1890ff',
  },
  nextButton: {
    backgroundColor: '#1890ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});