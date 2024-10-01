import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';

const Home = () => {
  const [currentExercise, setCurrentExercise] = useState(1);
  const [score, setScore] = useState(0);
  const totalExercises = 5;

  const exerciseImages = [
    images.ej1,
    images.ej2,
    images.ej3,
    images.ej4,
    images.ej5,
  ];

    const exerciseAnswers = [
    {
      options: ['1', '-1', '10', '5'], 
      correct: '-1'
    },
    {
      options: ['5/2', '20', '-1', '30'], 
      correct: '-1'
    },
    {
      options: ['13x-2', '12x^3+2', '12x^3-2', 'x'], 
      correct: '12x^3+2'
    },
    {
      options: ['sin(x)', 'cos(x)', 'tan(x)', 'sec(x)'], 
      correct: 'sin(x)'
    },
    {
      options: ['50%', '25%', '75%', '100%'], 
      correct: '75%'
    },
  ];

  const handleAnswer = (selectedOption) => {
    const correctAnswer = exerciseAnswers[currentExercise - 1].correct;
    if (selectedOption === correctAnswer) {
      setScore(score + 1);
    }

    if (currentExercise < totalExercises) {
      setCurrentExercise(currentExercise + 1);
    } else {
      alert(`Evaluación terminada. Tu puntaje es: ${score}/${totalExercises}`);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>Ejercicio {currentExercise}</Text>

          <Image 
            source={exerciseImages[currentExercise - 1]} 
            className="w-[260px] h-[110px]"
            resizeMode="contain" 
          />

          <View style={styles.buttonContainer}>
            {exerciseAnswers[currentExercise - 1].options.map((option, index) => (
              <CustomButton
                key={index}
                title={`Opción: ${option}`} // Mostrar el valor de la opción
                handlePress={() => handleAnswer(option)}
                containerStyles="w-[250px] h-[60px] mt-7"
                textStyles="text-white text-lg"
              />
            ))}
          </View>

          <Text style={styles.scoreText}>Puntaje: {score}</Text>
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style="light" />
    </SafeAreaView>
  );
};

export default Home;

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
  exerciseImage: {
    width: 300,
    height: 200,
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    height: 90,
    backgroundColor: '#292B2F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 30,
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
