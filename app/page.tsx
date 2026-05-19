'use client';

import { useEffect, useState } from 'react';

interface Article {
  title: string;
  link: string;
  date: string;
  source: string;
  category: string;
  summary: string;
}

const CATEGORIES = ['전체', '백화점', '마트', '편의점', '면세점', '이커머스', '식음료', '패션', '뷰티', '지주사·그룹'];
const COMPANIES = ['전체', '롯데', '신세계', '현대백화점', 'CJ', '이마트', 'SSG', '쿠팡', '컬리', '올리브영', '무신사'];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedCompany, setSelectedCompany] = useState('전체');
  const [search, setSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const load = () => {
      fetch('/api/news')
        .then(res => res.json())
        .then(data => {
          setArticles(data.articles);
          setLoading(false);
          const now = new Date();
          setLastUpdated(now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0'));
        });
    };
    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filtered = articles.filter((article) => {
    const matchCategory = selectedCategory === '전체' || article.category === selectedCategory;
    const matchCompany = selectedCompany === '전체' || article.title.includes(selectedCompany) || article.summary?.includes(selectedCompany);
    const matchSearch = search === '' || article.title.includes(search) || article.summary?.includes(search);
    return matchCategory && matchCompany && matchSearch;
  });

  const fmt = (s: string) => {
    const d = new Date(s);
    return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
  };

  return (
    <main className='min-h-screen bg-gray-50'>
      <header className='bg-white border-b border-gray-200 sticky top-0 z-10'>
        <div className='max-w-6xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between mb-3'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>유통업계 뉴스</h1>
              <p className='text-sm text-gray-500'>백화점 · 마트 · 편의점 · 면세점 · 이커머스 · 식음료 · 패션 · 뷰티</p>
            </div>
            <div className='text-right'>
              <span className='text-xs text-gray-400 block'>{filtered.length}개 기사</span>
              {lastUpdated && <span className='text-xs text-gray-300'>업데이트 {lastUpdated}</span>}
            </div>
          </div>
          <input
            type='text'
            placeholder='기사 검색...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='w-full border border-gray-200 rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <div className='flex gap-2 flex-wrap mb-2'>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white' : 'px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200'}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className='flex gap-2 flex-wrap'>
            {COMPANIES.map(company => (
              <button
                key={company}
                onClick={() => setSelectedCompany(company)}
                className={selectedCompany === company ? 'px-3 py-1 rounded-full text-sm bg-gray-800 text-white' : 'px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200'}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className='max-w-6xl mx-auto px-4 py-6'>
        {loading ? (
          <div className='text-center py-20 text-gray-400'>뉴스를 불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <div className='text-center py-20 text-gray-400'>해당하는 기사가 없어요</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filtered.map((article, i) => (
              <a
                key={i}
                href={article.link}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100'
              >
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full'>{article.source}</span>
                  <span className='text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full'>{article.category}</span>
                  <span className='text-xs text-gray-400 ml-auto'>{article.date ? fmt(article.date) : ''}</span>
                </div>
                <h2 className='text-sm font-semibold text-gray-900 mb-2 leading-snug'>{article.title}</h2>
                {article.summary && (
                  <p className='text-xs text-gray-500'>{article.summary}</p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}