import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export const Summary = ({ route, navigation }) => {
  const { data = [], answers = [] } = route.params || {};

  const calculateScore = () => {
    let totalScore = 0;

    data.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.correct;

      if (userAnswer === null || userAnswer === undefined) return;

      if (question.type === 'multiple-answer') {
        const correct =
          Array.isArray(userAnswer) &&
          Array.isArray(correctAnswer) &&
          userAnswer.length === correctAnswer.length &&
          userAnswer.every((a) => correctAnswer.includes(a));

        if (correct) totalScore++;
      } else {
        if (userAnswer === correctAnswer) totalScore++;
      }
    });

    return totalScore;
  };

  const score = calculateScore();

  const isAnswerCorrect = (question, index) => {
    const userAnswer = answers[index];
    const correctAnswer = question.correct;

    if (userAnswer === null || userAnswer === undefined) return false;

    if (question.type === 'multiple-answer') {
      return (
        Array.isArray(userAnswer) &&
        Array.isArray(correctAnswer) &&
        userAnswer.length === correctAnswer.length &&
        userAnswer.every((a) => correctAnswer.includes(a))
      );
    } else {
      return userAnswer === correctAnswer;
    }
  };

  const getChoiceStyle = (question, questionIndex, choiceIndex) => {
    const userAnswer = answers[questionIndex];
    const correctAnswer = question.correct;

    if (question.type === 'multiple-answer') {
      if (Array.isArray(correctAnswer) && correctAnswer.includes(choiceIndex)) {
        return styles.correct;
      }

      if (
        Array.isArray(userAnswer) &&
        userAnswer.includes(choiceIndex) &&
        !(Array.isArray(correctAnswer) && correctAnswer.includes(choiceIndex))
      ) {
        return styles.wrong;
      }
    } else {
      if (choiceIndex === correctAnswer) {
        return styles.correct;
      }

      if (choiceIndex === userAnswer && choiceIndex !== correctAnswer) {
        return styles.wrong;
      }
    }

    return styles.normal;
  };

  const restartQuiz = () => {
    navigation.navigate('Question', {
      data: data,
      index: 0,
      answers: [],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cat Quiz Results</Text>
      <Text testID="total" style={styles.scoreText}>
        Your Score: {score} out of {data.length} ({Math.round((score / data.length) * 100)}%)
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.cardRow}
      >
        {data.map((question, qIndex) => (
          <View key={qIndex} style={styles.horizontalCard}>
            <Text style={styles.questionText}>
              Question {qIndex + 1}: {question.prompt}
            </Text>

            {question.choices.map((choice, cIndex) => (
              <Text key={cIndex} style={getChoiceStyle(question, qIndex, cIndex)}>
                • {choice}
              </Text>
            ))}

            <Text
              style={[
                styles.resultText,
                isAnswerCorrect(question, qIndex) ? styles.correctText : styles.incorrectText,
              ]}
            >
              {isAnswerCorrect(question, qIndex) ? '✓ Correct' : '✗ Incorrect'}
            </Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
        <Text style={styles.buttonText}>Restart Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 15,
  },
  horizontalCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: 300,
    borderLeftWidth: 5,
    borderLeftColor: '#1890ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  normal: {
    fontSize: 16,
    marginVertical: 4,
    paddingLeft: 15,
  },
  correct: {
    fontSize: 16,
    marginVertical: 4,
    paddingLeft: 15,
    fontWeight: 'bold',
    color: 'green',
  },
  wrong: {
    fontSize: 16,
    marginVertical: 4,
    paddingLeft: 15,
    textDecorationLine: 'line-through',
    color: 'red',
  },
  resultText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  correctText: {
    color: 'green',
  },
  incorrectText: {
    color: 'red',
  },
  restartButton: {
    backgroundColor: '#1890ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
