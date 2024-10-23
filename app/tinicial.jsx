import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { updateUserScore } from '../lib/appwrite';
import { useGlobalContext } from "../context/GlobalProvider";

const Tinicial = () => {
  const [currentExercise, setCurrentExercise] = useState(1);
  const [score, setScore] = useState("0"); // Initial value as a string
  const totalExercises = 5; // Total exercises is 5
  const { user } = useGlobalContext();

  const exercises = [
    {
      question: `Deriva f(x) = 2x + 1`,
      solution: `f'(x) = 2`,
      correct: `2`,
      options: [
        `2`,
        `1`,
        `0`,
        `3`,
      ],
    },
    {
      question: `Deriva f(x) = x^2 + 3x`,
      solution: `f'(x) = 2x + 3`,
      correct: `2x + 3`,
      options: [
        `2x + 3`,
        `x + 3`,
        `3x^2`,
        `2`,
      ],
    },
    {
      question: `Deriva f(x) = 3x^2 - 5`,
      solution: `f'(x) = 6x`,
      correct: `6x`,
      options: [
        `6x`,
        `3x`,
        `5x`,
        `0`,
      ],
    },
    {
      question: `Deriva f(x) = 4x^3 + 2x^2 + x`,
      solution: `f'(x) = 12x^2 + 4x + 1`,
      correct: `12x^2 + 4x + 1`,
      options: [
        `12x^2 + 4x + 1`,
        `4x^2 + 2x`,
        `3x^2 + 2`,
        `12x^2 + 1`,
      ],
    },
    {
      question: `Deriva f(x) = 5x^4 - 3x^2 + 2`,
      solution: `f'(x) = 20x^3 - 6x`,
      correct: `20x^3 - 6x`,
      options: [
        `20x^3 - 6x`,
        `20x^2 - 3`,
        `5x^3 + 3x`,
        `0`,
      ],
    },
  ];

  // Function to shuffle options
  const shuffleOptions = (options) => {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  };

  // Shuffle options for each exercise
  const shuffledExercises = exercises.map(exercise => {
    const shuffledOptions = shuffleOptions([...exercise.options]); // Create a copy of options and shuffle
    return {
      ...exercise,
      options: shuffledOptions,
    };
  });

  const handleAnswer = (selectedOption) => {
    const correctAnswer = exercises[currentExercise - 1].correct;
    if (selectedOption === correctAnswer) {
      setScore((prevScore) => (parseInt(prevScore) + 1).toString());
    }

    if (currentExercise < totalExercises) {
      setCurrentExercise(currentExercise + 1);
    } else {
      alert(`Evaluación terminada. Tu puntaje es: ${score}/${totalExercises}`);
      updateUserScore(user.$id, score);
      router.replace("/home");
    }
  };

  if (shuffledExercises.length === 0) {
    return <Text>Cargando ejercicios...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>Ejercicio {currentExercise}</Text>

          <Text style={styles.questionText}>
            {shuffledExercises[currentExercise - 1].question}
          </Text>

          <View style={styles.buttonContainer}>
            {shuffledExercises[currentExercise - 1].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.textButton}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.buttonText}>{`${option}`}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.scoreText}>Puntaje: {score}</Text>
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style="light" />
    </SafeAreaView>
  );
};

// Estilos para los componentes
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#161622',
    height: '100%',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  questionText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  textButton: {
    width: '80%',
    height: 60,
    backgroundColor: '#292B2F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  scoreText: {
    fontSize: 20,
    color: '#B0B0B0',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default Tinicial;
