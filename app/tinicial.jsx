import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { updateUserScore } from '../lib/appwrite';
import { useGlobalContext } from "../context/GlobalProvider";


const Tinicial = () => {
  const [currentExercise, setCurrentExercise] = useState(1);
  const [score, setScore] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [isHintModalVisible, setIsHintModalVisible] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false); 
  const totalExercises = 8;
  const { user } = useGlobalContext();

  const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const generateRandomExercise = () => {
    const a = getRandomNumber(1, 5); 
    const b = getRandomNumber(1, 5); 
    const typesOfFunctions = [
      {
        type: 'producto',
        question: `Deriva f(x) = (${a}x^2 + ${b}x)(sin(x))`,
        hints: [
          'Nivel 1: Identifica f(x) y g(x). Usa la regla del producto.',
          'Nivel 2: Deriva ambas funciones por separado: f\'(x) y g\'(x).',
          `Nivel 3: f'(x) = ${2 * a}x + ${b}, g'(x) = cos(x). Aplica la regla del producto.`,
        ],
        solution: (a, b) => `Paso 1: Identificar las funciones f(x) = ${a}x^2 + ${b}x y g(x) = sin(x).
          Paso 2: Derivar f(x) = ${a}x^2 + ${b}x -> f'(x) = ${2 * a}x + ${b}.
          Paso 3: Derivar g(x) = sin(x) -> g'(x) = cos(x).
          Paso 4: Aplicar la regla del producto:
          f'(x)g(x) + f(x)g'(x) = (${2 * a}x + ${b})(sin(x)) + (${a}x^2 + ${b}x)(cos(x)).`,
        correctAnswer: (a, b) => `(${2 * a}x + ${b})sin(x) + (${a}x^2 + ${b}x)cos(x)`,
        generateValues: () => [a, b],
      },
      {
        type: 'cociente',
        question: `Deriva f(x) = e^x / (${a}x^2 + ${b})`,
        hints: [
          'Nivel 1: Usa la regla del cociente (f/g)\' = (f\'g - fg\')/g^2.',
          'Nivel 2: Deriva f(x) = e^x -> f\'(x) = e^x y g(x) = ${a}x^2 + ${b} -> g\'(x) = ${2 * a}x.',
          'Nivel 3: Sustituye en la fórmula: (e^x(${2 * a}x - (${a}x^2 + ${b}))) / (${a}x^2 + ${b})^2.',
        ],
        solution: (a, b) => `Paso 1: Identificar las funciones f(x) = e^x y g(x) = ${a}x^2 + ${b}.
          Paso 2: Derivar f(x) = e^x -> f'(x) = e^x.
          Paso 3: Derivar g(x) = ${a}x^2 + ${b} -> g'(x) = ${2 * a}x.
          Paso 4: Aplicar la regla del cociente:
          (e^x(${a}x^2 + ${b})' - e^x(${a}x^2 + ${b})) / (${a}x^2 + ${b})^2
          = (e^x(${2 * a}x - (${a}x^2 + ${b}))) / (${a}x^2 + ${b})^2.`,
        correctAnswer: (a, b) => `(e^x(${2 * a}x - (${a}x^2 + ${b}))) / (${a}x^2 + ${b})^2`,
        generateValues: () => [a, b],
      },
    ];


    const randomType = typesOfFunctions[Math.floor(Math.random() * typesOfFunctions.length)];
    const values = randomType.generateValues();

    return {
      question: randomType.question, 
      hints: randomType.hints,
      solution: randomType.solution(...values), 
      correct: randomType.correctAnswer(...values), 
      options: [
        randomType.correctAnswer(...values),
        `(${values[0]}x + ${values[1]})sin(x) + (${values[0]}x^2)cos(x)`,
        `(${values[0]})cos(x) + (${values[1]}x)sin(x)`,
        `(${values[0]}x + ${values[1]})cos(x) + (${values[0]}x^2 + ${values[1]})sin(x)`,
      ],
    };
  };

  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const generatedExercises = [];
    for (let i = 0; i < totalExercises; i++) {
      generatedExercises.push(generateRandomExercise());
    }
    setExercises(generatedExercises);
  }, []);

  const handleAnswer = (selectedOption) => {
    const correctAnswer = exercises[currentExercise - 1].correct;
    if (selectedOption === correctAnswer) {
      console.log(score);
      setScore(score + 1);
    }

    if (currentExercise < totalExercises) {
      setCurrentExercise(currentExercise + 1);
      setHintLevel(0);
      setShowSolutionModal(false);
    } else {
      alert(`Evaluación terminada. Tu puntaje es: ${score}/${totalExercises}`);
      updateUserScore(user.$id, score);
      router.replace("/home");
    }
  };

  const handleShowHint = () => {
    setIsHintModalVisible(true);
  };

  const handleNextHint = () => {
    setHintLevel(prev => (prev < 2 ? prev + 1 : 2));
  };

  const handleCloseHintModal = () => {
    setIsHintModalVisible(false);
    setHintLevel(0);
  };

  const handleShowSolution = () => {
    setShowSolutionModal(true);
  };

  const handleCloseSolutionModal = () => {
    setShowSolutionModal(false);
  };

  if (exercises.length === 0) {
    return <Text>Cargando ejercicios...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>Ejercicio {currentExercise}</Text>

          <Text style={styles.questionText}>
            {exercises[currentExercise - 1].question}
          </Text>

          <View style={styles.buttonContainer}>
            {exercises[currentExercise - 1].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.textButton}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.buttonText}>{`Opción: ${option}`}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.hintButton} onPress={handleShowHint}>
            <Text style={styles.hintButtonText}>Mostrar pista</Text>
          </TouchableOpacity>

          <Modal
            visible={isHintModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCloseHintModal}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.hintText}>
                  {exercises[currentExercise - 1].hints[hintLevel]}
                </Text>

                <TouchableOpacity style={styles.modalButton} onPress={handleNextHint}>
                  <Text style={styles.modalButtonText}>
                    {hintLevel < 2 ? 'Siguiente pista' : 'Cerrar'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalButton} onPress={handleCloseHintModal}>
                  <Text style={styles.modalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity style={styles.solutionButton} onPress={handleShowSolution}>
            <Text style={styles.solutionButtonText}>Mostrar solución</Text>
          </TouchableOpacity>

          {/* Modal para mostrar la solución */}
          <Modal
            visible={showSolutionModal}
            transparent={true}
            animationType="slide"
            onRequestClose={handleCloseSolutionModal}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.solutionText}>
                  {exercises[currentExercise - 1].solution}
                </Text>
                <TouchableOpacity style={styles.modalButton} onPress={handleCloseSolutionModal}>
                  <Text style={styles.modalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
  hintButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
  },
  hintButtonText: {
    color: 'white',
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    marginVertical: 10,
    backgroundColor: '#292B2F',
    padding: 10,
    borderRadius: 10,
    width: '80%',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  solutionButton: {
    marginTop: 20,
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 10,
  },
  solutionButtonText: {
    color: 'white',
    fontSize: 18,
  },
  solutionText: {
    fontSize: 18,
    color: '#B0B0B0',
    marginTop: 20,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 20,
    color: '#B0B0B0',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default Tinicial;
