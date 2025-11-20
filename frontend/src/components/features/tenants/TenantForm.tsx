import React, { useState } from 'react';
import type { TenantFormData } from '../../../types.js';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { DocumentUpload } from './DocumentUpload';

interface TenantFormProps {
  initialData?: Partial<TenantFormData>;
  onSubmit: (data: TenantFormData, files?: { idCardFront?: File; idCardBack?: File }) => void;
  isSubmitting?: boolean;
}

export const TenantForm: React.FC<TenantFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<TenantFormData>({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    phone_secondary: initialData?.phone_secondary || '',
    birth_date: initialData?.birth_date || '',
    birth_place: initialData?.birth_place || '',
    nationality: initialData?.nationality || 'Française',
    id_card_number: initialData?.id_card_number || '',
    id_card_type: initialData?.id_card_type || 'id_card',
    id_card_expiry_date: initialData?.id_card_expiry_date || '',
    profession: initialData?.profession || '',
    employer: initialData?.employer || '',
    monthly_income: initialData?.monthly_income,
    notes: initialData?.notes || '',
    is_active: initialData?.is_active ?? true,
  });

  const [files, setFiles] = useState<{
    idCardFront?: File;
    idCardBack?: File;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, files);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value ? Number(value) : undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Informations personnelles */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Prénom"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            placeholder="Jean"
          />

          <Input
            label="Nom"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            placeholder="Dupont"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="jean.dupont@example.com"
          />

          <Input
            label="Téléphone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+33 6 12 34 56 78"
          />

          <Input
            label="Téléphone secondaire"
            name="phone_secondary"
            type="tel"
            value={formData.phone_secondary}
            onChange={handleChange}
            placeholder="+33 1 23 45 67 89"
          />

          <Input
            label="Date de naissance"
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            required
          />

          <Input
            label="Lieu de naissance"
            name="birth_place"
            value={formData.birth_place}
            onChange={handleChange}
            placeholder="Paris, France"
          />

          <Input
            label="Nationalité"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Pièce d'identité */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Pièce d'identité</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de pièce
            </label>
            <select
              name="id_card_type"
              value={formData.id_card_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="id_card">Carte d'identité</option>
              <option value="passport">Passeport</option>
              <option value="residence_permit">Titre de séjour</option>
            </select>
          </div>

          <Input
            label="Numéro de pièce"
            name="id_card_number"
            value={formData.id_card_number}
            onChange={handleChange}
            placeholder="123456789"
          />

          <Input
            label="Date d'expiration"
            name="id_card_expiry_date"
            type="date"
            value={formData.id_card_expiry_date}
            onChange={handleChange}
          />
        </div>

        {/* Document uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <DocumentUpload
            label="Recto de la pièce d'identité"
            onFileSelected={(file) => setFiles((prev) => ({ ...prev, idCardFront: file || undefined }))}
            accept="image/*,application/pdf"
          />

          <DocumentUpload
            label="Verso de la pièce d'identité"
            onFileSelected={(file) => setFiles((prev) => ({ ...prev, idCardBack: file || undefined }))}
            accept="image/*,application/pdf"
          />
        </div>
      </div>

      {/* Informations professionnelles */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="Ingénieur informatique"
          />

          <Input
            label="Employeur"
            name="employer"
            value={formData.employer}
            onChange={handleChange}
            placeholder="Nom de l'entreprise"
          />

          <Input
            label="Revenu mensuel (€)"
            name="monthly_income"
            type="number"
            value={formData.monthly_income || ''}
            onChange={handleChange}
            min="0"
            step="100"
            placeholder="2500"
          />
        </div>
      </div>

      {/* Notes et statut */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Informations complémentaires</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Notes additionnelles sur le locataire..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
            Locataire actif
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};
