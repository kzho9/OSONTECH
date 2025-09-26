import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { authApi, LoginData, RegisterData, AuthResponse } from '@/api/auth';
import { userApi, UserProfile } from '@/api/user';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      queryClient.setQueryData(['user'], data.user);
      toast.success('Вход выполнен успешно');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Ошибка входа';
      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      queryClient.setQueryData(['user'], data.user);
      toast.success('Регистрация прошла успешно');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Ошибка регистрации';
      toast.error(message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success('Выход выполнен');
      router.push('/');
    },
    onError: () => {
      // Force logout even if API call fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      queryClient.clear();
      router.push('/');
    },
  });

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => userApi.getProfile(),
    enabled: !!localStorage.getItem('access_token'),
    retry: false,
  });

  const isAuthenticated = !!localStorage.getItem('access_token') && !userQuery.isError;

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    user: userQuery.data,
    isAuthenticated,
    isUserLoading: userQuery.isLoading,
  };
};