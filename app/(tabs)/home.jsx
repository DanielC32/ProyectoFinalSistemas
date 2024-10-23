import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EjercicioCard from '../../components/EjercicioCard'
import EmptyState from '../../components/EmptyState'
import { searchPostsbyLv } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import { useGlobalContext } from "../../context/GlobalProvider";
import CustomButton from '../../components/CustomButton';


const Home = () => {

  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => searchPostsbyLv(user.score));
  

  useEffect(() => {
    refetch();
  }, [user.score]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
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
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Bienvenido de nuevo
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-12 h-12 rounded-lg"
                  resizeMode="contain"
                />
                <CustomButton
                  title="Ecuaciones"
                  handlePress={() => router.push(`/tinicial`)}
                  containerStyles="w-full mt-7"
                />
              </View>
            </View>
            <SearchInput />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No has resuelto ejercicios"
            subtitle="¡Es un buen momento para resolver uno!"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;