import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import NotFoundImage from "../../assets/img/no-result-found.png";

import { FireSQL } from "firesql";
import firebase from "firebase/app";

import Restaurant from "../components/Search/Restaurant";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

const NotFoundRestaurants = () => (
  <View style={styles.notFoundView}>
    <Image source={NotFoundImage} resizeMode="cover" style={styles.notFound} />
  </View>
);

const Search = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fireSQL
      .query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
      .then((response) => {
        setRestaurants(response);
      });
  }, [search]);

  return (
    <View>
      <SearchBar
        placeholder="Busca tu restaurante..."
        onChangeText={(e) => setSearch(e)}
        value={search}
        containerStyle={styles.searchBar}
      />
      {!restaurants.length ? (
        <NotFoundRestaurants />
      ) : (
        <FlatList
          data={restaurants}
          renderItem={(restaurant) => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
  },
  notFoundView: {
    flex: 1,
    alignItems: "center",
  },
  notFound: {
    width: 200,
    height: 200,
  },
});

export default Search;
