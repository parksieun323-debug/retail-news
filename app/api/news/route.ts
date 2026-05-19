import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

const RSS_FEEDS = [
  // 종합 매체
  { url: 'https://www.khan.co.kr/rss/rssdata/total_news.xml', source: '경향신문' },
  { url: 'https://rss.kmib.co.kr/data/kmibRssAll.xml', source: '국민일보' },
  { url: 'https://rss.donga.com/total.xml', source: '동아일보' },
  { url: 'https://www.munhwa.com/rss/all.xml', source: '문화일보' },
  { url: 'https://www.seoul.co.kr/xml/rss/rss_economy.xml', source: '서울신문' },
  { url: 'https://www.segye.com/Articles/RSSList/segye_economy.xml', source: '세계일보' },
  { url: 'https://www.chosun.com/arc/outboundfeeds/rss/', source: '조선일보' },
  { url: 'https://www.joongang.co.kr/RSS/economy.xml', source: '중앙일보' },
  { url: 'https://www.hani.co.kr/rss/economy/', source: '한겨레' },
  { url: 'https://www.hankookilbo.com/rss/economy.xml', source: '한국일보' },

  // 방송/통신사
  { url: 'https://feeds.news1.kr/articles/all', source: '뉴스1' },
  { url: 'https://www.newsis.com/RSS/economy.xml', source: '뉴시스' },
  { url: 'https://www.yna.co.kr/RSS/economy.xml', source: '연합뉴스' },
  { url: 'https://www.yonhapnewstv.co.kr/rss/economy.xml', source: '연합뉴스TV' },
  { url: 'https://biz.sbs.co.kr/rss/economy.xml', source: 'SBS Biz' },

  // 경제 매체
  { url: 'https://www.mk.co.kr/rss/30000001/', source: '매일경제' },
  { url: 'https://www.mt.co.kr/rss/economy.xml', source: '머니투데이' },
  { url: 'https://www.bizwatch.co.kr/rss/rss.html', source: '비즈워치' },
  { url: 'https://www.sedaily.com/RSS/economy', source: '서울경제' },
  { url: 'https://www.asiae.co.kr/rss/rss.htm', source: '아시아경제' },
  { url: 'https://www.edaily.co.kr/rss/edaily_news.xml', source: '이데일리' },
  { url: 'https://biz.chosun.com/rss/rss.html', source: '조선비즈' },
  { url: 'https://www.joseilbo.com/rss/news.xml', source: '조세일보' },
  { url: 'https://www.fn.co.kr/rss/rss.xml', source: '파이낸셜뉴스' },
  { url: 'https://www.hankyung.com/feed/all-news', source: '한국경제' },
  { url: 'https://www.heraldcorp.com/rss/010000000000.xml', source: '헤럴드경제' },

  // 인터넷
  { url: 'https://www.nocutnews.co.kr/rss/economy.xml', source: '노컷뉴스' },
  { url: 'https://thefact.co.kr/rss/allArticle.xml', source: '더팩트' },
  { url: 'https://www.dailian.co.kr/rss/allArticle.xml', source: '데일리안' },
  { url: 'https://www.inews24.com/rss/economy.xml', source: '아이뉴스24' },
  { url: 'https://www.ohmynews.com/rss/economy.xml', source: '오마이뉴스' },

  // IT
  { url: 'https://www.ddaily.co.kr/rss/allArticle.xml', source: '디지털데일리' },
  { url: 'https://www.dt.co.kr/rss/economy.xml', source: '디지털타임스' },
  { url: 'https://www.bloter.net/feed', source: '블로터' },
  { url: 'https://www.etnews.com/rss/economy.xml', source: '전자신문' },
  { url: 'https://zdnet.co.kr/rss/economy.xml', source: '지디넷코리아' },

  // 매거진
  { url: 'https://www.thescoop.co.kr/rss/allArticle.xml', source: '더스쿠프' },
  { url: 'https://www.mk.co.kr/rss/50200011/', source: '매경이코노미' },
  { url: 'https://www.sisain.co.kr/rss/allArticle.xml', source: '시사IN' },
  { url: 'https://www.economist.co.kr/rss/allArticle.xml', source: '이코노미스트' },
  { url: 'https://magazine.hankyung.com/business/rss', source: '한경비즈니스' },

  // 비CP 매체
  { url: 'https://www.newsworks.co.kr/rss/allArticle.xml', source: '뉴스웍스' },
  { url: 'https://www.newspim.com/rss/economy.xml', source: '뉴스핌' },
  { url: 'https://www.thebell.co.kr/free/content/RssForm.asp', source: '더벨' },
  { url: 'https://dealsite.co.kr/feed', source: '딜사이트' },
  { url: 'https://www.investchosun.com/rss/rss.html', source: '인베스트조선' },
  { url: 'https://www.apparelnews.co.kr/rss/allArticle.xml', source: '어패럴뉴스' },
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  '백화점': ['백화점', '롯데백화점', '신세계백화점', '현대백화점', '갤러리아', '더현대', 'AK플라자'],
  '마트': ['이마트', '롯데마트', '홈플러스', '코스트코', '트레이더스', '이마트트레이더스', '창고형 할인'],
  '편의점': ['편의점', 'CU', 'GS25', '세븐일레븐', '이마트24', 'BGF리테일', '미니스톱'],
  '면세점': ['면세점', '면세점업계', '면세사업', '호텔신라', '신라면세점', '롯데면세점', '신세계면세점', '현대면세점'],
  '이커머스': ['쿠팡', '컬리', '마켓컬리', 'SSG닷컴', '쓱닷컴', '오아시스마켓', '이커머스', '온라인쇼핑몰', '네이버쇼핑'],
  '식음료': ['CJ제일제당', 'CJ푸드빌', '신세계푸드', '현대그린푸드', '롯데웰푸드', '농심', '오리온', '해태제과', '빙그레', '동원F&B', '대상', '풀무원', '하이트진로', '오비맥주', '삼양식품', '오뚜기', '식품업계', '식음료업계', '스타벅스', '투썸플레이스', '메가MGC', '컴포즈커피', '빽다방', '이디야', '맥도날드', '롯데리아', '버거킹', '맘스터치', '도미노피자', '아워홈', '삼성웰스토리', '한화푸드테크', '배스킨라빈스'],
  '패션': ['무신사', '한섬', 'F&F', '휠라코리아', '코오롱FnC', '삼성물산 패션', '패션업계', '의류업계', 'LF', '신세계인터내셔날'],
  '뷰티': ['올리브영', '아모레퍼시픽', 'LG생활건강', '애경산업', '코스맥스', '한국콜마', '뷰티업계', '화장품업계', 'K뷰티'],
  '지주사·그룹': ['롯데지주', '신세계그룹', '현대백화점그룹', 'CJ그룹', 'GS그룹', 'HDC그룹'],
};

