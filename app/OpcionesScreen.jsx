import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal } from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native'; // Para obtener los parámetros
import { GoogleGenerativeAI } from "@google/generative-ai";

const OpcionesScreen = () => {
  const route = useRoute(); // Obtén los parámetros de la navegación
  const { ejercicio, opciones, categoria, correctAnswer } = route.params; // Extrae el ejercicio, las opciones y la respuesta correcta
  const [selectedOption, setSelectedOption] = useState(null);
  const [hintLevel, setHintLevel] = useState(0); // Nivel de pistas
  const [hint, setHint] = useState(''); // Contenido de la pista
  const [modalVisible, setModalVisible] = useState(false); // Estado para mostrar el modal
  const [solutionSteps, setSolutionSteps] = useState(''); // Guardar los pasos de la resolución
  const [solutionModalVisible, setSolutionModalVisible] = useState(false); // Estado para el modal de solución

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  async function getHint() {
    if (hintLevel >= 3) return; // No permite más de 3 pistas

    try {
      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Proporciona una pista nivel ${hintLevel + 1} para resolver esta ejercicio "${ejercicio}" de "${categoria}".`;
      const result = await model.generateContent(prompt);
      const hintResponse = result.response.text();

      console.log(prompt);
      
      // Aumenta el nivel de pistas y actualiza el contenido de la pista
      setHint(hintResponse);
      setHintLevel(hintLevel + 1);
      setModalVisible(true); // Mostrar el modal con la pista
    } catch (error) {
      console.error("Error al obtener la pista del chatbot:", error);
    }
  }

  // Función para obtener la explicación en 5 pasos
  async function getSolutionSteps() {
    try {
      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Resuelve este ejercicio "${ejercicio}" de "${categoria}" en 5 pasos claros, en 5 lineas y muestra la fórmula que se utiliza en cada paso. En texto plano`;
      const result = await model.generateContent(prompt);
      const solutionResponse = result.response.text();

      console.log(prompt);
      
      setSolutionSteps(solutionResponse); // Guarda la solución
      setSolutionModalVisible(true); // Muestra el modal con la explicación
    } catch (error) {
      console.error("Error al obtener la solución del chatbot:", error);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 30 }}>

        {/* Título de la página */}
        <View>
          <Text className="text-3xl text-white font-bold mb-8 mt-8 text-center">
            ¡Resuelve este ejercicio!
          </Text>
        </View>

        {/* Mostrar el ejercicio con estilo */}
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

        {/* Mostrar las opciones como botones */}
        <View>
          <Text className="text-xl text-white font-bold mb-4 mt-10 text-center">
            Selecciona la respuesta correcta
          </Text>
          {opciones.slice(0, 4).map((option, index) => ( // Limita a 4 opciones
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

          {/* Mostrar el resultado de la opción seleccionada */}
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

        {/* Botón para obtener una pista */}
        <TouchableOpacity
          onPress={getHint}
          disabled={hintLevel >= 3} // Deshabilitar cuando se alcance el máximo de pistas
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: hintLevel >= 3 ? '#a0a0a0' : '#f39c12', // Cambia el color si está deshabilitado
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>
            {hintLevel < 3 ? `Obtener Pista (${hintLevel + 1}/3)` : "No hay más pistas disponibles"}
          </Text>
        </TouchableOpacity>

        {/* Botón para obtener la explicación en 5 pasos */}
        <TouchableOpacity
          onPress={getSolutionSteps}
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: '#27ae60', // Verde para indicar que es la solución
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>
            Obtener explicación en 5 pasos
          </Text>
        </TouchableOpacity>

        {/* Modal para mostrar la pista */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                width: '80%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Pista {hintLevel}</Text>
              <Text style={{ fontSize: 16 }}>{hint}</Text>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  marginTop: 20,
                  padding: 10,
                  backgroundColor: '#007bff',
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para mostrar la explicación de los 5 pasos */}
        <Modal
          visible={solutionModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSolutionModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                width: '80%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Resolución del ejercicio</Text>
              <Text style={{ fontSize: 16 }}>{solutionSteps}</Text>

              <TouchableOpacity
                onPress={() => setSolutionModalVisible(false)}
                style={{
                  marginTop: 20,
                  padding: 10,
                  backgroundColor: '#007bff',
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OpcionesScreen;
