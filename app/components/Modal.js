import React from "react";
import { StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";

const Modal = ({ isVisible, setIsVisible, children }) => {
  const onClose = () => setIsVisible(false);

  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor="rgba(0,0,0,0.5)"
      overlayBackgroundColor="transparent"
      overlayStyle={styles.overlay}
      onBackdropPress={onClose}
    >
      {children}
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: {
    height: "auto",
    width: "90%",
    backgroundColor: "white",
  },
});

export default Modal;
