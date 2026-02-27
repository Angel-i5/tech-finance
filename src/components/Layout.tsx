import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Cpu, TrendingUp, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { fetchSettings } from '../api';
import { BlogSettings } from '../types';
import { AdBanner } from './AdBanner';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    fetchSettings().then(setSettings).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Cpu size={18} />
              </div>
              <span className="font-bold text-xl tracking-tight">TechFinance</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium hover:text-black/60 transition-colors">Inicio</Link>
              <Link to="/sobre-nosotros" className="text-sm font-medium hover:text-black/60 transition-colors">Sobre Nosotros</Link>
              <div className="h-4 w-px bg-black/10" />
              <Link to="/admin/login" className="flex items-center gap-1 text-sm font-medium hover:text-black/60 transition-colors">
                <ShieldCheck size={16} />
                Admin
              </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-black/5 px-4 py-4 space-y-4">
            <Link to="/" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
            <Link to="/sobre-nosotros" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Sobre Nosotros</Link>
            <Link to="/admin/login" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Admin</Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-black/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white">
                  <Cpu size={14} />
                </div>
                <span className="font-bold text-lg tracking-tight">TechFinance</span>
              </Link>
              <p className="text-sm text-black/60 leading-relaxed">
                Análisis sobre la intersección de la inteligencia artificial y la riqueza personal.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Categorías</h3>
              <ul className="space-y-2 text-sm text-black/60">
                <li><Link to="/" className="hover:text-black transition-colors">Tecnología e IA</Link></li>
                <li><Link to="/" className="hover:text-black transition-colors">Finanzas e Inversión</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-black/60">
                <li><Link to="/sobre-nosotros" className="hover:text-black transition-colors">Sobre Nosotros</Link></li>
                <li><Link to="/privacidad" className="hover:text-black transition-colors">Privacidad y Descargo</Link></li>
                <li><Link to="/admin/login" className="hover:text-black transition-colors">Admin</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-black/5 text-center text-xs text-black/40">
            © {new Date().getFullYear()} TechFinance Insights. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Adsterra Footer Banner */}
      {settings?.banner_footer && (
        <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-sm flex justify-center py-2 z-40 border-t border-black/5">
          <AdBanner htmlCode={settings.banner_footer} />
        </div>
      )}

      {/* Global Ad Scripts (Popunder & Social Bar) */}
      <AdBanner htmlCode={settings?.popunder_code} />
      <AdBanner htmlCode={settings?.social_bar_code} />
    </div>
  );
}
