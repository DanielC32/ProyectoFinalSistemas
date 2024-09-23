import { useState } from "react";
import * as Animatable from "react-native-animatable";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  View,
} from "react-native";


const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {/* Miniatura clicable */}
      <TouchableOpacity
        className="relative flex justify-center items-center"
        activeOpacity={0.7}
        onPress={toggleModal}
      >
        <ImageBackground
          source={{
            uri: item.thumbnail,
          }}
          className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Modal para la imagen a pantalla completa */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          }}
          onPress={toggleModal}
        >
          <Image
            source={{ uri: item.thumbnail }}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }}
    />
  );
};

export default Trending;
