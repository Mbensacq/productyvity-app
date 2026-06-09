import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { del, get, set } from 'idb-keyval';

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: ONE_DAY_MS,
      retry: 1,
      refetchOnWindowFocus: false,
      // Offline-first: serve cached data and let Realtime/refetch reconcile.
      networkMode: 'offlineFirst',
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
});

/**
 * Persists the query cache to IndexedDB (via idb-keyval) so the app starts
 * instantly and reads work offline after the first load.
 */
export const queryPersister = createAsyncStoragePersister({
  key: 'pa-query-cache',
  storage: {
    getItem: (key) => get<string>(key).then((value) => value ?? null),
    setItem: (key, value) => set(key, value),
    removeItem: (key) => del(key),
  },
  throttleTime: 1000,
});
