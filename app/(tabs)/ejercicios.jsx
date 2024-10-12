import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { router, usePathname } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';

const Ejercicios = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
 

  const handleExerciseSelect = (exerciseIndex) => {
    setCurrentExercise(exerciseIndex);
    setIsMenuVisible(true);
  };

  const handleBack = () => {
    setIsMenuVisible(false);
    setCurrentExercise(0);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center min-h-[10vh] px-4">
          <Image
            source={images.logo}
            className="w-[260px] h-[110px]"
            resizeMode="contain"
          />

          <View className="relative mt-1">
            <Text className="text-3xl text-white font-bold text-center">
              Bienvenido{' '}
              <Text className="text-secondary-200">
                MateKL
              </Text>
            </Text>
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Escoge la categoria de ejercicios que deseas resolver:
          </Text>

          {/* Botones para seleccionar ejercicios */}
          <CustomButton
            title="Derivadas"
            handlePress={() => router.push(`/searchCat/Derivadas`)}
            containerStyles="w-full mt-7"
          />
          <CustomButton
            title="Limites"
            handlePress={() => router.push(`/searchCat/Límites`)}
            containerStyles="w-full mt-7"
          />
          <CustomButton
            title="Ecuaciones"
            handlePress={() => router.push(`/searchCat/Ecuaciones`)}
            containerStyles="w-full mt-7"
          />

          {/* Menú de ejercicios */}
          {isMenuVisible && (
            <View style={styles.exerciseMenu}>
              <Text style={styles.exerciseTitle}>Ejercicio {currentExercise + 1}</Text>
              <Image
                source={exerciseImages[currentExercise]}
                className="w-[260px] h-[110px]"
                resizeMode="contain"
              />
              <CustomButton
                title="Volver"
                handlePress={handleBack}
                containerStyles="w-full mt-7"
              />
            </View>
          )}
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  exerciseMenu: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseTitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
});

export default Ejercicios;
