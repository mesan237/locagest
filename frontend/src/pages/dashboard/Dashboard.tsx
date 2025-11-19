import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/ui';

export const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Locagest Pro</h1>
            </div>
            <div className="flex items-center gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Propriétés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600 mt-2">Biens immobiliers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Locataires</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-600 mt-2">Locataires actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenus du mois</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">0 €</p>
              <p className="text-sm text-gray-600 mt-2">Loyers encaissés</p>
            </CardContent>
          </Card>
        </div>

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
