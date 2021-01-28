import React from "react";
import { SocialIcon } from "react-native-elements";
import * as firebase from "firebase";
import * as Facebook from "expo-facebook";

import { FacebookApi } from "../../utils/social";

const LoginFacebook = ({ toastRef }) => {
  const login = async () => {
    // TODO: An error ocurred in here
    // I must research about expo-facebook library
    // Update the library to the version 9.0.0 and wait for the results
    try {
      await Facebook.initializeAsync(FacebookApi.applicationId);

      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: FacebookApi.permissions,
      });

      if (type === "success") {
        const credentials = firebase.auth.FacebookAuthProvider.credential(
          token
        );
        firebase
          .auth()
          .signInWithCredential(credentials)
          .then(() => {
            console.log("Login correcto");
          })
          .catch(() => {
            toastRef.current.show("Credenciales incorrectas.");
          });
      } else if (type === "cancel") {
        toastRef.current.show("Inicio de sesión cancelado");
      } else {
        toastRef.current.show("Error desconocido, inténtelo más tarde");
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  return (
    <SocialIcon
      title="Iniciar sesión con Facebook"
      button
      type="facebook"
      onPress={login}
    />
  );
};

export default LoginFacebook;
