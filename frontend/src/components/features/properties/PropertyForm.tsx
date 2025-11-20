import React, { useState } from 'react';
import type { PropertyFormData } from '../../../types.js';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData) => void;
  isSubmitting?: boolean;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    name: initialData?.name || '',
    type: initialData?.type || 'apartment',
    address: initialData?.address || '',
    address_complement: initialData?.address_complement || '',
    city: initialData?.city || '',
    postal_code: initialData?.postal_code || '',
    country: initialData?.country || 'France',
    surface_area: initialData?.surface_area || 0,
    rooms: initialData?.rooms,
    bedrooms: initialData?.bedrooms,
    bathrooms: initialData?.bathrooms,
    floor: initialData?.floor,
    construction_year: initialData?.construction_year,
    description: initialData?.description || '',
    status: initialData?.status || 'available',
    is_furnished: initialData?.is_furnished || false,
    has_parking: initialData?.has_parking || false,
    has_elevator: initialData?.has_elevator || false,
    has_balcony: initialData?.has_balcony || false,
    has_terrace: initialData?.has_terrace || false,
    has_garden: initialData?.has_garden || false,
    has_garage: initialData?.has_garage || false,
    has_cellar: initialData?.has_cellar || false,
    energy_rating: initialData?.energy_rating,
    ges_rating: initialData?.ges_rating,
    energy_consumption: initialData?.energy_consumption,
    ges_emission: initialData?.ges_emission,
    estimated_value: initialData?.estimated_value,
    latitude: initialData?.latitude,
    longitude: initialData?.longitude,
    cadastral_reference: initialData?.cadastral_reference || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
      {/* Informations de base */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Informations de base</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Nom du bien"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ex: Appartement T3 centre-ville"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de bien <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="apartment">Appartement</option>
              <option value="house">Maison</option>
              <option value="commercial">Local commercial</option>
              <option value="parking">Parking</option>
              <option value="land">Terrain</option>
              <option value="office">Bureau</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="available">Disponible</option>
              <option value="rented">Loué</option>
              <option value="maintenance">En maintenance</option>
              <option value="reserved">Réservé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Adresse */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Adresse"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="12 rue de la République"
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Complément d'adresse"
              name="address_complement"
              value={formData.address_complement}
              onChange={handleChange}
              placeholder="Bâtiment A, Appartement 5"
            />
          </div>

          <Input
            label="Ville"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="Paris"
          />

          <Input
            label="Code postal"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            required
            placeholder="75001"
          />

          <Input
            label="Pays"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />

          <Input
            label="Référence cadastrale"
            name="cadastral_reference"
            value={formData.cadastral_reference}
            onChange={handleChange}
            placeholder="AB 123 456"
          />
        </div>
      </div>

      {/* Caractéristiques */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Caractéristiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Surface (m²)"
            name="surface_area"
            type="number"
            value={formData.surface_area}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />

          <Input
            label="Nombre de pièces"
            name="rooms"
            type="number"
            value={formData.rooms || ''}
            onChange={handleChange}
            min="0"
          />

          <Input
            label="Chambres"
            name="bedrooms"
            type="number"
            value={formData.bedrooms || ''}
            onChange={handleChange}
            min="0"
          />

          <Input
            label="Salles de bain"
            name="bathrooms"
            type="number"
            value={formData.bathrooms || ''}
            onChange={handleChange}
            min="0"
          />

          <Input
            label="Étage"
            name="floor"
            type="number"
            value={formData.floor || ''}
            onChange={handleChange}
          />

          <Input
            label="Année de construction"
            name="construction_year"
            type="number"
            value={formData.construction_year || ''}
            onChange={handleChange}
            min="1800"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez le bien..."
          />
        </div>
      </div>

      {/* Équipements */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Équipements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'is_furnished', label: 'Meublé' },
            { name: 'has_parking', label: 'Parking' },
            { name: 'has_elevator', label: 'Ascenseur' },
            { name: 'has_balcony', label: 'Balcon' },
            { name: 'has_terrace', label: 'Terrasse' },
            { name: 'has_garden', label: 'Jardin' },
            { name: 'has_garage', label: 'Garage' },
            { name: 'has_cellar', label: 'Cave' },
          ].map((item) => (
            <div key={item.name} className="flex items-center">
              <input
                type="checkbox"
                id={item.name}
                name={item.name}
                checked={formData[item.name as keyof PropertyFormData] as boolean}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={item.name} className="ml-2 text-sm text-gray-700">
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Performance énergétique */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Performance énergétique</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DPE</label>
            <select
              name="energy_rating"
              value={formData.energy_rating || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Non renseigné</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GES</label>
            <select
              name="ges_rating"
              value={formData.ges_rating || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Non renseigné</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
            </select>
          </div>

          <Input
            label="Consommation énergétique (kWh/m²/an)"
            name="energy_consumption"
            type="number"
            value={formData.energy_consumption || ''}
            onChange={handleChange}
            min="0"
          />

          <Input
            label="Émission GES (kg CO2/m²/an)"
            name="ges_emission"
            type="number"
            value={formData.ges_emission || ''}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      {/* Informations financières */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Informations financières</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Valeur estimée (€)"
            name="estimated_value"
            type="number"
            value={formData.estimated_value || ''}
            onChange={handleChange}
            min="0"
            step="1000"
          />
        </div>
      </div>

      {/* Localisation GPS */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Localisation GPS (optionnel)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Latitude"
            name="latitude"
            type="number"
            value={formData.latitude || ''}
            onChange={handleChange}
            step="0.000001"
            placeholder="48.856614"
          />

          <Input
            label="Longitude"
            name="longitude"
            type="number"
            value={formData.longitude || ''}
            onChange={handleChange}
            step="0.000001"
            placeholder="2.352222"
          />
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
