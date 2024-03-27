import {useEffect} from 'react';
import {useRealm} from '@realm/react';
import {Product} from '../models/Product';
import {BSON} from 'realm';

export const useProduct = () => {
  const realm = useRealm();
  const products = realm.objects(Product);

  // Function to create a new product
  const addProduct = (
    storeId: BSON.ObjectId,
    name: string,
    price: number,
    numInStock: number,
  ) => {
    realm.write(() => {
      realm.create(Product, {
        _id: new BSON.ObjectId(),
        storeId,
        name,
        price,
        numInStock,
      });
    });
  };

  // Function to update a product
  const updateProduct = (
    productId: BSON.ObjectId,
    newName: string,
    newPrice: number,
    newNumInStock: number,
  ) => {
    const product = realm.objectForPrimaryKey(Product, productId);
    if (product) {
      realm.write(() => {
        product.name = newName;
        product.price = newPrice;
        product.numInStock = newNumInStock;
      });
    }
  };

  // Function to delete a product
  const deleteProduct = (productId: BSON.ObjectId) => {
    const product = realm.objectForPrimaryKey(Product, productId);
    if (product) {
      realm.write(() => {
        realm.delete(product);
      });
    }
  };

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Product));
    });
  }, [realm]);

  return {
    product: products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
