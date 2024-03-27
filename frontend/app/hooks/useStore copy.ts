import {useState, useEffect} from 'react';
import {BSON} from 'realm';
import {useRealm, useUser} from '@realm/react';
import {Kiosk} from '../models/Kiosk';
import {Product, getRandomProductName} from '../models/Product';
import {Store} from '../models/Store';
import {getFloatBetween, getIntBetween} from '../utils/random';
import {logger} from '../utils/logger';

export const useStores = () => {
  const realm = useRealm();
  const user = useUser<{}, {storeId: BSON.ObjectId}, {}>();

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[] | any>([]);

  useEffect(() => {
    const fetchStore = async () => {
      const fetchedStore = await realm.objectForPrimaryKey(
        Store,
        user?.customData?.storeId,
      );
      setStore(fetchedStore);
    };

    const fetchProducts = async () => {
      const fetchedProduct = await realm.objects(Product);
      setProducts(fetchedProduct);
    };

    fetchStore();
    fetchProducts();

    const productsResults = realm.objects(Product);

    function onStoreChange(stores: any, changes: any) {
      changes.deletions?.forEach((index: any) => {
        logger.info(`Looks like Store #${index} has been removed.`);
      });
      changes.insertions?.forEach((index: string | number) => {
        const insertedStore = stores[index];
        logger.info(`A new store has been added: ${insertedStore.name}`);
      });
      changes.modifications?.forEach((index: string | number) => {
        const modifiedStore = stores[index];
        logger.info(`Store #${modifiedStore._id} has been modified.`);
      });
    }
    productsResults.addListener(onStoreChange);

    return () => {
      productsResults.removeListener(onStoreChange);
    };
  }, [realm, user]);

  const addKiosk = () => {
    realm.write(() => {
      const kiosk = realm.create(Kiosk, {
        _id: new BSON.ObjectId(),
        storeId: user.customData.storeId,
        products: [...products],
      });
      store?.kiosks.push(kiosk);
    });
  };

  const addProduct = () => {
    realm.write(() => {
      const product = realm.create(Product, {
        _id: new BSON.ObjectId(),
        storeId: user.customData.storeId,
        name: getRandomProductName(),
        price: parseFloat(getFloatBetween(3, 15).toFixed(2)),
        numInStock: getIntBetween(0, 100),
      });
      for (const kiosk of store?.kiosks || []) {
        kiosk.products.push(product);
      }
    });
  };

  const updateProduct = (product: Product) => {
    realm.write(() => {
      product.numInStock = getIntBetween(0, 100);
    });
  };

  const removeProduct = (product: Product) => {
    realm.write(() => {
      realm.delete(product);
    });
  };

  return {
    store,
    products,
    addKiosk,
    addProduct,
    updateProduct,
    removeProduct,
  };
};
