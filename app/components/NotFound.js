import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";

const NotFound = ({ text }) => (
  <View style={styles.viewBody}>
    <Icon type="material-community" name="alert-outline" size={50} />
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

NotFound.propTypes = {
  text: PropTypes.string,
};

NotFound.defaultProps = {
  text: "No hay datos",
};

export default NotFound;
