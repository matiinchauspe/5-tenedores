import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";

import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseApp } from "../utils/firebase";

import ListTopRestaurants from "../components/Ranking/ListTopRestaurants";

const db = firebase.firestore(firebaseApp);

const TopRestaurants = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const toastRef = useRef();

  useEffect(() => {
    db.collection("restaurants")
      .orderBy("rating", "desc")
      .limit(5)
      .get()
      .then((response) => {
        const restaurantsArray = [];
        response.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          restaurantsArray.push(data);
        });
        setRestaurants(restaurantsArray);
      });
  }, []);

  return (
    <View>
      <ListTopRestaurants restaurants={restaurants} navigation={navigation} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </View>
  );
};

export default TopRestaurants;
