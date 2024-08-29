import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React from 'react'
import { Redirect, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../constants'
import CustomButton from '../components/CustomButton'

const index = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
       <ScrollView contentContainerStyle={{ height: '100%'}}>
         <View className="w-full justify-center items-center min-h-[85vh] px-4">
           <Image source={images.logo}
           className="w-[260px] h-[110px]"
           resizeMode="contain"
            />    

            <Image source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode='contain' 
            />

            <View className="relative mt-5">
               <Text className="text-3xl text-white font-bold text-center">
                 Descubre el cálculo con{' '}
                <Text className="text-secondary-200"> 
                 MateKL
                </Text>
               </Text>
            </View>
            <Text className="text-sm font-pregular 
                text-gray-100 mt-7 text-center">
                Aprender 
                cálculo nunca 
                fue tan fácil y divertido
            </Text>
            <CustomButton 
             title="Continua con Email"
             handlePress={() => router.push('/sign-in')}
             containerStyles="w-full mt-7"
            />
         </View>
       </ScrollView>
       <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({})
