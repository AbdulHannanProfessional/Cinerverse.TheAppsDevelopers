import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, UserX, UserCheck, Shield, User, Flag, 
  Mail, Calendar, MoreVertical, Ban, CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => base44.entities.User.list('-created_date')
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }) => base44.entities.User.update(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['all-users']);
      setDialogOpen(false);
      setSelectedUser(null);
    }
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleStatusChange = (user, newStatus) => {
    updateUserMutation.mutate({
      userId: user.id,
      data: { status: newStatus }
    });
  };

  const handleRoleChange = (user, newRole) => {
    updateUserMutation.mutate({
      userId: user.id,
      data: { role: newRole }
    });
  };

  const handleFlagUser = (user) => {
    updateUserMutation.mutate({
      userId: user.id,
      data: { is_flagged: !user.is_flagged }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#E8E8E8] mb-2">User Management</h1>
        <p className="text-[#8B92A8]">Manage users, roles, and account status</p>
      </div>

      {/* Filters */}
      <Card className="bg-[#1A1F2E] border-[#2A3144]">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B92A8]" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-[#131720] border-[#2A3144] text-[#E8E8E8]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="bg-[#131720] border-[#2A3144] text-[#E8E8E8]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatBox
          label="Total Users"
          value={users.length}
          icon={User}
          color="text-blue-400"
        />
        <StatBox
          label="Active"
          value={users.filter(u => u.status === 'active').length}
          icon={CheckCircle}
          color="text-green-400"
        />
        <StatBox
          label="Suspended"
          value={users.filter(u => u.status === 'suspended').length}
          icon={UserX}
          color="text-yellow-400"
        />
        <StatBox
          label="Banned"
          value={users.filter(u => u.status === 'banned').length}
          icon={Ban}
          color="text-red-400"
        />
      </div>

      {/* Users Table */}
      <Card className="bg-[#1A1F2E] border-[#2A3144]">
        <CardHeader>
          <CardTitle className="text-[#E8E8E8]">
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-20 bg-[#2A3144]" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="p-4 bg-[#131720] rounded-lg border border-[#2A3144] hover:border-[#F5C518] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-[#F5C518] flex items-center justify-center text-[#0A0E17] font-bold">
                        {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#E8E8E8]">
                            {user.full_name || 'No name'}
                          </h3>
                          {user.is_flagged && (
                            <Flag className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[#8B92A8]">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(user.created_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          user.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : user.status === 'suspended'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }
                      >
                        {user.status}
                      </Badge>
                      <Badge className="bg-[#F5C518]/20 text-[#F5C518]">
                        {user.role}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-[#8B92A8]">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#1A1F2E] border-[#2A3144]">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setDialogOpen(true);
                            }}
                            className="text-[#E8E8E8] focus:bg-[#2A3144] focus:text-[#E8E8E8]"
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleFlagUser(user)}
                            className="text-[#E8E8E8] focus:bg-[#2A3144] focus:text-[#E8E8E8]"
                          >
                            <Flag className="w-4 h-4 mr-2" />
                            {user.is_flagged ? 'Unflag' : 'Flag User'}
                          </DropdownMenuItem>
                          {user.status !== 'banned' && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(user, 'banned')}
                              className="text-red-400 focus:bg-[#2A3144] focus:text-red-400"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Ban User
                            </DropdownMenuItem>
                          )}
                          {user.status === 'banned' && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(user, 'active')}
                              className="text-green-400 focus:bg-[#2A3144] focus:text-green-400"
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Reinstate User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[#8B92A8]">No users found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1F2E] border-[#2A3144] text-[#E8E8E8] max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription className="text-[#8B92A8]">
              Manage user account and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#8B92A8]">Full Name</label>
                  <p className="text-[#E8E8E8] font-semibold">{selectedUser.full_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-[#8B92A8]">Email</label>
                  <p className="text-[#E8E8E8] font-semibold">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm text-[#8B92A8] mb-2 block">Status</label>
                  <Select
                    value={selectedUser.status}
                    onValueChange={(value) => handleStatusChange(selectedUser, value)}
                  >
                    <SelectTrigger className="bg-[#131720] border-[#2A3144]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-[#8B92A8] mb-2 block">Role</label>
                  <Select
                    value={selectedUser.role}
                    onValueChange={(value) => handleRoleChange(selectedUser, value)}
                  >
                    <SelectTrigger className="bg-[#131720] border-[#2A3144]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {selectedUser.bio && (
                <div>
                  <label className="text-sm text-[#8B92A8]">Bio</label>
                  <p className="text-[#E8E8E8]">{selectedUser.bio}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color }) {
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
