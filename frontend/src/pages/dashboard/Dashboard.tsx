import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { Card, CardHeader, CardTitle, CardContent, Button, Spinner, Alert } from '../../components/ui';
import { Link } from '@tanstack/react-router';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { stats, recentRents, upcomingRents, isLoading, isError, error } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Locagest Pro</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/properties">
                <Button variant="ghost" size="sm">
                  Propriétés
                </Button>
              </Link>
              <span className="text-sm text-gray-700">
                {user?.name}
                {user?.is_company && user?.company_name && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({user.company_name})
                  </span>
                )}
              </span>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Bienvenue {user?.is_company ? 'sur votre espace bailleur' : 'sur votre espace locataire'}
          </h2>
          <p className="mt-2 text-gray-600">
            Tableau de bord - Locagest Pro
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {isError && (
          <Alert variant="error" title="Erreur">
            {error instanceof Error ? error.message : 'Impossible de charger les statistiques'}
          </Alert>
        )}

        {!isLoading && !isError && stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Propriétés</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">{stats.total_properties}</p>
                  <p className="text-sm text-gray-600 mt-2">Biens immobiliers</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {stats.rented_properties} louées · {stats.available_properties} disponibles
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Locataires</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">{stats.total_tenants}</p>
                  <p className="text-sm text-gray-600 mt-2">Locataires actifs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenus du mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.monthly_revenue)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Loyers encaissés</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taux d'occupation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-600">{stats.occupancy_rate}%</p>
                  <p className="text-sm text-gray-600 mt-2">Occupation</p>
                  {stats.pending_payments > 0 && (
                    <div className="mt-2 text-xs text-red-600">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.pending_payments)} en attente
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {upcomingRents.length > 0 && (
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Loyers à venir (30 prochains jours)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propriété</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Locataire</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Échéance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {upcomingRents.map((rent) => (
                            <tr key={rent.id}>
                              <td className="px-4 py-3 text-sm text-gray-900">{rent.property_name}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{rent.tenant_name}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(rent.amount)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {new Date(rent.due_date).toLocaleDateString('fr-FR')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nom</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                </div>
                {user?.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.phone}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type de compte</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.is_company ? 'Professionnel (Bailleur)' : 'Particulier (Locataire)'}
                  </dd>
                </div>
                {user?.is_company && user?.company_name && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Entreprise</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.company_name}</dd>
                    </div>
                    {user.company_siret && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">SIRET</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.company_siret}</dd>
                      </div>
                    )}
                  </>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
