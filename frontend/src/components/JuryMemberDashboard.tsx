import React from 'react';
import { Film, Calendar, MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { useData } from '../contexts/DataContext';
import { Badge } from './ui/badge';

export const JuryMemberDashboard: React.FC = () => {
  const { documentaries, screenings } = useData();

  const now = new Date();
  const upcomingScreenings = screenings
    .filter(screening => {
      const screeningDate = new Date(screening.date + ' ' + screening.time);
      return screeningDate >= now && screening.isPublished;
    })
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());

  const getDocumentary = (id: string) => {
    return documentaries.find(d => d.id === id);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[#C69B3A]">Mon Espace Jury</h1>
          <p className="text-[#F5F2E7]/60">Consultez les films et projections du festival</p>
        </div>

        {/* Welcome Card */}
        <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-8 mb-8 spotlight-card text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#C69B3A]/20 mb-4 glow-gold">
            <Film className="w-10 h-10 text-[#C69B3A]" />
          </div>
          <h2 className="text-2xl mb-2 text-[#C69B3A]">Bienvenue au Festival</h2>
          <p className="text-[#F5F2E7]/70 max-w-2xl mx-auto">
            En tant que membre du jury, vous avez accès aux informations sur tous les documentaires
            en compétition et le calendrier des projections auxquelles vous participerez.
          </p>
        </Card>

        {/* Upcoming Screenings */}
        <div className="mb-12">
          <h2 className="text-2xl mb-6 text-[#C69B3A]">Prochaines Projections</h2>
          {upcomingScreenings.length === 0 ? (
            <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-12 text-center">
              <p className="text-[#F5F2E7]/60">Aucune projection à venir</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {upcomingScreenings.map((screening) => {
                const doc = getDocumentary(screening.documentaryId);
                if (!doc) return null;

                return (
                  <Card
                    key={screening.id}
                    className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card hover:border-[#C69B3A]/50 transition-all"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl mb-2 text-[#C69B3A]">{doc.title}</h3>
                            <p className="text-sm text-[#F5F2E7]/60 mb-2">Code: {doc.code}</p>
                          </div>
                          <Badge className="bg-[#C69B3A] text-[#0E0E0E]">À venir</Badge>
                        </div>

                        <p className="text-[#F5F2E7]/80 mb-4 line-clamp-2">{doc.subject}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-[#C69B3A] mb-1">Réalisateur</p>
                            <p className="text-[#F5F2E7]">
                              {doc.director.firstName} {doc.director.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#C69B3A] mb-1">Producteur</p>
                            <p className="text-[#F5F2E7]">
                              {doc.producer.firstName} {doc.producer.lastName}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-[#C69B3A]/20 pt-4 md:pt-0 md:pl-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#C69B3A]" />
                            <div>
                              <p className="text-xs text-[#F5F2E7]/60">Date</p>
                              <p className="text-[#F5F2E7]">
                                {new Date(screening.date).toLocaleDateString('fr-FR', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#C69B3A]" />
                            <div>
                              <p className="text-xs text-[#F5F2E7]/60">Heure</p>
                              <p className="text-[#F5F2E7]">{screening.time}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-[#C69B3A]" />
                            <div>
                              <p className="text-xs text-[#F5F2E7]/60">Lieu</p>
                              <p className="text-[#F5F2E7]">{screening.room}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* All Documentaries */}
        <div>
          <h2 className="text-2xl mb-6 text-[#C69B3A]">Tous les Documentaires</h2>
          {documentaries.length === 0 ? (
            <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-12 text-center">
              <p className="text-[#F5F2E7]/60">Aucun documentaire enregistré</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {documentaries.map((doc) => (
                <Card
                  key={doc.id}
                  className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card hover:border-[#C69B3A]/50 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#C69B3A]/20 flex items-center justify-center flex-shrink-0 glow-gold">
                      <Film className="w-6 h-6 text-[#C69B3A]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl mb-2 text-[#C69B3A]">{doc.title}</h3>
                      <p className="text-sm text-[#F5F2E7]/60 mb-3">
                        Code: {doc.code} • Date: {new Date(doc.date).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-[#F5F2E7]/80 mb-4">{doc.subject}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#0E0E0E]/30 rounded-lg border border-[#C69B3A]/10">
                        <div>
                          <p className="text-xs text-[#C69B3A] mb-2">Réalisateur</p>
                          <p className="text-[#F5F2E7]">
                            {doc.director.firstName} {doc.director.lastName}
                          </p>
                          {doc.director.birthDate && (
                            <p className="text-xs text-[#F5F2E7]/60 mt-1">
                              Né(e) le {new Date(doc.director.birthDate).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-[#C69B3A] mb-2">Producteur</p>
                          <p className="text-[#F5F2E7]">
                            {doc.producer.firstName} {doc.producer.lastName}
                          </p>
                          {doc.producer.birthDate && (
                            <p className="text-xs text-[#F5F2E7]/60 mt-1">
                              Né(e) le {new Date(doc.producer.birthDate).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
