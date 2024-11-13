import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal } from 'react-native';
import React, { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAccount, markExerciseAsResolved } from '../lib/appwrite';

const OpcionesScreen = () => {
  const route = useRoute();
  const navigation = useNavigation(); 
  const { ejercicio, opciones, categoria, correctAnswer, ejercicioId } = route.params;
  const [selectedOption, setSelectedOption] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [hint, setHint] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [solutionSteps, setSolutionSteps] = useState('');
  const [solutionModalVisible, setSolutionModalVisible] = useState(false);
  const [incorrectModalVisible, setIncorrectModalVisible] = useState(false);
  const [correctModalVisible, setCorrectModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);

    if (option === correctAnswer) {
      try {
        const currentAccount = await getAccount();
        if (currentAccount) {
          await markExerciseAsResolved(currentAccount.$id, ejercicioId);
          setCorrectModalVisible(true);
        }
      } catch (error) {
        console.error("Error marcando el ejercicio como resuelto:", error);
      }
    } else {
      await getFeedback(option);
      setIncorrectModalVisible(true);
    }
  };

  async function getHint() {
    if (hintLevel >= 3) {
      console.log("No hay más pistas disponibles");
      return;
    }
  
    try {
      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const prompt = `Proporciona una pista nivel ${hintLevel + 1} para resolver este ejercicio "${ejercicio}" de "${categoria}. En texto plano y en maximo 3 lineas".`;
      const result = await model.generateContent(prompt);
  
      if (result && result.response && result.response.text) {
        const hintResponse = await result.response.text();
  
        setHint(hintResponse);
        setHintLevel(hintLevel + 1);
        setModalVisible(true);
      } else {
        console.error("Error: No se pudo obtener el hint de la respuesta");
      }
    } catch (error) {
      console.error("Error al obtener la pista del chatbot:", error);
    }
  }

  async function getSolutionSteps() {
    try {
      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Resuelve este ejercicio "${ejercicio}" de "${categoria}" en 5 pasos claros, en 5 líneas y muestra la fórmula que se utiliza en cada paso. En texto plano.`;
      const result = await model.generateContent(prompt);
      const solutionResponse = await result.response.text();
      
      setSolutionSteps(solutionResponse);
      setSolutionModalVisible(true);
    } catch (error) {
      console.error("Error al obtener la solución del chatbot:", error);
    }
  }

  async function getFeedback(option) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Explica en 1 línea, 1 solo renglón por qué la opción "${option}" es incorrecta para el ejercicio "${ejercicio}" de la categoría "${categoria}" sin decir la respuesta explícitamente. En texto plano`;
      const result = await model.generateContent(prompt);
      const feedbackResponse = await result.response.text();

      setFeedback(feedbackResponse);
    } catch (error) {
      console.error("Error al obtener la retroalimentación del chatbot:", error);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 30 }}>
        <View>
          <Text className="text-3xl text-white font-bold mb-8 mt-8 text-center">
            ¡Resuelve este ejercicio!
          </Text>
        </View>

        <View
          style={{
            width: 'flex',
            height: 'flex',
            backgroundColor: '#f0f0f0',
            borderRadius: 10,
            marginTop: 12,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
            {ejercicio}
          </Text>
        </View>

        <View>
          <Text className="text-xl text-white font-bold mb-4 mt-10 text-center">
            Selecciona la respuesta correcta
          </Text>
          {opciones.slice(0, 4).map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleOptionSelect(option)}
              style={{
                backgroundColor: selectedOption === option ? '#007bff' : '#e0e0e0',
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 16, color: selectedOption === option ? '#fff' : '#333' }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={getHint}
          disabled={hintLevel >= 3}
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: hintLevel >= 3 ? '#a0a0a0' : '#f39c12',
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }}>
            {hintLevel < 3 ? `Obtener Pista (${hintLevel + 1}/3)` : "No hay más pistas disponibles"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: '#193bfc',
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }}>
            Volver
          </Text>
        </TouchableOpacity>

        {/* Modal para Retroalimentación de Respuesta Incorrecta */}
        <Modal
          visible={incorrectModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIncorrectModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
              <Text style={{ color: 'red', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                ¡Respuesta Incorrecta!
              </Text>
              <Text style={{ marginTop: 10, textAlign: 'center' }}>{feedback}</Text>
              <TouchableOpacity
                onPress={() => setIncorrectModalVisible(false)}
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: '#193bfc',
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para Retroalimentación de Respuesta Correcta */}
        <Modal
          visible={correctModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setCorrectModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
              <Text style={{ color: 'green', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                ¡Respuesta Correcta!
              </Text>
              <Text style={{ marginTop: 10, textAlign: 'center' }}>¿Qué te gustaría hacer ahora?</Text>
              
              <TouchableOpacity
                onPress={() => {
                  setCorrectModalVisible(false);
                  navigation.goBack();
                }}
                style={{
                  padding: 10,
                  backgroundColor: '#193bfc',
                  borderRadius: 10,
                  marginTop: 10,
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Volver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setCorrectModalVisible(false);
                  getSolutionSteps();
                }}
                style={{
                  padding: 10,
                  backgroundColor: '#159e19',
                  borderRadius: 10,
                  marginTop: 10,
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Ver Solución</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para Explicación de la Solución */}
        <Modal
          visible={solutionModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSolutionModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
              <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                Solución Paso a Paso
              </Text>
              <Text style={{ marginTop: 10, textAlign: 'center' }}>{solutionSteps}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSolutionModalVisible(false);
                  setCorrectModalVisible(true);
                }}
                style={{
                  padding: 10,
                  backgroundColor: '#193bfc',
                  borderRadius: 10,
                  marginTop: 10,
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para Mostrar Pista */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
              <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                Pista
              </Text>
              <Text style={{ marginTop: 10, textAlign: 'center' }}>{hint}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  padding: 10,
                  backgroundColor: '#193bfc',
                  borderRadius: 10,
                  marginTop: 10,
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
};

export default OpcionesScreen;
