import React from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantService } from '../../services/tenantService';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export const TenantDetails: React.FC = () => {
  const { id } = useParams({ from: '/tenants/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch tenant details
  const { data: tenant, isLoading, error } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => tenantService.getTenant(Number(id)),
  });

  // Delete tenant mutation
  const deleteTenantMutation = useMutation({
    mutationFn: () => tenantService.deleteTenant(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      navigate({ to: '/tenants' });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Erreur lors de la suppression du locataire');
    },
  });

  const handleDeleteTenant = () => {
    if (
      confirm(
        'Voulez-vous vraiment supprimer ce locataire ? Cette action est irréversible.'
      )
    ) {
      deleteTenantMutation.mutate();
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

  if (error || !tenant) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Erreur lors du chargement du locataire</p>
          <Button onClick={() => navigate({ to: '/tenants' })} className="mt-4">
            Retour à la liste
          </Button>
        </div>
      </AppLayout>
    );
  }

  // Generate initials for avatar
  const initials = `${tenant.first_name[0]}${tenant.last_name[0]}`.toUpperCase();

  // Generate avatar background color
  const avatarColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-indigo-500',
  ];
  const colorIndex = (tenant.first_name.charCodeAt(0) + tenant.last_name.charCodeAt(0)) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  const idCardTypeLabels: Record<string, string> = {
    id_card: "Carte d'identité",
    passport: 'Passeport',
    residence_permit: 'Titre de séjour',
  };

  return (
    <AppLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div
            className={`w-16 h-16 rounded-full ${avatarColor} flex items-center justify-center text-white text-2xl font-bold`}
          >
            {initials}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">{tenant.full_name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tenant.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {tenant.is_active ? 'Actif' : 'Inactif'}
              </span>
            </div>
            {tenant.age && (
              <p className="mt-1 text-gray-600">
                {tenant.age} ans • {tenant.nationality}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Link to="/tenants/$id/edit" params={{ id: id as string }}>
            <Button variant="secondary">Modifier</Button>
          </Link>
          <Button
            variant="secondary"
            onClick={handleDeleteTenant}
            disabled={deleteTenantMutation.isPending}
          >
            Supprimer
          </Button>
        </div>
      </div>

      {/* Contact Information */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Coordonnées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{tenant.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Téléphone</p>
            <p className="font-medium">{tenant.phone}</p>
          </div>
          {tenant.phone_secondary && (
            <div>
              <p className="text-sm text-gray-500">Téléphone secondaire</p>
              <p className="font-medium">{tenant.phone_secondary}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Personal Information */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Date de naissance</p>
            <p className="font-medium">
              {new Date(tenant.birth_date).toLocaleDateString('fr-FR')}
              {tenant.age && ` (${tenant.age} ans)`}
            </p>
          </div>
          {tenant.birth_place && (
            <div>
              <p className="text-sm text-gray-500">Lieu de naissance</p>
              <p className="font-medium">{tenant.birth_place}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Nationalité</p>
            <p className="font-medium">{tenant.nationality}</p>
          </div>
        </div>
      </Card>

      {/* ID Card Information */}
      {(tenant.id_card_number || tenant.id_card_type) && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Pièce d'identité</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenant.id_card_type && (
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">
                  {tenant.id_card_type_label || idCardTypeLabels[tenant.id_card_type]}
                </p>
              </div>
            )}
            {tenant.id_card_number && (
              <div>
                <p className="text-sm text-gray-500">Numéro</p>
                <p className="font-medium">{tenant.id_card_number}</p>
              </div>
            )}
            {tenant.id_card_expiry_date && (
              <div>
                <p className="text-sm text-gray-500">Date d'expiration</p>
                <p className="font-medium">
                  {new Date(tenant.id_card_expiry_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
          </div>

          {/* ID Card Documents */}
          {(tenant.id_card_front_path || tenant.id_card_back_path) && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {tenant.id_card_front_path && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Recto</p>
                  <img
                    src={tenant.id_card_front_path}
                    alt="Recto pièce d'identité"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
              {tenant.id_card_back_path && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Verso</p>
                  <img
                    src={tenant.id_card_back_path}
                    alt="Verso pièce d'identité"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Professional Information */}
      {(tenant.profession || tenant.employer || tenant.monthly_income) && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Informations professionnelles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenant.profession && (
              <div>
                <p className="text-sm text-gray-500">Profession</p>
                <p className="font-medium">{tenant.profession}</p>
              </div>
            )}
            {tenant.employer && (
              <div>
                <p className="text-sm text-gray-500">Employeur</p>
                <p className="font-medium">{tenant.employer}</p>
              </div>
            )}
            {tenant.monthly_income && (
              <div>
                <p className="text-sm text-gray-500">Revenu mensuel</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(tenant.monthly_income)}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Notes */}
      {tenant.notes && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{tenant.notes}</p>
        </Card>
      )}

      {/* Leases History */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Historique des baux</h2>
        {tenant.leases_count && tenant.leases_count > 0 ? (
          <p className="text-gray-600">
            Ce locataire a {tenant.leases_count} bail(s) associé(s).
          </p>
        ) : (
          <p className="text-gray-500">Aucun bail enregistré pour ce locataire.</p>
        )}
      </Card>
      </div>
    </AppLayout>
  );
};
