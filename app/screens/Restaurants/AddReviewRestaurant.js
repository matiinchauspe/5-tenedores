import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from "react-native-easy-toast";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

import Loading from "../../components/Loading";

const db = firebase.firestore(firebaseApp);

const AddReviewRestaurant = ({
  navigation,
  route: {
    params: { idRestaurant },
  },
}) => {
  const [formData, setFormData] = useState({
    rating: null,
    title: "",
    comment: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef();

  const onChange = (value, field) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const updateRestaurant = () => {
    const restaurantRef = db.collection("restaurants").doc(idRestaurant);

    restaurantRef.get().then((response) => {
      const restaurantData = response.data();
      const ratingTotal = restaurantData.ratingTotal + formData.rating;
      const quantityVoting = restaurantData.quantityVoting + 1;
      const ratingResult = ratingTotal / quantityVoting;

      restaurantRef
        .update({
          rating: ratingResult,
          ratingTotal,
          quantityVoting,
        })
        .then(() => {
          setIsLoading(false);
          navigation.goBack();
        });
    });
  };

  const addReview = () => {
    if (!formData.rating) {
      toastRef.current.show("No has dado ninguna puntuación");
    } else if (!formData.title) {
      toastRef.current.show("El título es obligatorio");
    } else if (!formData.comment) {
      toastRef.current.show("El comentario es obligatorio");
    } else {
      setIsLoading(true);
      const user = firebase.auth().currentUser;
      const payload = {
        idUser: user.uid,
        avatarUser: user.photoURL,
        idRestaurant,
        title: formData.title,
        review: formData.comment,
        rating: formData.rating,
        createAt: new Date(),
      };

      db.collection("reviews")
        .add(payload)
        .then(() => {
          updateRestaurant();
        })
        .catch(() => {
          setIsLoading(false);
          toastRef.current.show("Error al enviar la opinión");
        });
    }
  };

  return (
    <View style={styles.viewBody}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count={5}
          reviews={["Pésimo", "Deficiente", "Normal", "Muy Bueno", "Excelente"]}
          defaultRating={0}
          size={35}
          onFinishRating={(value) => onChange(value, "rating")}
        />
      </View>
      <View style={styles.formReview}>
        <Input
          placeholder="Título"
          containerStyle={styles.input}
          onChange={(e) => onChange(e.nativeEvent.text, "title")}
        />
        <Input
          placeholder="Comentario..."
          multiline
          inputContainerStyle={styles.textArea}
          onChange={(e) => onChange(e.nativeEvent.text, "comment")}
        />
        <Button
          title="Enviar comentario"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={addReview}
        />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={isLoading} text="Enviando comentario" />
    </View>
  );
};

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2",
  },
  formReview: {
    flex: 1,
    alignItems: "center",
    margin: 10,
    marginTop: 40,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 10,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});

export default AddReviewRestaurant;
