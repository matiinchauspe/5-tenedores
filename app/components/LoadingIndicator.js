import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";

const LoadingIndicator = ({ text, indicatorSize }) => (
  <View>
    <View style={styles.loader}>
      <ActivityIndicator size={indicatorSize} />
      {text && <Text>{text}</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  loader: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
});

LoadingIndicator.propTypes = {
  text: PropTypes.string,
  indicatorSize: PropTypes.string,
};

LoadingIndicator.defaultProps = {
  text: "",
  indicatorSize: "large",
};

export default LoadingIndicator;
