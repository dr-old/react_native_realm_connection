import {useEffect} from 'react';
import {useQuery, useRealm} from '@realm/react';
import {Store} from '../models/Store';
import {BSON} from 'realm';

export const useStore = () => {
  const realm = useRealm();
  const stores = useQuery(Store);

  // Function to create a new store
  const addStore = (name: string, location: string, kiosks: []) => {
    realm.write(() => {
      realm.create(Store, {
        name,
        location,
        kiosks: kiosks ?? [],
      });
    });
  };

  // Function to update a store
  const updateStore = (
    storeId: BSON.ObjectId,
    newName: string,
    newLocation: string,
  ) => {
    const store = realm.objectForPrimaryKey(Store, storeId);
    if (store) {
      realm.write(() => {
        store.name = newName;
        store.location = newLocation;
      });
    }
  };

  // Function to delete a store
  const deleteStore = (storeId: BSON.ObjectId) => {
    const store = realm.objectForPrimaryKey(Store, storeId);
    if (store) {
      realm.write(() => {
        realm.delete(store);
      });
    }
  };

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Store));
    });
  }, [realm]);

  return {
    store: stores,
    addStore,
    updateStore,
    deleteStore,
  };
};
