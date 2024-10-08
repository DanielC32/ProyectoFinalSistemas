import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { images } from '../constants';
import { router } from 'expo-router';
//import { MathView } from 'react-native-math-view';  // Importar MathView

const Home = () => {
  const [currentExercise, setCurrentExercise] = useState(1);
  const [score, setScore] = useState(0);
  const totalExercises = 8;

  const exerciseImages = [
    images.ej1,
    images.ej2,
    images.ej3,
    images.ej4,
    images.ej5,
    images.ej6,
    images.ej7,
    images.ej8,
  ];
  
  const exerciseAnswers = [
    //1
    {
      options: ['1', '-1', '10', '5'], 
      correct: '-1'
    },
    //2
    {
      options: ['5/2', '20', '-1', '30'], 
      correct: '-1',
    },
    //3
    {
      options: ['x^2', '2', '12x^3-2', '32'], 
      correct: '2',
    },
    //4
    {
      options: ['0', 'cos(x)', '2', '-1'], 
      correct: '0'
    },
    //5
    {
      options: ['6', 'x-2', 'x+2', '5'], 
      correct: '6'
    },
    //6
    {
      options: ['13x-2', '12x^3+2', '12x^3-2', '13x+2'], 
      correct: '12x^3+2',
    },
    //7
    {
      options: ['15x^2+34x-3', '20x^3-15^2-34x+3', '20x^3-1', '20x^3+15^2+34x-3'], 
      correct: '20x^3+15^2+34x-3',
    },
    //8
    {
      options: [images.ej8r1, images.ej8r2, images.ej3, images.ej4],
      correct: images.ej2,
      isImageOption: true
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
      router.replace("/home");
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
              exerciseAnswers[currentExercise - 1].isImageOption ? (
                <TouchableOpacity
                  key={index}
                  style={styles.imageButton}
                  onPress={() => handleAnswer(option)}
                >
                  <Image 
                    source={option} 
                    style={styles.imageOption}
                    resizeMode="contain" 
                  />
                </TouchableOpacity>
              ) : exerciseAnswers[currentExercise - 1].isMathOption ? (
                <TouchableOpacity
                  key={index}
                  style={styles.mathButton}
                  onPress={() => handleAnswer(option)}
                >
                  <MathView 
                    math={option} 
                    style={styles.mathText} 
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={index}
                  style={styles.textButton}
                  onPress={() => handleAnswer(option)}
                >
                  <Text style={styles.buttonText}>{`Opción: ${option}`}</Text>
                </TouchableOpacity>
              )
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
  textButton: {
    width: '80%',
    height: 60,
    backgroundColor: '#292B2F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  mathButton: {
    width: '80%',
    height: 60,
    backgroundColor: '#292B2F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  imageButton: {
    width: 200,  
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  mathText: {
    fontSize: 20, 
    color: 'white',
  },
  imageOption: {
    width: '80%',  
    height: '100%',
  },
  scoreText: {
    fontSize: 20,
    color: '#B0B0B0',
    marginTop: 20,
    textAlign: 'center',
  },
});
