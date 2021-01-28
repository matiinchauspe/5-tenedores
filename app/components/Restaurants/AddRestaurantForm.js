import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Input, Icon, Avatar, Image, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";

import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import { firebaseApp } from "../../utils/firebase";

import NotFoundImage from "../../../assets/img/no-image.png";
import Modal from "../Modal";

const widthScreen = Dimensions.get("window").width;
const db = firebase.firestore(firebaseApp);

const ImageRestaurant = ({ source }) => {
  return (
    <View style={styles.viewPhoto}>
      <Image
        source={source ? { uri: source } : NotFoundImage}
        style={{ width: widthScreen, height: 200 }}
      />
    </View>
  );
};

const UploadImage = ({ toastRef, imagesSelected, setImagesSelected }) => {
  const imageSelect = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (resultPermissions === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir a ajustes y activarlos manualmente",
        3000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galeria sin seleccionar ninguna imágen",
          2000
        );
      } else {
        setImagesSelected([...imagesSelected, result.uri]);
      }
    }
  };

  const removeImage = (image) => {
    Alert.alert(
      "Eliminar imágen",
      "Estás seguro de que quieres eliminar la imágen?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            const images = imagesSelected.filter(
              (currentImage) => currentImage !== image
            );
            setImagesSelected(images);
          },
        },
        {
          cancellable: false,
        },
      ]
    );
  };

  return (
    <View style={styles.viewImages}>
      {imagesSelected.length < 4 && (
        <Icon
          type="material-community"
          name="camera"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}
      {imagesSelected.map((image, i) => (
        <Avatar
          key={i.toString()}
          style={styles.miniature}
          source={{ uri: image }}
          onPress={() => removeImage(image)}
        />
      ))}
    </View>
  );
};

const Map = ({
  isVisibleMap,
  setIsVisibleMap,
  setLocationRestaurant,
  toastRef,
}) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const resultPermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );
      const statusPermissions = resultPermissions.permissions.location.status;

      if (statusPermissions !== "granted") {
        toastRef.current.show(
          "Tienes que aceptar los permisos de localización para crear un restaurante",
          3000
        );
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationRestaurant(location);
    toastRef.current.show("Localización guardada correctamente");
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={location}
            showsUserLocation
            onRegionChange={(region) => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable
            ></MapView.Marker>
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar ubicación"
            containerStyle={styles.viewMapBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
            onPress={confirmLocation}
          />
          <Button
            title="Cancelar ubicación"
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMap(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

const AddRestaurantForm = ({ navigation, toastRef, setIsLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
  });
  const [imagesSelected, setImagesSelected] = useState([]);
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState(null);

  const onChange = (value, type) => {
    setFormData({
      ...formData,
      [type]: value,
    });
  };

  const addRestaurant = () => {
    if (!formData.name || !formData.address || !formData.description) {
      toastRef.current.show("Todos los campos del formulario son requeridos");
    } else if (!imagesSelected.length) {
      toastRef.current.show(
        "El restaurante tiene que tener al menos una imágen"
      );
    } else if (!locationRestaurant) {
      toastRef.current.show("Tienes que localizar el restaurante en el mapa");
    } else {
      setIsLoading(true);
      uploadImageStorage()
        .then((response) => {
          db.collection("restaurants")
            .add({
              name: formData.name,
              address: formData.address,
              description: formData.description,
              location: locationRestaurant,
              images: response,
              rating: 0,
              ratingTotal: 0,
              quantityVoting: 0,
              createAt: new Date(),
              createBy: firebase.auth().currentUser.uid,
            })
            .then(() => {
              setIsLoading(false);
              navigation.navigate("restaurants");
            })
            .catch(() => {
              setIsLoading(false);
              toastRef.current.show(
                "Error al subir el restaurante, inténtelo más tarde"
              );
            });
        })
        .catch(() => {
          toastRef.current.show("Hubo error en la subida de imágenes");
        });
    }
  };

  const uploadImageStorage = async () => {
    const imageBlob = [];

    await Promise.all(
      imagesSelected.map(async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const name = uuid();
        const ref = firebase.storage().ref("restaurants").child(name);
        await ref.put(blob).then(async (result) => {
          await firebase
            .storage()
            .ref(`restaurants/${name}`)
            .getDownloadURL()
            .then((photoUrl) => {
              imageBlob.push(photoUrl);
            });
        });
      })
    );

    return imageBlob;
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ImageRestaurant source={imagesSelected[0]} />
      <View style={styles.viewForm}>
        <Input
          placeholder="Nombre del restaurante"
          containerStyle={styles.input}
          onChange={(e) => onChange(e.nativeEvent.text, "name")}
        />
        <Input
          placeholder="Dirección"
          containerStyle={styles.input}
          onChange={(e) => onChange(e.nativeEvent.text, "address")}
          rightIcon={{
            type: "material-community",
            name: "google-maps",
            color: locationRestaurant ? "#00a680" : "#c2c2c2",
            onPress: () => setIsVisibleMap(true),
          }}
        />
        <Input
          placeholder="Descripción del restaurante"
          multiline
          inputContainerStyle={styles.textArea}
          onChange={(e) => onChange(e.nativeEvent.text, "description")}
        />
      </View>
      <UploadImage
        toastRef={toastRef}
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
      />
      <Button
        buttonStyle={styles.btnAddRestaurant}
        title="Crear restaurante"
        onPress={addRestaurant}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationRestaurant={setLocationRestaurant}
        toastRef={toastRef}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20,
  },
  viewImages: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniature: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: 550,
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 5,
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d",
  },
  viewMapBtnContainerSave: {
    paddingRight: 5,
  },
  viewMapBtnSave: {
    backgroundColor: "#00a680",
  },
});

export default AddRestaurantForm;
