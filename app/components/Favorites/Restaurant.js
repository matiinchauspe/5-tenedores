import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image, Icon } from "react-native-elements";

import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseApp } from "../../utils/firebase";

import NoImage from "../../../assets/img/no-image.png";

const db = firebase.firestore(firebaseApp);

const Restaurant = ({
  restaurant: {
    item: { id, name, images },
  },
  toastRef,
  setIsLoading,
  setReloadData,
  navigation,
}) => {
  const handleRemove = () => {
    setIsLoading(true);
    const currentUser = firebase.auth().currentUser.uid;

    db.collection("favorites")
      .where("idRestaurant", "==", id)
      .where("idUser", "==", currentUser)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsLoading(false);
              toastRef.current.show(
                "El restaurante ha sido eliminado de lista de favoritos"
              );
              setReloadData(true);
            })
            .catch(() => {
              setIsLoading(false);
              toastRef.current.show(
                "Error al eliminar el restaurante de lista de favoritos"
              );
            });
        });
      });
  };

  const onRemovefavorite = () => {
    Alert.alert(
      "Eliminar restaurante de favoritos",
      "Estás seguro que deseas eliminar este restaurante de favoritos?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: handleRemove,
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  return (
    <View style={styles.restaurant}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("restaurants", {
            screen: "restaurant",
            params: { id, name },
          })
        }
      >
        <Image
          resizeMode="cover"
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
          source={images[0] ? { uri: images[0] } : NoImage}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Icon
            type="material-community"
            name="heart"
            color="#f00"
            containerStyle={styles.favorite}
            onPress={onRemovefavorite}
            underlayColor="transparent"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  restaurant: {
    margin: 10,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  name: {
    fontWeight: "bold",
    fontSize: 30,
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
  },
});

export default Restaurant;
