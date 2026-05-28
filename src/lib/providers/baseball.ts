import { mockBaseballStandings, mockBaseballUpdates } from "../../mocks/baseball";

import type { KboTeam } from "../../types/assistants";
import type {
  BaseballProvider,
  BaseballProviderInput,
  BaseballProviderItem,
  BaseballProviderResult,
  BaseballStanding,
} from "./types";
import { fetchProviderText, getProviderSelection } from "./shared";

type OfficialKboTeamCode =
  | "DOOSAN"
  | "HANWHA"
  | "KIA"
  | "KIWOOM"
  | "KT"
  | "LG"
  | "LOTTE"
  | "NC"
  | "SAMSUNG"
  | "SSG";

type TeamRuntimeInfo = {
  officialCode: OfficialKboTeamCode;
  team: KboTeam;
};

type ParsedHtmlCell = {
  text: string;
  title: string | null;
};

type KboStandingRow = {
  awayRecord: string;
  draw: number;
  games: number;
  gb: string;
  homeRecord: string;
  losses: number;
  officialCode: OfficialKboTeamCode;
  pct: string;
  rank: number;
  streak: string;
  wins: number;
};

type KboScheduleGame = {
  awayTeam: OfficialKboTeamCode;
  dateLabel: string;
  etc: string;
  homeTeam: OfficialKboTeamCode;
  isoDate: string;
  location: string;
  scoreText: string;
  time: string;
  type: string;
};

type KboNewsItem = {
  publishedAt: string | null;
  sourceName: string;
  sourceUrl: string;
  summary: string;
  title: string;
};

type KboLeaderRow = {
  officialCode: OfficialKboTeamCode;
  player: string;
};

const KBO_BASE_URL = "https://www.koreabaseball.com";
const KBO_STANDINGS_URL = "https://eng.koreabaseball.com/Standings/TeamStandings.aspx";
const KBO_SCHEDULE_URL = "https://eng.koreabaseball.com/Schedule/DailySchedule.aspx";
const KBO_BREAKING_NEWS_URL =
  "https://www.koreabaseball.com/MediaNews/News/BreakingNews/List.aspx";
const KBO_BATTING_LEADERS_URL =
  "https://eng.koreabaseball.com/Stats/BattingLeaders.aspx";
const KBO_PITCHING_LEADERS_URL =
  "https://eng.koreabaseball.com/Stats/PitchingLeaders.aspx";

const officialCodeBySlug = {
  doosan: "DOOSAN",
  hanwha: "HANWHA",
  kia: "KIA",
  kiwoom: "KIWOOM",
  kt: "KT",
  lg: "LG",
  lotte: "LOTTE",
  nc: "NC",
  samsung: "SAMSUNG",
  ssg: "SSG",
} as const satisfies Record<string, OfficialKboTeamCode>;

const ballparkNameMap = {
  CHANGWON: "Changwon",
  DAEGU: "Daegu",
  DAEJEON: "Daejeon",
  GOCHEOKSKY: "Gocheok Sky Dome",
  GWANGJU: "Gwangju",
  JAMSIL: "Jamsil",
  MUNHAK: "Munhak",
  POHANG: "Pohang",
  SAJIK: "Sajik",
  SUWON: "Suwon",
} as const satisfies Record<string, string>;

function extractSlugFromSourceUrl(sourceUrl: string) {
  const match = sourceUrl.match(/\/baseball\/([a-z-]+)/i);

  if (!match) {
    return null;
  }

  return match[1].split("-")[0]?.toLowerCase() ?? null;
}

function buildRuntimeTeamMap() {
  const teamMap = new Map<OfficialKboTeamCode, TeamRuntimeInfo>();

  for (const update of Object.values(mockBaseballUpdates)) {
    const slug = extractSlugFromSourceUrl(update.sourceUrl);

    if (!slug) {
      continue;
    }

    const officialCode =
      officialCodeBySlug[slug as keyof typeof officialCodeBySlug];

    if (!officialCode || teamMap.has(officialCode)) {
      continue;
    }

    teamMap.set(officialCode, {
      officialCode,
      team: update.team,
    });
  }

  return teamMap;
}

