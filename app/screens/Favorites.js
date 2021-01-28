import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";

import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseApp } from "../utils/firebase";

import { Restaurant, UserNoLogged } from "../components/Favorites";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import LoadingIndicator from "../components/LoadingIndicator";

const db = firebase.firestore(firebaseApp);

const Favorites = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);

  const toastRef = useRef();

  firebase.auth().onAuthStateChanged((user) => {
    setUserLogged(!!user);
  });

  useFocusEffect(
    useCallback(() => {
      if (userLogged) {
        const idUser = firebase.auth().currentUser.uid;

        db.collection("favorites")
          .where("idUser", "==", idUser)
          .get()
          .then((response) => {
            const idRestaurantArray = [];
            response.forEach((doc) => {
              idRestaurantArray.push(doc.data().idRestaurant);
            });
            getDataRestaurant(idRestaurantArray).then((response) => {
              const restaurants = [];
              response.forEach((doc) => {
                const restaurant = doc.data();
                restaurant.id = doc.id;
                restaurants.push(restaurant);
              });

              setRestaurants(restaurants);
            });
          });
      }

      if (reloadData) {
        setReloadData(false);
      }
    }, [userLogged, reloadData])
  );

  const getDataRestaurant = (idRestaurantArray) => {
    const arrayRestaurants = [];
    idRestaurantArray.forEach((idRestaurant) => {
      const result = db.collection("restaurants").doc(idRestaurant).get();

      arrayRestaurants.push(result);
    });

    return Promise.all(arrayRestaurants);
  };

  if (!userLogged) return <UserNoLogged navigation={navigation} />;

  if (!restaurants) {
    return <LoadingIndicator text="Cargando favoritos" />;
  } else if (!restaurants?.length) {
    return <NotFound text="No se tienen favoritos" />;
  }

  return (
    <View style={styles.viewBody}>
      <FlatList
        data={restaurants}
        renderItem={(restaurant) => (
          <Restaurant
            restaurant={restaurant}
            toastRef={toastRef}
            setIsLoading={setIsLoading}
            setReloadData={setReloadData}
            navigation={navigation}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading text="Eliminando" isVisible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  viewNotFoundRestaurant: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
});

export default Favorites;
