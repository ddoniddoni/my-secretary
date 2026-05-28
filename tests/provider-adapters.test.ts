import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockBaseballUpdates } from "../src/mocks/baseball";
import { createBaseballProvider } from "../src/lib/providers/baseball";
import { createNewsProvider } from "../src/lib/providers/news";
import { createRealEstateProvider } from "../src/lib/providers/real-estate";
import { createStockProvider } from "../src/lib/providers/stock";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    status,
  });
}

function xmlResponse(body: string, status = 200) {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
    },
    status,
  });
}

describe("provider adapters", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-18T00:00:00.000Z"));
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.useRealTimers();
  });

  it("keeps the mock news provider as the default", async () => {
    delete process.env.NEWS_PROVIDER;

    const provider = createNewsProvider();
    const result = await provider.getTopHeadlines({
      categories: ["IT"],
      language: "ko",
      maxItems: 5,
    });

    expect(result.provider).toBe("mock");
    expect(result.isMock).toBe(true);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("requires NEWSAPI_API_KEY when newsapi is selected", () => {
    process.env.NEWS_PROVIDER = "newsapi";
    delete process.env.NEWSAPI_API_KEY;

    expect(() => createNewsProvider()).toThrow(
      "NEWSAPI_API_KEY is required when NEWS_PROVIDER=newsapi is enabled.",
    );
  });

  it("normalizes NewsAPI responses into the shared news shape", async () => {
    process.env.NEWS_PROVIDER = "newsapi";
    process.env.NEWSAPI_API_KEY = "news-key";

    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = new URL(String(input));
      const category = url.searchParams.get("category");

      if (category === "technology") {
        return jsonResponse({
          articles: [
            {
              description: "반도체 수요가 이어졌습니다.",
              publishedAt: "2026-05-14T09:00:00Z",
              source: { name: "Tech Desk" },
              title: "AI 반도체 수요 유지",
              url: "https://example.com/news/ai-chip-demand",
            },
          ],
          status: "ok",
        });
      }

      return jsonResponse({
        articles: [
          {
            description: "원/달러 흐름이 안정적이었습니다.",
            publishedAt: "2026-05-14T08:30:00Z",
            source: { name: "Market Daily" },
            title: "환율 변동성 완화",
            url: "https://example.com/news/fx-stable",
          },
        ],
        status: "ok",
      });
    });

    vi.stubGlobal("fetch", fetchMock);

    const provider = createNewsProvider();
    const result = await provider.getTopHeadlines({
      categories: ["IT", "경제"],
      language: "ko",
      maxItems: 2,
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.provider).toBe("newsapi");
    expect(result.isMock).toBe(false);
    expect(result.items).toEqual([
      {
        category: "IT",
        publishedAt: "2026-05-14T09:00:00Z",
        sourceName: "Tech Desk",
        sourceUrl: "https://example.com/news/ai-chip-demand",
        summary: "반도체 수요가 이어졌습니다.",
        title: "AI 반도체 수요 유지",
      },
      {
        category: "경제",
        publishedAt: "2026-05-14T08:30:00Z",
        sourceName: "Market Daily",
        sourceUrl: "https://example.com/news/fx-stable",
        summary: "원/달러 흐름이 안정적이었습니다.",
        title: "환율 변동성 완화",
      },
    ]);
  });

  it("requires ALPHA_VANTAGE_API_KEY when alphavantage is selected", () => {
    process.env.STOCK_PROVIDER = "alphavantage";
    delete process.env.ALPHA_VANTAGE_API_KEY;

    expect(() => createStockProvider()).toThrow(
      "ALPHA_VANTAGE_API_KEY is required when STOCK_PROVIDER=alphavantage is enabled.",
    );
  });

  it("normalizes Alpha Vantage quote and news responses", async () => {
    process.env.STOCK_PROVIDER = "alphavantage";
    process.env.ALPHA_VANTAGE_API_KEY = "alpha-key";

    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = new URL(String(input));
      const fnName = url.searchParams.get("function");

      if (fnName === "GLOBAL_QUOTE") {
        return jsonResponse({
          "Global Quote": {
            "05. price": "190.75",
            "07. latest trading day": "2026-05-14",
            "09. change": "2.15",
            "10. change percent": "1.14%",
          },
        });
      }

      return jsonResponse({
        feed: [
          {
            overall_sentiment_label: "Bullish",
            summary: "서비스 매출 비중이 지지력을 보였습니다.",
            ticker_sentiment: [{ ticker: "AAPL" }],
            time_published: "20260514T101500",
            title: "애플 서비스 사업 방어력 유지",
            url: "https://example.com/stocks/aapl-services",
          },
        ],
      });
    });

    vi.stubGlobal("fetch", fetchMock);

    const provider = createStockProvider();
    const result = await provider.getMarketBrief({
      language: "ko",
      market: "US",
      symbols: ["AAPL"],
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.provider).toBe("alphavantage");
    expect(result.isMock).toBe(false);
    expect(result.quotes).toEqual([
      {
        asOf: "2026-05-14T00:00:00.000Z",
        change: 2.15,
        changePercent: 1.14,
        currency: "USD",
        market: "US",
        price: 190.75,
        symbol: "AAPL",
      },
    ]);
    expect(result.relatedNews).toEqual([
      {
        publishedAt: "2026-05-14T10:15:00.000Z",
        sentiment: "positive",
        sourceName: "Alpha Vantage News",
        sourceUrl: "https://example.com/stocks/aapl-services",
        summary: "서비스 매출 비중이 지지력을 보였습니다.",
        symbol: "AAPL",
        title: "애플 서비스 사업 방어력 유지",
      },
    ]);
  });

  it("keeps the mock baseball provider as the default", async () => {
    delete process.env.BASEBALL_PROVIDER;

    const provider = createBaseballProvider();
    const result = await provider.getLeagueBrief({
      includeStandings: true,
      language: "ko",
      teams: ["LG"],
    });

    expect(result.provider).toBe("mock");
    expect(result.isMock).toBe(true);
    expect(result.items).toHaveLength(1);
    expect(result.standings).toHaveLength(1);
  });

  it("normalizes official KBO standings, schedule, news, and leader pages", async () => {
    process.env.BASEBALL_PROVIDER = "kbo";

    const doosanTeam = Object.values(mockBaseballUpdates).find((item) =>
      item.sourceUrl.includes("/doosan-"),
    )?.team;

    expect(doosanTeam).toBeDefined();

    const standingsHtml = `
      <table summary="team standings">
        <thead>
          <tr>
            <th>RK</th>
            <th>TEAM</th>
            <th>GAMES</th>
            <th>W</th>
            <th>L</th>
            <th>D</th>
            <th>PCT</th>
            <th>GB</th>
            <th>STREAK</th>
            <th>HOME</th>
            <th>AWAY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td title="RK">1</td>
            <td title="TEAM">KT</td>
            <td title="GAMES">42</td>
            <td title="W">25</td>
            <td title="L">16</td>
            <td title="D">1</td>
            <td title="PCT">0.610</td>
            <td title="GB">0.0</td>
            <td title="STREAK">W1</td>
            <td title="HOME">13-10-0</td>
            <td title="AWAY">12-6-1</td>
          </tr>
          <tr>
            <td title="RK">2</td>
            <td title="TEAM">LG</td>
            <td title="GAMES">42</td>
            <td title="W">25</td>
            <td title="L">17</td>
            <td title="D">0</td>
            <td title="PCT">0.595</td>
            <td title="GB">0.5</td>
            <td title="STREAK">W1</td>
            <td title="HOME">14-9-0</td>
            <td title="AWAY">11-8-0</td>
          </tr>
          <tr>
            <td title="RK">6</td>
            <td title="TEAM">DOOSAN</td>
            <td title="GAMES">43</td>
            <td title="W">20</td>
            <td title="L">22</td>
            <td title="D">1</td>
            <td title="PCT">0.476</td>
            <td title="GB">5.5</td>
            <td title="STREAK">W2</td>
            <td title="HOME">11-9-0</td>
            <td title="AWAY">9-13-1</td>
          </tr>
        </tbody>
      </table>
    `;

    const scheduleHtml = `
      <div>2026.05</div>
      <table summary="schdule">
        <thead>
          <tr>
            <th>DATE</th>
            <th>TYPE</th>
            <th>TIME</th>
            <th colspan="3">GAME</th>
            <th>TV</th>
            <th>RADIO</th>
            <th>LOCATION</th>
            <th>ETC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td title="DATE" rowspan="2">05.17(SUN)</td>
            <td title="TYPE" rowspan="2">REGULAR</td>
            <td class="TIME">14:00</td>
            <td title="GAME">LG</td>
            <td title="GAME"><span class="score_schedule">6:4</span></td>
            <td title="GAME">SSG</td>
            <td class="TV">M-T</td>
            <td class="RADIO"></td>
            <td class="LOCATION">MUNHAK</td>
            <td class="ETC">-</td>
          </tr>
          <tr>
            <td class="TIME">14:00</td>
            <td title="GAME">LOTTE</td>
            <td title="GAME"><span class="score_schedule">4:8</span></td>
            <td title="GAME">DOOSAN</td>
            <td class="TV">MS-T</td>
            <td class="RADIO"></td>
            <td class="LOCATION">JAMSIL</td>
            <td class="ETC">-</td>
          </tr>
          <tr>
            <td title="DATE" rowspan="2">05.19(TUE)</td>
            <td title="TYPE" rowspan="2">REGULAR</td>
            <td class="TIME">18:30</td>
            <td title="GAME">LG</td>
            <td title="GAME"><span class="score_schedule">:</span></td>
            <td title="GAME">KIA</td>
            <td class="TV">SPO-T</td>
            <td class="RADIO"></td>
            <td class="LOCATION">GWANGJU</td>
            <td class="ETC">-</td>
          </tr>
          <tr>
            <td class="TIME">18:30</td>
            <td title="GAME">NC</td>
            <td title="GAME"><span class="score_schedule">:</span></td>
            <td title="GAME">DOOSAN</td>
            <td class="TV">MS-T</td>
            <td class="RADIO"></td>
            <td class="LOCATION">JAMSIL</td>
            <td class="ETC">-</td>
          </tr>
        </tbody>
      </table>
    `;

    const newsHtml = `
      <ul class="boardPhoto">
        <li>
          <div class="txt">
            <strong><a href="View.aspx?bdSe=1">LG wins weekend finale</a></strong>
            <p>LG offense stayed hot in a 6-4 win over SSG.<span class="date">2026.05.17</span></p>
          </div>
        </li>
        <li>
          <div class="txt">
            <strong><a href="View.aspx?bdSe=2">${doosanTeam} closes series with late surge</a></strong>
            <p>${doosanTeam} finished the weekend with an 8-4 comeback win.<span class="date">2026.05.17</span></p>
          </div>
        </li>
      </ul>
    `;

    const battingHtml = `
      <table summary="batting leaders">
        <thead>
          <tr>
            <th>RK</th>
            <th>PLAYER</th>
            <th>TEAM</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td title="RK">1</td>
            <td title="PLAYER"><a href="/player/1">DEAN Austin</a></td>
            <td title="TEAM">LG</td>
          </tr>
          <tr>
            <td title="RK">2</td>
            <td title="PLAYER"><a href="/player/2">PARK Jun Soon</a></td>
            <td title="TEAM">DOOSAN</td>
          </tr>
        </tbody>
      </table>
    `;

    const pitchingHtml = `
      <table summary="Pitching leaders">
        <thead>
          <tr>
            <th>RK</th>
            <th>PLAYER</th>
            <th>TEAM</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td title="RK">1</td>
            <td title="PLAYER"><a href="/player/3">Pitcher One</a></td>
            <td title="TEAM">SSG</td>
          </tr>
        </tbody>
      </table>
    `;

    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = new URL(String(input));

      if (url.pathname.includes("/Standings/TeamStandings.aspx")) {
        return new Response(standingsHtml, { status: 200 });
      }

      if (url.pathname.includes("/Schedule/DailySchedule.aspx")) {
        return new Response(scheduleHtml, { status: 200 });
      }

      if (url.pathname.includes("/MediaNews/News/BreakingNews/List.aspx")) {
        return new Response(newsHtml, { status: 200 });
      }

      if (url.pathname.includes("/Stats/BattingLeaders.aspx")) {
        return new Response(battingHtml, { status: 200 });
      }

      if (url.pathname.includes("/Stats/PitchingLeaders.aspx")) {
        return new Response(pitchingHtml, { status: 200 });
      }

      return new Response("not found", { status: 404 });
    });

    vi.stubGlobal("fetch", fetchMock);

    const provider = createBaseballProvider();
    const result = await provider.getLeagueBrief({
      includeStandings: true,
      language: "ko",
      teams: ["LG", doosanTeam!],
    });

    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect(result.provider).toBe("kbo");
    expect(result.isMock).toBe(false);
    expect(result.items).toHaveLength(2);
    expect(result.standings).toEqual([
      {
        rank: 2,
        record: "25승 17패",
        streak: "1연승",
        team: "LG",
      },
      {
        rank: 6,
        record: "20승 22패 1무",
        streak: "2연승",
        team: doosanTeam,
      },
    ]);
    expect(result.items[0]).toMatchObject({
      keyPlayer: "DEAN Austin",
      keyStory: "LG offense stayed hot in a 6-4 win over SSG.",
      sourceName: "KBO News",
      sourceUrl: "https://www.koreabaseball.com/MediaNews/News/BreakingNews/View.aspx?bdSe=1",
      team: "LG",
      title: "LG wins weekend finale",
    });
    expect(result.items[0].latestResult).toContain("6:4");
    expect(result.items[0].nextGame).toContain("18:30");
    expect(result.items[1]).toMatchObject({
      keyPlayer: "PARK Jun Soon",
      keyStory: `${doosanTeam} finished the weekend with an 8-4 comeback win.`,
      sourceName: "KBO News",
      sourceUrl: "https://www.koreabaseball.com/MediaNews/News/BreakingNews/View.aspx?bdSe=2",
      team: doosanTeam,
      title: `${doosanTeam} closes series with late surge`,
    });
    expect(result.items[1].latestResult).toContain("8:4");
    expect(result.items[1].nextGame).toContain("Jamsil");
  });

  it("requires MOLIT_API_KEY when molit is selected", () => {
    process.env.REAL_ESTATE_PROVIDER = "molit";
    delete process.env.MOLIT_API_KEY;

    expect(() => createRealEstateProvider()).toThrow(
      "MOLIT_API_KEY is required when REAL_ESTATE_PROVIDER=molit is enabled.",
    );
  });

  it("normalizes MOLIT real estate responses into the shared housing shape", async () => {
    process.env.REAL_ESTATE_PROVIDER = "molit";
    process.env.MOLIT_API_KEY = "molit-key";

    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = new URL(String(input));
      const month = url.searchParams.get("DEAL_YMD");
      const pageNo = url.searchParams.get("pageNo");

      if (month === "202605" && pageNo === "1") {
        return xmlResponse(`
          <response>
            <header>
              <resultCode>00</resultCode>
              <resultMsg>NORMAL SERVICE.</resultMsg>
            </header>
            <body>
              <items>
                <item>
                  <거래금액>95,000</거래금액>
                  <년>2026</년>
                  <월>5</월>
                  <일>3</일>
                  <법정동>상암동</법정동>
                  <아파트>한강타운</아파트>
                  <전용면적>84.91</전용면적>
                  <층>12</층>
                </item>
              </items>
              <totalCount>2</totalCount>
            </body>
          </response>
        `);
      }

      if (month === "202605" && pageNo === "2") {
        return xmlResponse(`
          <response>
            <header>
              <resultCode>00</resultCode>
              <resultMsg>NORMAL SERVICE.</resultMsg>
            </header>
            <body>
              <items>
                <item>
                  <거래금액>98,000</거래금액>
                  <년>2026</년>
                  <월>5</월>
                  <일>14</일>
                  <법정동>아현동</법정동>
                  <아파트>마포래미안</아파트>
                  <전용면적>84.97</전용면적>
                  <층>18</층>
                </item>
              </items>
              <totalCount>2</totalCount>
            </body>
          </response>
        `);
      }

      if (month === "202604") {
        return xmlResponse(`
          <response>
            <header>
              <resultCode>00</resultCode>
              <resultMsg>NORMAL SERVICE.</resultMsg>
            </header>
            <body>
              <items>
                <item>
                  <거래금액>92,000</거래금액>
                  <년>2026</년>
                  <월>4</월>
                  <일>10</일>
                  <법정동>아현동</법정동>
                  <아파트>마포래미안</아파트>
                  <전용면적>84.97</전용면적>
                  <층>17</층>
                </item>
              </items>
              <totalCount>1</totalCount>
            </body>
          </response>
        `);
      }

      return xmlResponse(`
        <response>
          <header>
            <resultCode>00</resultCode>
            <resultMsg>NORMAL SERVICE.</resultMsg>
          </header>
          <body>
            <items />
            <totalCount>0</totalCount>
          </body>
        </response>
      `);
    });

    vi.stubGlobal("fetch", fetchMock);

    const provider = createRealEstateProvider();
    const result = await provider.getMarketPulse({
      language: "ko",
      propertyTypes: ["apartment"],
      regions: ["서울 마포구"],
    });

    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(3);
    expect(result.provider).toBe("molit");
    expect(result.isMock).toBe(false);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      propertyType: "apartment",
      region: "서울 마포구",
      sourceName: "국토교통부 실거래가 공개시스템",
      sourceUrl: "https://www.data.go.kr/data/15126469/openapi.do",
      title: "서울 마포구 아파트 실거래 요약",
    });
    expect(result.items[0].publishedAt).toBe("2026-05-14T00:00:00.000Z");
    expect(result.items[0].priceTrendSummary).toContain("2026년 05월");
    expect(result.items[0].priceTrendSummary).toContain("9억 6,500만원");
    expect(result.items[0].priceTrendSummary).toContain("2026년 04월");
    expect(result.items[0].keyChanges[0]).toContain("거래 2건");
    expect(result.items[0].keyChanges.join(" ")).toContain("마포래미안");
  });

  it("fails clearly for unmapped MOLIT regions", async () => {
    process.env.REAL_ESTATE_PROVIDER = "molit";
    process.env.MOLIT_API_KEY = "molit-key";

    const provider = createRealEstateProvider();

    await expect(
      provider.getMarketPulse({
        language: "ko",
        propertyTypes: ["villa"],
        regions: ["지원하지 않는 지역"],
      }),
    ).rejects.toThrow(
      "Unsupported real estate region for REAL_ESTATE_PROVIDER=molit: 지원하지 않는 지역.",
    );
  });
});
