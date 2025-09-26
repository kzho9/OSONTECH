import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { t } = useTranslation('common');
  const { user, isAuthenticated, isUserLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-secondary-900">
              {t('dashboard.welcome')}, {user?.first_name}!
            </h1>
            <p className="text-secondary-600 mt-2">
              Управление вашими VPN подключениями и подписками
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Active Subscription Card */}
            <div className="card animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">
                  {t('dashboard.activeSubscription')}
                </h3>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-secondary-600">Статус: <span className="text-green-600 font-medium">Активна</span></p>
                <p className="text-sm text-secondary-600">Истекает: <span className="font-medium">15 дней</span></p>
                <p className="text-sm text-secondary-600">Тариф: <span className="font-medium">Месячный</span></p>
              </div>
              <button className="btn-primary w-full mt-4">
                Продлить подписку
              </button>
            </div>

            {/* VPN Configurations Card */}
            <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">
                  {t('dashboard.vpnConfigs')}
                </h3>
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-secondary-600">Сервер: <span className="font-medium">Netherlands #1</span></p>
                <p className="text-sm text-secondary-600">Протокол: <span className="font-medium">Shadowsocks</span></p>
                <p className="text-sm text-secondary-600">Статус: <span className="text-green-600 font-medium">Подключен</span></p>
              </div>
              <div className="flex space-x-2 mt-4">
                <button className="btn-primary flex-1">Скачать конфиг</button>
                <button className="btn-secondary">QR-код</button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Статистика
                </h3>
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-secondary-600">Использовано: <span className="font-medium">2.5 GB</span></p>
                <p className="text-sm text-secondary-600">Доступно: <span className="font-medium">Безлимит</span></p>
                <p className="text-sm text-secondary-600">Скорость: <span className="font-medium">50 Mbps</span></p>
              </div>
              <div className="mt-4">
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                {t('dashboard.paymentHistory')}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200">
                  <thead className="bg-secondary-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Дата
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Описание
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Сумма
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Статус
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-secondary-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        26.09.2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        Месячная подписка
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        $9.99
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Оплачено
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        26.08.2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        Месячная подписка
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        $9.99
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Оплачено
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
  },
});