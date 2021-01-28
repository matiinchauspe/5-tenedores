import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TopRestaurants from '../screens/TopRestaurants';

const Stack = createStackNavigator();

const TopRestaurantsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="account"
      component={TopRestaurants}
      options={{ title: "Los más votados" }}
    />
  </Stack.Navigator>
);

export default TopRestaurantsStack;