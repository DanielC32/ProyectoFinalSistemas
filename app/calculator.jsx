/*import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { create, all } from 'mathjs';

const config = { number: 'Fraction' };  // Configuración para manejar fracciones
const math = create(all, config);

const Calculator = () => {
  const [expression, setExpression] = useState('');  // Para ingresar expresiones matemáticas
  const [result, setResult] = useState('');  // Para mostrar el resultado
  const [operationType, setOperationType] = useState('evaluate');  // Tipo de operación

  const handleEvaluate = () => {
    try {
      let res;

      // Se manejan diferentes tipos de operaciones
      switch (operationType) {
        case 'derivative':
          res = math.derivative(expression, 'x').toString();  // Derivar con respecto a 'x'
          break;
        case 'simplify':
          res = math.simplify(expression).toString();  // Simplificar la expresión
          break;
        case 'matrix':
          // Ejemplo de multiplicación de matrices
          const m1 = math.matrix([
            [math.fraction(1, 2), math.fraction(1, 3)],
            [math.fraction(2, 3), math.fraction(3, 4)]
          ]);
          const m2 = math.matrix([
            [math.fraction(4, 5), math.fraction(5, 6)],
            [math.fraction(6, 7), math.fraction(7, 8)]
          ]);
          res = math.multiply(m1, m2).toString();  // Multiplicación de matrices
          break;
        default:
          res = math.evaluate(expression).toString();  // Evaluar expresiones matemáticas
      }

      setResult(res);
    } catch (error) {
      setResult('Error en la expresión');  // Manejo de errores
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>Calculadora</Text>
        <TextInput
          style={styles.input}
          value={expression}
          onChangeText={setExpression}
          placeholder="Escribe una expresión"
        />
        <View style={styles.buttonRow}>
          <Button title="Evaluar" onPress={() => { setOperationType('evaluate'); handleEvaluate(); }} />
          <Button title="Derivar" onPress={() => { setOperationType('derivative'); handleEvaluate(); }} />
        </View>
        <View style={styles.buttonRow}>
          <Button title="Simplificar" onPress={() => { setOperationType('simplify'); handleEvaluate(); }} />
          <Button title="Matriz" onPress={() => { setOperationType('matrix'); handleEvaluate(); }} />
        </View>
        <Text style={styles.result}>Resultado: {result}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  result: {
    fontSize: 18,
    marginTop: 20,
    color: '#333',
  },
});

export default Calculator;*/