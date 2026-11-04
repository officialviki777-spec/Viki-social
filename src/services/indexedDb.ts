/**
 * IndexedDB storage engine for Viki Social
 * Handles persistent storage of accounts, high-resolution gallery photos, videos, stories, and chats.
 */

const DB_NAME = 'VikiSocialDB';
const DB_VERSION = 1;

export class StorageEngine {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Media blobs store for real phone gallery photos & videos
        if (!db.objectStoreNames.contains('media')) {
          db.createObjectStore('media', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveMedia(id: string, file: Blob | File): Promise<string> {
    try {
      const db = await this.dbPromise;
      return new Promise((resolve, reject) => {
        const tx = db.transaction('media', 'readwrite');
        const store = tx.objectStore('media');
        const req = store.put({ id, data: file, mimeType: file.type });
        req.onsuccess = () => {
          // Create an object URL for instant, zero-copy high performance display
          const url = URL.createObjectURL(file);
          resolve(url);
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Fallback to data URL if IndexedDB is blocked
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  async getMediaUrl(id: string): Promise<string | null> {
    try {
      const db = await this.dbPromise;
      return new Promise((resolve, reject) => {
        const tx = db.transaction('media', 'readonly');
        const store = tx.objectStore('media');
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result && req.result.data) {
            const url = URL.createObjectURL(req.result.data);
            resolve(url);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  }
}

export const mediaStorage = new StorageEngine();
