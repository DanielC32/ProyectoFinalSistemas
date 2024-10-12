import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from "../../context/GlobalProvider";



const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Inicio de sesión correcto");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-top min-h-[85vh]
        px-5">
          <Image source={images.logo}
          resizeMode='contain' className="w-[380px]" />

          <Text className="text-2xl text-white text-semibold
          mt-10 font-psemibold ">Entra a MateKL</Text>
          <FormField
           title="Correo electónico"
           value={form.email}
           handleChangeText={(e) => setForm({...form,
            email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
           <FormField
           title="Contraseña"
           value={form.password}
           handleChangeText={(e) => setForm({...form,
            password: e})}
            otherStyles="mt-7"
          />
          
          <CustomButton 
           title="Entrar"
           handlePress={submit}
           containerStyles="mt-7"
           isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row
           gap-2">
            <Text className="text-lg text-gray-100
            font-prengular">
              ¿No tienes una cuenta?
            </Text>
            <Link href="/sign-up" className="text-lg
            font-psemibold text-secondary">
             Regístrate
            </Link>
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn