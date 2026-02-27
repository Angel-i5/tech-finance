import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticleBySlug, incrementViews, likeArticle, fetchSettings } from '../api';
import { Article, BlogSettings } from '../types';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Share2, Clock, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { AdBanner } from '../components/AdBanner';

export function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      Promise.all([
        fetchArticleBySlug(slug),
        fetchSettings()
      ]).then(([articleData, settingsData]) => {
        setArticle(articleData);
        setSettings(settingsData);
        incrementViews(articleData.id);
      }).finally(() => setLoading(false));
    }
  }, [slug]);

  const processContent = (content: string) => {
    if (!settings?.smartlink_url || !settings?.smartlink_keywords) return content;
    
    const keywords = settings.smartlink_keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    if (keywords.length === 0) return content;

    let processedContent = content;
    keywords.forEach(keyword => {
      // Simple regex to find the keyword as a whole word, avoiding already linked text
      // This regex looks for the keyword not preceded by [ (markdown link text) or ! (image)
      // and not followed by ] (markdown link end)
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?<!\\[)\\b(${escapedKeyword})\\b(?![^\\(]*\\))`, 'gi');
      processedContent = processedContent.replace(regex, `[$1](${settings.smartlink_url})`);
    });
    
    return processedContent;
  };

  const handleLike = async () => {
    if (!article || liked) return;
    try {
      await likeArticle(article.id);
      setArticle({ ...article, likes: (article.likes || 0) + 1 });
      setLiked(true);
    } catch (err) {
      console.error('Error liking article', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
        <Link to="/" className="text-black/60 hover:text-black underline">Volver al inicio</Link>
      </div>
    );
  }

  const categoryMap: Record<string, string> = {
    'Technology': 'Tecnología e IA',
    'Finance': 'Finanzas e Inversión'
  };

  return (
    <article className="max-w-3xl mx-auto">
      <AdBanner htmlCode={settings?.banner_header} className="mb-8" />
      <Helmet>
        <title>{article.meta_title || article.title}</title>
        <meta name="description" content={article.meta_description || article.excerpt} />
        {article.meta_keywords && <meta name="keywords" content={article.meta_keywords} />}
        <meta property="og:title" content={article.meta_title || article.title} />
        <meta property="og:description" content={article.meta_description || article.excerpt} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
      </Helmet>

      <Link to="/" className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors mb-8">
        <ArrowLeft size={16} /> Volver al feed
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-black/40 mb-4">
          <span className="text-black">{categoryMap[article.category] || article.category}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Clock size={12} /> 5 min de lectura</span>
          <span>•</span>
          <span className="flex items-center gap-1">{article.views || 0} vistas</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
          {article.title}
        </h1>
        <div className="flex items-center justify-between border-y border-black/5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center font-bold text-sm">TF</div>
            <div>
              <p className="text-sm font-bold">Editorial TechFinance</p>
              <p className="text-xs text-black/40">{format(new Date(article.published_at), 'dd MMMM, yyyy')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-colors ${liked ? 'bg-red-50 text-red-500' : 'hover:bg-black/5 text-black/40 hover:text-black'}`}
            >
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              <span className="text-sm font-bold">{article.likes || 0}</span>
            </button>
            <button className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/40 hover:text-black">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </header>

      {article.image_url && (
        <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-black/5">
          <img 
            src={article.image_url} 
            className="w-full h-full object-cover"
            alt={article.title}
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Adsterra Placeholder (In-Article) */}
      <div className="my-12 p-4 bg-black/5 rounded-2xl flex flex-col items-center justify-center gap-2 text-[10px] text-black/20 uppercase tracking-widest">
        <div className="w-[300px] h-[250px] bg-white border border-black/10 flex items-center justify-center">
          Publicidad 300x250
        </div>
        <span>Anuncio</span>
      </div>

      <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-black prose-a:underline prose-img:rounded-2xl">
        <ReactMarkdown>{processContent(article.content)}</ReactMarkdown>
      </div>

      <AdBanner htmlCode={settings?.banner_article_bottom} className="mt-12" />

      <footer className="mt-20 pt-12 border-t border-black/5">
        <div className="bg-black text-white p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-2">Suscríbete a nuestro boletín</h3>
          <p className="text-white/60 text-sm mb-6">Recibe las últimas novedades sobre IA y Finanzas directamente en tu correo.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="tu@email.com" 
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-white/40"
            />
            <button className="bg-white text-black px-6 py-2 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors">
              Unirse
            </button>
          </div>
        </div>
      </footer>
    </article>
  );
}
