import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Alert } from '../../ui';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from '@tanstack/react-router';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, isLoggingIn, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
        <p className="mt-2 text-sm text-gray-600">
          Connectez-vous à votre compte Locagest Pro
        </p>
      </div>

      {loginError && (
        <Alert variant="error">
          {loginError instanceof Error ? loginError.message : 'Erreur de connexion'}
        </Alert>
      )}

      <div className="space-y-4">
        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="vous@exemple.com"
          error={errors.email?.message}
          fullWidth
          autoComplete="email"
          disabled={isLoggingIn}
        />

        <div className="relative">
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="Mot de passe"
            placeholder="••••••••"
            error={errors.password?.message}
            fullWidth
            autoComplete="current-password"
            disabled={isLoggingIn}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-sm text-gray-600 hover:text-gray-900"
            disabled={isLoggingIn}
          >
            {showPassword ? 'Masquer' : 'Afficher'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
        </label>

        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isLoggingIn}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? 'Connexion...' : 'Se connecter'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </form>
  );
};
