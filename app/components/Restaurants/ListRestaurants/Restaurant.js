import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";

import NoImage from "../../../../assets/img/no-image.png";

const Restaurant = ({
  restaurant: {
    item: { id, images, name, address, description },
  },
  navigation,
}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("restaurant", { id, name })}
    >
      <View style={styles.viewRestaurant}>
        <View style={styles.restaurantImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="fff" />}
            source={images.length ? { uri: images[0] } : NoImage}
            style={styles.imageRestaurant}
          />
        </View>
        <View>
          <Text style={styles.restaurantName}>{name}</Text>
          <Text style={styles.restaurantAddress}>{address}</Text>
          <Text style={styles.restaurantDescription}>
            {description.substr(0, 60)}...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  viewRestaurant: {
    flexDirection: "row",
    margin: 10,
  },
  restaurantImage: {
    marginRight: 15,
  },
  imageRestaurant: {
    width: 80,
    height: 80,
  },
  restaurantName: {
    fontWeight: "bold",
  },
  restaurantAddress: {
    paddingTop: 2,
    color: "grey",
  },
  restaurantDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
});

export default Restaurant;
