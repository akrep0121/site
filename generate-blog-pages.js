const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously } = require('firebase/auth');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

const firebaseConfig = {
  apiKey: "AIzaSyDtN5CJ4fvWMCkGImJEMfKQrIiBdeKZKqI",
  authDomain: "portfolyo-145a9.firebaseapp.com",
  projectId: "portfolyo-145a9",
  storageBucket: "portfolyo-145a9.firebasestorage.app",
  messagingSenderId: "230588990982",
  appId: "1:230588990982:web:d7fbb79d94bb4cc9b22587"
};

async function generateStaticBlogPages() {
  console.log('Connecting to Firebase...');
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const appId = "portfolyo-145a9";
  
  await signInAnonymously(auth);
  console.log('✅ Connected to Firebase');
  
  // Fetch all blog posts
  const postsRef = collection(db, 'artifacts', appId, 'public', 'data', 'blogPosts');
  const querySnapshot = await getDocs(postsRef);
  
  const posts = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  console.log(`✅ Found ${posts.length} blog posts`);
  
  // Read index.html template
  const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  console.log('✅ Read index.html template');
  
  // Create blog directory if it doesn't exist
  const blogDir = path.join(__dirname, 'public', 'blog');
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
    console.log('✅ Created public/blog directory');
  }
  
  // Generate static HTML for each post
  let generatedCount = 0;
  
  for (const post of posts) {
    if (!post.slug) {
      console.log(`⚠️ Skipping post without slug: ${post.title}`);
      continue;
    }
    
    console.log(`\nGenerating: ${post.slug}`);
    
    // Create summary
    const cleanContent = post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const summary = cleanContent.substring(0, 160) + "...";
    const newTitle = `${post.title} | Soner Yılmaz`;
    const postUrl = `https://soneryilmaz.vercel.app/blog/${post.slug}`;
    
    // Update HTML meta tags
    let blogHtml = indexHtml
      .replace(/<title>[^<]*<\/title>/i, `<title>${newTitle}</title>`)
      .replace(/name="description"[^>]*content="[^"]*"[^>]*>/i, 
              `name="description" id="site-description" content="${summary}"`)
      .replace(/name="keywords"[^>]*content="[^"]*"[^>]*>/i, 
              `name="keywords" id="site-keywords" content="${post.category}, ${post.title}, Soner Yılmaz"`)
      .replace(/property="og:title"[^>]*content="[^"]*"[^>]*>/i, 
              `property="og:title" id="og-title" content="${newTitle}"`)
      .replace(/property="og:description"[^>]*content="[^"]*"[^>]*>/i, 
              `property="og:description" id="og-description" content="${summary}"`)
      .replace(/property="og:url"[^>]*content="[^"]*"[^>]*>/i, 
              `property="og:url" id="og-url" content="${postUrl}"`)
      .replace(/property="og:image"[^>]*content="[^"]*"[^>]*>/i, 
              `property="og:image" id="og-image" content="${post.imageUrl}"`)
      .replace(/property="og:type"[^>]*content="[^"]*"[^>]*>/i, 
              `property="og:type" id="og-type" content="article"`)
      .replace(/name="twitter:title"[^>]*content="[^"]*"[^>]*>/i, 
              `name="twitter:title" id="twitter-title" content="${newTitle}"`)
      .replace(/name="twitter:description"[^>]*content="[^"]*"[^>]*>/i, 
              `name="twitter:description" id="twitter-description" content="${summary}"`)
      .replace(/name="twitter:image"[^>]*content="[^"]*"[^>]*>/i, 
              `name="twitter:image" id="twitter-image" content="${post.imageUrl}"`)
      .replace(/rel="canonical"[^>]*href="[^"]*"[^>]*>/i, 
              `rel="canonical" id="site-canonical" href="${postUrl}"`);
    
    // Update JSON-LD
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": summary,
      "image": post.imageUrl,
      "author": { "@type": "Person", "name": "Soner Yılmaz", "jobTitle": "FinTech Geliştiricisi & Yatırım Analisti" },
      "datePublished": post.createdAt ? new Date(post.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
      "url": postUrl,
      "publisher": {
        "@type": "Organization",
        "name": "Soner Yılmaz",
        "logo": {
          "@type": "ImageObject",
          "url": post.imageUrl
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": postUrl
      }
    };
    
    blogHtml = blogHtml.replace(
      /<script type="application\/ld\+json" id="structured-data-ld"><\/script>/i,
      `<script type="application/ld+json" id="structured-data-ld">${JSON.stringify(schemaData)}</script>`
    );
    
    // Add auto-open script
    const autoOpenScript = `
        <script>
          window.autoOpenPostId = '${post.id}';
          window.autoOpenPostData = ${JSON.stringify(post)};
        </script>
      </head>`;
    
    blogHtml = blogHtml.replace('</head>', autoOpenScript);
    
    // Write to file
    const filePath = path.join(blogDir, `${post.slug}.html`);
    fs.writeFileSync(filePath, blogHtml, 'utf-8');
    
    generatedCount++;
    console.log(`✅ Generated: ${filePath}`);
  }
  
  console.log(`\n✅ Total static pages generated: ${generatedCount}/${posts.length}`);
  console.log('Files saved to: public/blog/');
}

generateStaticBlogPages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