const runtimeTeamMap = buildRuntimeTeamMap();

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&middot;/g, "·")
    .replace(/&hellip;/g, "...")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, rawValue: string) =>
      String.fromCodePoint(Number(rawValue)),
    );
}

function stripHtmlTags(value: string) {
  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function getAttributeValue(tag: string, attributeName: string) {
  const match = tag.match(
    new RegExp(`${attributeName}=(["'])(.*?)\\1`, "i"),
  );

  return match?.[2]?.trim() || null;
}

function extractTable(html: string, summary: string, errorContext: string) {
  const tableMatch = html.match(
    new RegExp(
      `<table[^>]*summary=(["'])${summary}\\1[^>]*>([\\s\\S]*?)<\\/table>`,
      "i",
    ),
  );

  if (!tableMatch) {
    throw new Error(`${errorContext} is missing the ${summary} table.`);
  }

  return tableMatch[0];
}

function extractRowBlocks(tableHtml: string) {
  return tableHtml.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) ?? [];
}

function parseHtmlCells(rowHtml: string) {
  const cells: ParsedHtmlCell[] = [];
  const cellPattern = /<(td|th)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null = null;

  while ((match = cellPattern.exec(rowHtml)) !== null) {
    const [, , rawAttributes, rawInnerHtml] = match;

    cells.push({
      text: stripHtmlTags(rawInnerHtml),
      title: getAttributeValue(rawAttributes, "title"),
    });
  }

  return cells;
}

