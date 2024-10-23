import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { icons } from "../../constants";
import { useEffect, useState } from "react";
import useAppwrite from "../../lib/useAppwrite"; // Custom hook to interact with Appwrite
import { getResolvedExercises, getUserScore, signOut } from "../../lib/appwrite"; // Ensure getUserScore is available
import { useGlobalContext } from "../../context/GlobalProvider";
import EjercicioCard from "../../components/EjercicioCard";
import EmptyState from "../../components/EmptyState";
import InfoBox from "../../components/InfoBox";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts, refetch: refetchPosts } = useAppwrite(() => getResolvedExercises(user.$id)); // Refetch exercises
  const { data: score, refetch: refetchScore } = useAppwrite(() => getUserScore(user.$id)); // Refetch score

  const [refreshing, setRefreshing] = useState(false);

  // Function to handle refreshing both posts and score
  const onRefresh = async () => {
    setRefreshing(true);
    await refetchPosts(); // Fetch fresh posts data
    await refetchScore(); // Fetch fresh score data
    setRefreshing(false);
  };

  const logout = async () => {
    router.replace("/sign-in");
    await signOut();
    setUser(null);
    setIsLogged(false);
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
            categoria={item.categoria}
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
                title={posts?.length || 0}
                subtitle="Ejercicios resueltos"
                titleStyles="text-xl"
                containerStyles="mr-9"
              />
              <InfoBox
                title={score || user?.score} // Updated score or fallback to user's current score
                subtitle="Nivel"
                titleStyles="text-xl"
                containerStyles="ml-8"
              />
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
