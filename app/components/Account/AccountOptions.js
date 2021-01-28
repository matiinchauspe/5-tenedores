import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ListItem } from "react-native-elements";

import Modal from "../Modal";
import NameForm from "../Account/NameForm";
import EmailForm from "../Account/EmailForm";
import PasswordForm from "../Account/PasswordForm";

const AccountOptions = ({ userInfo, toastRef, setReloadUserInfo }) => {
  const [openModal, toggleModal] = useState(false);
  const [renderComponent, setRenderComponent] = useState(null);

  const selectComponent = (key) => {
    switch (key) {
      case "name":
        setRenderComponent(
          <NameForm
            name={userInfo.displayName}
            toggleModal={toggleModal}
            toastRef={toastRef}
            setReloadUserInfo={setReloadUserInfo}
          />
        );
        toggleModal(true);
        break;
      case "email": {
        setRenderComponent(
          <EmailForm
            email={userInfo.email}
            toggleModal={toggleModal}
            toastRef={toastRef}
            setReloadUserInfo={setReloadUserInfo}
          />
        );
        toggleModal(true);
        break;
      }
      case "password": {
        setRenderComponent(
          <PasswordForm toggleModal={toggleModal} toastRef={toastRef} />
        );
        toggleModal(true);
        break;
      }
      default:
        setRenderComponent(null);
        break;
    }
  };

  const menuOptions = [
    {
      title: "Cambiar nombre y apellido",
      iconType: "material-community",
      iconNameLeft: "account-circle",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectComponent("name"),
    },
    {
      title: "Cambiar email",
      iconType: "material-community",
      iconNameLeft: "at",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectComponent("email"),
    },
    {
      title: "Cambiar contraseña",
      iconType: "material-community",
      iconNameLeft: "lock-reset",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectComponent("password"),
    },
  ];

  return (
    <View>
      {menuOptions.map((menu, index) => (
        <ListItem
          key={index.toString()}
          title={menu.title}
          leftIcon={{
            type: menu.iconType,
            name: menu.iconNameLeft,
            color: menu.iconColorLeft,
          }}
          rightIcon={{
            type: menu.iconType,
            name: menu.iconNameRight,
            color: menu.iconColorRight,
          }}
          containerStyle={styles.menuItem}
          onPress={menu.onPress}
        />
      ))}
      {renderComponent && (
        <Modal isVisible={openModal} setIsVisible={toggleModal}>
          {renderComponent}
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
  },
});

export default AccountOptions;
