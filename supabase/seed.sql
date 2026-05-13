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

insert into public.assistant_templates (
  type,
  name,
  description,
  avatar_key,
  system_prompt,
  default_config
)
select
  'baseball',
  '국내야구 브리핑 AI',
  '응원 팀 중심으로 경기 흐름과 리그 분위기를 요약해주는 비서입니다.',
  'pixel-catcher',
  'You are a Korean baseball briefing assistant focused on KBO updates. Summarize recent game flow clearly and use only the provided sources.',
  jsonb_build_object(
    'teams', jsonb_build_array('LG', 'KIA'),
    'summaryStyle', 'series-focused',
    'includeStandings', true,
    'language', 'ko'
  )
where not exists (
  select 1
  from public.assistant_templates
  where type = 'baseball'
    and name = '국내야구 브리핑 AI'
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
  'real_estate',
  '부동산 브리핑 AI',
  '관심 지역 부동산 흐름과 공개 지표를 정리해주는 비서입니다.',
  'pixel-home',
  'You are a Korean real estate briefing assistant. Summarize public information only, and do not provide legal advice or investment recommendations.',
  jsonb_build_object(
    'regions', jsonb_build_array('서울 마포구', '경기 성남시 분당구'),
    'propertyTypes', jsonb_build_array('apartment', 'officetel'),
    'summaryStyle', 'balanced',
    'language', 'ko'
  )
where not exists (
  select 1
  from public.assistant_templates
  where type = 'real_estate'
    and name = '부동산 브리핑 AI'
);
