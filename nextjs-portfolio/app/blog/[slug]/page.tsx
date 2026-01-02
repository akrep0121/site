'use client';

import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
<<<<<<< HEAD
import { getAuth, signInAnonymously } from 'firebase/auth';
=======
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
>>>>>>> 2f4ae76de39c84e594796e874f4396d71fb5f40e
import { useParams, useRouter } from 'next/navigation';

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

interface Comment {
  id: string;
  postId?: string;
  author?: string;
  text?: string;
  createdAt?: any;
}

<<<<<<< HEAD
export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);
      const appId = "portfolyo-145a9";

      try {
        await signInAnonymously(auth);

        const postsSnap = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'blogPosts'));
        const postsData = postsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Post[];
        setPosts(postsData);

        const foundPost = postsData.find(p => {
          const createSlug = (title?: string) => {
            if (!title) return '';
            const trMap: Record<string, string> = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
            return title.split('').map(c => trMap[c] || c).join('').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
          };
          const postSlug = p.slug || createSlug(p.title);
          return postSlug === slug;
        });

        if (foundPost) {
          setPost(foundPost);

          const commentsSnap = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'comments'));
          const commentsData = commentsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Comment[];
          setComments(commentsData);

          if (foundPost.title) {
            document.title = `${foundPost.title} | Soner Yılmaz`;
          }
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug, router]);

  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-500 border-gray-400';
    const colors: Record<string, string> = {
=======
export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const appId = "portfolyo-145a9";

      const postsSnap = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'blogPosts'));
      const postsData: Post[] = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const slug = params.slug;
      const foundPost = postsData.find(p => {
        const createSlug = (title?: string) => {
          if (!title) return '';
          const trMap = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
          return title.split('').map(c => trMap[c] || c).join('').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
        };
        const postSlug = p.slug || createSlug(p.title);
        return postSlug === slug;
      });

      if (foundPost) {
        setPost(foundPost);

        const commentsSnap = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'comments'));
        const commentsData = commentsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
        const postComments = commentsData.filter((c: any) => c.postId === foundPost.id);
        setComments(postComments);

        document.title = `${foundPost.title} | Soner Yılmaz`;
      } else {
        router.push('/');
      }
    };

    fetchPost();
  }, [params.slug, router]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500/50 animate-spin rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Yazı yükleniyor...</p>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-500 border-gray-400';
    const colors = {
>>>>>>> 2f4ae76de39c84e594796e874f4396d71fb5f40e
      'fintech': 'bg-indigo-500 border-indigo-400',
      'borsa': 'bg-blue-500 border-blue-400',
      'yatırım': 'bg-emerald-500 border-emerald-400',
      'teknoloji': 'bg-purple-500 border-purple-400',
      'halka arz': 'bg-orange-500 border-orange-400',
      'genel': 'bg-gray-500 border-gray-400'
    };
    return colors[category.toLowerCase()] || 'bg-gray-500 border-gray-400';
  };

  const formatDate = (timestamp?: any) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

<<<<<<< HEAD
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Bağlantı kopyalandı!');
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500/50 animate-spin rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Yazı yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
        <h1 className="text-white text-4xl font-bold mb-4">Yazı Bulunamadı</h1>
        <p className="text-gray-500 mb-8">Aradığınız yazı mevcut değil.</p>
        <button
          onClick={() => router.push('/#blog-section')}
          className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

=======
>>>>>>> 2f4ae76de39c84e594796e874f4396d71fb5f40e
  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <nav className="fixed w-full z-50 p-8 flex justify-center">
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] px-12 py-4 rounded-full shadow-2xl flex items-center gap-16 transition-all hover:border-white/[0.12]">
          <div 
            onClick={() => router.push('/')}
