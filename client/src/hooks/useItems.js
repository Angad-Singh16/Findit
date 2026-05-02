import { useEffect } from 'react';
import useItemStore from '../store/itemStore.js';

export const useItems = (autoFetch = true) => {
  const store = useItemStore();

  useEffect(() => {
    if (autoFetch) {
      store.fetchItems(1);
    }
  }, []);

  return store;
};

export default useItems;