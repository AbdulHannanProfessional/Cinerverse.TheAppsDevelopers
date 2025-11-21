import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, AlertTriangle, Info, AlertCircle, XCircle,
  Plus, Send, Trash2, CheckCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [newNotification, setNewNotification] = useState({
    type: 'info',
    title: '',
    message: '',
    severity: 'info'
  });
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['all-notifications'],
    queryFn: () => base44.entities.Notification.list('-created_date')
  });

  const createNotificationMutation = useMutation({
    mutationFn: (data) => base44.entities.Notification.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['all-notifications']);
      setDialogOpen(false);
      setNewNotification({
        type: 'info',
        title: '',
        message: '',
        severity: 'info'
      });
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['all-notifications']);
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['all-notifications']);
    }
  });

  const filteredNotifications = selectedType === 'all' 
    ? notifications 
    : notifications.filter(n => n.severity === selectedType);

  const severityIcons = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    critical: XCircle
  };

  const severityColors = {
    info: 'bg-blue-500/20 text-blue-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
    critical: 'bg-red-600/20 text-red-500'
  };

  const handleCreateNotification = () => {
    if (newNotification.title && newNotification.message) {
      createNotificationMutation.mutate(newNotification);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      deleteNotificationMutation.mutate(id);
    }
  };

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    critical: notifications.filter(n => n.severity === 'critical').length,
    warnings: notifications.filter(n => n.severity === 'warning').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#E8E8E8] mb-2">Notification Management</h1>
          <p className="text-[#8B92A8]">Monitor system alerts and send notifications</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[#F5C518] text-[#0A0E17] hover:bg-[#c79b00] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Notification
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Notifications"
          value={stats.total}
          icon={Bell}
          color="text-blue-400"
        />
        <StatCard
          label="Unread"
          value={stats.unread}
          icon={AlertCircle}
          color="text-purple-400"
        />
        <StatCard
          label="Critical"
          value={stats.critical}
          icon={XCircle}
          color="text-red-400"
        />
        <StatCard
          label="Warnings"
          value={stats.warnings}
          icon={AlertTriangle}
          color="text-yellow-400"
        />
      </div>

      {/* Filters */}
      <Card className="bg-[#1A1F2E] border-[#2A3144]">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <label className="text-sm text-[#8B92A8]">Filter by Severity:</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48 bg-[#131720] border-[#2A3144] text-[#E8E8E8]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card className="bg-[#1A1F2E] border-[#2A3144]">
        <CardHeader>
          <CardTitle className="text-[#E8E8E8]">
            Notifications ({filteredNotifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-24 bg-[#2A3144]" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map(notification => {
                const SeverityIcon = severityIcons[notification.severity];
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all ${
                      notification.read 
                        ? 'bg-[#131720] border-[#2A3144]'
                        : 'bg-[#1A1F2E] border-[#F5C518]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className={`p-3 rounded-lg ${severityColors[notification.severity]}`}>
                          <SeverityIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-[#E8E8E8]">
                              {notification.title}
                            </h3>
                            <Badge className={severityColors[notification.severity]}>
                              {notification.severity}
                            </Badge>
                            <Badge variant="outline" className="border-[#2A3144] text-[#8B92A8]">
                              {notification.type}
                            </Badge>
                            {!notification.read && (
                              <Badge className="bg-[#F5C518] text-[#0A0E17]">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-[#E8E8E8] mb-2">
                            {notification.message}
                          </p>
                          <p className="text-sm text-[#8B92A8]">
                            {new Date(notification.created_date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                            className="text-[#8B92A8] hover:text-[#F5C518]"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(notification.id)}
                          className="text-[#8B92A8] hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredNotifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-[#8B92A8] mx-auto mb-3" />
                  <p className="text-[#8B92A8]">No notifications found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card className="bg-[#1A1F2E] border-[#2A3144]">
        <CardHeader>
          <CardTitle className="text-[#E8E8E8]">Automated Alert Triggers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-[#131720] rounded-lg border border-[#2A3144]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[#E8E8E8]">Ingestion Failure Alert</h4>
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>
              <p className="text-sm text-[#8B92A8]">
                Trigger when data ingestion fails 3 times consecutively
              </p>
            </div>
            <div className="p-4 bg-[#131720] rounded-lg border border-[#2A3144]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[#E8E8E8]">ML Drift Warning</h4>
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>
              <p className="text-sm text-[#8B92A8]">
                Alert when model drift score exceeds 0.15
              </p>
            </div>
            <div className="p-4 bg-[#131720] rounded-lg border border-[#2A3144]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[#E8E8E8]">High Traffic Spike</h4>
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>
              <p className="text-sm text-[#8B92A8]">
                Notify when traffic exceeds 10,000 requests per minute
              </p>
            </div>
            <div className="p-4 bg-[#131720] rounded-lg border border-[#2A3144]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[#E8E8E8]">Suspicious User Behavior</h4>
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>
              <p className="text-sm text-[#8B92A8]">
                Alert when user reports exceed 5 in 24 hours
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Notification Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1F2E] border-[#2A3144] text-[#E8E8E8] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[#8B92A8] mb-2 block">Notification Type</label>
                <Select
                  value={newNotification.type}
                  onValueChange={(value) => setNewNotification({...newNotification, type: value})}
                >
                  <SelectTrigger className="bg-[#131720] border-[#2A3144]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingestion_failure">Ingestion Failure</SelectItem>
                    <SelectItem value="ml_drift">ML Drift</SelectItem>
                    <SelectItem value="suspicious_user">Suspicious User</SelectItem>
                    <SelectItem value="high_traffic">High Traffic</SelectItem>
                    <SelectItem value="graph_updated">Graph Updated</SelectItem>
                    <SelectItem value="review_ingested">Review Ingested</SelectItem>
                    <SelectItem value="analytics_ready">Analytics Ready</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-[#8B92A8] mb-2 block">Severity</label>
                <Select
                  value={newNotification.severity}
                  onValueChange={(value) => setNewNotification({...newNotification, severity: value})}
                >
                  <SelectTrigger className="bg-[#131720] border-[#2A3144]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm text-[#8B92A8] mb-2 block">Title</label>
              <Input
                value={newNotification.title}
                onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                placeholder="Notification title..."
                className="bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
              />
            </div>
            <div>
              <label className="text-sm text-[#8B92A8] mb-2 block">Message</label>
              <Textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                placeholder="Notification message..."
                className="min-h-32 bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
              />
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
                onClick={handleCreateNotification}
                disabled={!newNotification.title || !newNotification.message || createNotificationMutation.isPending}
                className="bg-[#F5C518] text-[#0A0E17] hover:bg-[#c79b00] flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {createNotificationMutation.isPending ? 'Creating...' : 'Create Notification'}
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
