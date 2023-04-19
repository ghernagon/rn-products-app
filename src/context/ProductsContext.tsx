import React, {createContext, useEffect, useState} from 'react';
import cafeApi from '../api/cafeApi';
import {Producto, ProductsResponse} from '../interfaces/appInterfaces';
import {ImagePickerResponse} from 'react-native-image-picker';
import {Platform} from 'react-native';

type ProductsContextProps = {
  products: Producto[];
  loadProducts: () => Promise<void>;
  addProduct: (categoryId: string, productName: string) => Promise<Producto>;
  updateProduct: (
    categoryId: string,
    productName: string,
    productId: string,
  ) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  loadProductById: (id: string) => Promise<Producto>;
  uploadImage: (data: ImagePickerResponse, id: string) => Promise<void>;
};

export const ProductContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({children}: any) => {
  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * It loads products from the API and sets the state of products to the new products.
   */
  const loadProducts = async () => {
    const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50');
    setProducts([...resp.data.productos]);
    // setProducts([...products, ...resp.data.productos]);
  };

  const addProduct = async (
    categoryId: string,
    productName: string,
  ): Promise<Producto> => {
    try {
      const resp = await cafeApi.post<Producto>('/productos', {
        nombre: productName,
        categoria: categoryId,
      });
      setProducts([...products, resp.data]);
      return resp.data;
    } catch (error) {
      console.log({error});
      throw new Error(error);
    }
  };

  const updateProduct = async (
    categoryId: string,
    productName: string,
    productId: string,
  ) => {
    try {
      const resp = await cafeApi.put<Product>(`/productos/${productId}`, {
        nombre: productName,
        categoria: categoryId,
      });
      setProducts(products.map(p => (p._id === productId ? resp.data : p)));
    } catch (error) {
      console.log({error});
    }
  };

  const removeProduct = async (id: string) => {};

  /**
   * It returns a promise that resolves to a Producto
   * @param {string} id - string
   * @returns A promise that resolves to a Producto object.
   */
  const loadProductById = async (id: string): Promise<Producto> => {
    const resp = await cafeApi.get<Producto>(`/productos/${id}`);
    return resp.data;
  };

  const uploadImage = async (data: ImagePickerResponse, id: string) => {
    const params = {
      name: data.assets![0].fileName!,
      type: data.assets![0].type!,
      uri: data.assets![0].uri!.includes('file://')
        ? data.assets![0].uri!.replace('file://', '')
        : data.assets![0].uri!,
    };

    const fileToUpload = JSON.parse(JSON.stringify(params));

    const formData = new FormData();
    formData.append('archivo', fileToUpload);

    console.log({fileToUpload});

    try {
      const resp = await cafeApi.put(`/uploads/productos/${id}`, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      console.log(resp);
    } catch (error) {
      console.log({error});
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loadProducts,
        addProduct,
        updateProduct,
        removeProduct,
        loadProductById,
        uploadImage,
      }}>
      {children}
    </ProductContext.Provider>
  );
};