<<<<<<< HEAD
            className="text-2xl font-black tracking-tighter text-white uppercase italic cursor-pointer hover:opacity-80 transition"
          >
            Soner<span className="text-indigo-500">.</span>
          </div>
          <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            <span 
              onClick={() => router.push('/')}
              className="hover:text-white transition cursor-pointer"
            >
              Giriş
            </span>
            <span 
              onClick={() => router.push('/#blog-section')}
              className="hover:text-white transition cursor-pointer"
            >
              Yazılar
            </span>
          </div>
        </div>
      </nav>

      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <button
          onClick={() => router.push('/#blog-section')}
          className="mb-12 flex items-center gap-3 text-gray-400 hover:text-white transition text-sm font-bold uppercase tracking-wider"
        >
          <span>←</span>
          <span>Yazılara Dön</span>
        </button>

        <div className="mb-16">
          <span className={`${getCategoryColor(post.category)} px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 inline-block text-white shadow-xl border`}>
            {post.category || 'Genel'}
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter text-white uppercase mb-8">
            {post.title}
          </h1>
          <div className="flex items-center gap-8 text-gray-400 text-sm">
            <span className="font-medium">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {post.imageUrl && (
          <div className="mb-16 rounded-[2rem] overflow-hidden shadow-2xl">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-[60vh] object-cover"
            />
          </div>
        )}

        <div className="max-w-4xl">
          <div
            className="prose prose-invert prose-p:text-gray-400 prose-p:text-xl prose-h2:text-white prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>

        <div className="mt-20 pt-12 border-t border-white/[0.1]">
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-xs font-black uppercase tracking-widest">Paylaş</span>
            <button
              onClick={copyUrl}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-black uppercase hover:bg-white/10 transition"
            >
              Bağlantıyı Kopyala
            </button>
          </div>
        </div>

        <div className="mt-24 p-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/[0.1] rounded-[2.5rem] text-center">
          <h3 className="text-3xl font-black text-white uppercase mb-4 tracking-tighter">Haftalık Analizler</h3>
          <p className="text-gray-400 mb-8">En güncel finansal analizler, yatırım stratejileri ve teknoloji trendleri. Her Pazartesi gelen kutunuzda.</p>
=======
            className="text-2xl font-black tracking-tighter text-white uppercase italic select-none cursor-pointer hover:opacity-80 transition"
          >
            Soner<span className="text-indigo-500">.</span>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-bold uppercase tracking-widest mb-8"
        >
          ← Ana Sayfa
        </button>

        <div className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[3rem] mb-8">
          <span className={`${getCategoryColor(post.category)} px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block text-white shadow-xl border`}>
            {post.category || 'Genel'}
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">{post.title}</h1>
          <div className="text-gray-500 mb-8">{formatDate(post.createdAt)}</div>
        </div>

        <div className="prose prose-invert prose-p:text-gray-400 prose-p:text-xl prose-h2:text-white prose-h2:text-4xl max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        </div>

        <div className="mt-16 p-10 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] text-center">
          <h4 className="text-2xl font-black text-white uppercase mb-6">Haftalık Analizler</h4>
          <p className="text-gray-400 mb-6">En güncel finansal analizler, yatırım stratejileri ve teknoloji trendleri.</p>
>>>>>>> 2f4ae76de39c84e594796e874f4396d71fb5f40e
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const app = initializeApp(firebaseConfig);
              const db = getFirestore(app);
              const appId = "portfolyo-145a9";
              try {
                await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'subscribers'), {
                  email: formData.get('email'),
                  createdAt: new Date()
                });
                alert('Aboneliğiniz başarıyla oluşturuldu!');
                e.currentTarget.reset();
              } catch (err) {
                console.error('Abonelik hatası:', err);
                alert('Abonelik oluşturulamadı.');
              }
            }}
<<<<<<< HEAD
            className="flex gap-3 max-w-md mx-auto"
=======
            className="flex gap-3"
>>>>>>> 2f4ae76de39c84e594796e874f4396d71fb5f40e
          >
            <input
              type="email"
              name="email"
              required
              placeholder="E-posta adresiniz"
<<<<<<< HEAD
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 text-white placeholder-gray-600"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-black rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition"
=======
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 text-black placeholder-gray-600"
            />
            <button
              type="submit"
              className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gray-200"
>>>>>>> 2f4ae76de39c84e594796e874f4396d71fb5f40e
            >
              Abone Ol
            </button>
          </form>
        </div>

<<<<<<< HEAD
        <div className="mt-24">
          <h2 className="text-4xl font-black text-white uppercase mb-12 flex items-center gap-4">
            Yorumlar <span className="text-indigo-500 text-lg">{comments.filter(c => c.postId === post.id).length}</span>
          </h2>
          
=======
        <div className="mt-24 pt-12 border-t border-white/[0.05]">
          <h3 className="text-3xl font-black text-white uppercase mb-12 flex items-center gap-4">
            Yorumlar <span className="text-indigo-500 text-sm">({comments.length})</span>
          </h3>
>>>>>>> 2f4ae76de39c84e594796e874f4396d71fb5f40e
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const app = initializeApp(firebaseConfig);
              const db = getFirestore(app);
              const appId = "portfolyo-145a9";
              try {
                await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'comments'), {
                  postId: post.id,
                  author: formData.get('author'),
                  text: formData.get('text'),
                  createdAt: new Date()
                });
                alert('Yorumunuz iletildi!');
                e.currentTarget.reset();
