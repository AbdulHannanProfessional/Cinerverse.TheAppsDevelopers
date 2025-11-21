import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, Clapperboard, MessageSquare, AlertTriangle, 
  TrendingUp, Activity, CheckCircle, XCircle 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { data: movies = [], isLoading: moviesLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: () => base44.entities.Movie.list()
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list()
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => base44.entities.Review.list()
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['reports'],
    queryFn: () => base44.entities.Report.list()
  });

  const { data: ingestionLogs = [] } = useQuery({
    queryKey: ['ingestion-logs'],
    queryFn: () => base44.entities.IngestionLog.list('-created_date', 10)
  });

  const { data: mlMetrics = [] } = useQuery({
    queryKey: ['ml-metrics'],
    queryFn: () => base44.entities.MLMetric.list('-created_date', 5)
  });

  const stats = {
    totalMovies: movies.length,
    totalUsers: users.length,
    pendingReviews: reviews.filter(r => r.status === 'pending').length,
    activeReports: reports.filter(r => r.status === 'pending').length,
    activeUsers: users.filter(u => u.status === 'active').length,
    bannedUsers: users.filter(u => u.status === 'banned').length,
    featuredMovies: movies.filter(m => m.is_featured).length
  };

  const recentActivity = [
    { date: 'Mon', reviews: 12, users: 8 },
    { date: 'Tue', reviews: 19, users: 15 },
    { date: 'Wed', reviews: 15, users: 12 },
    { date: 'Thu', reviews: 25, users: 20 },
    { date: 'Fri', reviews: 22, users: 18 },
    { date: 'Sat', reviews: 30, users: 25 },
    { date: 'Sun', reviews: 28, users: 22 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#E8E8E8] mb-2">Admin Dashboard</h1>
        <p className="text-[#8B92A8]">Overview of your platform's performance and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Movies"
          value={stats.totalMovies}
          icon={Clapperboard}
          color="bg-blue-500"
          isLoading={moviesLoading}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-green-500"
          isLoading={usersLoading}
        />
        <StatCard
          title="Pending Reviews"
          value={stats.pendingReviews}
          icon={MessageSquare}
          color="bg-yellow-500"
          isLoading={reviewsLoading}
        />
        <StatCard
          title="Active Reports"
          value={stats.activeReports}
          icon={AlertTriangle}
          color="bg-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1A1F2E] border-[#2A3144]">
          <CardHeader>
            <CardTitle className="text-[#E8E8E8] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#F5C518]" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={recentActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3144" />
                <XAxis dataKey="date" stroke="#8B92A8" />
                <YAxis stroke="#8B92A8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131720', border: '1px solid #2A3144', borderRadius: '8px' }}
                  labelStyle={{ color: '#E8E8E8' }}
                />
                <Line type="monotone" dataKey="reviews" stroke="#F5C518" strokeWidth={2} />
                <Line type="monotone" dataKey="users" stroke="#00D9FF" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1F2E] border-[#2A3144]">
          <CardHeader>
            <CardTitle className="text-[#E8E8E8] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#F5C518]" />
              User Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: 'Active', count: stats.activeUsers },
                { name: 'Banned', count: stats.bannedUsers },
                { name: 'Suspended', count: users.filter(u => u.status === 'suspended').length }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3144" />
                <XAxis dataKey="name" stroke="#8B92A8" />
                <YAxis stroke="#8B92A8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131720', border: '1px solid #2A3144', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#F5C518" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Ingestion Logs */}
      <Card className="bg-[#1A1F2E] border-[#2A3144]">
        <CardHeader>
          <CardTitle className="text-[#E8E8E8]">Recent Ingestion Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ingestionLogs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-[#131720] rounded-lg border border-[#2A3144]">
                <div className="flex items-center gap-4">
                  {log.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-semibold text-[#E8E8E8]">{log.source}</p>
                    <p className="text-sm text-[#8B92A8]">
                      {log.records_processed} records • {log.processing_time}s
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    log.status === 'success' 
                      ? 'bg-green-500/20 text-green-400'
                      : log.status === 'partial'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
            {ingestionLogs.length === 0 && (
              <p className="text-center text-[#8B92A8] py-8">No ingestion logs available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ML Metrics */}
      <Card className="bg-[#1A1F2E] border-[#2A3144]">
        <CardHeader>
          <CardTitle className="text-[#E8E8E8]">ML Pipeline Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mlMetrics.map(metric => (
              <div key={metric.id} className="p-4 bg-[#131720] rounded-lg border border-[#2A3144]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-[#E8E8E8]">{metric.model_name}</p>
                    <p className="text-sm text-[#8B92A8]">{metric.metric_type}</p>
                  </div>
                  {metric.retrain_suggested && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded">
                      Retrain Suggested
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  {metric.accuracy && (
                    <div>
                      <p className="text-xs text-[#8B92A8]">Accuracy</p>
                      <p className="text-lg font-bold text-[#F5C518]">{(metric.accuracy * 100).toFixed(1)}%</p>
                    </div>
                  )}
                  {metric.drift_score && (
                    <div>
                      <p className="text-xs text-[#8B92A8]">Drift Score</p>
                      <p className="text-lg font-bold text-[#E8E8E8]">{metric.drift_score.toFixed(3)}</p>
                    </div>
                  )}
                  {metric.samples_processed && (
                    <div>
                      <p className="text-xs text-[#8B92A8]">Samples</p>
                      <p className="text-lg font-bold text-[#E8E8E8]">{metric.samples_processed}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {mlMetrics.length === 0 && (
              <p className="text-center text-[#8B92A8] py-8">No ML metrics available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-[#1A1F2E] border-[#2A3144]">
        <CardContent className="pt-6">
          <Skeleton className="h-20 bg-[#2A3144]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1A1F2E] border-[#2A3144] hover:border-[#F5C518] transition-all">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-[#8B92A8] mb-1">{title}</p>
            <p className="text-3xl font-bold text-[#E8E8E8]">{value}</p>
          </div>
          <div className={`p-3 ${color} bg-opacity-20 rounded-lg`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
