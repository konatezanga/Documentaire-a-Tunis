import React, { useEffect } from 'react'; // Ajoutez useEffect
import { Calendar, MapPin, Clock, Film } from 'lucide-react';
import { Card } from './ui/card';
import { useData } from '../contexts/DataContext';
import { Badge } from './ui/badge';

export const SchedulePage: React.FC = () => {
  const { documentaries, screenings, fetchDocumentaries, fetchScreenings } = useData();

  // Charger les données au montage du composant
  useEffect(() => {
    fetchDocumentaries();
    fetchScreenings();
  }, [fetchDocumentaries, fetchScreenings]);

  // DEBUG: Afficher les données
  useEffect(() => {
    console.log("Documentaires chargés:", documentaries);
    console.log("Projections chargées:", screenings);
    console.log("Projections publiées:", screenings.filter(s => s.isPublished));
  
  // Debug des IDs
  console.log("IDs des documentaires:", documentaries.map(d => ({ id: d.id, type: typeof d.id })));
  console.log("IDs des documentaires dans les projections:", screenings.map(s => ({ 
    screeningId: s.id, 
    documentaryId: s.documentaryId, 
    type: typeof s.documentaryId 
  })));
}, [documentaries, screenings]);

  // DEBUG: Afficher les données
  useEffect(() => {
    console.log("Documentaires chargés:", documentaries);
    console.log("Projections chargées:", screenings);
    console.log("Projections publiées:", screenings.filter(s => s.isPublished));
  }, [documentaries, screenings]);

  // Montre seulement les projections publiées, triées par date et heure
  const publishedScreenings = screenings
    .filter(s => s.isPublished)
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());

  const getDocumentary = (id: string | number) => {
  const doc = documentaries.find(d => String(d.id) === String(id));
  console.log(`Recherche documentaire ${id} (type: ${typeof id}):`, doc);
  return doc;
};

  // Grouper les projections par date
  const groupedByDate = publishedScreenings.reduce((acc, screening) => {
    const date = screening.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(screening);
    return acc;
  }, {} as { [key: string]: typeof publishedScreenings });

  const dates = Object.keys(groupedByDate).sort();

  console.log("Données pour affichage:", { // Debug
    publishedScreenings,
    groupedByDate,
    dates
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4 text-[#C69B3A]">Programme du Festival</h1>
          <p className="text-lg text-[#F5F2E7]/70 max-w-2xl mx-auto">
            Découvrez l'ensemble des projections de documentaires programmées
            pour cette édition de Doc à Tunis
          </p>
        </div>

        {/* Stats Card */}
        {publishedScreenings.length > 0 && (
          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 mb-12 spotlight-card">
            <div className="flex flex-wrap justify-around gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#C69B3A]/20 flex items-center justify-center mb-3 glow-gold">
                  <Film className="w-8 h-8 text-[#C69B3A]" />
                </div>
                <p className="text-3xl text-[#F5F2E7] mb-1">{documentaries.length}</p>
                <p className="text-[#F5F2E7]/60 text-sm">Films</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#C69B3A]/20 flex items-center justify-center mb-3 glow-gold">
                  <Calendar className="w-8 h-8 text-[#C69B3A]" />
                </div>
                <p className="text-3xl text-[#F5F2E7] mb-1">{publishedScreenings.length}</p>
                <p className="text-[#F5F2E7]/60 text-sm">Projections</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#C69B3A]/20 flex items-center justify-center mb-3 glow-gold">
                  <MapPin className="w-8 h-8 text-[#C69B3A]" />
                </div>
                <p className="text-3xl text-[#F5F2E7] mb-1">{dates.length}</p>
                <p className="text-[#F5F2E7]/60 text-sm">Jours</p>
              </div>
            </div>
          </Card>
        )}

        {/* Schedule */}
        {publishedScreenings.length === 0 ? (
          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-16 text-center spotlight-card">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#C69B3A]/20 flex items-center justify-center mb-6 glow-gold">
              <Calendar className="w-10 h-10 text-[#C69B3A]" />
            </div>
            <h3 className="text-2xl mb-3 text-[#C69B3A]">Programme à venir</h3>
            <p className="text-[#F5F2E7]/60 max-w-md mx-auto">
              Le programme des projections sera bientôt disponible.
              Revenez régulièrement pour découvrir la programmation complète du festival.
            </p>
            {/* Debug info */}
            <div className="mt-4 p-4 bg-[#0E0E0E]/30 rounded-lg">
              <p className="text-sm text-[#F5F2E7]/40">
                Debug: {screenings.length} projections totales, {publishedScreenings.length} publiées
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-12">
            {dates.map((date) => (
              <div key={date}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#C69B3A]/20 flex items-center justify-center glow-gold">
                    <Calendar className="w-6 h-6 text-[#C69B3A]" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-[#C69B3A]">
                      {new Date(date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h2>
                    <p className="text-[#F5F2E7]/60 text-sm">
                      {groupedByDate[date].length} projection{groupedByDate[date].length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {groupedByDate[date].map((screening) => {
                    const doc = getDocumentary(screening.documentaryId);
                    
                    // Si le documentaire n'est pas trouvé, afficher un message d'erreur
                    if (!doc) {
                      console.error(`Documentaire non trouvé pour la projection ${screening.id}`, screening);
                      return (
                        <Card key={screening.id} className="bg-[#1B2430]/50 border-[#A62C21]/50 p-6">
                          <div className="text-center text-[#A62C21]">
                            <p>Erreur: Documentaire introuvable (ID: {screening.documentaryId})</p>
                            <p className="text-sm">Salle: {screening.room} | Heure: {screening.time}</p>
                          </div>
                        </Card>
                      );
                    }

                    const now = new Date();
                    const screeningDate = new Date(screening.date + ' ' + screening.time);
                    const isPast = screeningDate < now;

                    return (
                      <Card
                        key={screening.id}
                        className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card hover:border-[#C69B3A]/50 transition-all"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Time & Location */}
                          <div className="lg:w-48 flex lg:flex-col gap-4 lg:gap-3 border-b lg:border-b-0 lg:border-r border-[#C69B3A]/20 pb-4 lg:pb-0 lg:pr-6">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-[#C69B3A] flex-shrink-0" />
                              <div>
                                <p className="text-xs text-[#F5F2E7]/60">Heure</p>
                                <p className="text-lg text-[#F5F2E7]">{screening.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin className="w-5 h-5 text-[#C69B3A] flex-shrink-0" />
                              <div>
                                <p className="text-xs text-[#F5F2E7]/60">Salle</p>
                                <p className="text-[#F5F2E7]">{screening.room}</p>
                              </div>
                            </div>
                            {isPast && (
                              <Badge className="bg-[#2a2a2a] text-[#F5F2E7]/60 w-fit">
                                Terminé
                              </Badge>
                            )}
                          </div>

                          {/* Film Details */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-12 h-12 rounded-full bg-[#C69B3A]/20 flex items-center justify-center flex-shrink-0 glow-gold">
                                <Film className="w-6 h-6 text-[#C69B3A]" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl mb-2 text-[#C69B3A]">{doc.title}</h3>
                                <p className="text-sm text-[#F5F2E7]/60 mb-3">
                                  Réalisé par {doc.realisateur.firstName} {doc.realisateur.lastName}
                                </p>
                                <p className="text-[#F5F2E7]/80 line-clamp-2">
                                  {doc.subject}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs text-[#F5F2E7]/60">
                              <span className="px-3 py-1 bg-[#0E0E0E]/50 rounded-full border border-[#C69B3A]/20">
                                Code: {doc.code}
                              </span>
                              <span className="px-3 py-1 bg-[#0E0E0E]/50 rounded-full border border-[#C69B3A]/20">
                                Producteur: {doc.producteur.firstName} {doc.producteur.lastName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};