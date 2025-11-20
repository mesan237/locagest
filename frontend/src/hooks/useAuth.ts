import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { authService, type LoginCredentials, type RegisterData, type UpdateProfileData, type UpdatePasswordData } from '../services/authService';
import { useNavigate } from '@tanstack/react-router';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, setAuth, logout: logoutStore } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate({ to: '/dashboard' });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate({ to: '/dashboard' });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      navigate({ to: '/login' });
    },
    onError: () => {
      // Even if the API call fails, logout the user locally
      logoutStore();
      queryClient.clear();
      navigate({ to: '/login' });
    },
  });

  // Logout all mutation
  const logoutAllMutation = useMutation({
    mutationFn: () => authService.logoutAll(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      navigate({ to: '/login' });
    },
    onError: () => {
      // Even if the API call fails, logout the user locally
      logoutStore();
      queryClient.clear();
      navigate({ to: '/login' });
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      if (token) {
        setAuth(updatedUser, token);
      }
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (data: UpdatePasswordData) => authService.updatePassword(data),
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: () => authService.deleteAccount(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      navigate({ to: '/login' });
    },
  });

  // Fetch current user query
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => authService.me(),
    enabled: isAuthenticated && !!token,
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  return {
    // State
    user: currentUser || user,
    token,
    isAuthenticated,
    isLoadingUser,

    // Mutations
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    logoutAll: logoutAllMutation.mutate,
    isLoggingOutAll: logoutAllMutation.isPending,

    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,

    updatePassword: updatePasswordMutation.mutate,
    updatePasswordAsync: updatePasswordMutation.mutateAsync,
    isUpdatingPassword: updatePasswordMutation.isPending,
    updatePasswordError: updatePasswordMutation.error,

    deleteAccount: deleteAccountMutation.mutate,
    isDeletingAccount: deleteAccountMutation.isPending,
  };
};
