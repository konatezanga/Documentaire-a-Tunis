import React, { useState } from 'react';
import { Users, Film, Calendar, Award, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useData } from '../contexts/DataContext';
import { toast } from 'sonner@2.0.3';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';

export const AdminDashboard: React.FC = () => {
  const { documentaries, screenings, juryMembers, ratings, users, addUser, updateUser, deleteUser } = useData();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'jury_member'
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-[#C69B3A] text-[#0E0E0E]';
      case 'inspection_manager':
        return 'bg-[#1B2430] text-[#F5F2E7]';
      case 'production_manager':
        return 'bg-[#A62C21] text-[#F5F2E7]';
      case 'jury_president':
        return 'bg-[#d4a855] text-[#0E0E0E]';
      case 'jury_member':
        return 'bg-[#2a2a2a] text-[#F5F2E7]';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'inspection_manager':
        return 'Responsable des inspections';
      case 'production_manager':
        return 'Responsable de la production';
      case 'jury_president':
        return 'Président du jury';
      case 'jury_member':
        return 'Membre du jury';
      default:
        return role;
    }
  };

  const handleAddUser = () => {
    if (!newUser.email || !newUser.firstName || !newUser.lastName) {
      toast.error('Erreur', {
        description: 'Veuillez remplir tous les champs',
        className: 'bg-[#0E0E0E] border-[#A62C21] text-[#F5F2E7]',
      });
      return;
    }

    addUser(newUser);
    toast.success('Utilisateur créé', {
      description: `${newUser.firstName} ${newUser.lastName} a été ajouté avec succès`,
      className: 'bg-[#0E0E0E] border-[#C69B3A] text-[#F5F2E7]',
    });
    setIsAddUserOpen(false);
    setNewUser({ email: '', firstName: '', lastName: '', role: 'jury_member' });
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
      deleteUser(id);
      toast.success('Utilisateur supprimé', {
        className: 'bg-[#0E0E0E] border-[#C69B3A] text-[#F5F2E7]',
      });
    }
  };

  const stats = [
    {
      label: 'Documentaires',
      value: documentaries.length,
      icon: Film,
      color: 'from-[#C69B3A] to-[#d4a855]'
    },
    {
      label: 'Projections',
      value: screenings.length,
      icon: Calendar,
      color: 'from-[#1B2430] to-[#2a3a4a]'
    },
    {
      label: 'Membres du jury',
      value: juryMembers.length,
      icon: Award,
      color: 'from-[#A62C21] to-[#c63a2e]'
    },
    {
      label: 'Utilisateurs',
      value: users.length,
      icon: Users,
      color: 'from-[#8b7355] to-[#a68968]'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[#C69B3A]">Tableau de Bord Administrateur</h1>
          <p className="text-[#F5F2E7]/60">Gestion complète du festival</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card hover:border-[#C69B3A]/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#F5F2E7]/60 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl text-[#F5F2E7]">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center glow-gold`}>
                  <stat.icon className="w-7 h-7 text-[#F5F2E7]" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* User Management */}
        <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl text-[#C69B3A]">Gestion des Utilisateurs</h2>
              <p className="text-[#F5F2E7]/60 text-sm">Créer et gérer les comptes utilisateurs</p>
            </div>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#C69B3A] text-[#0E0E0E] hover:bg-[#d4a855] glow-gold-hover">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1B2430] border-[#C69B3A]/30 text-[#F5F2E7]">
                <DialogHeader>
                  <DialogTitle className="text-[#C69B3A]">Nouvel Utilisateur</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-[#F5F2E7]">Email</Label>
                    <Input
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="email@example.com"
                      className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#F5F2E7]">Prénom</Label>
                      <Input
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                        className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#F5F2E7]">Nom</Label>
                      <Input
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                        className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#F5F2E7]">Rôle</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1B2430] border-[#C69B3A]/30 text-[#F5F2E7]">
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="inspection_manager">Responsable des inspections</SelectItem>
                        <SelectItem value="production_manager">Responsable de la production</SelectItem>
                        <SelectItem value="jury_president">Président du jury</SelectItem>
                        <SelectItem value="jury_member">Membre du jury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleAddUser}
                    className="w-full bg-[#C69B3A] text-[#0E0E0E] hover:bg-[#d4a855]"
                  >
                    Créer l'utilisateur
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border border-[#C69B3A]/20 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-[#C69B3A]/20 hover:bg-[#C69B3A]/5">
                  <TableHead className="text-[#C69B3A]">Nom</TableHead>
                  <TableHead className="text-[#C69B3A]">Email</TableHead>
                  <TableHead className="text-[#C69B3A]">Rôle</TableHead>
                  <TableHead className="text-[#C69B3A]">Date création</TableHead>
                  <TableHead className="text-[#C69B3A] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-[#C69B3A]/10 hover:bg-[#C69B3A]/5">
                    <TableCell className="text-[#F5F2E7]">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell className="text-[#F5F2E7]/70">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#F5F2E7]/70">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-[#C69B3A] hover:bg-[#C69B3A]/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                          className="text-[#A62C21] hover:bg-[#A62C21]/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};
