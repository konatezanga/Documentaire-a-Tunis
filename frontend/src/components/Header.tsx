import React from 'react';
import { Film, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

type Page = 'home' | 'login' | 'dashboard' | 'schedule' | 'about';

interface HeaderProps {
  onNavigate?: (page: Page) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { user, logout, isAuthenticated } = useAuth();

  const getRoleName = (role: string | null) => {
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
        return 'Visiteur';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1B2430]/95 backdrop-blur-sm border-b border-[#C69B3A]/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <Film className="w-8 h-8 text-[#C69B3A] group-hover:text-[#d4a855] transition-colors" />
              <div className="absolute inset-0 bg-[#C69B3A]/20 blur-xl group-hover:bg-[#C69B3A]/30 transition-all" />
            </div>
            <div>
              <h1 className="text-[#C69B3A] tracking-wide">Doc à Tunis</h1>
              <p className="text-[10px] text-[#F5F2E7]/60 tracking-widest uppercase">
                Festival International
              </p>
            </div>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate?.('home')}
              className="text-[#F5F2E7]/80 hover:text-[#C69B3A] transition-colors"
            >
              Accueil
            </button>
            <button
              onClick={() => onNavigate?.('schedule')}
              className="text-[#F5F2E7]/80 hover:text-[#C69B3A] transition-colors"
            >
              Programme
            </button>
            <button
              onClick={() => onNavigate?.('about')}
              className="text-[#F5F2E7]/80 hover:text-[#C69B3A] transition-colors"
            >
              À propos
            </button>
          </nav>

          {/* User section */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-[#F5F2E7]">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-[#C69B3A]">{getRoleName(user.role)}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C69B3A] to-[#A62C21] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#0E0E0E]" />
                </div>
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="icon"
                  className="text-[#F5F2E7]/60 hover:text-[#A62C21] hover:bg-[#A62C21]/10"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onNavigate?.('login')}
                className="bg-[#C69B3A] text-[#0E0E0E] hover:bg-[#d4a855] glow-gold-hover transition-all"
              >
                Connexion
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
