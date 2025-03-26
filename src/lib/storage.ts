
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
const BLOB_STORAGE_PREFIX = 'pitchhouse_blob_';

// Convert Blob to Base64 string
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Convert Base64 string to Blob
const base64ToBlob = (base64: string): Blob => {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const byteString = atob(parts[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: contentType });
};

// Save video to localStorage
export const saveVideoToLocalStorage = async (video: PitchVideo): Promise<void> => {
  try {
    // Convert blob to base64
    const blobBase64 = await blobToBase64(video.blob);
    
    // Store the blob separately to avoid localStorage size limits
    localStorage.setItem(`${BLOB_STORAGE_PREFIX}${video.id}`, blobBase64);
    
    // Get existing videos
    const existingVideosJson = localStorage.getItem(STORAGE_KEY);
    const existingVideos: StoredPitch[] = existingVideosJson ? JSON.parse(existingVideosJson) : [];
    
    // Add new video without the blob (which is stored separately)
    const storedPitch: StoredPitch = {
      id: video.id,
      title: video.title,
      description: video.description,
      blobUrl: `${BLOB_STORAGE_PREFIX}${video.id}`,
      date: video.date
    };
    
    // Add to the beginning of the array (newest first)
    existingVideos.unshift(storedPitch);
    
    // Save updated list
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingVideos));
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving video to localStorage:', error);
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

// Get video blob from localStorage
export const getVideoBlob = (id: string): Blob | null => {
  const blobBase64 = localStorage.getItem(`${BLOB_STORAGE_PREFIX}${id}`);
  return blobBase64 ? base64ToBlob(blobBase64) : null;
};

// Create object URL for video
export const getVideoBlobUrl = (id: string): string | null => {
  const blob = getVideoBlob(id);
  return blob ? URL.createObjectURL(blob) : null;
};

// Delete video from localStorage
export const deleteVideo = (id: string): void => {
  // Remove the blob
  localStorage.removeItem(`${BLOB_STORAGE_PREFIX}${id}`);
  
  // Remove from the list
  const videos = getAllVideos();
  const updatedVideos = videos.filter(video => video.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVideos));
};

// Load sample videos if none exist (for demo purposes)
export const loadSampleVideosIfEmpty = (): void => {
  const videos = getAllVideos();
  
  if (videos.length === 0) {
    // This is just a placeholder - in a real app, you might load demo content
    // But we can't really preload video blobs easily
    console.log('No videos found - would load sample videos in a real app');
  }
};
