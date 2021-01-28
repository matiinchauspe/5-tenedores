import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Rating } from "react-native-elements";

const TitleRestaurant = ({ name, description, rating }) => (
  <View style={styles.viewRestaurantTitle}>
    <View style={{ flexDirection: "row" }}>
      <Text style={styles.nameRestaurant}>{name}</Text>
      <Rating
        style={styles.rating}
        imageSize={20}
        readonly
        startingValue={parseFloat(rating)}
      />
    </View>
    <Text style={styles.descriptionRestaurant}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  viewRestaurantTitle: {
    padding: 5,
  },
  nameRestaurant: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  descriptionRestaurant: {
    marginTop: 5,
    color: "grey",
  },
});

export default TitleRestaurant;
