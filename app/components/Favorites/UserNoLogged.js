import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View } from "react-native";
import { Icon, Button } from "react-native-elements";

const UserNoLogged = ({ navigation }) => (
  <View style={styles.userLoggedView}>
    <Icon type="material-community" name="alert-outline" size={50} />
    <Text style={styles.userNoLoggedText}>
      Necesitas estas logeado para ver esta sección
    </Text>
    <Button
      title="Ir al login"
      containerStyle={styles.btnContainerUserLogged}
      buttonStyle={styles.btnUserLogged}
      onPress={() => navigation.navigate("account", { screen: "login" })}
    />
  </View>
);

const styles = StyleSheet.create({
  userLoggedView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  userNoLoggedText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  btnContainerUserLogged: {
    marginTop: 20,
    width: "80%",
  },
  btnUserLogged: {
    backgroundColor: "#00a680",
  },
});

UserNoLogged.propTypes = {
  navigation: PropTypes.any,
};

export default UserNoLogged;
