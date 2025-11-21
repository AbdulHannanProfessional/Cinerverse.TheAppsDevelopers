import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, CheckCircle, XCircle, Flag, 
  TrendingUp, BarChart3, AlertTriangle
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function ContentModeration() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['all-reviews'],
    queryFn: () => base44.entities.Review.list('-created_date')
  });

  const { data: graphs = [], isLoading: graphsLoading } = useQuery({
    queryKey: ['all-graphs'],
    queryFn: () => base44.entities.Graph.list('-created_date')
  });

  const { data: collections = [], isLoading: collectionsLoading } = useQuery({
    queryKey: ['all-collections'],
    queryFn: () => base44.entities.Collection.list('-created_date')
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['all-reports'],
    queryFn: () => base44.entities.Report.list('-created_date')
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Review.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['all-reviews']);
      setDialogOpen(false);
      setSelectedItem(null);
      setRejectionReason('');
    }
  });

  const updateGraphMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Graph.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['all-graphs']);
      setDialogOpen(false);
      setSelectedItem(null);
    }
  });

  const updateCollectionMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Collection.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['all-collections']);
    }
  });

  const handleApprove = (item, type) => {
    if (type === 'review') {
      updateReviewMutation.mutate({ id: item.id, data: { status: 'approved' } });
    } else if (type === 'graph') {
      updateGraphMutation.mutate({ id: item.id, data: { status: 'approved' } });
    } else if (type === 'collection') {
      updateCollectionMutation.mutate({ id: item.id, data: { status: 'approved' } });
    }
  };

  const handleReject = (item, type) => {
    setSelectedItem({ ...item, type });
    setDialogOpen(true);
  };

  const confirmReject = () => {
    if (selectedItem.type === 'review') {
      updateReviewMutation.mutate({
        id: selectedItem.id,
        data: { status: 'rejected', moderation_reason: rejectionReason }
      });
    } else if (selectedItem.type === 'graph') {
      updateGraphMutation.mutate({
        id: selectedItem.id,
        data: { status: 'rejected', moderation_reason: rejectionReason }
      });
    } else if (selectedItem.type === 'collection') {
      updateCollectionMutation.mutate({
        id: selectedItem.id,
        data: { status: 'rejected' }
      });
    }
  };

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const pendingGraphs = graphs.filter(g => g.status === 'pending');
  const pendingCollections = collections.filter(c => c.status === 'pending');
  const pendingReports = reports.filter(r => r.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#E8E8E8] mb-2">Content Moderation</h1>
        <p className="text-[#8B92A8]">Review and moderate user-generated content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Pending Reviews"
          value={pendingReviews.length}
          icon={MessageSquare}
          color="text-yellow-400"
        />
        <StatCard
          label="Pending Graphs"
          value={pendingGraphs.length}
          icon={TrendingUp}
          color="text-blue-400"
        />
        <StatCard
          label="Pending Collections"
          value={pendingCollections.length}
          icon={BarChart3}
          color="text-purple-400"
        />
        <StatCard
          label="Active Reports"
          value={pendingReports.length}
          icon={AlertTriangle}
          color="text-red-400"
        />
      </div>

      {/* Moderation Queue */}
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="bg-[#1A1F2E] border border-[#2A3144]">
          <TabsTrigger value="reviews">
            Reviews ({pendingReviews.length})
          </TabsTrigger>
          <TabsTrigger value="graphs">
            Graphs ({pendingGraphs.length})
          </TabsTrigger>
          <TabsTrigger value="collections">
            Collections ({pendingCollections.length})
          </TabsTrigger>
          <TabsTrigger value="reports">
            Reports ({pendingReports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <Card className="bg-[#1A1F2E] border-[#2A3144]">
            <CardHeader>
              <CardTitle className="text-[#E8E8E8]">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-32 bg-[#2A3144]" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingReviews.map(review => (
                    <div
                      key={review.id}
                      className="p-4 bg-[#131720] rounded-lg border border-[#2A3144]"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[#E8E8E8]">{review.user_email}</span>
                            <Badge className="bg-[#F5C518] text-[#0A0E17]">
                              {review.rating}/10
                            </Badge>
                          </div>
                          <p className="text-sm text-[#8B92A8]">
                            {new Date(review.created_date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-[#E8E8E8] mb-4">{review.content}</p>
                      {review.sentiment_score && (
                        <div className="mb-4">
                          <span className="text-sm text-[#8B92A8]">
                            Sentiment Score: {review.sentiment_score.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(review, 'review')}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(review, 'review')}
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingReviews.length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <p className="text-[#8B92A8]">No pending reviews</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graphs">
          <Card className="bg-[#1A1F2E] border-[#2A3144]">
            <CardHeader>
              <CardTitle className="text-[#E8E8E8]">Pending Graphs</CardTitle>
            </CardHeader>
            <CardContent>
              {graphsLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-32 bg-[#2A3144]" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingGraphs.map(graph => (
                    <div
                      key={graph.id}
                      className="p-4 bg-[#131720] rounded-lg border border-[#2A3144]"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[#E8E8E8]">{graph.user_email}</span>
                            <Badge className="bg-blue-500/20 text-blue-400">
                              {graph.graph_type}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#8B92A8]">
                            {new Date(graph.created_date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-[#8B92A8] mb-4">
                        {graph.data_points?.length || 0} data points
                      </p>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(graph, 'graph')}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(graph, 'graph')}
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingGraphs.length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <p className="text-[#8B92A8]">No pending graphs</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections">
          <Card className="bg-[#1A1F2E] border-[#2A3144]">
            <CardHeader>
              <CardTitle className="text-[#E8E8E8]">Pending Collections</CardTitle>
            </CardHeader>
            <CardContent>
              {collectionsLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-32 bg-[#2A3144]" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCollections.map(collection => (
                    <div
                      key={collection.id}
                      className="p-4 bg-[#131720] rounded-lg border border-[#2A3144]"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-[#E8E8E8] mb-1">{collection.name}</h3>
                          <p className="text-sm text-[#8B92A8]">
                            By {collection.user_email} • {collection.movie_ids?.length || 0} movies
                          </p>
                        </div>
                      </div>
                      <p className="text-[#E8E8E8] mb-4">{collection.description}</p>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(collection, 'collection')}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(collection, 'collection')}
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingCollections.length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <p className="text-[#8B92A8]">No pending collections</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="bg-[#1A1F2E] border-[#2A3144]">
            <CardHeader>
              <CardTitle className="text-[#E8E8E8]">Active Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingReports.map(report => (
                  <div
                    key={report.id}
                    className="p-4 bg-[#131720] rounded-lg border border-[#2A3144]"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Flag className="w-4 h-4 text-red-400" />
                          <span className="font-semibold text-[#E8E8E8]">
                            {report.content_type} Report
                          </span>
                          <Badge className="bg-red-500/20 text-red-400">
                            {report.reason}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#8B92A8]">
                          Reported by {report.reporter_email}
                        </p>
                      </div>
                    </div>
                    <p className="text-[#E8E8E8] mb-4">{report.description}</p>
                    <div className="text-sm text-[#8B92A8]">
                      Content ID: {report.content_id}
                    </div>
                  </div>
                ))}
                {pendingReports.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-[#8B92A8]">No active reports</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rejection Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1F2E] border-[#2A3144] text-[#E8E8E8]">
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription className="text-[#8B92A8]">
              Please provide a reason for rejection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-32 bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-[#2A3144] text-[#E8E8E8]"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmReject}
                disabled={!rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
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
