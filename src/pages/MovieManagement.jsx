import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Plus, Edit, Trash2, Star, TrendingUp, 
  Award, Upload, Calendar, Clock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function MovieManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: () => base44.entities.Movie.list('-created_date')
  });

  const createMovieMutation = useMutation({
    mutationFn: (data) => base44.entities.Movie.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['movies']);
      setDialogOpen(false);
      setSelectedMovie(null);
    }
  });

  const updateMovieMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Movie.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['movies']);
      setDialogOpen(false);
      setSelectedMovie(null);
    }
  });

  const deleteMovieMutation = useMutation({
    mutationFn: (id) => base44.entities.Movie.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['movies']);
    }
  });

  const filteredMovies = movies.filter(movie =>
    movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setSelectedMovie({
      title: '',
      synopsis: '',
      runtime: 0,
      release_date: '',
      genres: [],
      cast: [],
      status: 'active',
      is_featured: false,
      editorial_tags: []
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleEdit = (movie) => {
    setSelectedMovie({ ...movie });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedMovie.id) {
      const { id, created_date, updated_date, created_by, ...updateData } = selectedMovie;
      updateMovieMutation.mutate({ id, data: updateData });
    } else {
      createMovieMutation.mutate(selectedMovie);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      deleteMovieMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#E8E8E8] mb-2">Movie Management</h1>
          <p className="text-[#8B92A8]">Manage your movie database and metadata</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-[#F5C518] text-[#0A0E17] hover:bg-[#c79b00] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Movie
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Movies"
          value={movies.length}
          icon={Star}
          color="text-blue-400"
        />
        <StatCard
          label="Featured"
          value={movies.filter(m => m.is_featured).length}
          icon={Award}
          color="text-yellow-400"
        />
        <StatCard
          label="Active"
          value={movies.filter(m => m.status === 'active').length}
          icon={TrendingUp}
          color="text-green-400"
        />
        <StatCard
          label="Draft"
          value={movies.filter(m => m.status === 'draft').length}
          icon={Edit}
          color="text-gray-400"
        />
      </div>

      {/* Search */}
      <Card className="bg-[#1A1F2E] border-[#2A3144]">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B92A8]" />
            <Input
              placeholder="Search movies by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Movies List */}
      <Card className="bg-[#1A1F2E] border-[#2A3144]">
        <CardHeader>
          <CardTitle className="text-[#E8E8E8]">
            Movies ({filteredMovies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-32 bg-[#2A3144]" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMovies.map(movie => (
                <div
                  key={movie.id}
                  className="p-4 bg-[#131720] rounded-lg border border-[#2A3144] hover:border-[#F5C518] transition-all"
                >
                  <div className="flex gap-4">
                    <img
                      src={movie.poster_url || 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300'}
                      alt={movie.title}
                      className="w-24 h-36 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-[#E8E8E8] mb-1">{movie.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-[#8B92A8]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {movie.release_date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {movie.runtime} min
                            </span>
                            {movie.rating && (
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-[#F5C518] fill-[#F5C518]" />
                                {movie.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(movie)}
                            className="text-[#8B92A8] hover:text-[#F5C518]"
                          >
                            <Edit className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(movie.id)}
                            className="text-[#8B92A8] hover:text-red-400"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-[#E8E8E8] text-sm mb-3 line-clamp-2">
                        {movie.synopsis}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {movie.is_featured && (
                          <Badge className="bg-[#F5C518] text-[#0A0E17]">
                            <Award className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge
                          className={
                            movie.status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : movie.status === 'draft'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }
                        >
                          {movie.status}
                        </Badge>
                        {movie.genres?.slice(0, 3).map(genre => (
                          <Badge key={genre} variant="outline" className="border-[#2A3144] text-[#8B92A8]">
                            {genre}
                          </Badge>
                        ))}
                        {movie.editorial_tags?.map(tag => (
                          <Badge key={tag} className="bg-[#00D9FF]/20 text-[#00D9FF]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredMovies.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[#8B92A8]">No movies found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Movie Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1F2E] border-[#2A3144] text-[#E8E8E8] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMovie?.id ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
          </DialogHeader>
          {selectedMovie && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm text-[#8B92A8] mb-2 block">Title</label>
                  <Input
                    value={selectedMovie.title}
                    onChange={(e) => setSelectedMovie({...selectedMovie, title: e.target.value})}
                    className="bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#8B92A8] mb-2 block">Release Date</label>
                  <Input
                    type="date"
                    value={selectedMovie.release_date}
                    onChange={(e) => setSelectedMovie({...selectedMovie, release_date: e.target.value})}
                    className="bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#8B92A8] mb-2 block">Runtime (minutes)</label>
                  <Input
                    type="number"
                    value={selectedMovie.runtime}
                    onChange={(e) => setSelectedMovie({...selectedMovie, runtime: parseInt(e.target.value)})}
                    className="bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#8B92A8] mb-2 block">Status</label>
                  <Select
                    value={selectedMovie.status}
                    onValueChange={(value) => setSelectedMovie({...selectedMovie, status: value})}
                  >
                    <SelectTrigger className="bg-[#131720] border-[#2A3144]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-[#8B92A8] mb-2 block">Poster URL</label>
                  <Input
                    value={selectedMovie.poster_url || ''}
                    onChange={(e) => setSelectedMovie({...selectedMovie, poster_url: e.target.value})}
                    placeholder="https://..."
                    className="bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-[#8B92A8] mb-2 block">Synopsis</label>
                  <Textarea
                    value={selectedMovie.synopsis}
                    onChange={(e) => setSelectedMovie({...selectedMovie, synopsis: e.target.value})}
                    className="min-h-32 bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#8B92A8] mb-2 block">Genres (comma separated)</label>
                  <Input
                    value={selectedMovie.genres?.join(', ') || ''}
                    onChange={(e) => setSelectedMovie({...selectedMovie, genres: e.target.value.split(',').map(g => g.trim())})}
                    placeholder="Action, Drama, Thriller"
                    className="bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#8B92A8] mb-2 block">Cast (comma separated)</label>
                  <Input
                    value={selectedMovie.cast?.join(', ') || ''}
                    onChange={(e) => setSelectedMovie({...selectedMovie, cast: e.target.value.split(',').map(c => c.trim())})}
                    placeholder="Actor 1, Actor 2"
                    className="bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedMovie.is_featured}
                    onChange={(e) => setSelectedMovie({...selectedMovie, is_featured: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label className="text-sm text-[#E8E8E8]">Featured Movie</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="border-[#2A3144] text-[#E8E8E8]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={createMovieMutation.isPending || updateMovieMutation.isPending}
                  className="bg-[#F5C518] text-[#0A0E17] hover:bg-[#c79b00]"
                >
                  {createMovieMutation.isPending || updateMovieMutation.isPending ? 'Saving...' : 'Save Movie'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <Card className="bg-[#1A1F2E] border-[#2A3144]">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#8B92A8] mb-1">{label}</p>
            <p className="text-2xl font-bold text-[#E8E8E8]">{value}</p>
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
}
