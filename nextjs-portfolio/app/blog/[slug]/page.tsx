'use client';

import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
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
  slug?: string;
  title?: string;
  content?: string;
  category?: string;
  imageUrl?: string;
  createdAt?: any;
}

interface Comment {
  id: string;
  postId?: string;
  author?: string;
  text?: string;
  createdAt?: any;
}

interface TrCharMap {
  [key: string]: string;
}

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const appId = "portfolyo-145a9";

      const postsSnap = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'blogPosts'));
      const postsData = postsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Post[];

      const slug = params.slug;
      const foundPost = postsData.find(p => {
        const createSlug = (title?: string) => {
          if (!title) return '';
          const trMap: TrCharMap = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
          };
          return title.split('').map(c => trMap[c] || c).join('').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
        };
        const postSlug = p.slug || createSlug(p.title);
        return postSlug === slug;
      });

      if (foundPost) {
        setPost(foundPost);

        const commentsSnap = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'comments'));
        const commentsData = commentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const postComments = commentsData.filter((c: any) => c.postId === foundPost.id);
        setComments(postComments);

        document.title = `${foundPost.title} | Soner Yılmaz`;
      } else {
        router.push('/');
      }
    };

    fetchPost();
  }, [params.slug, router]);

  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-500 border-gray-400';
    const colors = {
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

  const commentCount = comments.filter((c: any) => c.postId === post.id).length;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-indigo-500/50 animate-spin rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Yazı yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <div id="scroll-progress" className="fixed top-0 left-0 h-0.5 bg-indigo-500 z-[100] transition-all duration-100" style={{width: '0%'}}></div>

      <nav className="fixed w-full z-50 p-8 flex justify-center">
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] px-12 py-4 rounded-full shadow-2xl flex items-center gap-16 transition-all hover:border-white/[0.12]">
          <div className="text-2xl font-black tracking-tighter text-white uppercase italic select-none">
            Soner<span className="text-indigo-500">.</span>
          </div>
          <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            <a href="/" className="hover:text-white transition">Ana Sayfa</a>
            <a href="#blog-section" className="hover:text-white transition">Yazılar</a>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-bold uppercase tracking-widest">
            <span>← Yazılara Dön</span>
          </button>
        </div>

        <div className="md:w-1/2 h-[50vh] md:h-auto relative shrink-0 mb-8">
          <img src={post.imageUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"} alt={post.title} className="w-full h-full object-cover rounded-[3rem]" />
        </div>

        <div className="space-y-8">
          <div>
            <span className={`${getCategoryColor(post.category)} px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block text-white shadow-xl border`}>
              {post.category || 'Genel'}
            </span>
            <h1 className="text-6xl md:text-7xl font-black leading-[0.9] tracking-tighter text-white uppercase mb-4">
              {post.title}
            </h1>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {formatDate(post.createdAt)}
            </div>
          </div>

          <div className="prose prose-invert prose-p:text-gray-400 prose-p:text-xl prose-h2:text-white prose-h2:text-4xl" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        </div>

        <div className="mt-24 p-10 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] text-center">
          <h4 className="text-2xl font-black text-white uppercase mb-6">Haftalık Analizler</h4>
          <form onSubmit={async (e) => {
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
          }} className="flex gap-3">
            <input type="email" name="email" required placeholder="E-posta" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 text-white placeholder-gray-600" />
            <button type="submit" className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gray-200">Abone Ol</button>
          </form>
        </div>

        <div className="mt-24 pt-12 border-t border-white/[0.05]">
          <h3 className="text-3xl font-black text-white uppercase mb-12 flex items-center gap-4">
            Yorumlar <span className="text-indigo-500 text-sm">({commentCount})</span>
          </h3>
          <form onSubmit={async (e) => {
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
              window.location.reload();
            } catch (err) {
              console.error('Yorum hatası:', err);
              alert('Yorum iletilemedi.');
            }
          }} className="space-y-4 mb-16">
            <input name="author" required placeholder="İSMİNİZ" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 text-white placeholder-gray-600" />
            <textarea name="text" required placeholder="FİKRİNİZİ PAYLAŞIN..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 text-white placeholder-gray-600" rows={3} />
            <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase">Gönder</button>
          </form>

          <div className="space-y-8">
            {commentCount === 0 ? (
              <p className="text-gray-700 italic text-sm">İlk yorumu siz yapın!</p>
            ) : (
              comments
                .filter((c: any) => c.postId === post.id)
                .sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0))
                .map((c: any) => (
                  <div key={c.id} className="bg-white/[0.03] p-8 rounded-[2rem]">
                    <div className="text-white font-bold text-sm uppercase mb-4">{c.author}</div>
                    <p className="text-gray-400 text-sm leading-relaxed">{c.text}</p>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-8 left-8 z-[70] p-4 bg-white text-black rounded-full transition-all duration-500 shadow-2xl hover:bg-gray-200">
        ↑
      </button>

      <script dangerouslySetInnerHTML={{
        __html: `
          window.onscroll = () => {
            const ws = window.scrollY;
            const h = document.documentElement.scrollHeight - window.innerHeight;
            const prog = document.getElementById('scroll-progress');
            if (prog) prog.style.width = (ws / h * 100) + '%';
          };
        `
      }} />
    </div>
  );
}
