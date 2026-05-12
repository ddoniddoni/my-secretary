import { mockRealEstatePulses } from "../../mocks/real-estate";

import type {
  RealEstateProvider,
  RealEstateProviderInput,
  RealEstateProviderItem,
  RealEstateProviderResult,
} from "./types";

function buildFallbackPulse(
  region: string,
  propertyType: RealEstateProviderInput["propertyTypes"][number],
): RealEstateProviderItem {
  return {
    demandSignal: "공개 정보가 제한적이라 기본 데모 흐름으로 표시됩니다.",
    keyChanges: [
      `${region} ${propertyType} 관련 데모 지표를 사용 중입니다.`,
    ],
    priceTrendSummary: `${region} ${propertyType} 시장은 확인용 mock 데이터로 표시됩니다.`,
    propertyType,
    publishedAt: "2026-05-13T08:50:00.000Z",
    region,
    sourceName: "Demo Property Feed",
    sourceUrl: `https://example.com/real-estate/${encodeURIComponent(region)}-${propertyType}`,
    supplySignal: "실제 공급 지표 대신 데모용 요약을 표시합니다.",
    title: `${region} ${propertyType} 데모 브리핑`,
  };
}

class MockRealEstateProvider implements RealEstateProvider {
  async getMarketPulse(
    input: RealEstateProviderInput,
  ): Promise<RealEstateProviderResult> {
    const items = input.regions.flatMap((region) =>
      input.propertyTypes.map((propertyType) => {
        const match = mockRealEstatePulses.find(
          (item) =>
            item.region === region && item.propertyType === propertyType,
        );

        return match ?? buildFallbackPulse(region, propertyType);
      }),
    );

    return {
      generatedAt: new Date().toISOString(),
      isMock: true,
      items,
      propertyTypes: input.propertyTypes,
      provider: "mock",
      regions: input.regions,
    };
  }
}

export function createRealEstateProvider(): RealEstateProvider {
  const provider = process.env.REAL_ESTATE_PROVIDER?.trim() || "mock";

  if (provider !== "mock") {
    throw new Error(`Unsupported real estate provider: ${provider}`);
  }

  return new MockRealEstateProvider();
}
