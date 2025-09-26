import { useState } from 'react';
import { GetStaticProps } from 'next';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { LoginData } from '@/api/auth';

export default function LoginPage() {
  const { t } = useTranslation('common');
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit = (data: LoginData) => {
    login(data);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-secondary-900">
                {t('auth.login')}
              </h2>
              <p className="mt-2 text-sm text-secondary-600">
                {t('auth.dontHaveAccount')}{' '}
                <a href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
                  {t('auth.register')}
                </a>
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
                    {t('auth.email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="your@email.com"
                    {...register('email', {
                      required: t('errors.required'),
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: t('errors.invalidEmail'),
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="••••••••"
                      {...register('password', {
                        required: t('errors.required'),
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <svg
                        className={`h-5 w-5 text-secondary-400 ${showPassword ? 'hidden' : 'block'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg
                        className={`h-5 w-5 text-secondary-400 ${showPassword ? 'block' : 'hidden'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                    {t('auth.forgotPassword')}
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Вход...' : t('auth.login')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
  },
});