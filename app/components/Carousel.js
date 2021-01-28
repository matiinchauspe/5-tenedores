import React from "react";
import { Image } from "react-native-elements";
import SnapCarousel from "react-native-snap-carousel";

const Carousel = ({ arrayImages, height, width }) => {
  const renderItem = ({ item }) => (
    <Image style={{ width, height }} source={{ uri: item }} />
  );

  return (
    <SnapCarousel
      layout="default"
      data={arrayImages}
      sliderWidth={width}
      itemWidth={width}
      renderItem={renderItem}
    />
  );
};

export default Carousel;
