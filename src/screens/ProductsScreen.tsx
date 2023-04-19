/* eslint-disable react/no-unstable-nested-components */
import React, {useContext, useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ProductContext} from '../context/ProductsContext';
import {ProductsStackParams} from '../navigator/ProductsNavigator';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> {}

export const ProductsScreen = ({navigation}: Props) => {
  const {products, loadProducts} = useContext(ProductContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.headerButton}
          onPress={() => navigation.navigate('ProductScreen', {})}>
          <Text>Add</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const loadProductsFromBackend = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={p => p._id}
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('ProductScreen', {
                id: item._id,
                name: item.nombre,
              })
            }>
            <Text style={styles.productName}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        refreshing={refreshing}
        onRefresh={loadProductsFromBackend}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  productName: {
    fontSize: 20,
  },
  itemSeparator: {
    marginVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  headerButton: {
    marginRight: 20,
  },
});
