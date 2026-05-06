import type {
  AssistantPreview,
  ProductHighlight,
  ProductPrinciple,
} from "@/types/assistants";

export const productHighlights: ProductHighlight[] = [
  {
    label: "Saved workflows",
    value: "뉴스 카테고리와 관심 종목을 비서 설정으로 저장해 두고 다시 실행합니다.",
  },
  {
    label: "Structured output",
    value: "문자열 덤프 대신 schema로 검증된 결과를 비서 타입별 UI로 렌더링합니다.",
  },
  {
    label: "Server-side AI",
    value: "OpenAI 호출은 서버에서만 처리하고, provider와 runner를 분리해 확장성을 남깁니다.",
  },
];

export const assistantPreviews: AssistantPreview[] = [
  {
    type: "news",
    badge: "news brief",
    name: "오늘 뉴스 정리 AI",
    summary: "카테고리별 핵심 이슈를 빠르게 읽을 수 있는 브리핑 카드로 정리합니다.",
    description:
      "오늘의 주요 이슈를 전체 요약, 주요 이슈 카드, why it matters, 출처 정보까지 포함한 형태로 정리합니다.",
    bullets: [
      "IT, 경제, 국제 같은 관심 카테고리를 저장할 수 있습니다.",
      "핵심 요약과 중요 포인트를 함께 읽는 결과 UI를 목표로 합니다.",
      "sourceName과 sourceUrl을 유지해 실제 provider 전환에도 대응합니다.",
    ],
    previewItems: [
      {
        title: "AI 반도체 경쟁 심화",
        meta: "IT",
        description: "핵심 공급망과 클라우드 투자 흐름이 다시 집중되며 업계 지형이 바뀌고 있습니다.",
      },
      {
        title: "왜 중요한가",
        meta: "context",
        description: "장비, 데이터센터, 에너지 수요까지 연결되어 여러 산업에 파급 효과를 만듭니다.",
      },
    ],
  },
  {
    type: "stock",
    badge: "market brief",
    name: "주식 브리핑 AI",
    summary: "관심 종목과 관련 이슈를 요약해 카드 중심으로 읽기 쉽게 정리합니다.",
    description:
      "시장 요약, 종목별 카드, 관련 뉴스, 리스크 노트, 투자 조언 아님 문구까지 포함한 결과 UI를 준비합니다.",
    bullets: [
      "US 또는 KR 시장 기준으로 관심 종목을 저장할 수 있습니다.",
      "매수·매도 추천 없이 공개 데이터 기반 정보 요약만 제공합니다.",
      "관련 뉴스와 가격 변동을 함께 보여주는 읽기 흐름을 만듭니다.",
    ],
    previewItems: [
      {
        title: "NVDA",
        meta: "+2.1%",
        description: "데이터센터 수요 기대감이 유지되며 반도체 섹터 전반의 관심을 끌고 있습니다.",
      },
      {
        title: "주의 문구",
        meta: "notice",
        description: "이 내용은 투자 조언이 아니라 공개 데이터 기반 정보 요약입니다.",
      },
    ],
  },
];

export const productPrinciples: ProductPrinciple[] = [
  {
    eyebrow: "Readable UI",
    title: "결과는 읽기 좋은 카드와 섹션으로",
    description:
      "채팅 로그를 반복하는 대신 비서 타입별로 다른 결과 레이아웃을 준비해 사용 목적에 맞는 UX를 만듭니다.",
  },
  {
    eyebrow: "Reliable Data Flow",
    title: "provider, runner, schema를 분리한 구조",
    description:
      "mock provider로 시작하되 실제 API로 교체할 수 있도록 도메인 경계를 분리해 유지보수성을 높입니다.",
  },
  {
    eyebrow: "Safe By Default",
    title: "서버 전용 AI 호출과 사용자 소유권 보호",
    description:
      "AI 키를 클라이언트에 노출하지 않고, 이후 step에서 Supabase Auth와 RLS를 함께 적용할 기반을 준비합니다.",
  },
];
