import React from "react";
import { FlatList } from "react-native";

import Restaurant from "./Restaurant";

const ListTopRestaurants = ({ restaurants, navigation }) => {
  return (
    <FlatList
      data={restaurants}
      renderItem={(restaurant) => (
        <Restaurant restaurant={restaurant} navigation={navigation} />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default ListTopRestaurants;
