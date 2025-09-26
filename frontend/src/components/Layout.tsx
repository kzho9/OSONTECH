import { ReactNode } from 'react';
import { useTranslation } from 'next-i18next';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useTranslation('common');
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-secondary-50">
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">OSON VPN</h1>
            </div>

            <nav className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-secondary-600">
                    {t('dashboard.welcome')}, {user?.first_name}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm text-secondary-600 hover:text-secondary-900"
                  >
                    {t('auth.logout')}
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/auth/login"
                    className="text-sm text-secondary-600 hover:text-secondary-900"
                  >
                    {t('nav.login')}
                  </a>
                  <a
                    href="/auth/register"
                    className="btn-primary text-sm"
                  >
                    {t('nav.register')}
                  </a>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-white border-t border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-secondary-600">
            © 2025 OSON VPN. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}