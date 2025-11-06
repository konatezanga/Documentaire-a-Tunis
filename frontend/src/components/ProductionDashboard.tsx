import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useData } from '../contexts/DataContext';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';

export const ProductionDashboard: React.FC = () => {
  const { documentaries, screenings, addScreening, updateScreening, deleteScreening } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    documentaryId: '',
    date: '',
    time: '',
    room: ''
  });

  const rooms = [
    'Salle Carthage',
    'Salle Medina',
    'Salle Bardo',
    'Salle Sidi Bou Said',
    'Salle Sousse'
  ];

  const resetForm = () => {
    setFormData({
      documentaryId: '',
      date: '',
      time: '',
      room: ''
    });
    setIsAdding(false);
  };

  const checkConflict = (date: string, time: string, room: string) => {
    return screenings.some(
      screening =>
        screening.date === date &&
        screening.time === time &&
        screening.room === room
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.documentaryId || !formData.date || !formData.time || !formData.room) {
      toast.error('Erreur', {
        description: 'Veuillez remplir tous les champs',
        className: 'bg-[#0E0E0E] border-[#A62C21] text-[#F5F2E7]',
      });
      return;
    }

    // Check for conflicts
    if (checkConflict(formData.date, formData.time, formData.room)) {
      toast.error('Conflit d\'horaire', {
        description: 'Cette salle est déjà réservée à cet horaire',
        className: 'bg-[#0E0E0E] border-[#A62C21] text-[#F5F2E7]',
      });
      return;
    }

    addScreening({
      ...formData,
      isPublished: false
    });

    toast.success('Projection ajoutée', {
      description: 'La projection a été planifiée avec succès',
      className: 'bg-[#0E0E0E] border-[#C69B3A] text-[#F5F2E7]',
    });

    resetForm();
  };

  const handlePublishToggle = (id: string, currentStatus: boolean) => {
    updateScreening(id, { isPublished: !currentStatus });
    toast.success(
      currentStatus ? 'Projection dépubliée' : 'Projection publiée',
      {
        description: currentStatus
          ? 'La projection n\'est plus visible publiquement'
          : 'La projection est maintenant visible publiquement',
        className: 'bg-[#0E0E0E] border-[#C69B3A] text-[#F5F2E7]',
      }
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette projection ?')) {
      deleteScreening(id);
      toast.success('Projection supprimée', {
        className: 'bg-[#0E0E0E] border-[#C69B3A] text-[#F5F2E7]',
      });
    }
  };

  const getDocumentaryTitle = (id: string) => {
    const doc = documentaries.find(d => d.id === id);
    return doc ? doc.title : 'Film inconnu';
  };

  const publishedCount = screenings.filter(s => s.isPublished).length;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[#C69B3A]">Planning de Projection</h1>
          <p className="text-[#F5F2E7]/60">Gestion et publication du programme du festival</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C69B3A] to-[#d4a855] flex items-center justify-center glow-gold">
                <Calendar className="w-7 h-7 text-[#0E0E0E]" />
              </div>
              <div>
                <p className="text-3xl text-[#F5F2E7]">{screenings.length}</p>
                <p className="text-[#F5F2E7]/60">Projections planifiées</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1B2430] to-[#2a3a4a] flex items-center justify-center glow-gold">
                <Eye className="w-7 h-7 text-[#C69B3A]" />
              </div>
              <div>
                <p className="text-3xl text-[#F5F2E7]">{publishedCount}</p>
                <p className="text-[#F5F2E7]/60">Projections publiées</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A62C21] to-[#c63a2e] flex items-center justify-center glow-gold">
                <EyeOff className="w-7 h-7 text-[#F5F2E7]" />
              </div>
              <div>
                <p className="text-3xl text-[#F5F2E7]">{screenings.length - publishedCount}</p>
                <p className="text-[#F5F2E7]/60">Projections en attente</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Add Screening Form */}
        {isAdding ? (
          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 mb-8 spotlight-card">
            <h2 className="text-2xl mb-6 text-[#C69B3A]">Nouvelle projection</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#F5F2E7]">Documentaire *</Label>
                <Select value={formData.documentaryId} onValueChange={(value) => setFormData({ ...formData, documentaryId: value })}>
                  <SelectTrigger className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]">
                    <SelectValue placeholder="Sélectionner un documentaire" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1B2430] border-[#C69B3A]/30 text-[#F5F2E7]">
                    {documentaries.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.title} ({doc.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#F5F2E7]">Date *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#F5F2E7]">Heure *</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#F5F2E7]">Salle *</Label>
                  <Select value={formData.room} onValueChange={(value) => setFormData({ ...formData, room: value })}>
                    <SelectTrigger className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]">
                      <SelectValue placeholder="Sélectionner une salle" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1B2430] border-[#C69B3A]/30 text-[#F5F2E7]">
                      {rooms.map((room) => (
                        <SelectItem key={room} value={room}>
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-[#C69B3A] text-[#0E0E0E] hover:bg-[#d4a855] glow-gold-hover"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter la projection
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-[#C69B3A]/30 text-[#F5F2E7] hover:bg-[#C69B3A]/10"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <div className="mb-8">
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-[#C69B3A] text-[#0E0E0E] hover:bg-[#d4a855] glow-gold-hover"
              disabled={documentaries.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Planifier une projection
            </Button>
            {documentaries.length === 0 && (
              <p className="text-[#A62C21] text-sm mt-2">
                Aucun documentaire disponible. Demandez au responsable des inspections d'en ajouter.
              </p>
            )}
          </div>
        )}

        {/* Screenings Table */}
        {screenings.length > 0 && (
          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card">
            <h2 className="text-2xl mb-6 text-[#C69B3A]">Planning des projections</h2>
            <div className="border border-[#C69B3A]/20 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#C69B3A]/20 hover:bg-[#C69B3A]/5">
                    <TableHead className="text-[#C69B3A]">Film</TableHead>
                    <TableHead className="text-[#C69B3A]">Date</TableHead>
                    <TableHead className="text-[#C69B3A]">Heure</TableHead>
                    <TableHead className="text-[#C69B3A]">Salle</TableHead>
                    <TableHead className="text-[#C69B3A]">Statut</TableHead>
                    <TableHead className="text-[#C69B3A] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {screenings
                    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                    .map((screening) => (
                      <TableRow key={screening.id} className="border-[#C69B3A]/10 hover:bg-[#C69B3A]/5">
                        <TableCell className="text-[#F5F2E7]">
                          {getDocumentaryTitle(screening.documentaryId)}
                        </TableCell>
                        <TableCell className="text-[#F5F2E7]/70">
                          {new Date(screening.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell className="text-[#F5F2E7]/70">{screening.time}</TableCell>
                        <TableCell className="text-[#F5F2E7]/70">{screening.room}</TableCell>
                        <TableCell>
                          <Badge className={screening.isPublished ? 'bg-[#C69B3A] text-[#0E0E0E]' : 'bg-[#2a2a2a] text-[#F5F2E7]'}>
                            {screening.isPublished ? 'Publié' : 'Brouillon'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handlePublishToggle(screening.id, screening.isPublished)}
                              className="text-[#C69B3A] hover:bg-[#C69B3A]/10"
                            >
                              {screening.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(screening.id)}
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
        )}
      </div>
    </div>
  );
};
