import React from "react";
import { ListItem, Icon } from "react-native-elements";
import NoResultImage from "../../../assets/img/no-image.png";

const Restaurant = ({
  restaurant: {
    item: { id, name, images },
  },
  navigation,
}) => {
  return (
    <ListItem
      title={name}
      leftAvatar={{
        source: images[0] ? { uri: images[0] } : NoResultImage,
      }}
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() =>
        navigation.navigate("restaurants", {
          screen: "restaurant",
          params: { id, name },
        })
      }
    />
  );
};

export default Restaurant;
