import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchSettings, saveSettings, getSession } from '../api';
import { BlogSettings } from '../types';
import { ArrowLeft, Save, Settings as SettingsIcon, Link as LinkIcon, Type } from 'lucide-react';

export function AdminSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<BlogSettings>({
    smartlink_url: '',
    smartlink_keywords: '',
    banner_header: '',
    banner_sidebar: '',
    banner_footer: '',
    banner_article_bottom: '',
    popunder_code: '',
    social_bar_code: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      
      try {
        const data = await fetchSettings();
        if (data) {
          setSettings({
            smartlink_url: data.smartlink_url || '',
            smartlink_keywords: data.smartlink_keywords || '',
            banner_header: data.banner_header || '',
            banner_sidebar: data.banner_sidebar || '',
            banner_footer: data.banner_footer || '',
            banner_article_bottom: data.banner_article_bottom || '',
            popunder_code: data.popunder_code || '',
            social_bar_code: data.social_bar_code || ''
          });
        }
      } catch (err) {
        console.error('Error fetching settings', err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Intentamos guardar
      await saveSettings(settings);
      alert('✅ Configuración guardada correctamente');
    } catch (err: any) {
      console.error('Error detallado:', err);
      // Esto te mostrará el error real de Supabase (ej: "column popunder_code not found")
      alert(`❌ Error al guardar: ${err.message || 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <div className="flex items-center justify-between">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors">
          <ArrowLeft size={16} /> Volver al Panel
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon size={24} /> Configuración General
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sección Smartlink */}
        <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-xl shadow-black/5 space-y-6">
          <h2 className="text-lg font-bold tracking-tight border-b border-black/5 pb-4">Adsterra Smartlink</h2>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40">URL del Smartlink</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20" size={18} />
              <input 
                type="url" 
                value={settings.smartlink_url}
                onChange={(e) => setSettings({ ...settings, smartlink_url: e.target.value })}
                className="w-full bg-black/5 border border-transparent rounded-xl pl-10 pr-4 py-3 text-sm focus:bg-white focus:border-black/10 transition-all"
                placeholder="https://smartlink..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40">Palabras Clave</label>
            <textarea 
              value={settings.smartlink_keywords}
              onChange={(e) => setSettings({ ...settings, smartlink_keywords: e.target.value })}
              className="w-full bg-black/5 border border-transparent rounded-xl p-4 text-sm h-24 resize-none focus:bg-white focus:border-black/10 transition-all"
              placeholder="ia, cripto, trading..."
            />
          </div>
        </div>

        {/* Sección Banners */}
        <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-xl shadow-black/5 space-y-6">
          <h2 className="text-lg font-bold tracking-tight border-b border-black/5 pb-4">Banners de Publicidad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(['banner_header', 'banner_sidebar', 'banner_article_bottom', 'banner_footer'] as const).map((pos) => (
              <div key={pos} className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-black/40">{pos.replace('_', ' ')}</label>
                <textarea 
                  value={settings[pos]}
                  onChange={(e) => setSettings({ ...settings, [pos]: e.target.value })}
                  className="w-full bg-black/5 border border-transparent rounded-xl p-3 text-[10px] font-mono h-24 resize-none focus:bg-white focus:border-black/10 transition-all"
                  placeholder="Código Adsterra..."
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sección High Performance */}
        <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-xl shadow-black/5 space-y-6">
          <h2 className="text-lg font-bold tracking-tight border-b border-black/5 pb-4">Popunder & Social Bar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40">Popunder</label>
              <textarea 
                value={settings.popunder_code}
                onChange={(e) => setSettings({ ...settings, popunder_code: e.target.value })}
                className="w-full bg-black/5 border border-transparent rounded-xl p-3 text-[10px] font-mono h-32 resize-none focus:bg-white focus:border-black/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40">Social Bar</label>
              <textarea 
                value={settings.social_bar_code}
                onChange={(e) => setSettings({ ...settings, social_bar_code: e.target.value })}
                className="w-full bg-black/5 border border-transparent rounded-xl p-3 text-[10px] font-mono h-32 resize-none focus:bg-white focus:border-black/10 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-black text-white px-10 py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            <Save size={18} /> {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>
    </div>
  );
}