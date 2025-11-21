import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Star, Clock, Calendar, Users, Award, Plus, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function MovieDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('id');
  const [user, setUser] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const { data: movie, isLoading: movieLoading } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      const movies = await base44.entities.Movie.filter({ id: movieId });
      return movies[0];
    },
    enabled: !!movieId
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', movieId],
    queryFn: () => base44.entities.Review.filter({ movie_id: movieId, status: 'approved' }, '-created_date')
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data) => await base44.entities.Review.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', movieId]);
      setReviewText('');
      setRating(0);
    }
  });

  const handleSubmitReview = () => {
    if (!user) return;
    if (rating > 0 && reviewText.trim()) {
      submitReviewMutation.mutate({
        movie_id: movieId,
        user_email: user.email,
        rating: rating,
        content: reviewText,
        status: 'pending'
      });
    }
  };

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-[#0A0E17] p-6">
        <Skeleton className="w-full h-96 bg-[#1A1F2E] rounded-lg mb-6" />
        <Skeleton className="w-3/4 h-12 bg-[#1A1F2E] rounded mb-4" />
        <Skeleton className="w-full h-32 bg-[#1A1F2E] rounded" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#E8E8E8] mb-4">Movie Not Found</h1>
          <p className="text-[#8B92A8]">The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E17]">
      {/* Hero Banner */}
      <div className="relative h-[60vh] mb-8">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.banner_url || movie.poster_url || 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200'})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/70 to-transparent" />
        </div>

        <div className="relative h-full flex items-end pb-12 px-12">
          <div className="flex gap-8 items-end">
            <img
              src={movie.poster_url || 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400'}
              alt={movie.title}
              className="w-64 h-96 object-cover rounded-lg shadow-2xl"
            />
            <div>
              <h1 className="text-5xl font-bold mb-4 text-white">{movie.title}</h1>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-8 h-8 text-[#F5C518] fill-[#F5C518]" />
                  <span className="text-3xl font-bold text-white">{movie.rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-[#8B92A8] text-lg">/ 10</span>
                </div>
                <div className="flex items-center gap-2 text-[#8B92A8]">
                  <Users className="w-5 h-5" />
                  {movie.rating_count || 0} ratings
                </div>
              </div>
              <div className="flex gap-6 text-[#E8E8E8] mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#F5C518]" />
                  {movie.release_date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#F5C518]" />
                  {movie.runtime} min
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                {movie.genres?.map(genre => (
                  <span key={genre} className="px-3 py-1 bg-[#1A1F2E] border border-[#2A3144] rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
              {movie.editorial_tags?.length > 0 && (
                <div className="flex gap-2">
                  {movie.editorial_tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-[#F5C518] text-[#0A0E17] text-sm font-bold rounded-full flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-[#1A1F2E] border border-[#2A3144] mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="bg-[#1A1F2E] border-[#2A3144]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#E8E8E8]">Synopsis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#E8E8E8] leading-relaxed text-lg">
                  {movie.synopsis || 'No synopsis available.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cast">
            <Card className="bg-[#1A1F2E] border-[#2A3144]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#E8E8E8]">Cast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {movie.cast?.map((actor, idx) => (
                    <div key={idx} className="text-center">
                      <div className="w-24 h-24 rounded-full bg-[#2A3144] mx-auto mb-2 flex items-center justify-center">
                        <Users className="w-10 h-10 text-[#8B92A8]" />
                      </div>
                      <p className="font-semibold text-[#E8E8E8]">{actor}</p>
                    </div>
                  ))}
                </div>
                {(!movie.cast || movie.cast.length === 0) && (
                  <p className="text-[#8B92A8]">No cast information available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            {/* Write Review */}
            <Card className="bg-[#1A1F2E] border-[#2A3144] mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-[#E8E8E8]">Write a Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#E8E8E8]">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <button
                        key={num}
                        onClick={() => setRating(num)}
                        className={`w-10 h-10 rounded-lg font-bold transition-all ${
                          rating >= num
                            ? 'bg-[#F5C518] text-[#0A0E17]'
                            : 'bg-[#2A3144] text-[#8B92A8] hover:bg-[#3A4154]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Share your thoughts about this movie..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="min-h-32 bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
                />
                <Button
                  onClick={handleSubmitReview}
                  disabled={!rating || !reviewText.trim() || submitReviewMutation.isPending}
                  className="bg-[#F5C518] text-[#0A0E17] hover:bg-[#c79b00]"
                >
                  {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map(review => (
                <Card key={review.id} className="bg-[#1A1F2E] border-[#2A3144]">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-[#E8E8E8]">{review.user_email}</div>
                        <div className="text-sm text-[#8B92A8]">
                          {new Date(review.created_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-[#F5C518] text-[#0A0E17] rounded-full font-bold">
                        <Star className="w-4 h-4 fill-[#0A0E17]" />
                        {review.rating}/10
                      </div>
                    </div>
                    <p className="text-[#E8E8E8] leading-relaxed">{review.content}</p>
                    <div className="flex gap-4 mt-4">
                      <button className="flex items-center gap-2 text-[#8B92A8] hover:text-[#F5C518] transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        {review.likes || 0} Helpful
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {reviews.length === 0 && (
                <Card className="bg-[#1A1F2E] border-[#2A3144]">
                  <CardContent className="py-12 text-center">
                    <p className="text-[#8B92A8]">No reviews yet. Be the first to review!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
