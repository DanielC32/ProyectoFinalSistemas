import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { icons } from "../constants";



const EjercicioCard = ({ title, categoria, ejercicio, dificultad }) => {

 

  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState("");

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-blue flex justify-center items-center p-0.5">
            <Image
              source={icons.avatar}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text className="text-sm text-white" numberOfLines={1}>
              {categoria}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
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
        <Text style={{ fontSize: 18, textAlign: 'center', lineHeight: 28 }}>
          {ejercicio}
        </Text>
      </View>
    </View>
  );
};

export default EjercicioCard;
