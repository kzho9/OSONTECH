import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';

export default function HomePage() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('welcome')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              {t('description')}
            </p>
            <div className="space-x-4">
              <a
                href="/auth/register"
                className="bg-white text-primary-600 px-8 py-3 rounded-md font-semibold hover:bg-primary-50 transition-colors duration-200 inline-block"
              >
                Начать сейчас
              </a>
              <a
                href="/pricing"
                className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200 inline-block"
              >
                {t('nav.pricing')}
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                Преимущества OSON VPN
              </h2>
              <p className="text-lg text-secondary-600">
                Безопасность, скорость и простота использования
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card text-center animate-slide-up">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Безопасность
                </h3>
                <p className="text-secondary-600">
                  Современное шифрование и защита ваших данных
                </p>
              </div>

              <div className="card text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Высокая скорость
                </h3>
                <p className="text-secondary-600">
                  Быстрые серверы по всему миру для комфортного использования
                </p>
              </div>

              <div className="card text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Простота
                </h3>
                <p className="text-secondary-600">
                  Легкая настройка и использование на любых устройствах
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-secondary-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Готовы обезопасить свой интернет?
            </h2>
            <p className="text-xl text-secondary-300 mb-8">
              Присоединяйтесь к тысячам пользователей, которые доверяют OSON VPN
            </p>
            <a
              href="/auth/register"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-semibold transition-colors duration-200 inline-block"
            >
              Начать бесплатно
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
  },
});