import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";

import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseApp } from "../../utils/firebase";

import Loading from "../../components/Loading";
import Carousel from "../../components/Carousel";
import {
  ListReviews,
  TitleRestaurant,
  RestaurantInfo,
} from "../../components/Restaurants";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

const Restaurant = ({
  route: {
    params: { id, name },
  },
  navigation,
}) => {
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();

  useEffect(() => {
    navigation.setOptions({ title: name });
    firebase.auth().onAuthStateChanged((user) => {
      user ? setUserLogged(true) : setUserLogged(false);
    });
  }, []);

  useEffect(() => {
    if (userLogged && restaurant) {
      const currentUser = firebase.auth().currentUser.uid;
      db.collection("favorites")
        .where("idRestaurant", "==", restaurant.id)
        .where("idUser", "==", currentUser)
        .get()
        .then((response) => {
          if (response.docs.length) {
            setIsFavorite(true);
          }
        });
    }
  }, [userLogged, restaurant]);

  useFocusEffect(
    useCallback(() => {
      db.collection("restaurants")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;
          setRestaurant(data);
          setRating(data.rating);
        });
    }, [])
  );

  const handleFavorite = () => {
    if (!userLogged) {
      toastRef.current.show(
        "Para usar la función de favoritos tienes que estar logeado"
      );
    } else {
      const currentUser = firebase.auth().currentUser.uid;
      if (!isFavorite) {
        const payload = {
          idUser: currentUser,
          idRestaurant: restaurant.id,
        };

        db.collection("favorites")
          .add(payload)
          .then(() => {
            setIsFavorite(true);
            toastRef.current.show("Restaurante añadido a favoritos");
          })
          .catch(() => {
            toastRef.current.show("Error al añadir el restaurante a favoritos");
          });
      } else {
        db.collection("favorites")
          .where("idRestaurant", "==", restaurant.id)
          .where("idUser", "==", currentUser)
          .get()
          .then((response) => {
            response.forEach((doc) => {
              const idFavorite = doc.id;
              db.collection("favorites")
                .doc(idFavorite)
                .delete()
                .then(() => {
                  setIsFavorite(false);
                  toastRef.current.show(
                    "Restaurante eliminado de la lista de favoritos"
                  );
                })
                .catch(() => {
                  toastRef.current.show(
                    "Error al eliminar el restaurante de favoritos"
                  );
                });
            });
          });
      }
    }
  };

  if (!restaurant) return <Loading isVisible text="Cargando..." />;

  return (
    <ScrollView vertical style={styles.viewBody}>
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={handleFavorite}
          color={isFavorite ? "#f00" : "#00a680"}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <Carousel
        arrayImages={restaurant.images}
        height={250}
        width={screenWidth}
      />
      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={rating}
      />
      <RestaurantInfo
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
      />
      <ListReviews navigation={navigation} idRestaurant={restaurant.id} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "transparent",
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingLeft: 15,
  },
});

export default Restaurant;
