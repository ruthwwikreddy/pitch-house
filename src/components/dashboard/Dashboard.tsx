
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PitchCard from './PitchCard';
import { Plus, TrendingUp, Clock, Award, Search } from 'lucide-react';
import { 
  getAllPitches, 
  getTrendingPitches, 
  getNewestPitches, 
  getFeaturedPitches,
  Pitch
} from '@/lib/pitches';

type FilterType = 'trending' | 'newest' | 'featured' | 'all';

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pitches, setPitches] = useState<Pitch[]>([]);

  // Load pitches on component mount and when filter changes
  useEffect(() => {
    let filteredPitches: Pitch[];
    
    // Apply category filter
    if (activeFilter === 'featured') {
      filteredPitches = getFeaturedPitches();
    } else if (activeFilter === 'trending') {
      filteredPitches = getTrendingPitches();
    } else if (activeFilter === 'newest') {
      filteredPitches = getNewestPitches();
    } else {
      filteredPitches = getAllPitches();
    }
    
    // Apply search filter if needed
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPitches = filteredPitches.filter(
        pitch => 
          pitch.title.toLowerCase().includes(query) || 
          pitch.description.toLowerCase().includes(query)
      );
    }
    
    setPitches(filteredPitches);
  }, [activeFilter, searchQuery]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Discover Pitches</h1>
          <p className="text-muted-foreground">
            Find innovative startups and support founders building the future.
          </p>
        </div>
        
        <Button asChild className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 button-animated">
          <Link to="/upload">
            <Plus className="mr-2 h-4 w-4" />
            Create Your Pitch
          </Link>
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search pitches..."
              className="w-full pl-10 py-2 pr-4 rounded-lg border border-input bg-background h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('all')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              All
            </Button>
            <Button 
              variant={activeFilter === 'trending' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('trending')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <TrendingUp className="mr-1 h-4 w-4" />
              Trending
            </Button>
            <Button 
              variant={activeFilter === 'newest' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('newest')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Clock className="mr-1 h-4 w-4" />
              Newest
            </Button>
            <Button 
              variant={activeFilter === 'featured' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('featured')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Award className="mr-1 h-4 w-4" />
              Featured
            </Button>
          </div>
        </div>
      </div>
      
      {/* Pitch grid */}
      {pitches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pitches.map((pitch) => (
            <PitchCard
              key={pitch.id}
              id={pitch.id}
              title={pitch.title}
              description={pitch.description}
              videoUrl={pitch.videoUrl}
              founder={pitch.founder}
              stats={pitch.stats}
              featured={pitch.featured}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">No pitches found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filters, or create your own pitch.
          </p>
          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link to="/upload">
              <Plus className="mr-2 h-4 w-4" />
              Create Your Pitch
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
