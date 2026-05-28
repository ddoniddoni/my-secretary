import type {
  AssistantPreview,
  ProductHighlight,
  ProductPrinciple,
} from "@/types/assistants";

export const productHighlights: ProductHighlight[] = [
  {
    label: "저장된 작업 흐름",
    value:
      "뉴스, 시장, 야구, 부동산처럼 반복 확인하는 일을 한 번의 클릭으로 다시 실행할 수 있는 비서로 바꿉니다.",
  },
  {
    label: "구조화된 출력",
    value:
      "원시 모델 텍스트를 채팅 로그처럼 보여주지 않고, 검증된 결과 카드를 렌더링합니다.",
  },
  {
    label: "서버 측 인공지능",
    value:
      "데이터 제공자 조회, 인공지능 생성, 스키마 검증은 모두 라우트 핸들러와 비서 실행기 뒤에서 처리합니다.",
  },
];

export const assistantPreviews: AssistantPreview[] = [
  {
    type: "news",
    badge: "뉴스 브리핑",
    name: "아침 뉴스 데스크",
    summary: "관심 있는 주요 뉴스를 간결한 아침 브리핑으로 정리합니다.",
    description:
      "뉴스 비서는 카테고리 기반 소스 데이터를 읽기 쉬운 브리프와 헤드라인 카드, 중요한 이유 설명, 출처 링크로 바꿔줍니다.",
    bullets: [
      "IT, 금융, 국제, 문화 같은 카테고리를 추적합니다.",
      "헤드라인 묶음, 핵심 요약, 출처 맥락을 함께 보여줍니다.",
      "처음엔 모의 데이터 제공자, 나중엔 실제 피드로 그대로 연결할 수 있습니다.",
    ],
    previewItems: [
      {
        title: "반도체 투자 확대",
        meta: "IT",
        description:
          "클라우드와 인프라 수요가 이어지면서 공급망 전반에서 새로운 투자 계획이 나오고 있습니다.",
      },
      {
        title: "왜 중요한가",
        meta: "맥락",
        description:
          "같은 흐름이 기업 예산, 인공지능 공급사, 하드웨어 제조사 모두에 영향을 줄 수 있습니다.",
      },
    ],
  },
  {
    type: "stock",
    badge: "시장 브리핑",
    name: "시장 레이더",
    summary:
      "관심 종목의 움직임과 핵심 이슈를 추적하되, 투자 조언으로 흐르지 않게 정리합니다.",
    description:
      "주식 비서는 가격 변화, 관련 헤드라인, 시장 맥락을 하나의 구조화된 카드와 명확한 주의 문구로 묶어줍니다.",
    bullets: [
      "같은 대시보드에서 미국과 한국 종목을 함께 확인합니다.",
      "요약은 매수/매도 판단이 아니라 정보 안내에 머뭅니다.",
      "관련 뉴스와 이슈 목록은 데이터 제공자 데이터와 연결됩니다.",
    ],
    previewItems: [
      {
        title: "NVDA",
        meta: "+2.1%",
        description:
          "수요 기대와 데이터센터 코멘트가 단기 내러티브를 계속 이끌고 있습니다.",
      },
      {
        title: "주의 문구",
        meta: "알림",
        description: "이 브리핑은 공개 데이터 요약이며 투자 조언이 아닙니다.",
      },
    ],
  },
  {
    type: "baseball",
    badge: "KBO 브리핑",
    name: "KBO 레이더",
    summary:
      "여러 페이지를 뒤지지 않아도 순위 정보를 포함한 경기 흐름을 한 번에 확인합니다.",
    description:
      "야구 비서는 팀 업데이트, 순위 맥락, 다음 경기 신호를 빠르게 읽을 수 있는 스포츠 브리핑으로 묶어줍니다.",
    bullets: [
      "하나의 저장된 설정에서 KBO 여러 팀을 추적합니다.",
      "최종 브리핑에 순위를 포함할지 선택할 수 있습니다.",
      "스포츠 데이터는 데이터 제공자 경계 안에서 분리해 둡니다.",
    ],
    previewItems: [
      {
        title: "LG 트윈스",
        meta: "시리즈",
        description:
          "다음 경기 전까지는 선발진과 불펜 운영이 핵심 관전 포인트입니다.",
      },
      {
        title: "순위",
        meta: "포함",
        description:
          "리그 위치를 함께 보여줘서 한 경기 결과를 더 쉽게 해석할 수 있습니다.",
      },
    ],
  },
  {
    type: "real_estate",
    badge: "부동산 흐름",
    name: "집 흐름",
    summary:
      "공개 시장 업데이트를 빠르게 훑기 좋은 결과 UI로 지역별 주택 신호를 확인합니다.",
    description:
      "부동산 비서는 지역과 주택 유형별로 공개 시장 신호를 묶어서 반복 확인이 빠르고 읽기 쉽게 만듭니다.",
    bullets: [
      "하나의 비서에서 여러 지역과 주택 유형을 추적합니다.",
      "공개 시장 업데이트와 공급 신호를 바탕으로 문구를 유지합니다.",
      "나중에 실제 주택 피드로 교체하기 쉽게 설계합니다.",
    ],
    previewItems: [
      {
        title: "마포 아파트",
        meta: "서울",
        description:
          "매물 움직임, 심리, 공급 메모를 한 번에 읽을 수 있는 지역 요약으로 묶습니다.",
      },
      {
        title: "신호",
        meta: "공개 데이터",
        description:
          "각 업데이트는 추측보다 맥락 요약에 초점을 맞춥니다.",
      },
    ],
  },
];

export const productPrinciples: ProductPrinciple[] = [
  {
    eyebrow: "읽기 쉬운 UI",
    title: "채팅 로그 대신 결과 카드",
    description:
      "각 비서 유형은 일반 채팅창을 반복하기보다 작업 목적에 맞는 전용 결과 화면으로 렌더링되어야 합니다.",
  },
  {
    eyebrow: "명확한 경계",
    title: "데이터 제공자, 실행기, 스키마를 분리",
    description:
      "모의 데이터 제공자는 나중에 실제 API로 바꿔도 비서 UI와 route-level 실행 흐름을 다시 쓰지 않아도 됩니다.",
  },
  {
    eyebrow: "안전 기본값",
    title: "소유권 검증과 서버 측 실행",
    description:
      "Supabase 소유권 검사, RLS, 서버 측 인공지능 호출은 데이터 접근과 비밀키를 안전한 경계 안에 둡니다.",
  },
];
