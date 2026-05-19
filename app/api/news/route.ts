import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

const RSS_FEEDS = [
  { url: 'https://www.hankyung.com/feed/all-news', source: '한국경제' },
  { url: 'https://www.mk.co.kr/rss/30000001/', source: '매일경제' },
  { url: 'https://www.edaily.co.kr/rss/edaily_news.xml', source: '이데일리' },
  { url: 'https://www.etoday.co.kr/news/rss', source: '이투데이' },
  { url: 'https://www.newsis.com/RSS/economy.xml', source: '뉴시스' },
  { url: 'https://biz.chosun.com/rss/rss.html', source: '조선비즈' },
  { url: 'https://www.asiae.co.kr/rss/rss.htm', source: '아시아경제' },
  { url: 'https://www.heraldcorp.com/rss/010000000000.xml', source: '헤럴드경제' },
  { url: 'https://www.sedaily.com/RSS/economy', source: '서울경제' },
  { url: 'https://www.bizwatch.co.kr/rss/rss.html', source: '비즈워치' },
  { url: 'https://www.bloter.net/feed', source: '블로터' },
  { url: 'https://www.fn.co.kr/rss/rss.xml', source: '파이낸셜뉴스' },
  { url: 'https://www.thebell.co.kr/free/content/RssForm.asp', source: '더벨' },
  { url: 'https://dealsite.co.kr/feed', source: '딜사이트' },
  { url: 'https://www.investchosun.com/rss/rss.html', source: '인베스트조선' },
  { url: 'https://www.kdfnews.com/rss/allArticle.xml', source: '유통경제신문' },
  { url: 'https://www.retailing.co.kr/rss/allArticle.xml', source: '리테일링' },
  { url: 'https://www.foodnews.co.kr/rss/allArticle.xml', source: '식품신문' },
  { url: 'https://www.thinkfood.co.kr/rss/allArticle.xml', source: '식품음료신문' },
  { url: 'https://www.foodbank.co.kr/rss/allArticle.xml', source: '식품외식경제' },
  { url: 'https://www.apparelnews.co.kr/rss/allArticle.xml', source: '어패럴뉴스' },
  { url: 'https://www.fashionbiz.co.kr/rss/allArticle.xml', source: '패션비즈' },
  { url: 'https://www.cosmorning.com/rss/allArticle.xml', source: '코스모닝' },
  { url: 'https://www.beautynury.com/rss/allArticle.xml', source: '뷰티누리' },
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  '백화점': ['백화점', '롯데백화점', '신세계백화점', '현대백화점', '갤러리아', '더현대', 'AK플라자'],
  '마트': ['이마트', '롯데마트', '홈플러스', '코스트코', '트레이더스', '이마트트레이더스', '창고형 할인'],
  '편의점': ['편의점', 'CU', 'GS25', '세븐일레븐', '이마트24', 'BGF리테일', '미니스톱'],
  '면세점': ['면세점', '면세점업계', '면세사업', '호텔신라', '신라면세점', '롯데면세점', '신세계면세점', '현대면세점'],
  '이커머스': ['쿠팡', '컬리', '마켓컬리', 'SSG닷컴', '쓱닷컴', '오아시스마켓', '이커머스', '온라인쇼핑몰', '네이버쇼핑'],
  '식음료': ['CJ제일제당', 'CJ푸드빌', '신세계푸드', '현대그린푸드', '롯데웰푸드', '농심', '오리온', '해태제과', '빙그레', '동원F&B', '대상', '풀무원', '하이트진로', '오비맥주', '삼양식품', '오뚜기', '식품업계', '식음료업계'],
  '패션': ['무신사', '한섬', 'F&F', '휠라코리아', '코오롱FnC', '삼성물산 패션', '패션업계', '의류업계', 'LF', '신세계인터내셔날'],
  '뷰티': ['올리브영', '아모레퍼시픽', 'LG생활건강', '애경산업', '코스맥스', '한국콜마', '뷰티업계', '화장품업계', 'K뷰티'],
  '지주사·그룹': ['롯데지주', '신세계그룹', '현대백화점그룹', 'CJ그룹', 'GS그룹', 'HDC그룹'],
};

// 반드시 제목에 포함되어야 하는 핵심 키워드 (제목 기준으로만 필터링)
const TITLE_MUST_INCLUDE = [
  // 유통 채널
  '백화점', '마트', '편의점', '면세점', '면세',
  '이마트', '롯데마트', '홈플러스', '코스트코', '트레이더스',
  'CU', 'GS25', '세븐일레븐', '이마트24', 'BGF',
  '쿠팡', '컬리', 'SSG', '오아시스', '이커머스',
  '호텔신라', '신라면세점', '롯데면세점',

  // 식품/식음료 기업
  'CJ제일제당', 'CJ푸드빌', '신세계푸드', '현대그린푸드', '롯데웰푸드',
  '농심', '오리온', '빙그레', '동원', '풀무원', '하이트진로', '오비맥주', '삼양식품', '오뚜기',

  // 커피 브랜드
  '스타벅스', '메가MGC', '메가mgc', '컴포즈커피', '빽다방', '투썸플레이스',
  '할리스', '커피빈', '바나프레소', '이디야', '팀홀튼', '폴바셋', '블루보틀',
  '파스쿠찌', '드롭탑', '탐앤탐스', '엔제리너스', '커피에반하다', '달콤커피',
  '더벤티', '비씨커피', '포시즌스커피', '커피나무', '빈브라더스',

  // 패스트푸드/버거/피자
  '맥도날드', '롯데리아', '버거킹', '맘스터치', '파이브가이즈', '쉐이크쉑',
  '도미노피자', '피자헛', '미스터피자', '피자알볼로', '고피자',
  'KFC', '노브랜드버거', '써브웨이', '타코벨',

  // 치킨
  'BBQ', 'BHC', '교촌치킨', '굽네치킨', '페리카나', '네네치킨', '호식이두마리치킨',
  '치킨플러스', '60계치킨', '푸라닭', '훌랄라', '멕시카나',

  // 급식/뷔페/단체급식
  '아워홈', '삼성웰스토리', '한화푸드테크', '현대그린푸드', 'CJ프레시웨이',
  '신세계푸드', '풀무원푸드앤컬처', '티알엔', '대한급식',
  '계절밥상', '올반', '자연별곡', '빕스', '애슐리', '계절밥상',

  // 아이스크림/디저트
  '배스킨라빈스', '베라', '하겐다즈', '나뚜루', '밀크카우',
  '설빙', '빙수', '젤라또', '소프트리',

  // 패션/뷰티
  '무신사', '한섬', 'F&F', '휠라', '코오롱FnC', 'LF', '신세계인터내셔날',
  '올리브영', '아모레퍼시픽', 'LG생활건강', '애경산업', '코스맥스', '한국콜마',

  // 지주사/그룹
  '롯데지주', '신세계그룹', '현대백화점그룹', 'CJ그룹', 'GS리테일',

  // 일반
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