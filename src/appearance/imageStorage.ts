import { APPEARANCE_DB_NAME, APPEARANCE_DB_VERSION, APPEARANCE_IMAGE_STORE } from "./appearanceDefaults";
import type { StoredAppearanceImage } from "./appearanceTypes";

function openAppearanceDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(APPEARANCE_DB_NAME, APPEARANCE_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(APPEARANCE_IMAGE_STORE)) {
        db.createObjectStore(APPEARANCE_IMAGE_STORE, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runImageStore<T>(
  mode: IDBTransactionMode,
  runner: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openAppearanceDb().then((db) => new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(APPEARANCE_IMAGE_STORE, mode);
    const store = transaction.objectStore(APPEARANCE_IMAGE_STORE);
    const request = runner(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  }));
}

export function getStoredAppearanceImage(key: string): Promise<StoredAppearanceImage | undefined> {
  return runImageStore("readonly", (store) => store.get(key));
}

export function saveStoredAppearanceImage(image: StoredAppearanceImage): Promise<string> {
  return runImageStore("readwrite", (store) => store.put(image)).then(() => image.key);
}

export function deleteStoredAppearanceImage(key: string): Promise<void> {
  return runImageStore("readwrite", (store) => store.delete(key)).then(() => undefined);
}

export function listStoredAppearanceImages(): Promise<StoredAppearanceImage[]> {
  return runImageStore("readonly", (store) => store.getAll());
}

