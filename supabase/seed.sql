insert into public.assistant_templates (
  type,
  name,
  description,
  avatar_key,
  system_prompt,
  default_config
)
select
  'news',
  '오늘 뉴스 정리 AI',
  '오늘의 주요 뉴스 이슈를 핵심만 정리해주는 비서입니다.',
  'pixel-reporter',
  'You are a Korean news briefing assistant. Summarize news clearly, neutrally, and concisely. Do not fabricate sources.',
  jsonb_build_object(
    'categories', jsonb_build_array('IT', '경제', '국제'),
    'summaryStyle', 'brief',
    'maxItems', 5,
    'language', 'ko'
  )
where not exists (
  select 1
  from public.assistant_templates
  where type = 'news'
    and name = '오늘 뉴스 정리 AI'
);

insert into public.assistant_templates (
  type,
  name,
  description,
  avatar_key,
  system_prompt,
  default_config
)
select
  'stock',
  '주식 브리핑 AI',
  '관심 종목의 가격 변동과 관련 이슈를 요약해주는 비서입니다.',
  'pixel-broker',
  'You are a stock information briefing assistant. Do not provide investment advice. Summarize public information only.',
  jsonb_build_object(
    'symbols', jsonb_build_array('AAPL', 'NVDA', 'TSLA'),
    'market', 'US',
    'summaryStyle', 'news-focused',
    'language', 'ko'
  )
where not exists (
  select 1
  from public.assistant_templates
  where type = 'stock'
    and name = '주식 브리핑 AI'
);
