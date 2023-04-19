import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {ProductsStackParams} from '../navigator/ProductsNavigator';
import {Picker} from '@react-native-picker/picker';
import {useCategories} from '../hooks/useCategories';
import {useForm} from '../hooks/useForm';
import {ProductContext} from '../context/ProductsContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

export const ProductScreen = ({navigation, route}: Props) => {
  const {id = '', name = ''} = route.params;

  const [tmpUri, setTmpUri] = useState<string>();

  const {categories} = useCategories();
  const {loadProductById, addProduct, updateProduct, uploadImage} =
    useContext(ProductContext);

  const {_id, categoriaId, nombre, img, form, onChange, setFormValue} = useForm(
    {
      _id: id,
      categoriaId: '',
      nombre: name,
      img: '',
    },
  );

  useEffect(() => {
    navigation.setOptions({
      title: nombre ? nombre : id ? 'No product name' : 'New Product',
    });
  }, [nombre]);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    if (_id.length === 0) return;
    const product = await loadProductById(id);
    setFormValue({
      _id: id,
      categoriaId: product.categoria._id,
      nombre,
      img: product.img || '',
    });
  };

  const saveOrUpdateProduct = async () => {
    if (_id.length > 0) {
      updateProduct(categoriaId, nombre, id);
    } else {
      const tmpCategoryId = categoriaId || categories[0]._id;
      const newProduct = await addProduct(tmpCategoryId, nombre);
      onChange(newProduct._id, '_id');
    }
  };

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        console.log(resp);
        if (resp.didCancel) return;
        if (!resp.assets?.[0].uri) return;
        setTmpUri(resp.assets?.[0].uri);

        uploadImage(resp, _id);
      },
    );
  };

  const takePhotoFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        console.log(resp);
        if (resp.didCancel) return;
        if (!resp.assets?.[0].uri) return;
        setTmpUri(resp.assets?.[0].uri);

        uploadImage(resp, _id);
      },
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Product name:</Text>
        <TextInput
          placeholder="Product"
          style={styles.textInput}
          value={nombre}
          onChangeText={value => onChange(value, 'nombre')}
        />

        {/* Picker */}
        <Text style={styles.label}>Category:</Text>
        <Picker
          selectedValue={categoriaId}
          onValueChange={itemValue => onChange(itemValue, 'categoriaId')}>
          {categories.map(cat => (
            <Picker.Item label={cat.nombre} value={cat._id} key={cat._id} />
          ))}
        </Picker>

        <Button title="Save" onPress={saveOrUpdateProduct} color="#5856D6" />

        {/* Show image buttons if product has been saved or exist */}
        {_id.length > 0 && (
          <View style={styles.row}>
            <Button title="Camera" onPress={takePhoto} color="#5856D6" />
            <View style={styles.itemSeparator} />
            <Button
              title="Gallery"
              onPress={takePhotoFromGallery}
              color="#5856D6"
            />
          </View>
        )}

        {img.length > 0 && !tmpUri && (
          <View style={styles.row}>
            <Image source={{uri: img}} style={styles.image} />
          </View>
        )}
        {tmpUri && <Image source={{uri: tmpUri}} style={styles.image} />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45,
    marginTop: 5,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  itemSeparator: {
    width: 10,
  },
  image: {
    width: '100%',
    height: 300,
  },
});
