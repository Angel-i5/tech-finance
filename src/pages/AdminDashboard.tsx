import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAdminArticles, deleteArticle, getSession, adminLogout } from '../api';
import { Article } from '../types';
import { format } from 'date-fns';
import { Plus, Edit2, Trash2, Eye, LayoutDashboard, Heart, Settings } from 'lucide-react';

export function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      loadArticles();
    };
    checkAuth();
  }, []);

  const loadArticles = () => {
    setLoading(true);
    setError(null);
    fetchAdminArticles()
      .then(setArticles)
      .catch(err => {
        console.error(err);
        setError('Error al cargar los artículos. Asegúrate de que las credenciales de Supabase estén configuradas y la tabla exista.');
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
      await deleteArticle(id);
      loadArticles();
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    navigate('/');
  };

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
        <div className="bg-red-50 border border-red-200 p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-red-900 mb-4">Error de Conexión</h2>
          <p className="text-red-800 mb-6">{error}</p>
          <button 
            onClick={loadArticles}
            className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
            <LayoutDashboard size={20} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-black/40 hover:text-black transition-colors"
          >
            Cerrar Sesión
          </button>
          <Link 
            to="/admin/settings" 
            className="flex items-center gap-2 bg-black/5 text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/10 transition-colors"
          >
            <Settings size={18} /> Configuración
          </Link>
          <Link 
            to="/admin/new" 
            className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-black/90 transition-colors"
          >
            <Plus size={18} /> Nuevo Artículo
          </Link>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/5 text-[10px] font-bold uppercase tracking-widest text-black/40">
                <th className="px-6 py-4">Artículo</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Estadísticas</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-black/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm">{article.title}</p>
                    <p className="text-xs text-black/40 truncate max-w-xs">{article.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-black/5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {article.category === 'Technology' ? 'Tecnología' : 'Finanzas'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      article.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {article.is_published ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <span className="flex items-center gap-1" title="Vistas"><Eye size={14} className="text-black/20" /> {article.views || 0}</span>
                      <span className="flex items-center gap-1" title="Me gusta"><Heart size={14} className="text-black/20" /> {article.likes || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-black/40">
                    {format(new Date(article.published_at), 'dd MMM, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/article/${article.slug}`} 
                        className="p-2 hover:bg-black/5 rounded-lg transition-colors text-black/40 hover:text-black"
                        title="Ver"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link 
                        to={`/admin/edit/${article.id}`} 
                        className="p-2 hover:bg-black/5 rounded-lg transition-colors text-black/40 hover:text-black"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(article.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-black/40 hover:text-red-500"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-black/40 italic">
                    No se encontraron artículos. ¡Empieza creando el primero!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
