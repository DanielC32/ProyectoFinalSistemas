import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
import { searchPosts, searchPostsbyCat } from "../../lib/appwrite";
import EjercicioCardOp from '../../components/EjercicioCardOp'
import EmptyState from '../../components/EmptyState'

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPostsbyCat(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <EjercicioCardOp
            title={item.titulo}
            ejercicio={item.ejercicio}
            categoria={item.categoria}
            ejercicioId={item.$id}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-pmedium text-gray-100 text-sm">
                Resultados de
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {query}
              </Text>

            
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Ejercicios no encontrados"
            subtitle="Esos ejercicios no han sido creados"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