function parseIntCell(value: string, errorContext: string) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${errorContext} returned an invalid numeric value: ${value}`);
  }

  return parsed;
}

function getRuntimeTeamInfo(officialCode: OfficialKboTeamCode) {
  const teamInfo = runtimeTeamMap.get(officialCode);

  if (!teamInfo) {
    throw new Error(`Missing runtime KBO team mapping for ${officialCode}.`);
  }

  return teamInfo;
}

function toKoreanStreak(streak: string) {
  const normalized = streak.trim().toUpperCase();
  const match = normalized.match(/^([WLD])(\d+)$/);

  if (!match) {
    return normalized;
  }

  const [, code, rawCount] = match;
  const count = Number.parseInt(rawCount, 10);

  if (code === "W") {
    return `${count}연승`;
  }

  if (code === "L") {
    return `${count}연패`;
  }

  return `${count}무`;
}

function formatStandingRecord(row: KboStandingRow) {
  return row.draw > 0
    ? `${row.wins}승 ${row.losses}패 ${row.draw}무`
    : `${row.wins}승 ${row.losses}패`;
}

function formatRecentRecord(row: KboStandingRow) {
  return `${formatStandingRecord(row)}, ${toKoreanStreak(row.streak)}`;
}

function formatMonthDayLabel(isoDate: string) {
  return `${Number.parseInt(isoDate.slice(5, 7), 10)}월 ${Number.parseInt(
    isoDate.slice(8, 10),
    10,
  )}일`;
}

function formatBallpark(location: string) {
  const normalized = location.trim().toUpperCase();

  return ballparkNameMap[normalized as keyof typeof ballparkNameMap] ?? location;
}

function formatLatestResult(officialCode: OfficialKboTeamCode, game: KboScheduleGame) {
  const [awayScore, homeScore] = game.scoreText
    .split(":")
    .map((score) => Number.parseInt(score, 10));
  const opponentCode =
    game.awayTeam === officialCode ? game.homeTeam : game.awayTeam;
  const opponent = getRuntimeTeamInfo(opponentCode).team;
  const teamScore = game.awayTeam === officialCode ? awayScore : homeScore;
  const opponentScore = game.awayTeam === officialCode ? homeScore : awayScore;
  const verb =
    teamScore > opponentScore
      ? "이겼습니다"
      : teamScore < opponentScore
        ? "졌습니다"
        : "비겼습니다";

  return `${formatMonthDayLabel(game.isoDate)} ${opponent}전에서 ${teamScore}:${opponentScore}로 ${verb}`;
}

function formatNextGame(
  officialCode: OfficialKboTeamCode,
  game: KboScheduleGame,
) {
  const opponentCode =
    game.awayTeam === officialCode ? game.homeTeam : game.awayTeam;
  const opponent = getRuntimeTeamInfo(opponentCode).team;

  return `${formatMonthDayLabel(game.isoDate)} ${game.time} ${opponent}전 (${formatBallpark(
    game.location,
  )})`;
}

function buildFallbackStory(
  selectedTeam: KboTeam,
  row: KboStandingRow,
  latestGame: KboScheduleGame | null,
) {
  const base = latestGame
    ? `${selectedTeam}는 ${formatLatestResult(row.officialCode, latestGame)}.`
    : `${selectedTeam}는 현재 ${row.rank}위입니다.`;

  return `${base} 현재 흐름은 ${toKoreanStreak(row.streak)}이며 시즌 성적은 ${formatStandingRecord(
    row,
  )}입니다.`;
}

function buildFallbackTitle(selectedTeam: KboTeam) {
  return `${selectedTeam} official KBO update`;
}

function buildFallbackPlayer(selectedTeam: KboTeam, row: KboStandingRow) {
  return `${selectedTeam} core lineup watch (${row.rank}위 흐름)`;
}

function parsePublishedDate(rawDate: string) {
  const trimmed = rawDate.trim();

  if (!trimmed) {
    return null;
  }

  const normalizedDate = trimmed.replace(/\./g, "-");

  return new Date(`${normalizedDate}T00:00:00.000+09:00`).toISOString();
}

function parseStandings(html: string) {
  const tableHtml = extractTable(
    html,
    "team standings",
    "KBO standings response",
  );
  const rows = extractRowBlocks(tableHtml).slice(1);

  return rows.map((rowHtml) => {
    const cells = parseHtmlCells(rowHtml);

    if (cells.length < 11) {
      throw new Error("KBO standings response returned an incomplete row.");
    }

    const officialCode = cells[1].text.trim().toUpperCase() as OfficialKboTeamCode;

    return {
      awayRecord: cells[10].text,
      draw: parseIntCell(cells[5].text, "KBO standings response"),
      games: parseIntCell(cells[2].text, "KBO standings response"),
      gb: cells[7].text,
      homeRecord: cells[9].text,
      losses: parseIntCell(cells[4].text, "KBO standings response"),
      officialCode,
      pct: cells[6].text,
      rank: parseIntCell(cells[0].text, "KBO standings response"),
      streak: cells[8].text,
      wins: parseIntCell(cells[3].text, "KBO standings response"),
    } satisfies KboStandingRow;
  });
}

function parseScheduleMonthContext(html: string) {
  const match = html.match(/\b(\d{4})\.(\d{2})\b/);

  if (!match) {
    throw new Error("KBO schedule response is missing the current month context.");
  }

  return {
    month: Number.parseInt(match[2], 10),
    year: Number.parseInt(match[1], 10),
  };
}

function buildScheduleIsoDate(
  year: number,
  currentMonth: number,
  dateLabel: string,
) {
  const match = dateLabel.match(/^(\d{2})\.(\d{2})/);

  if (!match) {
    throw new Error(`KBO schedule returned an invalid date label: ${dateLabel}`);
  }

  const [, rawMonth, rawDay] = match;
  let resolvedYear = year;
  const month = Number.parseInt(rawMonth, 10);
  const day = Number.parseInt(rawDay, 10);

  if (month < currentMonth) {
    resolvedYear += 1;
  }

  return new Date(
    `${resolvedYear}-${rawMonth}-${String(day).padStart(2, "0")}T00:00:00.000+09:00`,
  ).toISOString();
}

function parseSchedule(html: string) {
  const tableHtml = extractTable(html, "schdule", "KBO schedule response");
  const rowBlocks = extractRowBlocks(tableHtml).slice(1);
  const monthContext = parseScheduleMonthContext(html);
  const games: KboScheduleGame[] = [];
  let currentDateLabel = "";
  let currentType = "";

  for (const rowHtml of rowBlocks) {
    const cells = parseHtmlCells(rowHtml);
    let cursor = 0;

    if (cells[cursor]?.title === "DATE") {
      currentDateLabel = cells[cursor].text;
      cursor += 1;
    }

    if (cells[cursor]?.title === "TYPE") {
      currentType = cells[cursor].text;
      cursor += 1;
    }

    if (!currentDateLabel || cells.length - cursor < 8) {
      continue;
    }

    const awayTeam = cells[cursor + 1]?.text.trim().toUpperCase();
    const scoreText = cells[cursor + 2]?.text.trim();
    const homeTeam = cells[cursor + 3]?.text.trim().toUpperCase();

    if (!awayTeam || !scoreText || !homeTeam) {
      continue;
    }

    games.push({
      awayTeam: awayTeam as OfficialKboTeamCode,
      dateLabel: currentDateLabel,
      etc: cells[cursor + 7]?.text ?? "",
      homeTeam: homeTeam as OfficialKboTeamCode,
      isoDate: buildScheduleIsoDate(
        monthContext.year,
        monthContext.month,
        currentDateLabel,
      ),
      location: cells[cursor + 6]?.text ?? "",
      scoreText,
      time: cells[cursor]?.text ?? "",
      type: currentType,
    });
  }

  return games;
}

function parseBreakingNews(html: string) {
  const listMatch = html.match(
    /<ul[^>]*class=(["'])boardPhoto\1[^>]*>([\s\S]*?)<\/ul>/i,
  );

  if (!listMatch) {
    throw new Error("KBO breaking news response is missing the boardPhoto list.");
  }

  const items: KboNewsItem[] = [];
  const listHtml = listMatch[2];
  const itemPattern = /<li>([\s\S]*?)<\/li>/gi;
  let itemMatch: RegExpExecArray | null = null;

  while ((itemMatch = itemPattern.exec(listHtml)) !== null) {
    const itemHtml = itemMatch[1];
    const titleMatch = itemHtml.match(
      /<strong>\s*<a[^>]*href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>\s*<\/strong>/i,
    );
    const paragraphMatch = itemHtml.match(/<p>([\s\S]*?)<\/p>/i);
    const dateMatch = itemHtml.match(
      /<span[^>]*class=(["'])date\1[^>]*>([\s\S]*?)<\/span>/i,
    );

    if (!titleMatch) {
      continue;
    }

    const href = titleMatch[2].trim();
    const title = stripHtmlTags(titleMatch[3]);
    const paragraphText = paragraphMatch ? paragraphMatch[1] : "";
    const summary = stripHtmlTags(
      dateMatch ? paragraphText.replace(dateMatch[0], "") : paragraphText,
    );
    const publishedAt = dateMatch ? parsePublishedDate(stripHtmlTags(dateMatch[2])) : null;

    items.push({
      publishedAt,
      sourceName: "KBO News",
      sourceUrl: new URL(href, `${KBO_BASE_URL}/MediaNews/News/BreakingNews/`).toString(),
      summary,
      title,
    });
  }

  return items;
}

function parseLeaderRows(html: string, summary: string, errorContext: string) {
  const tableHtml = extractTable(html, summary, errorContext);
  const rows = extractRowBlocks(tableHtml).slice(1);

  return rows
    .map((rowHtml) => {
      const cells = parseHtmlCells(rowHtml);

      if (cells.length < 3) {
        return null;
      }

      return {
        officialCode: cells[2].text.trim().toUpperCase() as OfficialKboTeamCode,
        player: cells[1].text.trim(),
      } satisfies KboLeaderRow;
    })
    .filter((row): row is KboLeaderRow => row !== null);
}

function buildPlayerMap(battingRows: KboLeaderRow[], pitchingRows: KboLeaderRow[]) {
  const playerMap = new Map<OfficialKboTeamCode, string>();

  for (const row of battingRows) {
    if (!playerMap.has(row.officialCode)) {
      playerMap.set(row.officialCode, row.player);
    }
  }

  for (const row of pitchingRows) {
    if (!playerMap.has(row.officialCode)) {
      playerMap.set(row.officialCode, row.player);
    }
  }

  return playerMap;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildNewsMatchers(team: KboTeam, officialCode: OfficialKboTeamCode) {
  const matchers = new Set<string>([team.trim(), officialCode]);

  if (officialCode === "DOOSAN") {
    matchers.add("두산");
  } else if (officialCode === "HANWHA") {
    matchers.add("한화");
  } else if (officialCode === "KIWOOM") {
    matchers.add("키움");
  } else if (officialCode === "LOTTE") {
    matchers.add("롯데");
  } else if (officialCode === "SAMSUNG") {
    matchers.add("삼성");
  }

  return Array.from(matchers);
}

function matchesNewsForTeam(
  item: KboNewsItem,
  team: KboTeam,
  officialCode: OfficialKboTeamCode,
) {
  const haystack = `${item.title} ${item.summary}`;

  return buildNewsMatchers(team, officialCode).some((matcher) => {
    if (/^[A-Z]+$/.test(matcher)) {
      return new RegExp(`(^|[^A-Z])${escapeRegExp(matcher)}([^A-Z]|$)`).test(
        haystack.toUpperCase(),
      );
    }

    return haystack.includes(matcher);
  });
}

function findLatestCompletedGame(
  games: KboScheduleGame[],
  officialCode: OfficialKboTeamCode,
) {
  return [...games]
    .filter(
      (game) =>
        (game.awayTeam === officialCode || game.homeTeam === officialCode) &&
        /^\d+:\d+$/.test(game.scoreText),
    )
    .sort((left, right) => {
      const leftTimestamp = `${left.isoDate.slice(0, 10)}T${left.time}:00+09:00`;
      const rightTimestamp = `${right.isoDate.slice(0, 10)}T${right.time}:00+09:00`;

      return rightTimestamp.localeCompare(leftTimestamp);
    })[0] ?? null;
}

function findNextScheduledGame(
  games: KboScheduleGame[],
  officialCode: OfficialKboTeamCode,
  now: Date,
) {
  return [...games]
    .filter(
      (game) =>
        (game.awayTeam === officialCode || game.homeTeam === officialCode) &&
        game.scoreText === ":" &&
        game.etc.toUpperCase() !== "POSTPONED",
    )
    .sort((left, right) => {
      const leftTimestamp = `${left.isoDate.slice(0, 10)}T${left.time}:00+09:00`;
      const rightTimestamp = `${right.isoDate.slice(0, 10)}T${right.time}:00+09:00`;

      return leftTimestamp.localeCompare(rightTimestamp);
    })
    .find((game) => {
      const kickoff = new Date(
        `${game.isoDate.slice(0, 10)}T${game.time}:00+09:00`,
      );

      return kickoff.getTime() >= now.getTime();
    }) ?? null;
}

class MockBaseballProvider implements BaseballProvider {
  async getLeagueBrief(
    input: BaseballProviderInput,
  ): Promise<BaseballProviderResult> {
    const items = input.teams.map((team) => mockBaseballUpdates[team]);
    const standings = input.includeStandings
      ? mockBaseballStandings.filter((standing) =>
          input.teams.includes(standing.team),
        )
      : [];

    return {
      generatedAt: new Date().toISOString(),
      includeStandings: input.includeStandings,
      isMock: true,
      items,
      provider: "mock",
      standings,
      teams: input.teams,
    };
  }
}

class KboOfficialBaseballProvider implements BaseballProvider {
  async getLeagueBrief(
    input: BaseballProviderInput,
  ): Promise<BaseballProviderResult> {
    const [standingsHtml, scheduleHtml, newsHtml, battingHtml, pitchingHtml] =
      await Promise.all([
        this.fetchHtml(KBO_STANDINGS_URL, "KBO standings request"),
        this.fetchHtml(KBO_SCHEDULE_URL, "KBO schedule request"),
        this.fetchHtml(KBO_BREAKING_NEWS_URL, "KBO breaking news request"),
        this.fetchHtml(KBO_BATTING_LEADERS_URL, "KBO batting leaders request"),
        this.fetchHtml(KBO_PITCHING_LEADERS_URL, "KBO pitching leaders request"),
      ]);

    const standingsByCode = new Map(
      parseStandings(standingsHtml).map((row) => [row.officialCode, row]),
    );
    const scheduleGames = parseSchedule(scheduleHtml);
    const newsItems = parseBreakingNews(newsHtml);
    const playerMap = buildPlayerMap(
      parseLeaderRows(
        battingHtml,
        "batting leaders",
        "KBO batting leaders response",
      ),
      parseLeaderRows(
        pitchingHtml,
        "Pitching leaders",
        "KBO pitching leaders response",
      ),
    );
    const now = new Date();

    const items = input.teams.map((team) => {
      const teamInfo = Array.from(runtimeTeamMap.values()).find(
        (candidate) => candidate.team === team,
      );

      if (!teamInfo) {
        throw new Error(`Unsupported runtime KBO team mapping for ${team}.`);
      }

      const standingRow = standingsByCode.get(teamInfo.officialCode);

      if (!standingRow) {
        throw new Error(
          `KBO standings response is missing data for ${teamInfo.officialCode}.`,
        );
      }

      const latestGame = findLatestCompletedGame(scheduleGames, teamInfo.officialCode);
      const nextGame = findNextScheduledGame(
        scheduleGames,
        teamInfo.officialCode,
        now,
      );
      const newsItem =
        newsItems.find((item) =>
          matchesNewsForTeam(item, team, teamInfo.officialCode),
        ) ?? null;

      return {
        keyPlayer:
          playerMap.get(teamInfo.officialCode) ??
          buildFallbackPlayer(team, standingRow),
        keyStory:
          newsItem?.summary ||
          buildFallbackStory(team, standingRow, latestGame),
        latestResult: latestGame
          ? formatLatestResult(teamInfo.officialCode, latestGame)
          : `${team}의 최근 경기 결과를 KBO 일정표에서 찾지 못했습니다.`,
        nextGame: nextGame
          ? formatNextGame(teamInfo.officialCode, nextGame)
          : `${team}의 다음 경기 일정이 아직 등록되지 않았습니다.`,
        publishedAt: newsItem?.publishedAt ?? latestGame?.isoDate ?? null,
        recentRecord: formatRecentRecord(standingRow),
        sourceName: newsItem?.sourceName ?? "KBO Official Site",
        sourceUrl:
          newsItem?.sourceUrl ??
          (latestGame ? KBO_SCHEDULE_URL : KBO_STANDINGS_URL),
        team,
        title: newsItem?.title ?? buildFallbackTitle(team),
      } satisfies BaseballProviderItem;
    });

    const standings = input.includeStandings
      ? input.teams.map((team) => {
          const teamInfo = Array.from(runtimeTeamMap.values()).find(
            (candidate) => candidate.team === team,
          );

          if (!teamInfo) {
            throw new Error(`Unsupported runtime KBO team mapping for ${team}.`);
          }

          const standingRow = standingsByCode.get(teamInfo.officialCode);

          if (!standingRow) {
            throw new Error(
              `KBO standings response is missing data for ${teamInfo.officialCode}.`,
            );
          }

          return {
            rank: standingRow.rank,
            record: formatStandingRecord(standingRow),
            streak: toKoreanStreak(standingRow.streak),
            team,
          } satisfies BaseballStanding;
        })
      : [];

    return {
      generatedAt: new Date().toISOString(),
      includeStandings: input.includeStandings,
      isMock: false,
      items,
      provider: "kbo",
      standings,
      teams: input.teams,
    };
  }

  private async fetchHtml(rawUrl: string, errorContext: string) {
    return fetchProviderText(new URL(rawUrl), {
      errorContext,
      headers: {
        Accept: "text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8",
      },
    });
  }
}

export function createBaseballProvider(): BaseballProvider {
  const provider = getProviderSelection(process.env.BASEBALL_PROVIDER, "mock");

  if (provider === "mock") {
    return new MockBaseballProvider();
  }

  if (provider === "kbo") {
    return new KboOfficialBaseballProvider();
  }

  throw new Error(`Unsupported baseball provider: ${provider}`);
}
