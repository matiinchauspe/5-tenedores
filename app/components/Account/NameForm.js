import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";

const NameForm = ({ name, toggleModal, toastRef, setReloadUserInfo }) => {
  const [newName, setNewName] = useState(name ? name : "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setError("");
    if (!name && !newName) {
      setError("El nombre no puede estar vacío");
    } else if (name === newName) {
      setError("El nombre no puede igual al actual");
    } else {
      setIsLoading(true);
      firebase
        .auth()
        .currentUser.updateProfile({
          displayName: newName,
        })
        .then(() => {
          setIsLoading(false);
          toggleModal(false);
          setReloadUserInfo(true);
          toastRef.current.show("El nombre se ha actualizado correctamente");
        })
        .catch(() => {
          setError("Error al actualizar el nombre");
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Nombre y apellido"
        containerStyle={styles.input}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2",
        }}
        defaultValue={name || ""}
        onChange={(e) => setNewName(e.nativeEvent.text)}
        errorMessage={error}
      />
      <Button
        title="Cambiar nombre"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});

export default NameForm;
