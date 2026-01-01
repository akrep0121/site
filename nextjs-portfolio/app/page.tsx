'use client';

import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

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
  createdAt?: any;
}

interface SiteData {
  name?: string;
  role?: string;
  profileImage?: string;
  aboutText?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteData, setSiteData] = useState<SiteData>({});
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState({ title: '', category: '', content: '', imageUrl: '' });

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const appId = "portfolyo-145a9";

    signInAnonymously(auth);

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const postsSnap = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'blogPosts'));
        const postsData = postsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Post[];
        setPosts(postsData);

        const settingsSnap = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'siteSettings', 'config'));
        if (settingsSnap.exists()) {
          setSiteData(settingsSnap.data() as SiteData);
          localStorage.setItem('siteData', JSON.stringify(settingsSnap.data()));
        }
      }
    });

    const savedSiteData = localStorage.getItem('siteData');
    if (savedSiteData) {
      setSiteData(JSON.parse(savedSiteData));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(siteData).length > 0) {
      localStorage.setItem('siteData', JSON.stringify(siteData));
    }
  }, [siteData]);

  const createSlug = (title?: string) => {
    if (!title) return '';
    const trMap: Record<string, string> = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
    return title.split('').map(c => trMap[c] || c).join('').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-500 border-gray-400';
    const colors: Record<string, string> = {
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

  const getExcerpt = (content?: string, maxLength = 120) => {
    if (!content) return '';
    const cleanText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = currentCategory === 'all' || post.category?.toLowerCase() === currentCategory.toLowerCase();
    const matchesSearch = !searchTerm || 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [...new Set(posts.map(p => p.category).filter((c): c is string => Boolean(c)))];

  const openPost = (post: Post) => {
    setSelectedPost(post);
    const slug = createSlug(post.title);
    try {
      window.history.pushState({ postId: post.id }, '', `/blog/${slug}`);
    } catch (e) {
      console.error('URL change error:', e);
    }
  };

  const closePost = () => {
    setSelectedPost(null);
    window.history.pushState({}, '', '/');
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Bağlantı kopyalandı!');
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const password = formData.get('password') as string;
    if (password === 'KJSA1660') {
      setIsLoggedIn(true);
      setLoginModalOpen(false);
      setAdminModalOpen(true);
    } else {
      alert('Hatalı şifre!');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isLoggedIn) {
          setAdminModalOpen(true);
        } else {
          setLoginModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen">
      <nav className="fixed w-full z-50 p-8 flex justify-center">
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] px-12 py-4 rounded-full shadow-2xl flex items-center gap-16 transition-all hover:border-white/[0.12]">
          <div className="text-2xl font-black tracking-tighter text-white uppercase italic select-none">
            Soner<span className="text-indigo-500">.</span>
          </div>
          <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            <a href="#home" className="hover:text-white transition">Giriş</a>
            <a href="#blog-section" className="hover:text-white transition">Yazılar</a>
            <a href="#about-section" className="hover:text-white transition">Hakkımda</a>
            <a href="#contact-section" className="hover:text-white transition">İletişim</a>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-80 pb-40 px-6 max-w-6xl mx-auto text-center relative z-10">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/5 blur-[150px] rounded-full opacity-50 animate-pulse"></div>
        </div>
        <div className="mb-20 relative inline-block group text-center">
          <img 
            src={siteData.profileImage || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}
            className="w-44 h-44 rounded-full object-cover grayscale border border-white/10 shadow-2xl group-hover:grayscale-0 mx-auto"
            style={{transition: 'opacity 0.8s ease-in-out', opacity: 1}}
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] px-8 py-2.5 rounded-full text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase mb-12">
            <span>{siteData.role || "FinTech Geliştiricisi & Yatırım Analisti"}</span>
          </div>
          <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter leading-[0.8] mb-24 text-white uppercase text-center">
            Geleceği <span className="text-indigo-500">bugünden</span> inşa edin.
          </h1>
          <button 
            onClick={() => document.getElementById('blog-section')?.scrollIntoView({behavior: 'smooth'})}
            className="px-8 py-4 bg-white text-black rounded-full font-bold transition-all text-sm uppercase tracking-widest hover:bg-gray-200"
          >
            İçerikleri Keşfet
          </button>
        </div>
      </section>

      <section id="blog-section" className="py-60 px-6 max-w-[1600px] mx-auto border-t border-white/[0.05]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="mb-16">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                  <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase mb-3">
                    Güncel <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Yazılar</span>
                  </h2>
                  <p className="text-gray-500 text-sm font-medium tracking-widest">
                    Toplam <span className="text-indigo-400">{posts.length}</span> içerik
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="İçeriklerde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-indigo-500 w-full md:w-auto"
                />
              </div>

              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  onClick={() => setCurrentCategory('all')}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                    currentCategory === 'all'
                      ? 'bg-indigo-500 text-white border-indigo-400'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Tümü
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCurrentCategory(cat.toLowerCase())}
                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                      currentCategory === cat.toLowerCase()
                        ? 'bg-indigo-500 text-white border-indigo-400'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">Sonuç bulunamadı.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {filteredPosts.map((post, index) => (
                    <div
                      key={post.id}
                      onClick={() => openPost(post)}
                      className="blog-card group cursor-pointer bg-white/[0.01] border border-white/[0.05] rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-indigo-500/30"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={post.imageUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"}
                          alt={post.title}
                          className="card-img w-full h-full object-cover transition-transform duration-700 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute top-4 left-4">
                          <span className={`${getCategoryColor(post.category)} px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-[0.2em] backdrop-blur-sm`}>
                            {post.category || 'Genel'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <h3 className="text-xl font-bold leading-tight group-hover:text-indigo-400 transition-colors text-white uppercase">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                          {getExcerpt(post.content)}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                          <span className="text-[10px] font-medium text-gray-500">{formatDate(post.createdAt)}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Oku
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] sticky top-32 space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-3">
                  Kategoriler
                </h3>
                <div className="space-y-3">
                  {categories.map(cat => {
                    const count = posts.filter(p => p.category === cat).length;
                    const isActive = currentCategory === cat.toLowerCase();
                    return (
                      <button
                        key={cat}
                        onClick={() => setCurrentCategory(cat.toLowerCase())}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                          isActive
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xs font-black uppercase tracking-wider">{cat}</span>
                        <span className="text-xs font-bold">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about-section" className="py-60 px-6 bg-white/[0.01] border-y border-white/[0.05] relative text-center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase mb-20">Motivasyon</h2>
          <p className="text-3xl md:text-5xl text-gray-400 leading-[1.4] font-medium italic opacity-80 tracking-tight">
            "{siteData.aboutText || "Modern web dünyasında vizyoner işler üretiyorum."}"
          </p>
        </div>
      </section>

      <section id="contact-section" className="py-60 px-6 max-w-4xl mx-auto text-center border-t border-white/[0.05]">
        <h2 className="text-7xl font-black tracking-tighter text-white uppercase mb-20">
          BANA <span className="text-indigo-500">ULAŞIN</span>
        </h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);
            const appId = "portfolyo-145a9";
            try {
              await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message'),
                createdAt: new Date()
              });
              alert('Mesajınız iletildi!');
              e.currentTarget.reset();
            } catch (err) {
              console.error('Mesaj gönderme hatası:', err);
              alert('Mesaj gönderilemedi.');
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <input name="name" required placeholder="İSİM" className="w-full bg-transparent border-b border-white/10 py-6 outline-none focus:border-indigo-500 text-xl font-bold uppercase transition" />
          <input name="email" type="email" required placeholder="E-POSTA" className="w-full bg-transparent border-b border-white/10 py-6 outline-none focus:border-indigo-500 text-xl font-bold uppercase transition" />
          <textarea name="message" required placeholder="MESAJINIZ" className="md:col-span-2 w-full bg-transparent border-b border-white/10 py-6 outline-none focus:border-indigo-500 text-xl font-bold uppercase transition resize-none" rows={4} />
          <div className="md:col-span-2 flex justify-center pt-12">
            <button type="submit" className="px-20 py-6 bg-white text-black rounded-full font-bold transition-all text-lg uppercase tracking-widest hover:bg-gray-200">
              Mesaj Gönder
            </button>
          </div>
        </form>
      </section>

      <footer className="py-40 px-6 border-t border-white/[0.05] bg-[#000]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-[10px] font-black tracking-[0.5em] uppercase text-gray-600 flex items-center gap-4">
            <span>{siteData.name || "Soner Yılmaz"}</span> &copy; 2025
            <div 
              onClick={() => setLoginModalOpen(true)}
              className="w-3 h-3 bg-white/5 rounded-full cursor-pointer hover:bg-indigo-500/40 transition shadow-sm"
              title="Yönetici Girişi"
            />
          </div>
          <div className="flex gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
            <a href="https://x.com/soner_yilmz" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition">
              Twitter / @soner_yilmz
            </a>
          </div>
        </div>
      </footer>

      {loginModalOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-6 bg-black backdrop-blur-3xl">
          <div className="bg-[#050505] border border-white/10 p-16 rounded-[4rem] w-full max-w-md shadow-2xl">
            <h3 className="text-5xl font-black tracking-tighter text-white mb-16 uppercase italic text-center">Erişim</h3>
            <form onSubmit={handleLogin} className="space-y-8">
              <input 
                type="password" 
                placeholder="Parola" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-6 outline-none focus:border-indigo-500 text-center text-2xl tracking-[0.5em] text-white"
                required 
              />
              <button 
                type="submit" 
                className="w-full px-8 py-6 bg-white text-black rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition"
              >
                Doğrula
              </button>
              <button 
                type="button"
                onClick={() => setLoginModalOpen(false)}
                className="w-full text-gray-600 text-xs font-bold uppercase tracking-widest hover:text-white transition"
              >
                Vazgeç
              </button>
            </form>
          </div>
        </div>
      )}

      {adminModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black overflow-y-auto p-12">
          <div className="max-w-7xl mx-auto">
            <header className="flex justify-between items-end mb-24 border-b border-white/5 pb-12">
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Yönetim Paneli</h1>
                <p className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase">CMS</p>
              </div>
              <button 
                onClick={() => setAdminModalOpen(false)}
                className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition"
              >
                Kapat
              </button>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="space-y-12">
                <section className="space-y-8">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Site Ayarları</h2>
                  <div className="bg-white/[0.01] border border-white/[0.06] rounded-[2.5rem] p-8 space-y-4">
                    <input 
                      placeholder="Ad Soyad" 
                      value={siteData.name || ''}
                      onChange={(e) => setSiteData({ ...siteData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500" 
                    />
                    <input 
                      placeholder="Rol" 
                      value={siteData.role || ''}
                      onChange={(e) => setSiteData({ ...siteData, role: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500" 
                    />
                    <input 
                      placeholder="Profil Resmi URL" 
                      value={siteData.profileImage || ''}
                      onChange={(e) => setSiteData({ ...siteData, profileImage: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500" 
                    />
                    <textarea 
                      placeholder="Hakkımda" 
                      value={siteData.aboutText || ''}
                      onChange={(e) => setSiteData({ ...siteData, aboutText: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500" 
                      rows={3}
                    />
                    <button 
                      onClick={async () => {
                        const app = initializeApp(firebaseConfig);
                        const db = getFirestore(app);
                        const appId = "portfolyo-145a9";
                        try {
                          await import('firebase/firestore').then(({ setDoc, doc }) => {
                            setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'siteSettings', 'config'), siteData);
                          });
                          alert("Ayarlar kaydedildi!");
                        } catch (err) {
                          console.error('Kaydetme hatası:', err);
                          alert('Ayarlar kaydedilemedi.');
                        }
                      }}
                      className="w-full py-4 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-200"
                    >
                      Ayarları Kaydet
                    </button>
                  </div>
                </section>
              </div>
              
              <div className="lg:col-span-2 space-y-12">
                <section className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Yeni Blog Yazısı</h2>
                    <button 
                      onClick={() => {
                        setEditingPostId(null);
                        setPostForm({ title: '', category: '', content: '', imageUrl: '' });
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors"
                    >
                      Yeni Yazı
                    </button>
                  </div>
                  <div className="bg-white/[0.01] border border-white/[0.06] rounded-[2.5rem] p-8 space-y-6">
                    <input 
                      placeholder="Yazı Başlığı" 
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl font-bold outline-none focus:border-indigo-500" 
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        placeholder="Kategori" 
                        value={postForm.category}
                        onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500" 
                      />
                      <input 
                        placeholder="Kapak Görsel URL" 
                        value={postForm.imageUrl}
                        onChange={(e) => setPostForm({ ...postForm, imageUrl: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500" 
                      />
                    </div>
                    <textarea 
                      placeholder="Yazı İçeriği (HTML destekli)"
                      value={postForm.content}
                      onChange={(e) => setPostForm({ ...postForm, imageUrl: postForm.imageUrl })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500" 
                      rows={10}
                    />
                    <button 
                      onClick={async () => {
                        if (!postForm.title || !postForm.content) {
                          alert('Eksik bilgi!');
                          return;
                        }
                        const app = initializeApp(firebaseConfig);
                        const db = getFirestore(app);
                        const appId = "portfolyo-145a9";
                        try {
                          await import('firebase/firestore').then(({ setDoc, doc, addDoc, serverTimestamp }) => {
                            const postData = {
                              title: postForm.title,
                              slug: createSlug(postForm.title),
                              category: postForm.category || 'Genel',
                              imageUrl: postForm.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
                              content: postForm.content,
                              createdAt: serverTimestamp()
                            };
                            
                            if (editingPostId) {
                              setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'blogPosts', editingPostId), postData);
                              alert("Yazı güncellendi!");
                            } else {
                              addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'blogPosts'), postData);
                              alert("Yazı yayınlandı!");
                            }
                          });
                          setPostForm({ title: '', category: '', content: '', imageUrl: '' });
                          setEditingPostId(null);
                          // Reload posts
                          const postsSnap = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'blogPosts'));
                          const postsData = postsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Post[];
                          setPosts(postsData);
                        } catch (err) {
                          console.error('Yayın hatası:', err);
                          alert('Yayınlanırken bir hata oluştu.');
                        }
                      }}
                      className="w-full py-6 bg-white text-black rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gray-200"
                    >
                      {editingPostId ? 'Güncelle' : 'Yayınla'}
                    </button>
                  </div>
                </section>
                
                <section className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Blog Yazıları</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.map(p => (
                      <div key={p.id} className="bg-white/[0.03] border border-white/[0.06] p-5 rounded-[2rem] flex justify-between items-center group hover:border-indigo-500/30 transition-all duration-300">
                        <div className="overflow-hidden pr-4 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-gray-500/20 border text-gray-400">
                              {p.category || 'Genel'}
                            </span>
                          </div>
                          <p className="font-bold truncate text-white text-sm">{p.title}</p>
                          <div className="flex items-center gap-3 mt-2 text-[9px] text-gray-500">
                            <span>{formatDate(p.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingPostId(p.id);
                              setPostForm({
                                title: p.title || '',
                                category: p.category || '',
                                content: p.content || '',
                                imageUrl: p.imageUrl || ''
                              });
                            }}
                            className="p-3 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                          >
                            ✎
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

       {selectedPost && (
        <div className="fixed inset-0 z-[100] bg-black backdrop-blur-3xl flex items-center justify-center p-0 md:p-12 transition-opacity duration-500">
          <div className="bg-[#050505] w-full max-w-7xl h-full md:max-h-[95vh] md:rounded-[4rem] border border-white/10 flex flex-col md:flex-row overflow-hidden shadow-2xl relative">
            <div className="absolute top-10 left-10 z-50 flex gap-4">
              <button
                onClick={closePost}
                className="p-6 bg-white/5 rounded-full hover:bg-white/10 transition text-white border border-white/10 shadow-2xl"
              >
                ✕
              </button>
              <button
                onClick={copyUrl}
                className="p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 transition text-indigo-400 border-indigo-500/30 rounded-full shadow-2xl hover:shadow-indigo-500/50"
                title="Bağlantıyı Kopyala"
              >
                🔗
              </button>
            </div>
            <div className="md:w-1/2 h-[50vh] md:h-auto relative shrink-0">
              <img src={selectedPost.imageUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"} alt={selectedPost.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#050505] via-transparent to-transparent"></div>
              <div className="absolute bottom-16 left-16 right-16">
                <span className={`${getCategoryColor(selectedPost.category)} px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block text-white shadow-xl border`}>
                  {selectedPost.category || 'Genel'}
                </span>
                <h2 className="text-6xl md:text-7xl font-black leading-[0.9] tracking-tighter text-white uppercase">
                  {selectedPost.title}
                </h2>
              </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-24 overflow-y-auto bg-[#050505] custom-scrollbar">
              <div
                className="prose prose-invert prose-p:text-gray-400 prose-p:text-xl prose-h2:text-white prose-h2:text-4xl"
                dangerouslySetInnerHTML={{ __html: selectedPost.content || '' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
