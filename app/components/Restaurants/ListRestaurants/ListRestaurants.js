import React from "react";
import { View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Restaurant from "./Restaurant";
import NotFound from "../../NotFound";
import LoadingIndicator from "../../LoadingIndicator";

const FooterList = ({ isLoading }) => isLoading && <LoadingIndicator />;

const ListRestaurants = ({
  restaurants,
  handleLoadMore,
  isLoading,
  loadingRestaurants,
}) => {
  const navigation = useNavigation();

  if (!restaurants?.length && !loadingRestaurants) {
    return <NotFound text="No hay restaurantes" />;
  } else if (loadingRestaurants) {
    return <LoadingIndicator text="Cargando restaurantes" />;
  }

  return (
    <View>
      <FlatList
        data={restaurants}
        renderItem={(restaurant) => (
          <Restaurant restaurant={restaurant} navigation={navigation} />
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        ListFooterComponent={<FooterList isLoading={isLoading} />}
      />
    </View>
  );
};

export default ListRestaurants;
