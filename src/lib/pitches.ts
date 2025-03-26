
import { getAllVideos, getVideoBlobUrl } from './storage';

export interface Pitch {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  date: string;
  founder: {
    name: string;
    avatar: string;
  };
  stats: {
    likes: number;
    comments: number;
    views: number;
  };
  featured?: boolean;
}

// Default founder information when creating a new pitch
const DEFAULT_FOUNDER = {
  name: "Anonymous Founder",
  avatar: `https://avatar.vercel.sh/anonymous-${Math.floor(Math.random() * 1000)}.png`
};

// Get all pitches from storage and format them for display
export const getAllPitches = (): Pitch[] => {
  const storedVideos = getAllVideos();
  
  return storedVideos.map(video => {
    const videoUrl = getVideoBlobUrl(video.id) || '';
    
    // Create a Pitch object from the stored video
    return {
      id: video.id,
      title: video.title,
      description: video.description || '',
      videoUrl,
      date: video.date,
      founder: DEFAULT_FOUNDER,
      stats: {
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 10),
        views: Math.floor(Math.random() * 200) + 50
      },
      featured: Math.random() > 0.8 // Random featured status (20% chance)
    };
  });
};

// Get a specific pitch by ID
export const getPitchById = (id: string): Pitch | undefined => {
  const allPitches = getAllPitches();
  return allPitches.find(pitch => pitch.id === id);
};

// Like a pitch (increment likes count)
export const likePitch = (id: string): void => {
  // This would require more complex storage logic
  // For now, we'll just log it
  console.log(`Liked pitch: ${id}`);
};

// Get featured pitches
export const getFeaturedPitches = (): Pitch[] => {
  const allPitches = getAllPitches();
  return allPitches.filter(pitch => pitch.featured);
};

// Get trending pitches (most likes)
export const getTrendingPitches = (): Pitch[] => {
  const allPitches = getAllPitches();
  return [...allPitches].sort((a, b) => b.stats.likes - a.stats.likes);
};

// Get newest pitches (by date)
export const getNewestPitches = (): Pitch[] => {
  const allPitches = getAllPitches();
  return [...allPitches].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
