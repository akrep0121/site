import fs from 'fs/promises';
import path from 'path';
import { createRSSFeed } from '../lib/rss-generator';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const RSS_FILE = path.join(PUBLIC_DIR, 'rss.xml');

async function generateRSS() {
  console.log('📰 RSS Feed oluşturuluyor...');
  
  try {
    const feed = await createRSSFeed({
      title: 'Soner Yılmaz Blog',
      description: 'FinTech Geliştiricisi & Yatırım Analisti - En güncel finansal analizler, yatırım stratejileri ve teknoloji trendleri',
      link: 'https://soneryilmaz.vercel.app',
      language: 'tr',
    });

    await fs.writeFile(RSS_FILE, feed, 'utf-8');
    
    const stats = await fs.stat(RSS_FILE);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    
    console.log('✅ RSS Feed başarıyla oluşturuldu!');
    console.log(`📁 Dosya konumu: ${RSS_FILE}`);
    console.log(`📦 Dosya boyutu: ${fileSizeKB} KB`);
    console.log('');
    console.log('🔗 RSS Linkleri:');
    console.log('   Dinamik API: https://soneryilmaz.vercel.app/api/rss');
    console.log('   Statik XML:  https://soneryilmaz.vercel.app/rss.xml');
    console.log('');
    console.log('📬 Brevo Entegrasyonu için: Dinamik API linkini kullanın');
    
  } catch (error) {
    console.error('❌ RSS Feed oluşturma hatası:', error);
    process.exit(1);
  }
}

generateRSS();
