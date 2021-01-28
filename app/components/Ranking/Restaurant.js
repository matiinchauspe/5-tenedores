import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Card, Icon, Image, Rating } from "react-native-elements";

const Restaurant = ({
  restaurant: {
    index,
    item: { id, name, images, rating, description },
  },
  navigation,
}) => {
  const [color, setColor] = useState("#000");

  useEffect(() => {
    if (index === 0) {
      setColor("#efb819");
    } else if (index === 1) {
      setColor("#e3e4e5");
    } else if (index === 2) {
      setColor("#cd7f32");
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("restaurants", {
          screen: "restaurant",
          params: { id, name },
        })
      }
    >
      <Card containerStyle={styles.containerCard}>
        <Icon
          type="material-community"
          name="chess-queen"
          color={color}
          size={40}
          containerStyle={styles.containerIcon}
        />
        <Image
          style={styles.restaurantImage}
          resizeMode="cover"
          source={images[0] ? { uri: images[0] } : NotImage}
        />
        <View style={styles.titleRating}>
          <Text style={styles.title}>{name}</Text>
          <Rating imageSize={20} startingValue={rating} readonly />
        </View>
        <Text style={styles.description}>{description}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 30,
    borderWidth: 0,
  },
  containerIcon: {
    position: "absolute",
    top: -30,
    left: -30,
    zIndex: 1,
  },
  restaurantImage: {
    width: "100%",
    height: 200,
  },
  titleRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    color: "grey",
    marginTop: 0,
    textAlign: "justify",
  },
});

export default Restaurant;
