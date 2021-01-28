import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements";
import moment from "moment";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

import AvatarDefault from "../../../assets/img/avatar-default.jpg";
import { useFocusEffect } from "@react-navigation/native";

const db = firebase.firestore(firebaseApp);

const Review = ({
  review: { title, review, rating, createAt, avatarUser },
}) => (
  <View style={styles.viewReview}>
    <View style={styles.viewImageAvatar}>
      <Avatar
        size="large"
        rounded
        containerStyle={styles.imageAvatarUser}
        source={avatarUser ? { uri: avatarUser } : AvatarDefault}
      />
    </View>
    <View style={styles.viewInfo}>
      <Text style={styles.reviewTitle}>{title}</Text>
      <Text style={styles.reviewText}>{review}</Text>
      <Rating imageSize={15} startingValue={rating} readonly />
      <Text style={styles.reviewDate}>
        {moment(createAt.seconds * 1000).format("DD/MM/YYYY - h:mm a")}
      </Text>
    </View>
  </View>
);

const ListReviews = ({ navigation, idRestaurant }) => {
  const [userLogged, setUserLogged] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      user ? setUserLogged(true) : setUserLogged(false);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      db.collection("reviews")
        .where("idRestaurant", "==", idRestaurant)
        .get()
        .then((response) => {
          const resultReview = [];
          response.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            resultReview.push(data);
          });

          setReviews(resultReview);
        });
    }, [])
  );

  return (
    <View>
      {userLogged ? (
        <Button
          title="Escribe una opinión"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleReview}
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#00a680",
          }}
          onPress={() =>
            navigation.navigate("add-review-restaurant", {
              idRestaurant,
            })
          }
        />
      ) : (
        <View>
          <Text
            style={{ textAlign: "center", color: "#00a680", padding: 20 }}
            onPress={() => navigation.navigate("account", { screen: "login" })}
          >
            Para escribir un comentario es necesario estar logeado.{" "}
            <Text style={{ fontWeight: "bold" }}>
              Pulsa AQUÍ para iniciar sesión
            </Text>
          </Text>
        </View>
      )}
      {reviews.map((review, index) => (
        <Review key={index} review={review} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent",
  },
  btnTitleReview: {
    color: "#00a680",
  },
  viewReview: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
  },
  viewImageAvatar: {
    marginRight: 15,
  },
  imageAvatarUser: {
    width: 50,
    height: 50,
  },
  viewInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  reviewTitle: {
    fontWeight: "bold",
  },
  reviewText: {
    paddingTop: 2,
    color: "grey",
    marginBottom: 5,
  },
  reviewDate: {
    marginTop: 5,
    color: "grey",
    fontSize: 12,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});

export default ListReviews;
