
interface PitchVideo {
  id: string;
  title: string;
  description: string;
  blob: Blob;
  date: string;
}

interface StoredPitch {
  id: string;
  title: string;
  description: string;
  blobUrl: string;
  date: string;
}

// Storage key for localStorage
const STORAGE_KEY = 'pitchhouse_videos';
const DB_NAME = 'pitchhouse_db';
const BLOB_STORE = 'video_blobs';
const DB_VERSION = 1;

// Initialize the IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject("Could not open IndexedDB");
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(BLOB_STORE)) {
        db.createObjectStore(BLOB_STORE, { keyPath: 'id' });
      }
    };
  });
};

// Save video blob to IndexedDB
const saveVideoBlob = async (id: string, blob: Blob): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([BLOB_STORE], 'readwrite');
      const store = transaction.objectStore(BLOB_STORE);
      
      const request = store.put({ id, blob });
      
      request.onsuccess = () => resolve();
      request.onerror = (e) => {
        console.error("Error saving blob to IndexedDB:", e);
        reject(e);
      };
    });
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
    throw error;
  }
};

// Get video blob from IndexedDB
const getVideoBlob = async (id: string): Promise<Blob | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([BLOB_STORE], 'readonly');
      const store = transaction.objectStore(BLOB_STORE);
      
      const request = store.get(id);
      
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.blob);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = (e) => {
        console.error("Error retrieving blob from IndexedDB:", e);
        reject(e);
      };
    });
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
    return null;
  }
};

// Delete video blob from IndexedDB
const deleteVideoBlob = async (id: string): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([BLOB_STORE], 'readwrite');
      const store = transaction.objectStore(BLOB_STORE);
      
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = (e) => {
        console.error("Error deleting blob from IndexedDB:", e);
        reject(e);
      };
    });
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
    throw error;
  }
};

// Save video to IndexedDB and metadata to localStorage
export const saveVideoToLocalStorage = async (video: PitchVideo): Promise<void> => {
  try {
    // Store video blob in IndexedDB
    await saveVideoBlob(video.id, video.blob);
    
    // Get existing videos metadata
    const existingVideosJson = localStorage.getItem(STORAGE_KEY);
    const existingVideos: StoredPitch[] = existingVideosJson ? JSON.parse(existingVideosJson) : [];
    
    // Add new video metadata (without the blob)
    const storedPitch: StoredPitch = {
      id: video.id,
      title: video.title,
      description: video.description,
      blobUrl: video.id, // Just store the ID, we'll fetch from IndexedDB
      date: video.date
    };
    
    // Add to the beginning of the array (newest first)
    existingVideos.unshift(storedPitch);
    
    // Save updated list
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingVideos));
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving video:', error);
    return Promise.reject(error);
  }
};

// Get all videos from localStorage
export const getAllVideos = (): StoredPitch[] => {
  const videosJson = localStorage.getItem(STORAGE_KEY);
  return videosJson ? JSON.parse(videosJson) : [];
};

// Get a specific video from localStorage
export const getVideo = (id: string): StoredPitch | null => {
  const videos = getAllVideos();
  return videos.find(video => video.id === id) || null;
};

// Get video blob URL
export const getVideoBlobUrl = async (id: string): Promise<string | null> => {
  const blob = await getVideoBlob(id);
  return blob ? URL.createObjectURL(blob) : null;
};

// Synchronous version for compatibility with existing code
export const getVideoBlobUrlSync = (id: string): string | null => {
  // Return a placeholder that will be replaced when the real URL is available
  return `pending-${id}`;
};

// Delete video
export const deleteVideo = async (id: string): Promise<void> => {
  // Remove blob from IndexedDB
  await deleteVideoBlob(id);
  
  // Remove metadata from localStorage
  const videos = getAllVideos();
  const updatedVideos = videos.filter(video => video.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVideos));
};

// Load sample videos if none exist (for demo purposes)
export const loadSampleVideosIfEmpty = (): void => {
  const videos = getAllVideos();
  
  if (videos.length === 0) {
    console.log('No videos found - would load sample videos in a real app');
  }
};
