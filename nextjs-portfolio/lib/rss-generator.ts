import { Feed } from 'feed';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDtN5CJ4fvWMCkGImJEMfKQrIiBdeKZKqI",
  authDomain: "portfolyo-145a9.firebaseapp.com",
  projectId: "portfolyo-145a9",
  storageBucket: "portfolyo-145a9.firebasestorage.app",
  messagingSenderId: "230588990982",
  appId: "1:230588990982:web:d7fbb79d94bb4cc9b22587",
  measurementId: "G-TKWT71JERB"
};

interface Post {
  id: string;
  title?: string;
  content?: string;
  category?: string;
  imageUrl?: string;
  slug?: string;
  createdAt?: any;
}

export interface RSSFeedOptions {
  title: string;
  description: string;
  link: string;
  language?: string;
}

export const createRSSFeed = async (options: RSSFeedOptions): Promise<string> => {
  const { title, description, link, language = 'tr' } = options;
  
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const appId = "portfolyo-145a9";

    const postsSnap = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'blogPosts'));
    const posts = postsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Post[];

    const feed = new Feed({
      title,
      description,
      id: link,
      link,
      language,
      image: link + '/favicon.ico',
      favicon: link + '/favicon.ico',
      copyright: `© ${new Date().getFullYear()} Soner Yılmaz`,
      updated: new Date(),
      generator: 'Soner Yılmaz Blog RSS Feed',
      feedLinks: [
        {
          type: 'application/rss+xml',
          rel: 'self',
          href: link + '/api/rss',
        },
        {
          type: 'application/rss+xml',
          rel: 'alternate',
          href: link + '/rss.xml',
        },
      ],
      author: {
        name: 'Soner Yılmaz',
        link,
      },
    });

    const createSlug = (title?: string): string => {
      if (!title) return '';
      const trMap: Record<string, string> = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
      return title.split('').map(c => trMap[c] || c).join('').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
    };

    const stripHtml = (html?: string): string => {
      if (!html) return '';
      return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
    };

    posts.forEach((post) => {
      const slug = post.slug || createSlug(post.title);
      const url = `${link}/blog/${slug}`;
      const description = stripHtml(post.content)?.substring(0, 200) + (post.content && post.content.length > 200 ? '...' : '');
      
      const date = post.createdAt?.toDate?.() || post.createdAt?.seconds 
        ? new Date(post.createdAt.seconds * 1000) 
        : new Date();

      feed.addItem({
        title: post.title || '',
        id: post.id,
        link: url,
        guid: post.id,
        description,
        date,
        image: post.imageUrl ? { url: post.imageUrl } : undefined,
      });
    });

    return feed.rss2();
  } catch (error) {
    console.error('RSS Feed oluşturma hatası:', error);
    throw error;
  }
};
