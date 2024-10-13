import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { images } from '../constants'
import {useNavigation } from '@react-navigation/native';



const EmptyState = ({ title, subtitle }) => {
    const navigation = useNavigation();
    return (
        <View className="justify-center items-center px-4">
            <Image
                source={images.empty} className="w-[270px]
      h-[215px]" resizeMode='contain' />
            <Text className="text-xl text-center font-psemibold
            text-white">
                {title}
            </Text>
            <Text className="font-pmendium text-sm
            text-gray-100">
                {subtitle}
            </Text>
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
        </View>
    )
}

export default EmptyState