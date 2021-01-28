import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Restaurants,
  AddRestaurant,
  Restaurant,
  AddReviewRestaurant,
} from "../screens/Restaurants";

const Stack = createStackNavigator();

const RestaurantsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="restaurants"
      component={Restaurants}
      options={{ title: "Restaurantes" }}
    />
    <Stack.Screen
      name="add-restaurant"
      component={AddRestaurant}
      options={{ title: "Añadir nuevo restaurante" }}
    />
    <Stack.Screen name="restaurant" component={Restaurant} />
    <Stack.Screen
      name="add-review-restaurant"
      component={AddReviewRestaurant}
      options={{ title: "Nuevo comentario" }}
    />
  </Stack.Navigator>
);

export default RestaurantsStack;