const TITLE_MUST_INCLUDE = [
  '백화점', '마트', '편의점', '면세점', '면세',
  '이마트', '롯데마트', '홈플러스', '코스트코', '트레이더스',
  'CU', 'GS25', '세븐일레븐', '이마트24', 'BGF',
  '쿠팡', '컬리', 'SSG', '오아시스', '이커머스',
  '호텔신라', '신라면세점', '롯데면세점',
  'CJ제일제당', 'CJ푸드빌', '신세계푸드', '현대그린푸드', '롯데웰푸드',
  '농심', '오리온', '빙그레', '동원', '풀무원', '하이트진로', '오비맥주', '삼양식품', '오뚜기',
  '스타벅스', '투썸플레이스', '메가MGC', '컴포즈커피', '빽다방', '이디야', '할리스', '커피빈',
  '맥도날드', '롯데리아', '버거킹', '맘스터치', '도미노피자', '파이브가이즈', '쉐이크쉑',
  'BBQ', 'BHC', '교촌치킨', '굽네치킨',
  '아워홈', '삼성웰스토리', '한화푸드테크', '배스킨라빈스',
  '무신사', '한섬', 'F&F', '휠라', '코오롱FnC', 'LF',
  '올리브영', '아모레퍼시픽', 'LG생활건강', '코스맥스', '한국콜마',
  '롯데지주', '신세계그룹', '현대백화점그룹', 'CJ그룹', 'GS리테일',
  '유통업계', '유통기업', '소비재', '리테일',
  '식품업계', '식음료', '패션업계', '뷰티업계', '화장품업계', '프랜차이즈',
];

function getCategory(title: string): string {
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => title.includes(k))) {
      return category;
    }
  }
  return '전체';
}

function isRelevant(title: string): boolean {
  return TITLE_MUST_INCLUDE.some(k => title.includes(k));
}

export async function GET() {
  const results: any[] = [];

  await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        parsed.items.forEach((item) => {
          const title = item.title || '';
          const snippet = item.contentSnippet || '';
          if (isRelevant(title)) {
            results.push({
              title,
              link: item.link,
              date: item.pubDate,
              source: feed.source,
              category: getCategory(title),
              summary: snippet.slice(0, 120),
            });
          }
        });
      } catch (e) {
        console.error(`Failed to fetch ${feed.source}`);
      }
    })
  );

  results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ articles: results });
}