import { mockRealEstatePulses } from "../../mocks/real-estate";

import type {
  RealEstateProvider,
  RealEstateProviderInput,
  RealEstateProviderItem,
  RealEstateProviderResult,
} from "./types";
import {
  coerceFiniteNumber,
  fetchProviderText,
  getProviderSelection,
  getRequiredProviderEnv,
} from "./shared";

type RealEstatePropertyType = RealEstateProviderInput["propertyTypes"][number];

type MolitDatasetDefinition = {
  buildingNameKeys: string[];
  datasetUrl: string;
  endpoint: string;
  label: string;
};

type MolitRegion = {
  code: string;
  displayName: string;
};

type MolitTransaction = {
  areaSqm: number | null;
  buildingName: string;
  dealDate: string;
  districtName: string | null;
  floor: string | null;
  priceInManwon: number;
};

const RECENT_MONTH_COUNT = 3;
const MOLIT_PAGE_SIZE = 500;

const molitDatasets = {
  apartment: {
    buildingNameKeys: ["아파트"],
    datasetUrl: "https://www.data.go.kr/data/15126469/openapi.do",
    endpoint:
      "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade",
    label: "아파트",
  },
  officetel: {
    buildingNameKeys: ["오피스텔", "단지"],
    datasetUrl: "https://www.data.go.kr/data/15126464/openapi.do",
    endpoint:
      "https://apis.data.go.kr/1613000/RTMSDataSvcOffiTrade/getRTMSDataSvcOffiTrade",
    label: "오피스텔",
  },
  villa: {
    buildingNameKeys: ["연립다세대", "건물명", "주택명"],
    datasetUrl: "https://www.data.go.kr/data/15126467/openapi.do",
    endpoint:
      "https://apis.data.go.kr/1613000/RTMSDataSvcRHTrade/getRTMSDataSvcRHTrade",
    label: "연립/다세대",
  },
} as const satisfies Record<RealEstatePropertyType, MolitDatasetDefinition>;

const molitRegionCodeMap: Record<string, string> = {
  "11110": "11110",
  "11440": "11440",
  "11680": "11680",
  "11650": "11650",
  "11710": "11710",
  "11560": "11560",
  "11170": "11170",
  "11200": "11200",
  "11590": "11590",
  "11500": "11500",
  "41135": "41135",
  "41131": "41131",
  "41133": "41133",
  "41117": "41117",
  "41465": "41465",
  "41290": "41290",
  "41287": "41287",
  "41285": "41285",
  "41450": "41450",
  "26350": "26350",
  "26500": "26500",
  bundang: "41135",
  mapo: "11440",
  "서울강남구": "11680",
  "서울강서구": "11500",
  "서울동작구": "11590",
  "서울마포구": "11440",
  "서울서초구": "11650",
  "서울성동구": "11200",
  "서울송파구": "11710",
  "서울영등포구": "11560",
  "서울용산구": "11170",
  "서울종로구": "11110",
  "경기고양시일산동구": "41285",
  "경기고양시일산서구": "41287",
  "경기과천시": "41290",
  "경기성남시분당구": "41135",
  "경기성남시수정구": "41131",
  "경기성남시중원구": "41133",
  "경기수원시영통구": "41117",
  "경기용인시수지구": "41465",
  "경기하남시": "41450",
  "부산수영구": "26500",
  "부산해운대구": "26350",
};

function buildFallbackPulse(
  region: string,
  propertyType: RealEstatePropertyType,
): RealEstateProviderItem {
  return {
    demandSignal: "공개 데이터 연결이 없어 기본 데모 시그널을 표시합니다.",
    keyChanges: [`${region} ${propertyType} 관련 mock 요약을 사용 중입니다.`],
    priceTrendSummary: `${region} ${propertyType} 시장은 mock 데이터로 표시됩니다.`,
    propertyType,
    publishedAt: "2026-05-13T08:50:00.000Z",
    region,
    sourceName: "데모 부동산 피드",
    sourceUrl: `https://example.com/real-estate/${encodeURIComponent(region)}-${propertyType}`,
    supplySignal: "실제 공급 지표 대신 데모용 요약을 표시합니다.",
    title: `${region} ${propertyType} 데모 브리프`,
  };
}

