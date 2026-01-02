import { NextResponse } from 'next/server';
import { createRSSFeed } from '@/lib/rss-generator';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const feed = await createRSSFeed({
      title: 'Soner Yılmaz Blog',
      description: 'FinTech Geliştiricisi & Yatırım Analisti - En güncel finansal analizler, yatırım stratejileri ve teknoloji trendleri',
      link: 'https://soneryilmaz.vercel.app',
      language: 'tr',
    });

    return new NextResponse(feed, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('RSS API hatası:', error);
    return NextResponse.json(
      { error: 'RSS feed oluşturulamadı' },
      { status: 500 }
    );
  }
}
