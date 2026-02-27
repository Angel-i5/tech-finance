import { useState, useEffect, ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticles, fetchSettings } from '../api';
import { Article, BlogSettings } from '../types';
import { format } from 'date-fns';
import { ArrowRight, Cpu, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { AdBanner } from '../components/AdBanner';

export function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'views'>('latest');

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchArticles(sortBy),
      fetchSettings()
    ])
      .then(([articlesData, settingsData]) => {
        setArticles(articlesData);
        setSettings(settingsData);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar los artículos. Verifica la configuración de Supabase.');
      })
      .finally(() => setLoading(false));
  }, [sortBy]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="bg-black/5 p-8 rounded-3xl">
          <h2 className="text-xl font-bold mb-4">Aviso de Configuración</h2>
          <p className="text-black/60 mb-6">{error}</p>
          <p className="text-xs text-black/40">Asegúrate de configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en los Secretos de AI Studio.</p>
        </div>
      </div>
    );
  }

  const techArticles = articles.filter(a => a.category === 'Technology');
  const financeArticles = articles.filter(a => a.category === 'Finance');

  return (
    <div className="space-y-20">
      {/* Header Ad */}
      <AdBanner htmlCode={settings?.banner_header} className="my-4" />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden rounded-3xl bg-black text-white">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/tech/1920/1080" 
            className="w-full h-full object-cover"
            alt="Hero"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center max-w-3xl px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            El Futuro de la <span className="italic font-serif">Riqueza</span> & <span className="italic font-serif">Inteligencia artificial</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/80 mb-8"
          >
            Análisis profundos sobre productividad con IA y libertad financiera.
          </motion.p>
        </div>
      </section>

      {/* Sorting Controls */}
      <div className="flex justify-end gap-4 border-b border-black/5 pb-4">
        <button 
          onClick={() => setSortBy('latest')}
          className={`text-sm font-bold uppercase tracking-widest transition-colors ${sortBy === 'latest' ? 'text-black' : 'text-black/20 hover:text-black/40'}`}
        >
          Recientes
        </button>
        <button 
          onClick={() => setSortBy('views')}
          className={`text-sm font-bold uppercase tracking-widest transition-colors ${sortBy === 'views' ? 'text-black' : 'text-black/20 hover:text-black/40'}`}
        >
          Más Vistos
        </button>
      </div>

      {/* Adsterra Banner (Native/Sidebar) */}
      <AdBanner htmlCode={settings?.banner_sidebar} className="w-full min-h-[100px] bg-black/5 rounded-2xl" />

      {/* Technology Section */}
      <section>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
            <Cpu size={20} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Tecnología e IA</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techArticles.length > 0 ? techArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          )) : (
            <p className="text-black/40 italic">No hay artículos aún en esta categoría.</p>
          )}
        </div>
      </section>

      {/* Finance Section */}
      <section>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
            <TrendingUp size={20} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Finanzas e Inversión</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {financeArticles.length > 0 ? financeArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          )) : (
            <p className="text-black/40 italic">No hay artículos aún en esta categoría.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function ArticleCard({ article }: ComponentProps<typeof Link> & { article: Article }) {
  const categoryMap: Record<string, string> = {
    'Technology': 'Tecnología',
    'Finance': 'Finanzas'
  };

  return (
    <Link to={`/article/${article.slug}`} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-4 bg-black/5">
        <img 
          src={article.image_url || `https://picsum.photos/seed/${article.slug}/800/500`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={article.title}
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
            {categoryMap[article.category] || article.category}
          </span>
        </div>
      </div>
      <h3 className="text-xl font-bold leading-tight mb-2 group-hover:underline decoration-2 underline-offset-4">
        {article.title}
      </h3>
      <p className="text-sm text-black/60 line-clamp-2 mb-4">
        {article.excerpt}
      </p>
      <div className="flex items-center justify-between text-[11px] font-medium text-black/40 uppercase tracking-widest">
        <span>{format(new Date(article.published_at), 'dd MMM, yyyy')}</span>
        <div className="flex items-center gap-1 group-hover:text-black transition-colors">
          Leer Más <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}
