import React, { useState } from 'react';
import { LogIn, Film } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Connexion réussie', {
          description: 'Bienvenue sur Doc à Tunis',
          className: 'bg-[#0E0E0E] border-[#C69B3A] text-[#F5F2E7]',
        });
        onLoginSuccess();
        console.log("Résultat login:", success);
      } else {
        toast.error('Échec de connexion', {
          description: 'Email ou mot de passe incorrect',
          className: 'bg-[#0E0E0E] border-[#A62C21] text-[#F5F2E7]',
        });
      }
    } catch (error) {
      toast.error('Erreur', {
        description: 'Une erreur est survenue',
        className: 'bg-[#0E0E0E] border-[#A62C21] text-[#F5F2E7]',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="bg-[#1B2430]/80 border-[#C69B3A]/30 backdrop-blur-sm spotlight-card p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C69B3A]/20 mb-4 glow-gold">
              <Film className="w-8 h-8 text-[#C69B3A]" />
            </div>
            <h2 className="text-3xl mb-2 text-[#C69B3A]">Connexion</h2>
            <p className="text-[#F5F2E7]/60">Accédez à votre espace personnel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F5F2E7]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.tn"
                required
                className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7] placeholder:text-[#F5F2E7]/40 focus:border-[#C69B3A]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#F5F2E7]">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7] placeholder:text-[#F5F2E7]/40 focus:border-[#C69B3A]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C69B3A] text-[#0E0E0E] hover:bg-[#d4a855] glow-gold-hover transition-all py-6"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          {/*<div className="mt-8 p-4 bg-[#0E0E0E]/30 rounded-lg border border-[#C69B3A]/20">
            <p className="text-xs text-[#F5F2E7]/60 mb-2">Comptes de démonstration :</p>
            <div className="space-y-1 text-xs text-[#C69B3A]/80">
              <p>admin@docatunis.tn</p>
              <p>inspection@docatunis.tn</p>
              <p>production@docatunis.tn</p>
              <p>president@docatunis.tn</p>
              <p>jury1@docatunis.tn</p>
              <p className="mt-2 text-[#F5F2E7]/60">Mot de passe : password123</p>
            </div>
          </div>*/}
        </Card>
      </div>
    </div>
  );
};
