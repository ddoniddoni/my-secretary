import type { RealEstatePropertyType } from "../types/assistants";

export type MockRealEstatePulse = {
  demandSignal: string;
  keyChanges: string[];
  priceTrendSummary: string;
  propertyType: RealEstatePropertyType;
  publishedAt: string;
  region: string;
  sourceName: string;
  sourceUrl: string;
  supplySignal: string;
  title: string;
};

export const mockRealEstatePulses: MockRealEstatePulse[] = [
  {
    demandSignal: "실거주 수요와 교통 개선 기대가 함께 언급됩니다.",
    keyChanges: [
      "최근 매물 문의가 늘었다는 현장 반응이 이어졌습니다.",
      "역세권 소형 단지 중심으로 관심이 유지되고 있습니다.",
    ],
    priceTrendSummary:
      "서울 마포구 아파트는 최근 공개 지표 기준 보합에서 소폭 강세 흐름으로 요약됩니다.",
    propertyType: "apartment",
    publishedAt: "2026-05-13T08:30:00.000Z",
    region: "서울 마포구",
    sourceName: "Demo Housing Watch",
    sourceUrl: "https://example.com/real-estate/mapo-apartment",
    supplySignal: "신규 공급 뉴스는 제한적이어서 기존 매물 흐름이 더 주목받습니다.",
    title: "마포구 아파트 시장은 실거주 문의와 교통 기대감이 함께 반영됩니다.",
  },
  {
    demandSignal: "직주근접 수요가 꾸준히 언급됩니다.",
    keyChanges: [
      "오피스텔 월세 수요가 안정적으로 유지되는 편입니다.",
      "매매보다는 임대 관련 문의가 먼저 언급되는 흐름입니다.",
    ],
    priceTrendSummary:
      "서울 마포구 오피스텔은 가격 급등보다 안정적 수익형 수요 중심으로 해석됩니다.",
    propertyType: "officetel",
    publishedAt: "2026-05-13T08:35:00.000Z",
    region: "서울 마포구",
    sourceName: "City Lease Brief",
    sourceUrl: "https://example.com/real-estate/mapo-officetel",
    supplySignal: "기존 역세권 재고와 신축 간 선호 차이가 분명하게 나타납니다.",
    title: "마포구 오피스텔은 직주근접 수요가 꾸준한 편입니다.",
  },
  {
    demandSignal: "학군과 생활 인프라 선호가 동시에 언급됩니다.",
    keyChanges: [
      "실거주 관심 단지 위주로 문의가 이어집니다.",
      "가격 민감도는 있지만 거래 관망만으로 보기는 어렵습니다.",
    ],
    priceTrendSummary:
      "분당구 아파트는 공개 기사 기준 선호 입지 중심의 견조한 흐름으로 정리됩니다.",
    propertyType: "apartment",
    publishedAt: "2026-05-13T08:40:00.000Z",
    region: "경기 성남시 분당구",
    sourceName: "Metro Property Note",
    sourceUrl: "https://example.com/real-estate/bundang-apartment",
    supplySignal: "신규 공급보다는 기존 주요 단지 체결 흐름이 더 자주 언급됩니다.",
    title: "분당구 아파트는 선호 단지 중심으로 관심이 이어집니다.",
  },
  {
    demandSignal: "실수요와 소규모 투자 관심이 혼재된 흐름입니다.",
    keyChanges: [
      "빌라 시장은 개별 입지와 건물 상태에 따른 편차가 큽니다.",
      "대중교통 접근성이 가격 인식에 영향을 주는 편입니다.",
    ],
    priceTrendSummary:
      "분당구 빌라는 단지형 아파트보다 개별 매물 차별화가 더 크게 반영됩니다.",
    propertyType: "villa",
    publishedAt: "2026-05-13T08:45:00.000Z",
    region: "경기 성남시 분당구",
    sourceName: "Local Asset Watch",
    sourceUrl: "https://example.com/real-estate/bundang-villa",
    supplySignal: "매물 수는 존재하지만 거래 체결은 선별적으로 이뤄지는 편입니다.",
    title: "분당구 빌라는 매물별 차별화가 크게 작용합니다.",
  },
];
