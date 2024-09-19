import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'


const SearchInput = ({ title, value, placeholder,
  handleChangeText, otherStyles, ...props }
) => {

  const [showPassword, setShowPassword] = useState(false)

  return (
      <View className=" border-2 border-blue-500 w-full
       h-16 px-4 bg-gray-100 rounded-xl
       focus:border-secondary items-center flex-row 
       space-x-4">
        <TextInput
          className="text-base mt-0.5 text-white flex-1
          font-pregular"
          value={value}
          placeholder="Busca tema principal del ejecicio"
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
        />

        <TouchableOpacity/>
        <Image
        source={icons.search}
        className="w-5 h-5"
        resizeMode='contain'/>
      </View>
  )
}

export default SearchInput