import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

const EjercicioCardOp = ({ title, categoria, ejercicio, dificultad, ejercicioId }) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const navigation = useNavigation(); // Inicializa el hook de navegación

  async function getSolutionFromChatbot() {
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Aquí pedimos cuatro opciones pero no indicamos cuál es la correcta
      const prompt = `Genera cuatro opciones de respuesta para este ejercicio "${ejercicio}", 
                      incluyendo una correcta y tres incorrectas. 
                      Solo redacta 4 líneas, una para cada opción.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Separar las opciones por líneas y eliminar líneas vacías
      let options = responseText.split('\n').filter(option => option.trim() !== '');

      // En este caso no sabemos cuál es la correcta, así que pedimos al modelo que las genere
      // Imaginemos que por convención la opción correcta es siempre la primera
      const correctAnswerFromModel = options[0]; // Si el modelo la genera primero, la tomamos como correcta

      // Mezclamos las opciones para que no siempre esté en la misma posición
      options = options.sort(() => Math.random() - 0.5);

      setCorrectAnswer(correctAnswerFromModel); // Guardamos la correcta internamente
      setOptions(options); // Guardamos las opciones generadas

      // Navegar a la pantalla de opciones con los parámetros
      navigation.navigate('opciones', {
        ejercicio: ejercicio, 
        categoria: categoria,// Asegúrate de pasar este parámetro
        opciones: options,
        ejercicioId: ejercicioId,
        correctAnswer: correctAnswerFromModel // Esto no se muestra, pero se envía para la verificación
      });

    } catch (error) {
      console.error("Error al obtener las opciones del chatbot:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View>
        <Text className="font-bold text-white text-lg text-center">{title}</Text>
      </View>

      <View
        style={{
          backgroundColor: '#f0f0f0',
          borderRadius: 10,
          marginTop: 12,
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 18, textAlign: 'center' }}>{ejercicio}</Text>
      </View>

      <TouchableOpacity
        onPress={getSolutionFromChatbot}
        style={{
          marginTop: 12,
          padding: 10,
          backgroundColor: '#159e19',
          borderRadius: 10,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }}>
          Resolver
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#00ff00" style={{ marginTop: 12 }} />
      )}
    </View>
  );
};

export default EjercicioCardOp;
