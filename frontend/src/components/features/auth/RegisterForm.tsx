import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Alert } from '../../ui';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from '@tanstack/react-router';

const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  password_confirmation: z.string(),
  phone: z.string().optional(),
  is_company: z.boolean(),
  company_name: z.string().optional(),
  company_siret: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirmation'],
}).refine((data) => {
  // Si is_company est true, company_name et company_siret sont requis
  if (data.is_company) {
    return !!data.company_name && !!data.company_siret;
  }
  return true;
}, {
  message: 'Le nom et le SIRET de l\'entreprise sont requis pour un compte professionnel',
  path: ['company_name'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { register: registerUser, isRegistering, registerError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      is_company: false,
    },
  });

  const isCompany = watch('is_company');

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Créer un compte</h2>
        <p className="mt-2 text-sm text-gray-600">
          Commencez à gérer vos biens immobiliers dès aujourd'hui
        </p>
      </div>

      {registerError && (
        <Alert variant="error">
          {registerError instanceof Error ? registerError.message : 'Erreur lors de l\'inscription'}
        </Alert>
      )}

      <div className="space-y-4">
        {/* Type de compte */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <label className="flex items-center cursor-pointer">
            <input
              {...register('is_company')}
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Compte professionnel (bailleur)
            </span>
          </label>
        </div>

        <Input
          {...register('name')}
          type="text"
          label={isCompany ? 'Nom du responsable' : 'Nom complet'}
          placeholder="Jean Dupont"
          error={errors.name?.message}
          fullWidth
          autoComplete="name"
          disabled={isRegistering}
        />

        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="vous@exemple.com"
          error={errors.email?.message}
          fullWidth
          autoComplete="email"
          disabled={isRegistering}
        />

        <Input
          {...register('phone')}
          type="tel"
          label="Téléphone (optionnel)"
          placeholder="+33 6 12 34 56 78"
          error={errors.phone?.message}
          fullWidth
          autoComplete="tel"
          disabled={isRegistering}
        />

        {isCompany && (
          <>
            <Input
              {...register('company_name')}
              type="text"
              label="Nom de l'entreprise"
              placeholder="Ma Société Immobilière"
              error={errors.company_name?.message}
              fullWidth
              autoComplete="organization"
              disabled={isRegistering}
            />

            <Input
              {...register('company_siret')}
              type="text"
              label="SIRET"
              placeholder="123 456 789 00012"
              error={errors.company_siret?.message}
              fullWidth
              disabled={isRegistering}
              helperText="14 chiffres"
            />
          </>
        )}

        <div className="relative">
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="Mot de passe"
            placeholder="••••••••"
            error={errors.password?.message}
            fullWidth
            autoComplete="new-password"
            disabled={isRegistering}
            helperText="Au moins 8 caractères"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-sm text-gray-600 hover:text-gray-900"
            disabled={isRegistering}
          >
            {showPassword ? 'Masquer' : 'Afficher'}
          </button>
        </div>

        <div className="relative">
          <Input
            {...register('password_confirmation')}
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            error={errors.password_confirmation?.message}
            fullWidth
            autoComplete="new-password"
            disabled={isRegistering}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-sm text-gray-600 hover:text-gray-900"
            disabled={isRegistering}
          >
            {showConfirmPassword ? 'Masquer' : 'Afficher'}
          </button>
        </div>
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          required
          className="h-4 w-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="ml-2 text-sm text-gray-600">
          J'accepte les{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-700">
            conditions d'utilisation
          </a>{' '}
          et la{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-700">
            politique de confidentialité
          </a>
        </label>
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isRegistering}
        disabled={isRegistering}
      >
        {isRegistering ? 'Création du compte...' : 'Créer mon compte'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </form>
  );
};
