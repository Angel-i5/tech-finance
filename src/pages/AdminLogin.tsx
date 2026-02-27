import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl shadow-black/5">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Acceso Admin</h1>
          <p className="text-sm text-black/40">Inicio de sesión con Supabase Auth</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/5 border border-transparent rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-black/10 focus:bg-white transition-all"
                placeholder="admin@techfinance.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/5 border border-transparent rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-black/10 focus:bg-white transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-black/90 transition-all disabled:opacity-50"
          >
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
