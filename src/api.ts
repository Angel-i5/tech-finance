import { supabase } from './lib/supabase';
import { Article, BlogSettings } from './types';

export async function fetchArticles(sort: 'latest' | 'views' = 'latest'): Promise<Article[]> {
  let query = supabase
    .from('articles')
    .select('*')
    .eq('is_published', true);

  if (sort === 'views') {
    query = query.order('views', { ascending: false });
  } else {
    query = query.order('published_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Article[];
}

export async function fetchArticleBySlug(slug: string): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Article;
}

export async function incrementViews(id: number): Promise<void> {
  // Using a simple update since RPC might not be set up
  const { data: article } = await supabase.from('articles').select('views').eq('id', id).single();
  await supabase.from('articles').update({ views: (article?.views || 0) + 1 }).eq('id', id);
}

export async function likeArticle(id: number): Promise<void> {
  const { data: article } = await supabase.from('articles').select('likes').eq('id', id).single();
  await supabase.from('articles').update({ likes: (article?.likes || 0) + 1 }).eq('id', id);
}

// Admin Auth
export async function adminLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function adminLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Admin Articles
export async function fetchAdminArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false });
  
  if (error) throw error;
  return data as Article[];
}

export async function saveArticle(article: Partial<Article>): Promise<void> {
  if (article.id) {
    const { error } = await supabase
      .from('articles')
      .update(article)
      .eq('id', article.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('articles')
      .insert([{ ...article, views: 0, likes: 0 }]);
    if (error) throw error;
  }
}

export async function deleteArticle(id: number): Promise<void> {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// Settings
export async function fetchSettings(): Promise<BlogSettings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();
  
  // PGRST116: No rows found
  // 42P01: Table does not exist
  if (error && error.code !== 'PGRST116' && error.code !== '42P01') throw error;
  return data || { smartlink_url: '', smartlink_keywords: '' };
}

export async function saveSettings(settings: BlogSettings): Promise<void> {
  // Intentamos obtener el ID de la fila existente (usualmente la 1)
  const { data: existing } = await supabase.from('settings').select('id').maybeSingle();
  
  // Usamos settings directamente ya que no tiene propiedad 'id'
  const updateData = settings;

  if (existing) {
    const { error } = await supabase
      .from('settings')
      .update(updateData)
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    // Si no existe, insertamos con ID 1 por defecto
    const { error } = await supabase
      .from('settings')
      .insert([{ ...updateData, id: 1 }]);
    if (error) throw error;
  }
}
