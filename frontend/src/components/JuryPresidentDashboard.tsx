import React, { useState, useEffect } from 'react';
import { Award, Save, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
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

export const JuryPresidentDashboard: React.FC = () => {
  const { documentaries, screenings, juryMembers, ratings, addRating, fetchRatings } = useData();
  const [selectedScreening, setSelectedScreening] = useState<string | number | null>(null);
  const [scores, setScores] = useState<{ [key: string]: string }>({});

  // Charger les notes au montage
  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  // Filter past screenings
  const now = new Date();
  const pastScreenings = screenings.filter(screening => {
    const screeningDate = new Date(screening.date + ' ' + screening.time);
    return screeningDate < now;
  });

  const getDocumentary = (id: string | number) => {
    return documentaries.find(d => String(d.id) === String(id));
  };

  const getScreeningRatings = (screeningId: string | number) => {
    return ratings.filter(r => String(r.screeningId) === String(screeningId));
  };

  const hasRatings = (screeningId: string | number) => {
    return getScreeningRatings(screeningId).length > 0;
  };

  const handleSubmitRatings = async (screeningId: string | number) => {
    // Validate all jury members have scores
    const missingScores = juryMembers.filter(member => !scores[String(member.id)] || scores[String(member.id)] === '');
    
    if (missingScores.length > 0) {
      toast.error('Notes incomplètes', {
        description: `Veuillez attribuer une note à tous les membres du jury`,
      });
      return;
    }

    // Validate score range (0-100)
    const invalidScores = Object.values(scores).some(score => {
      const num = parseFloat(score);
      return isNaN(num) || num < 0 || num > 100;
    });

    if (invalidScores) {
      toast.error('Notes invalides', {
        description: 'Les notes doivent être entre 0 et 100',
      });
      return;
    }

    try {
      // Save all ratings
      for (const member of juryMembers) {
        await addRating({
          screeningId,
          juryMemberId: member.id,
          score: parseFloat(scores[String(member.id)])
        });
      }

      toast.success('Notes enregistrées', {
        description: 'Les notes du jury ont été enregistrées avec succès',
      });

      setSelectedScreening(null);
      setScores({});
    } catch (error) {
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors de l\'enregistrement',
      });
    }
  };

  const getAverageScore = (screeningId: string | number) => {
    const screeningRatings = getScreeningRatings(screeningId);
    if (screeningRatings.length === 0) return null;
    
    const total = screeningRatings.reduce((sum, rating) => sum + rating.score, 0);
    return (total / screeningRatings.length).toFixed(2);
  };

  // Fonction pour gérer la sélection d'une projection
  const handleSelectScreening = (screeningId: string | number) => {
    setSelectedScreening(screeningId);
  };

  // Fonction pour obtenir le titre du documentaire de manière sécurisée
  const getSelectedScreeningTitle = (): string => {
    if (!selectedScreening) return '';
    
    const screening = screenings.find(s => String(s.id) === String(selectedScreening));
    if (!screening) return '';
    
    const doc = getDocumentary(screening.documentaryId);
    return doc?.title || 'Titre non disponible';
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[#C69B3A]">Saisie des Notes du Jury</h1>
          <p className="text-[#F5F2E7]/60">Attribution des notes après chaque projection</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#C69B3A]/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-[#C69B3A]" />
              </div>
              <div>
                <p className="text-2xl text-[#F5F2E7]">{pastScreenings.length}</p>
                <p className="text-[#F5F2E7]/60 text-sm">Projections terminées</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#C69B3A]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#C69B3A]" />
              </div>
              <div>
                <p className="text-2xl text-[#F5F2E7]">{juryMembers.length}</p>
                <p className="text-[#F5F2E7]/60 text-sm">Membres du jury</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#C69B3A]/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-[#C69B3A]" />
              </div>
              <div>
                <p className="text-2xl text-[#F5F2E7]">
                  {pastScreenings.filter(s => hasRatings(s.id)).length}
                </p>
                <p className="text-[#F5F2E7]/60 text-sm">Films notés</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#A62C21]/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-[#A62C21]" />
              </div>
              <div>
                <p className="text-2xl text-[#F5F2E7]">
                  {pastScreenings.filter(s => !hasRatings(s.id)).length}
                </p>
                <p className="text-[#F5F2E7]/60 text-sm">En attente</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Rating Form */}
        {selectedScreening && (
          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 mb-8">
            <h2 className="text-2xl mb-6 text-[#C69B3A]">
              Saisie des notes - {getSelectedScreeningTitle()}
            </h2>
            <div className="space-y-4">
              <div className="border border-[#C69B3A]/20 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#C69B3A]/20">
                      <TableHead className="text-[#C69B3A]">Membre du jury</TableHead>
                      <TableHead className="text-[#C69B3A]">Expertise</TableHead>
                      <TableHead className="text-[#C69B3A]">Note (sur 100)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {juryMembers.map((member) => (
                      <TableRow key={String(member.id)} className="border-[#C69B3A]/10">
                        <TableCell className="text-[#F5F2E7]">
                          {member.firstName} {member.lastName}
                        </TableCell>
                        <TableCell className="text-[#F5F2E7]/70">{member.expertise}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={scores[String(member.id)] || ''}
                            onChange={(e) => setScores({ 
                              ...scores, 
                              [String(member.id)]: e.target.value 
                            })}
                            placeholder="0-100"
                            className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7] max-w-[150px]"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => handleSubmitRatings(selectedScreening)}
                  className="bg-[#C69B3A] text-[#0E0E0E] hover:bg-[#d4a855]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer les notes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedScreening(null);
                    setScores({});
                  }}
                  className="border-[#C69B3A]/30 text-[#F5F2E7] hover:bg-[#C69B3A]/10"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Screenings List */}
        <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6">
          <h2 className="text-2xl mb-6 text-[#C69B3A]">Projections à noter</h2>
          {pastScreenings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#F5F2E7]/60">Aucune projection terminée</p>
            </div>
          ) : (
            <div className="border border-[#C69B3A]/20 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#C69B3A]/20">
                    <TableHead className="text-[#C69B3A]">Film</TableHead>
                    <TableHead className="text-[#C69B3A]">Date</TableHead>
                    <TableHead className="text-[#C69B3A]">Heure</TableHead>
                    <TableHead className="text-[#C69B3A]">Salle</TableHead>
                    <TableHead className="text-[#C69B3A]">Statut</TableHead>
                    <TableHead className="text-[#C69B3A]">Moyenne</TableHead>
                    <TableHead className="text-[#C69B3A] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastScreenings.map((screening) => {
                    const doc = getDocumentary(screening.documentaryId);
                    const isRated = hasRatings(screening.id);
                    const avgScore = getAverageScore(screening.id);

                    return (
                      <TableRow key={String(screening.id)} className="border-[#C69B3A]/10">
                        <TableCell className="text-[#F5F2E7]">{doc?.title || 'Documentaire non trouvé'}</TableCell>
                        <TableCell className="text-[#F5F2E7]/70">
                          {new Date(screening.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell className="text-[#F5F2E7]/70">{screening.time}</TableCell>
                        <TableCell className="text-[#F5F2E7]/70">{screening.room}</TableCell>
                        <TableCell>
                          <Badge className={isRated ? 'bg-[#C69B3A] text-[#0E0E0E]' : 'bg-[#A62C21] text-[#F5F2E7]'}>
                            {isRated ? 'Noté' : 'En attente'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#F5F2E7]">
                          {avgScore ? `${avgScore}/100` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {!isRated && (
                            <Button
                              size="sm"
                              onClick={() => handleSelectScreening(screening.id)}
                              className="bg-[#C69B3A] text-[#0E0E0E] hover:bg-[#d4a855]"
                            >
                              Saisir les notes
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};