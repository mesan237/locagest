import React, { useState } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import { PhotoUploader } from '../../components/features/properties/PhotoUploader';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export const PropertyDetails: React.FC = () => {
  const { id } = useParams({ from: '/properties/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);

  // Fetch property details
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getProperty(Number(id)),
  });

  // Upload photos mutation
  const uploadPhotosMutation = useMutation({
    mutationFn: (files: File[]) => propertyService.uploadPhotos(Number(id), files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      setShowPhotoUploader(false);
    },
  });

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: (photoId: number) => propertyService.deletePhoto(Number(id), photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', id] });
    },
  });

  // Set main photo mutation
  const setMainPhotoMutation = useMutation({
    mutationFn: (photoId: number) => propertyService.setMainPhoto(Number(id), photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', id] });
    },
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: () => propertyService.deleteProperty(Number(id)),
    onSuccess: () => {
      navigate({ to: '/properties' });
    },
  });

  const handlePhotosSelected = (files: File[]) => {
    uploadPhotosMutation.mutate(files);
  };

  const handleDeletePhoto = (photoId: number) => {
    if (confirm('Voulez-vous vraiment supprimer cette photo ?')) {
      deletePhotoMutation.mutate(photoId);
    }
  };

  const handleSetMainPhoto = (photoId: number) => {
    setMainPhotoMutation.mutate(photoId);
  };

  const handleDeleteProperty = () => {
    if (confirm('Voulez-vous vraiment supprimer ce bien ? Cette action est irréversible.')) {
      deletePropertyMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </AppLayout>
    );
  }

  if (error || !property) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Erreur lors du chargement du bien</p>
          <Button onClick={() => navigate({ to: '/properties' })} className="mt-4">
            Retour à la liste
          </Button>
        </div>
      </AppLayout>
    );
  }

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    rented: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-orange-100 text-orange-800',
    reserved: 'bg-purple-100 text-purple-800',
  };

  return (
    <AppLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusColors[property.status]
              }`}
            >
              {property.status_label}
            </span>
          </div>
          <p className="mt-2 text-gray-600">
            Référence: {property.reference} • {property.type_label}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link to="/properties/$id/edit" params={{ id: id as string }}>
            <Button variant="secondary">Modifier</Button>
          </Link>
          <Button
            variant="secondary"
            onClick={handleDeleteProperty}
            disabled={deletePropertyMutation.isPending}
          >
            Supprimer
          </Button>
        </div>
      </div>

      {/* Photos */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Photos</h2>
          <Button onClick={() => setShowPhotoUploader(!showPhotoUploader)}>
            {showPhotoUploader ? 'Annuler' : 'Ajouter des photos'}
          </Button>
        </div>

        {showPhotoUploader && (
          <div className="mb-6">
            <PhotoUploader
              onFilesSelected={handlePhotosSelected}
              maxFiles={10}
              maxSizeMB={5}
            />
          </div>
        )}

        {property.photos && property.photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {property.photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.file_url}
                  alt={photo.caption || property.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {photo.is_main && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Photo principale
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-between text-xs">
                    {!photo.is_main && (
                      <button
                        onClick={() => handleSetMainPhoto(photo.id)}
                        className="hover:underline"
                      >
                        Définir comme principale
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="text-red-300 hover:text-red-100"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Aucune photo</p>
        )}
      </Card>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Adresse */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Adresse</h2>
          <div className="space-y-2 text-gray-700">
            <p>{property.address}</p>
            {property.address_complement && <p>{property.address_complement}</p>}
            <p>
              {property.postal_code} {property.city}
            </p>
            <p>{property.country}</p>
            {property.cadastral_reference && (
              <p className="text-sm text-gray-500">
                Réf. cadastrale: {property.cadastral_reference}
              </p>
            )}
          </div>
        </Card>

        {/* Caractéristiques */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Caractéristiques</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Surface</p>
              <p className="font-semibold">{property.surface_area} m²</p>
            </div>
            {property.rooms && (
              <div>
                <p className="text-sm text-gray-500">Pièces</p>
                <p className="font-semibold">{property.rooms}</p>
              </div>
            )}
            {property.bedrooms && (
              <div>
                <p className="text-sm text-gray-500">Chambres</p>
                <p className="font-semibold">{property.bedrooms}</p>
              </div>
            )}
            {property.bathrooms && (
              <div>
                <p className="text-sm text-gray-500">Salles de bain</p>
                <p className="font-semibold">{property.bathrooms}</p>
              </div>
            )}
            {property.floor !== undefined && property.floor !== null && (
              <div>
                <p className="text-sm text-gray-500">Étage</p>
                <p className="font-semibold">{property.floor}</p>
              </div>
            )}
            {property.construction_year && (
              <div>
                <p className="text-sm text-gray-500">Année de construction</p>
                <p className="font-semibold">{property.construction_year}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Description */}
      {property.description && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
        </Card>
      )}

      {/* Équipements */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Équipements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'is_furnished', label: 'Meublé' },
            { key: 'has_parking', label: 'Parking' },
            { key: 'has_elevator', label: 'Ascenseur' },
            { key: 'has_balcony', label: 'Balcon' },
            { key: 'has_terrace', label: 'Terrasse' },
            { key: 'has_garden', label: 'Jardin' },
            { key: 'has_garage', label: 'Garage' },
            { key: 'has_cellar', label: 'Cave' },
          ].map((item) => (
            <div key={item.key} className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full ${
                  property[item.key as keyof typeof property]
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance énergétique */}
      {(property.energy_rating || property.ges_rating) && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Performance énergétique</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {property.energy_rating && (
              <div>
                <p className="text-sm text-gray-500 mb-2">DPE</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">{property.energy_rating}</span>
                  {property.energy_consumption && (
                    <span className="text-sm text-gray-500">
                      ({property.energy_consumption} kWh/m²/an)
                    </span>
                  )}
                </div>
              </div>
            )}
            {property.ges_rating && (
              <div>
                <p className="text-sm text-gray-500 mb-2">GES</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">{property.ges_rating}</span>
                  {property.ges_emission && (
                    <span className="text-sm text-gray-500">
                      ({property.ges_emission} kg CO₂/m²/an)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Informations financières */}
      {property.estimated_value && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Informations financières</h2>
          <div>
            <p className="text-sm text-gray-500">Valeur estimée</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              }).format(property.estimated_value)}
            </p>
          </div>
        </Card>
      )}
      </div>
    </AppLayout>
  );
};
