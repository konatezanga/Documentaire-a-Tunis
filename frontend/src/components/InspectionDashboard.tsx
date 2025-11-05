import React, { useState } from 'react';
import { Film, Plus, Pencil, Trash2, Save } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useData } from '../contexts/DataContext';
import type { Documentary } from '../contexts/DataContext';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export const InspectionDashboard: React.FC = () => {
  const { documentaries, addDocumentary, updateDocumentary, deleteDocumentary } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    date: '',
    subject: '',
    realisateurCode: '',
    realisateurFirstName: '',
    realisateurLastName: '',
    realisateurBirthDate: '',
    producteurCode: '',
    producteurFirstName: '',
    producteurLastName: '',
    producteurBirthDate: ''
  });

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      date: '',
      subject: '',
      realisateurCode: '',
      realisateurFirstName: '',
      realisateurLastName: '',
      realisateurBirthDate: '',
      producteurCode: '',
      producteurFirstName: '',
      producteurLastName: '',
      producteurBirthDate: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validation complète
  const requiredFields = [
    { value: formData.code, field: 'Code Film' },
    { value: formData.title, field: 'Titre' },
    { value: formData.date, field: 'Date' },
    { value: formData.subject, field: 'Sujet' },
    { value: formData.realisateurCode, field: 'Code Réalisateur' },
    { value: formData.realisateurFirstName, field: 'Prénom Réalisateur' },
    { value: formData.realisateurLastName, field: 'Nom Réalisateur' },
    { value: formData.realisateurBirthDate, field: 'Date de naissance Réalisateur' },
    { value: formData.producteurCode, field: 'Code Producteur' },
    { value: formData.producteurFirstName, field: 'Prénom Producteur' },
    { value: formData.producteurLastName, field: 'Nom Producteur' },
    { value: formData.producteurBirthDate, field: 'Date de naissance Producteur' },
  ];

  const missingFields = requiredFields.filter(field => !field.value);
  
  if (missingFields.length > 0) {
    toast.error('Erreur de validation', {
      description: `Champs obligatoires manquants: ${missingFields.map(f => f.field).join(', ')}`,
      className: 'bg-[#0E0E0E] border-[#A62C21] text-[#F5F2E7]',
    });
    return;
  }

  // Check for duplicate code
  const isDuplicate = documentaries.some(
    doc => doc.code === formData.code && doc.id !== editingId
  );
  if (isDuplicate) {
    toast.error('Code déjà existant', {
      description: 'Ce code de film est déjà utilisé',
      className: 'bg-[#0E0E0E] border-[#A62C21] text-[#F5F2E7]',
    });
    return;
  }

  try {
    const docData = {
      code: formData.code,
      title: formData.title,
      date: formData.date,
      subject: formData.subject,
      realisateur: {
        code: formData.realisateurCode,
        firstName: formData.realisateurFirstName,
        lastName: formData.realisateurLastName,
        birthDate: formData.realisateurBirthDate
      },
      producteur: {
        code: formData.producteurCode,
        firstName: formData.producteurFirstName,
        lastName: formData.producteurLastName,
        birthDate: formData.producteurBirthDate
      }
    };

    console.log('Données préparées pour envoi:', docData);

    if (editingId) {
      await updateDocumentary(editingId, docData);
      toast.success('Film modifié', {
        description: 'Le documentaire a été mis à jour avec succès',
        className: 'bg-[#0E0E0E] border-[#C69B3A] text-[#F5F2E7]',
      });
    } else {
      await addDocumentary(docData);
      toast.success('Film enregistré', {
        description: 'Le documentaire a été ajouté avec succès',
        className: 'bg-[#0E0E0E] border-[#C69B3A] text-[#F5F2E7]',
      });
    }

    resetForm();
  } catch (error: any) {
    toast.error('Erreur', {
      description: error.message || 'Une erreur est survenue',
      className: 'bg-[#0E0E0E] border-[#A62C21] text-[#F5F2E7]',
    });
  }
};

  const handleEdit = (doc: Documentary) => {
    setFormData({
      code: doc.code,
      title: doc.title,
      date: doc.date,
      subject: doc.subject,
      realisateurCode: doc.realisateur.code,
      realisateurFirstName: doc.realisateur.firstName,
      realisateurLastName: doc.realisateur.lastName,
      realisateurBirthDate: doc.realisateur.birthDate,
      producteurCode: doc.producteur.code,
      producteurFirstName: doc.producteur.firstName,
      producteurLastName: doc.producteur.lastName,
      producteurBirthDate: doc.producteur.birthDate
    });
    setEditingId(doc.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
      deleteDocumentary(id);
      toast.success('Film supprimé', {
        className: 'bg-[#0E0E0E] border-[#C69B3A] text-[#F5F2E7]',
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[#C69B3A]">Gestion des Documentaires</h1>
          <p className="text-[#F5F2E7]/60">Enregistrement et gestion des films en compétition</p>
        </div>

        {/* Stats */}
        <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 mb-8 spotlight-card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C69B3A] to-[#d4a855] flex items-center justify-center glow-gold">
              <Film className="w-8 h-8 text-[#0E0E0E]" />
            </div>
            <div>
              <p className="text-3xl text-[#F5F2E7]">{documentaries.length}</p>
              <p className="text-[#F5F2E7]/60">Documentaires enregistrés</p>
            </div>
          </div>
        </Card>

        {/* Add/Edit Form */}
        {isAdding ? (
          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 mb-8 spotlight-card">
            <h2 className="text-2xl mb-6 text-[#C69B3A]">
              {editingId ? 'Modifier le documentaire' : 'Nouveau documentaire'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Film Section */}
              <div className="border border-[#C69B3A]/20 rounded-lg p-6 bg-[#0E0E0E]/30">
                <h3 className="text-xl mb-4 text-[#d4a855]">Informations du Film</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#F5F2E7]">Code Film *</Label>
                    <Input
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="DOC001"
                      className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                      required
                    />
                  </div>
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
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[#F5F2E7]">Titre *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Le titre du documentaire"
                      className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[#F5F2E7]">Sujet <span className='text-red'>*</span></Label>
                    <Textarea
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Description du sujet du documentaire"
                      className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7] min-h-[100px]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Director Section */}
              <div className="border border-[#C69B3A]/20 rounded-lg p-6 bg-[#0E0E0E]/30">
                <h3 className="text-xl mb-4 text-[#d4a855]">Réalisateur</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#F5F2E7]">Code</Label>
                    <Input
                      value={formData.realisateurCode}
                      onChange={(e) => setFormData({ ...formData, realisateurCode: e.target.value })}
                      placeholder="DIR001"
                      className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#F5F2E7]">Date de naissance</Label>
                    <Input
                      type="date"
                      value={formData.realisateurBirthDate}
                      onChange={(e) => setFormData({ ...formData, realisateurBirthDate: e.target.value })}
                      className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#F5F2E7]">Prénom</Label>
                    <Input
                      value={formData.realisateurFirstName}
                      onChange={(e) => setFormData({ ...formData, realisateurFirstName: e.target.value })}
                      className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#F5F2E7]">Nom</Label>
                    <Input
                      value={formData.realisateurLastName}
                      onChange={(e) => setFormData({ ...formData, realisateurLastName: e.target.value })}
                      className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                    />
                  </div>
                </div>
              </div>

              {/* Producer Section */}
              <div className="border border-[#C69B3A]/20 rounded-lg p-6 bg-[#0E0E0E]/30">
                <h3 className="text-xl mb-4 text-[#d4a855]">Producteur</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#F5F2E7]">Code</Label>
                    <Input
                      value={formData.producteurCode}
                      onChange={(e) => setFormData({ ...formData, producteurCode: e.target.value })}
                      placeholder="PROD001"
                      className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#F5F2E7]">Date de naissance</Label>
                    <Input
                      type="date"
                      value={formData.producteurBirthDate}
                      onChange={(e) => setFormData({ ...formData, producteurBirthDate: e.target.value })}
                      className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#F5F2E7]">Prénom</Label>
                    <Input
                      value={formData.producteurFirstName}
                      onChange={(e) => setFormData({ ...formData, producteurFirstName: e.target.value })}
                      className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#F5F2E7]">Nom</Label>
                    <Input
                      value={formData.producteurLastName}
                      onChange={(e) => setFormData({ ...formData, producteurLastName: e.target.value })}
                      className="bg-[#0E0E0E]/50 border-[#C69B3A]/30 text-[#F5F2E7]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-[#C69B3A] text-[#0E0E0E] hover:bg-[#d4a855] glow-gold-hover"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Enregistrer les modifications' : 'Enregistrer le documentaire'}
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
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un documentaire
            </Button>
          </div>
        )}

        {/* List of Documentaries */}
        {documentaries.length > 0 && (
          <Card className="bg-[#1B2430]/50 border-[#C69B3A]/20 p-6 spotlight-card">
            <h2 className="text-2xl mb-6 text-[#C69B3A]">Liste des documentaires</h2>
            <div className="border border-[#C69B3A]/20 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#C69B3A]/20 hover:bg-[#C69B3A]/5">
                    <TableHead className="text-[#C69B3A]">Code</TableHead>
                    <TableHead className="text-[#C69B3A]">Titre</TableHead>
                    <TableHead className="text-[#C69B3A]">Réalisateur</TableHead>
                    <TableHead className="text-[#C69B3A]">Date</TableHead>
                    <TableHead className="text-[#C69B3A] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentaries.map((doc) => (
                    <TableRow key={doc.id} className="border-[#C69B3A]/10 hover:bg-[#C69B3A]/5">
                      <TableCell className="text-[#C69B3A]">{doc.code}</TableCell>
                      <TableCell className="text-[#F5F2E7]">{doc.title}</TableCell>
                      <TableCell className="text-[#F5F2E7]/70">
                        {doc.realisateur.firstName} {doc.realisateur.lastName}
                      </TableCell>
                      <TableCell className="text-[#F5F2E7]/70">
                        {new Date(doc.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(doc)}
                            className="text-[#C69B3A] hover:bg-[#C69B3A]/10"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(doc.id, doc.title)}
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
