import { useState } from 'react';
import { useProperties } from '../../hooks/useProperties';
import { Card, CardHeader, CardTitle, CardContent, Button, Spinner, Alert } from '../../components/ui';
import { Link } from '@tanstack/react-router';
import type { PropertyFilters } from '../../types';

export const PropertiesPage = () => {
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    per_page: 12,
  });

  const { properties, pagination, isLoading, isError, error } = useProperties(filters);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
                Locagest Pro
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Mes Propriétés</h2>
            <p className="mt-2 text-gray-600">
              {pagination ? `${pagination.total} bien(s) immobilier(s)` : 'Chargement...'}
            </p>
          </div>
          <Button>+ Ajouter une propriété</Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined, page: 1 })}
          >
            <option value="">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="rented">Loué</option>
            <option value="maintenance">Maintenance</option>
            <option value="reserved">Réservé</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.type || ''}
            onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined, page: 1 })}
          >
            <option value="">Tous les types</option>
            <option value="apartment">Appartement</option>
            <option value="house">Maison</option>
            <option value="commercial">Commercial</option>
            <option value="parking">Parking</option>
            <option value="land">Terrain</option>
            <option value="office">Bureau</option>
          </select>

          <input
            type="text"
            placeholder="Rechercher..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined, page: 1 })}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Alert variant="error" title="Erreur">
            {error instanceof Error ? error.message : 'Impossible de charger les propriétés'}
          </Alert>
        )}

        {/* Properties Grid */}
        {!isLoading && !isError && (
          <>
            {properties.length === 0 ? (
              <Card>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">Aucune propriété trouvée</p>
                    <Button>Créer votre première propriété</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                      {property.main_photo ? (
                        <img
                          src={property.main_photo.file_url}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Pas de photo
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            property.status === 'available'
                              ? 'bg-green-100 text-green-800'
                              : property.status === 'rented'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {property.status_label}
                        </span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{property.name}</CardTitle>
                      <p className="text-sm text-gray-600">{property.reference}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">{property.type_label}</p>
                      <p className="text-sm text-gray-600 mb-4">
                        {property.city}, {property.postal_code}
                      </p>
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span>{property.surface_area} m²</span>
                        {property.rooms && <span>{property.rooms} pièces</span>}
                        {property.bedrooms && <span>{property.bedrooms} chambres</span>}
                      </div>
                      <Button variant="primary" fullWidth size="sm">
                        Voir détails
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.lastPage > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pagination.currentPage === 1}
                  onClick={() => setFilters({ ...filters, page: Math.max(1, pagination.currentPage - 1) })}
                >
                  Précédent
                </Button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {pagination.currentPage} sur {pagination.lastPage}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pagination.currentPage === pagination.lastPage}
                  onClick={() => setFilters({ ...filters, page: Math.min(pagination.lastPage, pagination.currentPage + 1) })}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
