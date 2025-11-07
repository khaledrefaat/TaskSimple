// lib/indexeddb.ts
export const DB_NAME = 'TaskSimple';
export const DB_VERSION = 1;

export const STORES = {
  PROJECTS: 'projects',
  TODOS: 'todos',
} as const;

export interface IDBProject {
  id: string;
  name: string;
  color: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface IDBTodo {
  id: string;
  projectId: string;
  title: string;
  isCompleted: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
}

// Initialize IndexedDB database
function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
        db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.TODOS)) {
        db.createObjectStore(STORES.TODOS, { keyPath: 'id' });
      }
    };
  });
}

// Generic put operation
export async function put<T>(store: string, item: T): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([store], 'readwrite');
    const request = tx.objectStore(store).put(item);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Generic get operation
export async function get<T>(
  store: string,
  key: string
): Promise<T | undefined> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([store], 'readonly');
    const request = tx.objectStore(store).get(key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Generic getAll operation
export async function getAll<T>(store: string): Promise<T[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([store], 'readonly');
    const request = tx.objectStore(store).getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Generic delete operation
export async function del(store: string, key: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([store], 'readwrite');
    const request = tx.objectStore(store).delete(key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Get todos by project
export async function getTodosByProject(projectId: string): Promise<IDBTodo[]> {
  const todos = await getAll<IDBTodo>(STORES.TODOS);
  return todos.filter((t) => t.projectId === projectId);
}