function normalizeRegionKey(region: string) {
  return region.replace(/[\s,.-]+/g, "").toLowerCase();
}

function resolveMolitRegion(region: string): MolitRegion {
  const trimmed = region.trim();

  if (/^\d{5}$/.test(trimmed)) {
    return {
      code: trimmed,
      displayName: trimmed,
    };
  }

  const mappedCode = molitRegionCodeMap[normalizeRegionKey(trimmed)];

  if (!mappedCode) {
    throw new Error(
      `Unsupported real estate region for REAL_ESTATE_PROVIDER=molit: ${region}. Use a known district name like '서울 마포구' or a 5-digit LAWD code.`,
    );
  }

  return {
    code: mappedCode,
    displayName: trimmed,
  };
}

function getRecentDealMonths(count: number, now = new Date()) {
  const cursor = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );
  const months: string[] = [];

  for (let index = 0; index < count; index += 1) {
    const year = cursor.getUTCFullYear();
    const month = String(cursor.getUTCMonth() + 1).padStart(2, "0");

    months.push(`${year}${month}`);
    cursor.setUTCMonth(cursor.getUTCMonth() - 1);
  }

  return months;
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function getXmlTagValue(xml: string, tagName: string) {
  const match = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`));

  if (!match) {
    return null;
  }

  const value = decodeXmlEntities(match[1].trim());

  return value.length > 0 ? value : null;
}

function parseXmlItems(xml: string) {
  const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];

  return itemBlocks.map((block) => {
    const record: Record<string, string> = {};
    const innerBlock = block
      .replace(/^<item>/, "")
      .replace(/<\/item>$/, "");
    const tagPattern = /<([^\/!\s>]+)>([\s\S]*?)<\/\1>/g;
    let match: RegExpExecArray | null = null;

    while ((match = tagPattern.exec(innerBlock)) !== null) {
      const [, rawTagName, rawValue] = match;

      const tagName = rawTagName.trim();
      const value = decodeXmlEntities(rawValue.trim());

      if (value) {
        record[tagName] = value;
      }
    }

    return record;
  });
}

function parseMolitResponse(xml: string, errorContext: string) {
  const resultCode = getXmlTagValue(xml, "resultCode");
  const resultMessage = getXmlTagValue(xml, "resultMsg");

  if (resultCode && resultCode !== "00") {
    throw new Error(
      resultMessage
        ? `${errorContext} failed: ${resultMessage}`
        : `${errorContext} failed with code ${resultCode}.`,
    );
  }

  const items = parseXmlItems(xml);
  const totalCount = coerceFiniteNumber(getXmlTagValue(xml, "totalCount"));

  return {
    items,
    totalCount: totalCount ?? items.length,
  };
}

function pickFirstValue(
  record: Record<string, string>,
  keys: readonly string[],
) {
  for (const key of keys) {
    const value = record[key]?.trim();

    if (value) {
      return value;
    }
  }

  return null;
}

function buildDealDate(record: Record<string, string>) {
  const year = record["년"]?.trim();
  const month = record["월"]?.trim();
  const day = record["일"]?.trim();

  if (!year || !month || !day) {
    return null;
  }

  return new Date(
    `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00.000Z`,
  ).toISOString();
}

function shouldSkipCancelledTransaction(record: Record<string, string>) {
  const cancelledFlag = pickFirstValue(record, ["해제여부"]);
  const cancelledAt = pickFirstValue(record, ["해제사유발생일"]);

  return cancelledFlag === "O" || cancelledFlag === "Y" || Boolean(cancelledAt);
}

function normalizeMolitTransaction(
  record: Record<string, string>,
  propertyType: RealEstatePropertyType,
) {
  if (shouldSkipCancelledTransaction(record)) {
    return null;
  }

  const priceInManwon = coerceFiniteNumber(record["거래금액"]);
  const dealDate = buildDealDate(record);
  const buildingName =
    pickFirstValue(record, molitDatasets[propertyType].buildingNameKeys) ??
    pickFirstValue(record, ["법정동"]) ??
    `${molitDatasets[propertyType].label} 실거래`;

  if (priceInManwon === null || !dealDate) {
    return null;
  }

  return {
    areaSqm: coerceFiniteNumber(pickFirstValue(record, ["전용면적"])),
    buildingName,
    dealDate,
    districtName: pickFirstValue(record, ["법정동"]),
    floor: pickFirstValue(record, ["층"]),
    priceInManwon,
  } satisfies MolitTransaction;
}

function formatMonthLabel(monthKey: string) {
  return `${monthKey.slice(0, 4)}년 ${monthKey.slice(5, 7)}월`;
}

function formatDateLabel(isoDate: string) {
  return `${isoDate.slice(0, 4)}.${isoDate.slice(5, 7)}.${isoDate.slice(8, 10)}`;
}

function formatPriceInManwon(value: number) {
  const rounded = Math.round(value);
  const eok = Math.floor(rounded / 10000);
  const manwon = rounded % 10000;

  if (eok > 0 && manwon > 0) {
    return `${eok}억 ${manwon.toLocaleString("ko-KR")}만원`;
  }

  if (eok > 0) {
    return `${eok}억원`;
  }

  return `${rounded.toLocaleString("ko-KR")}만원`;
}

function formatSignedPercent(value: number) {
  const sign = value > 0 ? "+" : "";

  return `${sign}${value.toFixed(1)}%`;
}

function averagePrice(records: MolitTransaction[]) {
  return (
    records.reduce((total, record) => total + record.priceInManwon, 0) /
    records.length
  );
}

function uniqueBuildingCount(records: MolitTransaction[]) {
  return new Set(records.map((record) => record.buildingName)).size;
}

function buildDemandSignal(
  latestMonthKey: string,
  latestRecords: MolitTransaction[],
  previousMonthKey: string | null,
  previousRecords: MolitTransaction[],
) {
  const latestCount = latestRecords.length;

  if (!previousMonthKey || previousRecords.length === 0) {
    return `${formatMonthLabel(latestMonthKey)}에 ${latestCount}건의 실거래가 확인돼 기본 수요 흐름을 살펴볼 수 있습니다.`;
  }

  const previousCount = previousRecords.length;
  const changeRatio = (latestCount - previousCount) / previousCount;

  if (changeRatio >= 0.2) {
    return `${formatMonthLabel(previousMonthKey)} ${previousCount}건에서 ${formatMonthLabel(latestMonthKey)} ${latestCount}건으로 거래가 늘어 수요가 다시 움직이는 모습입니다.`;
  }

  if (changeRatio <= -0.2) {
    return `${formatMonthLabel(latestMonthKey)} 거래 건수가 ${latestCount}건으로 줄어 관망 흐름이 이어지는 모습입니다.`;
  }

  return `${formatMonthLabel(latestMonthKey)} 거래 건수는 ${latestCount}건으로 전월과 비슷한 흐름을 보입니다.`;
}

function buildSupplySignal(
  latestMonthKey: string,
  latestRecords: MolitTransaction[],
) {
  const buildingCount = uniqueBuildingCount(latestRecords);

  if (buildingCount <= 1) {
    return `${formatMonthLabel(latestMonthKey)} 실거래가 한 단지 또는 한 건물 중심으로 확인돼 공급 상황은 추가 지표와 함께 보는 편이 안전합니다.`;
  }

  return `${formatMonthLabel(latestMonthKey)} 기준 실거래가 ${buildingCount}개 단지/건물에서 확인돼 기존 매물 소화 흐름은 일부 파악할 수 있지만, 신규 공급량 자체를 직접 보여주는 데이터는 아닙니다.`;
}

function buildPriceTrendSummary(
  latestMonthKey: string,
  latestAveragePrice: number,
  previousMonthKey: string | null,
  previousAveragePrice: number | null,
) {
  if (!previousMonthKey || previousAveragePrice === null) {
    return `${formatMonthLabel(latestMonthKey)} 평균 실거래가는 약 ${formatPriceInManwon(latestAveragePrice)}로 집계됐습니다.`;
  }

  const changePercent =
    previousAveragePrice === 0
      ? 0
      : ((latestAveragePrice - previousAveragePrice) / previousAveragePrice) *
        100;

  return `${formatMonthLabel(latestMonthKey)} 평균 실거래가는 약 ${formatPriceInManwon(latestAveragePrice)}로, ${formatMonthLabel(previousMonthKey)} 대비 ${formatSignedPercent(changePercent)} 움직였습니다.`;
}

function buildNoDataPulse(
  region: string,
  propertyType: RealEstatePropertyType,
): RealEstateProviderItem {
  const months = getRecentDealMonths(RECENT_MONTH_COUNT);
  const dataset = molitDatasets[propertyType];
  const fromMonth = months[months.length - 1];
  const toMonth = months[0];

  return {
    demandSignal:
      "최근 조회 구간에서 유효한 실거래 신고를 찾지 못해 수요 흐름을 판단하기 어렵습니다.",
    keyChanges: [
      `조회 구간: ${fromMonth.slice(0, 4)}-${fromMonth.slice(4, 6)} ~ ${toMonth.slice(0, 4)}-${toMonth.slice(4, 6)}`,
      "최근 실거래 없음",
    ],
    priceTrendSummary:
      "최근 3개월 실거래 응답에 유효한 거래가 없어 가격 흐름을 요약하지 못했습니다.",
    propertyType,
    publishedAt: new Date().toISOString(),
    region,
    sourceName: "국토교통부 실거래가 공개시스템",
    sourceUrl: dataset.datasetUrl,
    supplySignal:
      "거래 건수가 없어 공급 흐름도 별도 공공 통계와 함께 확인하는 편이 좋습니다.",
    title: `${region} ${dataset.label} 실거래 요약`,
  };
}

function buildPulseFromTransactions(
  region: string,
  propertyType: RealEstatePropertyType,
  transactions: MolitTransaction[],
): RealEstateProviderItem {
  if (transactions.length === 0) {
    return buildNoDataPulse(region, propertyType);
  }

  const dataset = molitDatasets[propertyType];
  const sortedTransactions = [...transactions].sort((left, right) =>
    left.dealDate.localeCompare(right.dealDate),
  );
  const latestTransaction = sortedTransactions[sortedTransactions.length - 1];
  const highestTransaction = sortedTransactions.reduce((currentHighest, record) =>
    record.priceInManwon > currentHighest.priceInManwon ? record : currentHighest,
  );
  const monthlyBuckets = new Map<string, MolitTransaction[]>();

  for (const transaction of sortedTransactions) {
    const monthKey = transaction.dealDate.slice(0, 7);
    const bucket = monthlyBuckets.get(monthKey) ?? [];

    bucket.push(transaction);
    monthlyBuckets.set(monthKey, bucket);
  }

  const monthKeys = Array.from(monthlyBuckets.keys()).sort().reverse();
  const latestMonthKey = monthKeys[0];
  const previousMonthKey = monthKeys[1] ?? null;
  const latestMonthRecords = monthlyBuckets.get(latestMonthKey) ?? [];
  const previousMonthRecords = previousMonthKey
    ? (monthlyBuckets.get(previousMonthKey) ?? [])
    : [];
  const latestAveragePrice = averagePrice(latestMonthRecords);
  const previousAveragePrice =
    previousMonthRecords.length > 0 ? averagePrice(previousMonthRecords) : null;
  const keyChanges = [
    `${formatMonthLabel(latestMonthKey)} 거래 ${latestMonthRecords.length}건, 평균 ${formatPriceInManwon(latestAveragePrice)}`,
    previousMonthKey && previousMonthRecords.length > 0
      ? `${formatMonthLabel(previousMonthKey)} 거래 ${previousMonthRecords.length}건`
      : null,
    `최고 거래 ${highestTransaction.buildingName} ${formatPriceInManwon(highestTransaction.priceInManwon)}`,
    `가장 최근 신고일 ${formatDateLabel(latestTransaction.dealDate)}`,
  ].filter((value): value is string => Boolean(value));

  if (highestTransaction.areaSqm !== null) {
    keyChanges[2] = `${keyChanges[2]} (${highestTransaction.areaSqm.toFixed(1)}㎡)`;
  }

  return {
    demandSignal: buildDemandSignal(
      latestMonthKey,
      latestMonthRecords,
      previousMonthKey,
      previousMonthRecords,
    ),
    keyChanges: keyChanges.slice(0, 4),
    priceTrendSummary: buildPriceTrendSummary(
      latestMonthKey,
      latestAveragePrice,
      previousMonthKey,
      previousAveragePrice,
    ),
    propertyType,
    publishedAt: latestTransaction.dealDate,
    region,
    sourceName: "국토교통부 실거래가 공개시스템",
    sourceUrl: dataset.datasetUrl,
    supplySignal: buildSupplySignal(latestMonthKey, latestMonthRecords),
    title: `${region} ${dataset.label} 실거래 요약`,
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

class MolitRealEstateProvider implements RealEstateProvider {
  constructor(private readonly apiKey: string) {}

  async getMarketPulse(
    input: RealEstateProviderInput,
  ): Promise<RealEstateProviderResult> {
    const items = await Promise.all(
      input.regions.flatMap((region) => {
        const resolvedRegion = resolveMolitRegion(region);

        return input.propertyTypes.map(async (propertyType) => {
          const transactions = await this.getTransactionsForPropertyType(
            resolvedRegion,
            propertyType,
          );

          return buildPulseFromTransactions(
            resolvedRegion.displayName,
            propertyType,
            transactions,
          );
        });
      }),
    );

    return {
      generatedAt: new Date().toISOString(),
      isMock: false,
      items,
      propertyTypes: input.propertyTypes,
      provider: "molit",
      regions: input.regions,
    };
  }

  private async getTransactionsForPropertyType(
    region: MolitRegion,
    propertyType: RealEstatePropertyType,
  ) {
    const months = getRecentDealMonths(RECENT_MONTH_COUNT);
    const monthlyTransactions = await Promise.all(
      months.map((dealMonth) =>
        this.getTransactionsForMonth(region, propertyType, dealMonth),
      ),
    );

    return monthlyTransactions.flat();
  }

  private async getTransactionsForMonth(
    region: MolitRegion,
    propertyType: RealEstatePropertyType,
    dealMonth: string,
  ) {
    const dataset = molitDatasets[propertyType];
    const records: MolitTransaction[] = [];
    let pageNo = 1;
    let previousPageSignature: string | null = null;

    while (pageNo <= 10) {
      const url = new URL(dataset.endpoint);

      url.searchParams.set("serviceKey", this.apiKey);
      url.searchParams.set("LAWD_CD", region.code);
      url.searchParams.set("DEAL_YMD", dealMonth);
      url.searchParams.set("pageNo", String(pageNo));
      url.searchParams.set("numOfRows", String(MOLIT_PAGE_SIZE));

      const errorContext = `MOLIT ${dataset.label} request for ${region.displayName} (${dealMonth})`;
      const xml = await fetchProviderText(url, { errorContext });
      const response = parseMolitResponse(xml, errorContext);
      const normalizedRecords = response.items
        .map((record) => normalizeMolitTransaction(record, propertyType))
        .filter((record): record is MolitTransaction => record !== null);
      const pageSignature = JSON.stringify(
        normalizedRecords.map((record) => [
          record.buildingName,
          record.dealDate,
          record.floor,
          record.priceInManwon,
        ]),
      );

      records.push(...normalizedRecords);

      if (
        normalizedRecords.length === 0 ||
        response.totalCount <= records.length ||
        pageSignature === previousPageSignature
      ) {
        break;
      }

      previousPageSignature = pageSignature;
      pageNo += 1;
    }

    const deduped = new Map<string, MolitTransaction>();

    for (const record of records) {
      const key = [
        record.buildingName,
        record.dealDate,
        record.floor ?? "",
        record.priceInManwon,
      ].join("::");

      if (!deduped.has(key)) {
        deduped.set(key, record);
      }
    }

    return Array.from(deduped.values());
  }
}

export function createRealEstateProvider(): RealEstateProvider {
  const provider = getProviderSelection(process.env.REAL_ESTATE_PROVIDER, "mock");

  if (provider === "mock") {
    return new MockRealEstateProvider();
  }

  if (provider === "molit") {
    return new MolitRealEstateProvider(
      getRequiredProviderEnv(
        process.env.MOLIT_API_KEY,
        "MOLIT_API_KEY",
        "REAL_ESTATE_PROVIDER=molit",
      ),
    );
  }

  throw new Error(`Unsupported real estate provider: ${provider}`);
}