<<<<<<< HEAD
                const commentsSnap = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'comments'));
                const commentsData = commentsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Comment[];
                setComments(commentsData);
=======
                window.location.reload();
>>>>>>> 2f4ae76de39c84e594796e874f4396d71fb5f40e
              } catch (err) {
                console.error('Yorum hatası:', err);
                alert('Yorum iletilemedi.');
              }
            }}
<<<<<<< HEAD
            className="mb-16 space-y-4"
=======
            className="space-y-4 mb-16"
>>>>>>> 2f4ae76de39c84e594796e874f4396d71fb5f40e
          >
            <input
              name="author"
              required
<<<<<<< HEAD
              placeholder="İSİM SOYİSİM"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 outline-none focus:border-indigo-500 text-white font-bold uppercase"
=======
              placeholder="İSMİNİZ"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 text-black placeholder-gray-600"
>>>>>>> 2f4ae76de39c84e594796e874f4396d71fb5f40e
            />
            <textarea
              name="text"
              required
              placeholder="FİKRİNİZİ PAYLAŞIN..."
<<<<<<< HEAD
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 outline-none focus:border-indigo-500 text-white font-bold resize-none"
              rows={4}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase hover:bg-indigo-700 transition"
            >
              Yorum Gönder
            </button>
          </form>

          <div className="space-y-8">
            {comments.filter(c => c.postId === post.id).length === 0 ? (
              <p className="text-gray-700 italic text-lg text-center py-12">İlk yorumu siz yapın!</p>
            ) : (
              comments
                .filter(c => c.postId === post.id)
                .sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0))
                .map(c => (
                  <div key={c.id} className="bg-white/[0.03] border border-white/[0.06] p-10 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-white font-bold text-lg uppercase">{c.author}</div>
                      <div className="text-xs text-gray-500">{formatDate(c.createdAt)}</div>
                    </div>
                    <p className="text-gray-400 text-lg leading-relaxed">{c.text}</p>
=======
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 text-black placeholder-gray-600"
              rows={3}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase"
            >
              Gönder
            </button>
          </form>
          <div className="space-y-8">
            {comments.length === 0 ? (
              <p className="text-gray-700 italic text-sm">İlk yorumu siz yapın!</p>
            ) : (
              comments
                .sort((a, b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0))
                .map((c) => (
                  <div key={c.id} className="bg-white/[0.03] p-8 rounded-[2rem]">
                    <div className="text-white font-bold text-sm uppercase mb-4">{c.author}</div>
                    <p className="text-gray-400 text-sm leading-relaxed">{c.text}</p>
>>>>>>> 2f4ae76de39c84e594796e874f4396d71fb5f40e
                  </div>
                ))
            )}
          </div>
        </div>
<<<<<<< HEAD

        {posts.length > 1 && (
          <div className="mt-24 pt-24 border-t border-white/[0.1]">
            <h2 className="text-4xl font-black text-white uppercase mb-12">İlgili Yazılar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts
                .filter(p => p.id !== post.id)
                .slice(0, 3)
                .map(relatedPost => {
                  const createSlug = (title?: string) => {
                    if (!title) return '';
                    const trMap: Record<string, string> = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
                    return title.split('').map(c => trMap[c] || c).join('').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
                  };
                  return (
                    <div
                      key={relatedPost.id}
                      onClick={() => router.push(`/blog/${relatedPost.slug || createSlug(relatedPost.title)}`)}
                      className="group cursor-pointer bg-white/[0.01] border border-white/[0.05] rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-indigo-500/30"
                    >
                      {relatedPost.imageUrl && (
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <img
                            src={relatedPost.imageUrl}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover transition-transform duration-700 grayscale group-hover:grayscale-0"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>
                      )}
                      <div className="p-6 space-y-4">
                        <h3 className="text-lg font-bold leading-tight group-hover:text-indigo-400 transition-colors text-white uppercase">
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                          <span className="text-[10px] font-medium text-gray-500">
                            {formatDate(relatedPost.createdAt)}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                            Oku
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      <footer className="py-20 px-6 border-t border-white/[0.05] bg-[#000]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-black tracking-[0.5em] uppercase text-gray-600">
            Soner Yılmaz &copy; 2025
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
            <a href="https://x.com/soner_yilmz" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition">
              Twitter / @soner_yilmz
            </a>
          </div>
        </div>
      </footer>
=======
      </div>
>>>>>>> 2f4ae76de39c84e594796e874f4396d71fb5f40e
    </div>
  );
}
