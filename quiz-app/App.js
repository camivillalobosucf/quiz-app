import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Question } from './QuestionScreen';
import { Summary } from './SummaryScreen';

const Stack = createStackNavigator();

// Cat quiz data - 3 questions (true/false, multiple-choice, multiple-answer)
export const quizData = [
  {
    "prompt": "Cats always land on their feet.",
    "type": "true-false",
    "choices": [
      "True",
      "False",
    ],
    "correct": 0
  },
  {
    "prompt": "Which of these is a hairless cat breed?",
    "type": "multiple-choice",
    "choices": [
      "Persian",
      "Maine Coon",
      "Sphynx",
      "Bengal",
    ],
    "correct": 2
  },
  {
    "prompt": "Which of the following are natural cat behaviors? Select all that apply.",
    "type": "multiple-answer",
    "choices": [
      "Kneading with paws",
      "Barking at strangers",
      "Grooming themselves",
      "Purring when content",
    ],
    "correct": [0, 2, 3]
  }
];

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Question">
        <Stack.Screen 
          name="Question" 
          component={Question} 
          options={{ 
            title: 'Cat Quiz',
            headerLeft: null,
            gestureEnabled: false
          }}
          initialParams={{
            data: quizData,
            index: 0,
            answers: []
          }}
        />
        <Stack.Screen 
          name="Summary" 
          component={Summary} 
          options={{ 
            title: 'Quiz Results',
            headerLeft: null,
            gestureEnabled: false
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* 
Answers to cat quiz questions:
1. "Cats always land on their feet." - TRUE (correct answer index: 0)
2. "Which of these is a hairless cat breed?" - SPHYNX (correct answer index: 2)
3. "Which of the following are natural cat behaviors?" - Kneading, Grooming, Purring (correct answer indices: [0,2,3])
*/