import { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { apiClient } from '../lib/api';
import { UserRole } from '../components/types';

type TeamMember = {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarImage: string;
};

export function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Staff');
  const [avatarImage, setAvatarImage] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const loadMembers = async () => {
    setLoading(true);

    try {
      const response = await apiClient.get('/team');
      setMembers(response.data.members ?? []);
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const adminCount = useMemo(() => members.filter((member) => member.role === 'Admin').length, [members]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('Staff');
    setAvatarImage('');
    setAvatarFile(null);
    setEditingId(null);
  };

  const openForCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openForEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setName(member.name);
    setEmail(member.email);
    setPassword('');
    setRole(member.role);
    setAvatarImage(member.avatarImage);
    setAvatarFile(null);
    setIsDialogOpen(true);
  };

  const handleAvatarFileChange = (file: File | null) => {
    setAvatarFile(file);

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarImage(previewUrl);
  };

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Name and email are required');
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!editingId && password.trim().length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    if (editingId && password.trim() && password.trim().length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    const payload = new FormData();
    payload.append('name', name.trim());
    payload.append('email', email.trim());
    payload.append('role', role);
    if (password.trim()) {
      payload.append('password', password.trim());
    }
    if (avatarImage.trim()) {
      payload.append('avatarImage', avatarImage.trim());
    }
    if (avatarFile) {
      payload.append('avatarFile', avatarFile);
    }

    const request = editingId
      ? apiClient.put(`/team/${editingId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      : apiClient.post('/team', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

    request
      .then(async () => {
        setErrorMessage('');
        setIsDialogOpen(false);
        resetForm();
        await loadMembers();
      })
      .catch((error: any) => {
        setErrorMessage(error?.response?.data?.message ?? 'Failed to save member');
      });
  };

  const handleDelete = (id: string) => {
    apiClient
      .delete(`/team/${id}`)
      .then(async () => {
        setErrorMessage('');
        await loadMembers();
      })
      .catch((error: any) => {
        setErrorMessage(error?.response?.data?.message ?? 'Failed to delete member');
      });
  };

  return (
    <section className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Team Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage team roles and account assignments.</p>
        </div>
        <Button onClick={openForCreate} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading team members...</p>}
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="rounded-[12px] border border-[#f1f5f9] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatarImage} alt={member.name} className="object-cover" />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {member.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openForEdit(member)}
                  className="rounded-[12px] p-1.5 text-blue-600 transition-colors hover:bg-blue-50"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(member.id)}
                  className="rounded-[12px] p-1.5 text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">{member.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{member.email}</p>
            <Badge
              variant="outline"
              className={
                member.role === 'Admin'
                  ? 'mt-3 border-blue-200 bg-blue-50 text-blue-700'
                  : 'mt-3 border-gray-200 bg-gray-50 text-gray-700'
              }
            >
              {member.role}
            </Badge>
          </div>
        ))}
      </div>

      <div className="rounded-[12px] border border-[#f1f5f9] bg-white p-4 text-sm text-gray-600 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        Team size: {members.length} members • Admins: {adminCount} • Staff: {members.length - adminCount}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
            <DialogDescription>Update role and contact information for this account.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Full Name</Label>
              <Input
                id="team-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-email">Email</Label>
              <Input
                id="team-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-password">
                {editingId ? 'New Password (optional)' : 'Password'}
              </Label>
              <Input
                id="team-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={editingId ? 'Leave blank to keep current password' : 'Enter password'}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-avatar-url">Photo URL (optional)</Label>
              <Input
                id="team-avatar-url"
                value={avatarFile ? '' : avatarImage}
                onChange={(event) => {
                  setAvatarFile(null);
                  setAvatarImage(event.target.value);
                }}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-avatar-file">Upload Photo (optional)</Label>
              <Input
                id="team-avatar-file"
                type="file"
                accept="image/*"
                onChange={(event) => handleAvatarFileChange(event.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-gray-500">Uploaded photo takes priority over the URL.</p>
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarImage} alt={name || 'Preview'} className="object-cover" />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {(name || 'TM')
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || !email.trim() || (!editingId && !password.trim())}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
