
import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MessageSquare, Eye, Award } from 'lucide-react';
import { VideoPlayer } from '@/components/ui/video-player';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PitchCardProps {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  posterUrl?: string;
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
  className?: string;
}

const PitchCard = ({
  id,
  title,
  description,
  videoUrl,
  posterUrl,
  founder,
  stats,
  featured = false,
  className
}: PitchCardProps) => {
  return (
    <div className={cn(
      "glass-card rounded-xl overflow-hidden card-hover",
      featured && "ring-2 ring-blue-500/50",
      className
    )}>
      {/* Video */}
      <div className="aspect-video relative">
        <VideoPlayer 
          src={videoUrl} 
          poster={posterUrl}
        />
        
        {featured && (
          <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <Award className="h-3 w-3 mr-1" />
            Featured
          </div>
        )}
      </div>
      
      <div className="p-5">
        {/* Title and description */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
        
        {/* Founder info */}
        <div className="flex items-center mb-4">
          <img 
            src={founder.avatar} 
            alt={founder.name}
            className="h-8 w-8 rounded-full object-cover mr-2"
          />
          <span className="text-sm font-medium">{founder.name}</span>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-muted-foreground text-sm">
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{stats.likes}</span>
            </div>
            
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{stats.comments}</span>
            </div>
            
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{stats.views}</span>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <ThumbsUp className="h-4 w-4 mr-2" />
            Support
          </Button>
          
          <Button asChild size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600">
            <Link to={`/pitch/${id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PitchCard;
