import React from 'react';
import { Award, Film, Users, MapPin, Mail, Phone } from 'lucide-react';
import { Card } from './ui/card';
import { ImageWithFallback } from './image/ImageWithFallback';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl mb-4 text-[#C69B3A]">À Propos du Festival</h1>
          <p className="text-lg text-[#F5F2E7]/70 max-w-2xl mx-auto">
            Une célébration du cinéma documentaire en Tunisie et à travers le monde
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-16 rounded-2xl overflow-hidden border border-[#C69B3A]/20 spotlight-card">
          <div className="relative h-96">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1659094654874-5a62e72317de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dW5pc2lhJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MDI3MTc1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Tunisie"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/50 to-transparent" />
          </div>
        </div>

        {/* Mission */}
        <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-8 mb-12 spotlight-card">
          <h2 className="text-3xl mb-6 text-[#C69B3A]">Notre Mission</h2>
          <p className="text-lg text-[#F5F2E7]/80 leading-relaxed mb-4">
            Doc à Tunis est le premier festival international dédié au film documentaire en Tunisie.
            Notre mission est de promouvoir l'art du documentaire, de mettre en lumière les réalités
            sociales, culturelles et historiques, et de créer un espace de dialogue entre cinéastes,
            professionnels et public.
          </p>
          <p className="text-lg text-[#F5F2E7]/80 leading-relaxed">
            Nous nous engageons à soutenir les cinéastes émergents et établis, à favoriser les
            échanges internationaux et à sensibiliser le public tunisien aux enjeux contemporains
            à travers le prisme du documentaire.
          </p>
        </Card>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-8 spotlight-card hover:border-[#C69B3A]/50 transition-all text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#C69B3A]/20 flex items-center justify-center mb-6 glow-gold">
              <Film className="w-8 h-8 text-[#C69B3A]" />
            </div>
            <h3 className="text-xl mb-4 text-[#C69B3A]">Excellence Artistique</h3>
            <p className="text-[#F5F2E7]/70">
              Nous sélectionnons des œuvres documentaires d'exception qui repoussent
              les limites de la narration visuelle
            </p>
          </Card>

          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-8 spotlight-card hover:border-[#C69B3A]/50 transition-all text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#C69B3A]/20 flex items-center justify-center mb-6 glow-gold">
              <Users className="w-8 h-8 text-[#C69B3A]" />
            </div>
            <h3 className="text-xl mb-4 text-[#C69B3A]">Diversité</h3>
            <p className="text-[#F5F2E7]/70">
              Nous célébrons la diversité des voix, des perspectives et des cultures
              à travers le monde
            </p>
          </Card>

          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-8 spotlight-card hover:border-[#C69B3A]/50 transition-all text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#C69B3A]/20 flex items-center justify-center mb-6 glow-gold">
              <Award className="w-8 h-8 text-[#C69B3A]" />
            </div>
            <h3 className="text-xl mb-4 text-[#C69B3A]">Reconnaissance</h3>
            <p className="text-[#F5F2E7]/70">
              Nous récompensons le talent et le travail des cinéastes documentaristes
              à travers nos prix prestigieux
            </p>
          </Card>
        </div>

        {/* History */}
        <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-8 mb-12 spotlight-card">
          <h2 className="text-3xl mb-6 text-[#C69B3A]">Notre Histoire</h2>
          <div className="space-y-4 text-[#F5F2E7]/80">
            <p className="leading-relaxed">
              Fondé en 2020, Doc à Tunis est né de la volonté de créer une plateforme dédiée
              au film documentaire en Tunisie et dans la région méditerranéenne. Depuis sa
              création, le festival a accueilli plus de 200 films documentaires de 50 pays différents.
            </p>
            <p className="leading-relaxed">
              Chaque édition du festival attire des milliers de spectateurs, des cinéastes
              reconnus internationalement et des professionnels de l'industrie du cinéma.
              Doc à Tunis est devenu un rendez-vous incontournable pour les amateurs de
              documentaires en Afrique du Nord.
            </p>
          </div>
        </Card>

        {/* Documentary Image */}
        <div className="mb-12 rounded-2xl overflow-hidden border border-[#C69B3A]/20 spotlight-card">
          <div className="relative h-96">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1613324295610-00b422bfc618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMGZpbG1tYWtpbmd8ZW58MXx8fHwxNzYwMjcxNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Cinéma documentaire"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/30 to-transparent" />
          </div>
        </div>

        {/* Contact */}
        <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-8 spotlight-card">
          <h2 className="text-3xl mb-6 text-[#C69B3A]">Contactez-nous</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl mb-4 text-[#d4a855]">Informations générales</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C69B3A] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[#F5F2E7]">Avenue 12</p>
                    <p className="text-[#F5F2E7]/70">1000 Tunis, Tunisie</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#C69B3A] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[#F5F2E7]">contact@docatunis.tn</p>
                    <p className="text-[#F5F2E7]/70">Pour toute question</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#C69B3A] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[#F5F2E7]">+216 71 123 456</p>
                    <p className="text-[#F5F2E7]/70">Lun-Ven, 9h-17h</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl mb-4 text-[#d4a855]">Soumissions de films</h3>
              <p className="text-[#F5F2E7]/80 mb-4">
                Vous souhaitez soumettre votre documentaire pour la prochaine édition ?
                Contactez-nous à :
              </p>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#C69B3A] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[#F5F2E7]">submissions@docatunis.tn</p>
                  <p className="text-[#F5F2E7]/70">Appels à projets et sélections</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Partners */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl mb-8 text-[#C69B3A]">Nos Partenaires</h2>
          <p className="text-[#F5F2E7]/70 max-w-2xl mx-auto mb-8">
            Doc à Tunis est soutenu par des institutions culturelles nationales et
            internationales engagées dans la promotion du cinéma documentaire.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-[#C69B3A]/60">
            <p>Ministère de la Culture • Institut Français • Goethe-Institut • CNC</p>
          </div>
        </div>
      </div>
    </div>
  );
};
