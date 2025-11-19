import { Card } from '../../components/ui';
import { RegisterForm } from '../../components/features/auth/RegisterForm';

export const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Locagest Pro</h1>
          <p className="text-gray-600 mt-2">Gestion immobilière simplifiée</p>
        </div>

        <Card variant="elevated" padding="lg">
          <RegisterForm />
        </Card>
      </div>
    </div>
  );
};
