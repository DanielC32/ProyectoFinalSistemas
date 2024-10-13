import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal } from 'react-native';
import React, { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAccount, markExerciseAsResolved } from '../lib/appwrite';  // Importar la función

const OpcionesScreen = () => {
  const route = useRoute();
  const navigation = useNavigation(); 
  const { ejercicio, opciones, categoria, correctAnswer, ejercicioId } = route.params;  // Añadir ejercicioId
  const [selectedOption, setSelectedOption] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [hint, setHint] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [solutionSteps, setSolutionSteps] = useState('');
  const [solutionModalVisible, setSolutionModalVisible] = useState(false);

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);

    if (option === correctAnswer) {
      try {
        // Obtener el usuario actual
        const currentAccount = await getAccount();
        if (currentAccount) {
          // Marcar el ejercicio como resuelto para el usuario actual
          await markExerciseAsResolved(currentAccount.$id, ejercicioId);  // Llamar a la función
          alert('¡Ejercicio resuelto y marcado como completado!');
        }
      } catch (error) {
        console.error("Error marcando el ejercicio como resuelto:", error);
      }
    }
  };

  async function getHint() {
    if (hintLevel >= 3) return;

    try {
      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Proporciona una pista nivel ${hintLevel + 1} para resolver este ejercicio "${ejercicio}" de "${categoria}".`;
      const result = await model.generateContent(prompt);
      const hintResponse = result.response.text();

      setHint(hintResponse);
      setHintLevel(hintLevel + 1);
      setModalVisible(true);
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
      const solutionResponse = result.response.text();
      
      setSolutionSteps(solutionResponse);
      setSolutionModalVisible(true);
    } catch (error) {
      console.error("Error al obtener la solución del chatbot:", error);
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

          {selectedOption && (
            <View style={{ marginTop: 12 }}>
              {selectedOption === correctAnswer ? (
                <Text style={{ color: '#12e807', fontSize: 25, textAlign: 'center', fontWeight: 'bold' }}>
                  ¡Correcto!
                </Text>
              ) : (
                <Text style={{ color: '#c40000', fontSize: 25, textAlign: 'center', fontWeight: 'bold' }}>
                  Incorrecto
                </Text>
              )}
            </View>
          )}
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
          onPress={getSolutionSteps}
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: '#159e19',
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }}>
            Explicación de la solución
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

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
              <Text>{hint}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: 'blue', marginTop: 10 }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={solutionModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSolutionModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
              <Text>{solutionSteps}</Text>
              <TouchableOpacity onPress={() => setSolutionModalVisible(false)}>
                <Text style={{ color: 'blue', marginTop: 10 }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OpcionesScreen;
