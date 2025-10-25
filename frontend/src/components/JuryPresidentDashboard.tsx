import React, { useState } from 'react';
import { Award, Save } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
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

export const JuryPresidentDashboard: React.FC = () => {
  const { documentaries, screenings, juryMembers, ratings, addRating } = useData();
  const [selectedScreening, setSelectedScreening] = useState<string | null>(null);
  const [scores, setScores] = useState<{ [key: string]: string }>({});

  // Filter past screenings
  const now = new Date();
  const pastScreenings = screenings.filter(screening => {
    const screeningDate = new Date(screening.date + ' ' + screening.time);
    return screeningDate < now;
  });

  const getDocumentary = (id: string) => {
    return documentaries.find(d => d.id === id);
  };

  const getScreeningRatings = (screeningId: string) => {
    return ratings.filter(r => r.screeningId === screeningId);
  };

  const hasRatings = (screeningId: string) => {
    return getScreeningRatings(screeningId).length > 0;
  };

  const handleSubmitRatings = (screeningId: string) => {
    // Validate all jury members have scores
    const missingScores = juryMembers.filter(member => !scores[member.id] || scores[member.id] === '');
    
    if (missingScores.length > 0) {
      toast.error('Notes incomplètes', {
        description: `Veuillez attribuer une note à tous les membres du jury`,
        className: 'bg-[#0E0E0E] border-[#A62C21] text-[#F5F2E7]',
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
        className: 'bg-[#0E0E0E] border-[#A62C21] text-[#F5F2E7]',
      });
      return;
    }

    // Save all ratings
    juryMembers.forEach(member => {
      addRating({
        screeningId,
        juryMemberId: member.id,
        score: parseFloat(scores[member.id])
      });
    });

    toast.success('Notes enregistrées', {
      description: 'Les notes du jury ont été enregistrées avec succès',
      className: 'bg-[#0E0E0E] border-[#C69B3A] text-[#F5F2E7]',
    });

    setSelectedScreening(null);
    setScores({});
  };

  const getAverageScore = (screeningId: string) => {
    const screeningRatings = getScreeningRatings(screeningId);
    if (screeningRatings.length === 0) return null;
    
    const total = screeningRatings.reduce((sum, rating) => sum + rating.score, 0);
    return (total / screeningRatings.length).toFixed(2);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C69B3A] to-[#d4a855] flex items-center justify-center glow-gold">
                <Award className="w-7 h-7 text-[#0E0E0E]" />
              </div>
              <div>
                <p className="text-3xl text-[#F5F2E7]">{pastScreenings.length}</p>
                <p className="text-[#F5F2E7]/60">Projections terminées</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1B2430] to-[#2a3a4a] flex items-center justify-center glow-gold">
                <Award className="w-7 h-7 text-[#C69B3A]" />
              </div>
              <div>
                <p className="text-3xl text-[#F5F2E7]">
                  {pastScreenings.filter(s => hasRatings(s.id)).length}
                </p>
                <p className="text-[#F5F2E7]/60">Films notés</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A62C21] to-[#c63a2e] flex items-center justify-center glow-gold">
                <Award className="w-7 h-7 text-[#F5F2E7]" />
              </div>
              <div>
                <p className="text-3xl text-[#F5F2E7]">{juryMembers.length}</p>
                <p className="text-[#F5F2E7]/60">Membres du jury</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Rating Form */}
        {selectedScreening ? (
          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 mb-8 spotlight-card">
            <h2 className="text-2xl mb-6 text-[#C69B3A]">
              Saisie des notes - {getDocumentary(screenings.find(s => s.id === selectedScreening)?.documentaryId || '')?.title}
            </h2>
            <div className="space-y-4">
              <div className="border border-[#C69B3A]/20 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#C69B3A]/20 hover:bg-[#C69B3A]/5">
                      <TableHead className="text-[#C69B3A]">Membre du jury</TableHead>
                      <TableHead className="text-[#C69B3A]">Expertise</TableHead>
                      <TableHead className="text-[#C69B3A]">Note (sur 100)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {juryMembers.map((member) => (
                      <TableRow key={member.id} className="border-[#C69B3A]/10">
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
                            value={scores[member.id] || ''}
                            onChange={(e) => setScores({ ...scores, [member.id]: e.target.value })}
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
                  className="bg-[#C69B3A] text-[#0E0E0E] hover:bg-[#d4a855] glow-gold-hover"
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
        ) : null}

        {/* Screenings List */}
        <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card">
          <h2 className="text-2xl mb-6 text-[#C69B3A]">Projections à noter</h2>
          {pastScreenings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#F5F2E7]/60">Aucune projection terminée</p>
            </div>
          ) : (
            <div className="border border-[#C69B3A]/20 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#C69B3A]/20 hover:bg-[#C69B3A]/5">
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
                      <TableRow key={screening.id} className="border-[#C69B3A]/10 hover:bg-[#C69B3A]/5">
                        <TableCell className="text-[#F5F2E7]">{doc?.title}</TableCell>
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
                              onClick={() => setSelectedScreening(screening.id)}
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
