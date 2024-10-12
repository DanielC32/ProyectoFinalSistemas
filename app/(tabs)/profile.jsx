import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity } from "react-native";
import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import EjercicioCard from "../../components/EjercicioCard";
import EmptyState from "../../components/EmptyState";
import InfoBox from "../../components/InfoBox";



const profile = () => {
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));
  const { user, setUser, setIsLogged } = useGlobalContext();

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <EjercicioCard
            title={item.titulo}
            ejercicio={item.ejercicio}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Sin ejercicios resueltos"
            subtitle="¡Resuelve un ejercicio y empieza a llenarte de logros!"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-2 flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Ejercicios resueltos"
                titleStyles="text-xl"
                containerStyles="mr-9"
              />
               <InfoBox
                title={user?.score}
                subtitle="Nivel"
                titleStyles="text-xl"
                containerStyles="ml-8"
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default profile;