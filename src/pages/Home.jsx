import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Star, TrendingUp, Award, Play, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState('all');

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['movies', selectedGenre],
    queryFn: async () => {
      const allMovies = await base44.entities.Movie.list('-created_date', 100);
      if (selectedGenre === 'all') return allMovies;
      return allMovies.filter(m => m.genres?.includes(selectedGenre));
    }
  });

  const featuredMovies = movies.filter(m => m.is_featured);
  const trendingMovies = movies.filter(m => m.editorial_tags?.includes('Trending'));
  const criticallyAcclaimed = movies.filter(m => m.editorial_tags?.includes('Critically Acclaimed'));

  const genres = ['all', 'Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Sci-Fi', 'Romance', 'Documentary'];

  return (
    <div className="min-h-screen bg-[#0A0E17]">
      {/* Hero Section */}
      {featuredMovies.length > 0 && (
        <div className="relative h-[70vh] mb-12 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${featuredMovies[0].banner_url || featuredMovies[0].poster_url || 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200'})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/80 to-transparent" />
          </div>

          <div className="relative h-full flex items-end pb-16 px-12">
            <div className="max-w-3xl">
              <div className="flex gap-2 mb-4">
                {featuredMovies[0].editorial_tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[#F5C518] text-[#0A0E17] text-xs font-bold rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-lg">
                {featuredMovies[0].title}
              </h1>
              
              <div className="flex items-center gap-6 mb-6 text-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-[#F5C518] fill-[#F5C518]" />
                  <span className="font-bold text-white">{featuredMovies[0].rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-[#8B92A8]">({featuredMovies[0].rating_count || 0})</span>
                </div>
                <span className="text-[#8B92A8]">{featuredMovies[0].release_date?.split('-')[0]}</span>
                <span className="text-[#8B92A8]">{featuredMovies[0].runtime} min</span>
              </div>
              
              <p className="text-lg text-[#E8E8E8] mb-8 line-clamp-3">
                {featuredMovies[0].synopsis}
              </p>
              
              <div className="flex gap-4">
                <Link
                  to={createPageUrl(`MovieDetail?id=${featuredMovies[0].id}`)}
                  className="px-8 py-3 bg-[#F5C518] text-[#0A0E17] font-bold rounded-lg hover:bg-[#c79b00] transition-all flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  View Details
                </Link>
                <button className="px-8 py-3 bg-white/10 backdrop-blur text-white font-semibold rounded-lg hover:bg-white/20 transition-all flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add to List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Genre Filter */}
      <div className="mb-8 px-6">
        <div className="flex gap-3 overflow-x-auto pb-4">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-[#F5C518] text-[#0A0E17]'
                  : 'bg-[#1A1F2E] text-[#E8E8E8] hover:bg-[#2A3144]'
              }`}
            >
              {genre === 'all' ? 'All Genres' : genre}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Section */}
      {trendingMovies.length > 0 && (
        <MovieSection
          title="Trending Now"
          icon={TrendingUp}
          movies={trendingMovies}
          isLoading={isLoading}
        />
      )}

      {/* Critically Acclaimed */}
      {criticallyAcclaimed.length > 0 && (
        <MovieSection
          title="Critically Acclaimed"
          icon={Award}
          movies={criticallyAcclaimed}
          isLoading={isLoading}
        />
      )}

      {/* All Movies */}
      <MovieSection
        title={selectedGenre === 'all' ? 'All Movies' : `${selectedGenre} Movies`}
        movies={movies}
        isLoading={isLoading}
      />
    </div>
  );
}

function MovieSection({ title, icon: Icon, movies, isLoading }) {
  if (isLoading) {
    return (
      <div className="mb-12 px-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          {Icon && <Icon className="w-7 h-7 text-[#F5C518]" />}
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-lg bg-[#1A1F2E]" />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) return null;

  return (
    <div className="mb-12 px-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        {Icon && <Icon className="w-7 h-7 text-[#F5C518]" />}
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movies.map(movie => (
          <Link
            key={movie.id}
            to={createPageUrl(`MovieDetail?id=${movie.id}`)}
            className="group"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#1A1F2E] mb-3 shadow-xl">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8B92A8]">
                  <Play className="w-12 h-12" />
                </div>
              )}
              
              {movie.rating && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur rounded-md flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#F5C518] fill-[#F5C518]" />
                  <span className="text-sm font-bold text-white">{movie.rating.toFixed(1)}</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <Play className="w-10 h-10 text-[#F5C518]" />
              </div>
            </div>
            
            <h3 className="font-semibold text-[#E8E8E8] group-hover:text-[#F5C518] transition-colors line-clamp-2">
              {movie.title}
            </h3>
            <p className="text-sm text-[#8B92A8]">{movie.release_date?.split('-')[0]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
