import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { saveArticle, fetchAdminArticles, getSession } from '../api';
import { Article, Category } from '../types';
import { ArrowLeft, Save, Image as ImageIcon, Layout } from 'lucide-react';

export function AdminEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'Technology',
    image_url: '',
    is_published: false
  });

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }

      if (id) {
        fetchAdminArticles().then(articles => {
          const article = articles.find(a => a.id === parseInt(id));
          if (article) setFormData(article);
        });
      }
    };
    checkAuth();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveArticle(formData);
      navigate('/admin');
    } catch (err) {
      alert('Error al guardar el artículo');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData({ ...formData, slug });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors">
          <ArrowLeft size={16} /> Volver al Panel
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          {id ? 'Editar Artículo' : 'Nuevo Artículo'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-xl shadow-black/5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40">Título</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onBlur={generateSlug}
                className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black/10 focus:bg-white transition-all"
                placeholder="El Futuro de la IA..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40">Slug (URL)</label>
              <input 
                type="text" 
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black/10 focus:bg-white transition-all"
                placeholder="futuro-de-la-ia"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40">Categoría</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black/10 focus:bg-white transition-all appearance-none"
              >
                <option value="Technology">Tecnología e IA</option>
                <option value="Finance">Finanzas e Inversión</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40">URL de Imagen</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                <input 
                  type="url" 
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-black/5 border border-transparent rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-black/10 focus:bg-white transition-all"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40">Resumen (Excerpt)</label>
            <textarea 
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black/10 focus:bg-white transition-all h-20 resize-none"
              placeholder="Un breve resumen del artículo..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40">Contenido (Markdown)</label>
            <textarea 
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-black/10 focus:bg-white transition-all h-96 resize-none"
              placeholder="# Tu contenido aquí..."
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 rounded border-black/10 text-black focus:ring-black"
            />
            <label htmlFor="is_published" className="text-sm font-medium">Publicar inmediatamente</label>
          </div>
        </div>

        {/* SEO Section */}
        <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-xl shadow-black/5 space-y-6">
          <h2 className="text-lg font-bold tracking-tight border-b border-black/5 pb-4">Optimización SEO</h2>
          
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40">Meta Título (SEO)</label>
            <input 
              type="text" 
              value={formData.meta_title || ''}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black/10 focus:bg-white transition-all"
              placeholder="Título para buscadores..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40">Meta Descripción</label>
            <textarea 
              value={formData.meta_description || ''}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black/10 focus:bg-white transition-all h-20 resize-none"
              placeholder="Descripción corta para Google..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40">Palabras Clave (Keywords)</label>
            <input 
              type="text" 
              value={formData.meta_keywords || ''}
              onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
              className="w-full bg-black/5 border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black/10 focus:bg-white transition-all"
              placeholder="ia, tecnología, productividad..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="button"
            onClick={() => navigate('/admin')}
            className="px-8 py-3 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-black text-white px-10 py-3 rounded-xl font-bold text-sm hover:bg-black/90 transition-all disabled:opacity-50"
          >
            <Save size={18} /> {loading ? 'Guardando...' : 'Guardar Artículo'}
          </button>
        </div>
      </form>
    </div>
  );
}
