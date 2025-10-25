import React from 'react';
import { Calendar, Film, Award, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './image/ImageWithFallback';

type Page = 'home' | 'login' | 'dashboard' | 'schedule' | 'about';

export interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1702890764798-eda71e941da1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBmaWxtJTIwZmVzdGl2YWx8ZW58MXx8fHwxNzYwMTYyNjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Festival de cinéma"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E0E]/80 via-[#0E0E0E]/70 to-[#0E0E0E]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="spotlight-card rounded-3xl p-8">
            <h1 className="text-5xl md:text-7xl mb-6 text-[#C69B3A] glow-gold">
              Doc à Tunis
            </h1>
            <p className="text-xl md:text-2xl text-[#F5F2E7] mb-4">
              Festival International du Film Documentaire de Tunisie
            </p>
            <p className="text-lg text-[#F5F2E7]/80 mb-8">
              Célébrons l'art du documentaire et les voix qui racontent notre monde
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onNavigate('schedule')}
                className="bg-[#C69B3A] text-[#0E0E0E] hover:bg-[#d4a855] glow-gold-hover transition-all px-8 py-6"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Voir le Programme
              </Button>
              <Button
                onClick={() => onNavigate('about')}
                variant="outline"
                className="border-[#C69B3A] text-[#C69B3A] hover:bg-[#C69B3A]/10 px-8 py-6"
              >
                En savoir plus
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl text-center mb-12 text-[#C69B3A]">
            Un Festival d'Excellence
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-8 hover:border-[#C69B3A]/50 transition-all spotlight-card">
              <div className="w-16 h-16 rounded-full bg-[#C69B3A]/20 flex items-center justify-center mb-6 glow-gold">
                <Film className="w-8 h-8 text-[#C69B3A]" />
              </div>
              <h3 className="text-xl mb-4 text-[#F5F2E7]">Documentaires d'Exception</h3>
              <p className="text-[#F5F2E7]/70">
                Une sélection rigoureuse de films documentaires du monde entier, 
                mettant en lumière les réalités sociales, culturelles et historiques.
              </p>
            </Card>

            <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-8 hover:border-[#C69B3A]/50 transition-all spotlight-card">
              <div className="w-16 h-16 rounded-full bg-[#C69B3A]/20 flex items-center justify-center mb-6 glow-gold">
                <Award className="w-8 h-8 text-[#C69B3A]" />
              </div>
              <h3 className="text-xl mb-4 text-[#F5F2E7]">Jury International</h3>
              <p className="text-[#F5F2E7]/70">
                Des experts reconnus du cinéma documentaire évaluent et récompensent 
                les œuvres les plus marquantes du festival.
              </p>
            </Card>

            <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-8 hover:border-[#C69B3A]/50 transition-all spotlight-card">
              <div className="w-16 h-16 rounded-full bg-[#C69B3A]/20 flex items-center justify-center mb-6 glow-gold">
                <Calendar className="w-8 h-8 text-[#C69B3A]" />
              </div>
              <h3 className="text-xl mb-4 text-[#F5F2E7]">Programme Riche</h3>
              <p className="text-[#F5F2E7]/70">
                Projections quotidiennes, rencontres avec les réalisateurs, 
                ateliers et débats pour une expérience immersive complète.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#1B2430]/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl mb-6 text-[#C69B3A]">
            Rejoignez-nous pour cette Édition
          </h2>
          <p className="text-lg text-[#F5F2E7]/80 mb-8">
            Découvrez les films en compétition et consultez le programme complet 
            des projections et événements du festival.
          </p>
          <Button
            onClick={() => onNavigate('schedule')}
            className="bg-[#C69B3A] text-[#0E0E0E] hover:bg-[#d4a855] glow-gold-hover transition-all px-10 py-6"
          >
            Consulter le Programme Complet
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#C69B3A]/20 py-8 px-4 mt-20">
        <div className="container mx-auto text-center">
          <p className="text-[#F5F2E7]/60">
            © 2025 Doc à Tunis - Festival International du Film Documentaire de Tunisie
          </p>
          <p className="text-[#C69B3A]/60 text-sm mt-2">
            Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
};
