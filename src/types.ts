export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: 'Technology' | 'Finance';
  image_url: string;
  published_at: string;
  is_published: boolean;
  views: number;
  likes: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface BlogSettings {
  smartlink_url: string;
  smartlink_keywords: string;
  banner_header?: string;
  banner_sidebar?: string;
  banner_footer?: string;
  banner_article_bottom?: string;
  popunder_code?: string;
  social_bar_code?: string;
}

export type Category = 'Technology' | 'Finance';
