import type { KboTeam } from "../types/assistants";

export type MockBaseballTeamUpdate = {
  latestResult: string;
  keyPlayer: string;
  keyStory: string;
  nextGame: string;
  publishedAt: string;
  recentRecord: string;
  sourceName: string;
  sourceUrl: string;
  team: KboTeam;
  title: string;
};

export type MockBaseballStanding = {
  rank: number;
  record: string;
  streak: string;
  team: KboTeam;
};

export const mockBaseballStandings: MockBaseballStanding[] = [
  { rank: 1, team: "LG", record: "26승 14패", streak: "2연승" },
  { rank: 2, team: "KIA", record: "24승 15패", streak: "1연패" },
  { rank: 3, team: "SSG", record: "22승 18패", streak: "1연승" },
  { rank: 4, team: "롯데", record: "21승 19패", streak: "2연승" },
  { rank: 5, team: "삼성", record: "20승 20패", streak: "1연패" },
  { rank: 6, team: "두산", record: "19승 20패", streak: "1연승" },
  { rank: 7, team: "KT", record: "18승 21패", streak: "2연패" },
  { rank: 8, team: "한화", record: "17승 22패", streak: "1연승" },
  { rank: 9, team: "NC", record: "16승 23패", streak: "3연패" },
  { rank: 10, team: "키움", record: "14승 25패", streak: "2연패" },
];

export const mockBaseballUpdates: Record<KboTeam, MockBaseballTeamUpdate> = {
  LG: {
    latestResult: "LG가 주중 시리즈 첫 경기에서 6:3으로 승리했습니다.",
    keyPlayer: "오스틴",
    keyStory: "중심 타선이 득점권에서 집중력을 보이며 흐름을 가져갔습니다.",
    nextGame: "내일 잠실에서 SSG와 18:30 경기 예정",
    publishedAt: "2026-05-13T09:00:00.000Z",
    recentRecord: "최근 5경기 4승 1패",
    sourceName: "KBO Daily",
    sourceUrl: "https://example.com/baseball/lg-series",
    team: "LG",
    title: "LG가 타선 집중력으로 시리즈 기선을 잡았습니다.",
  },
  SSG: {
    latestResult: "SSG는 불펜 운영 속에 4:2 승리를 챙겼습니다.",
    keyPlayer: "최정",
    keyStory: "중심 타선 장타와 불펜 안정감이 경기 후반 흐름을 지켰습니다.",
    nextGame: "내일 문학에서 LG와 18:30 경기 예정",
    publishedAt: "2026-05-13T09:05:00.000Z",
    recentRecord: "최근 5경기 3승 2패",
    sourceName: "Diamond Note",
    sourceUrl: "https://example.com/baseball/ssg-bullpen",
    team: "SSG",
    title: "SSG가 후반 불펜 운영으로 리드를 지켰습니다.",
  },
  두산: {
    latestResult: "두산은 연장 접전 끝에 5:4 승리를 만들었습니다.",
    keyPlayer: "양의지",
    keyStory: "경기 후반 대타 카드와 배터리 운영이 승부를 갈랐습니다.",
    nextGame: "내일 잠실에서 롯데와 18:30 경기 예정",
    publishedAt: "2026-05-13T09:10:00.000Z",
    recentRecord: "최근 5경기 2승 3패",
    sourceName: "KBO Daily",
    sourceUrl: "https://example.com/baseball/doosan-extra",
    team: "두산",
    title: "두산이 연장전 집중력으로 분위기 반전을 노립니다.",
  },
  롯데: {
    latestResult: "롯데는 선발 호투를 앞세워 3:1 승리를 거뒀습니다.",
    keyPlayer: "나승엽",
    keyStory: "상하위 타선 연결이 살아나며 득점 루트가 선명해졌습니다.",
    nextGame: "내일 잠실에서 두산과 18:30 경기 예정",
    publishedAt: "2026-05-13T09:15:00.000Z",
    recentRecord: "최근 5경기 3승 2패",
    sourceName: "Busan Sports",
    sourceUrl: "https://example.com/baseball/lotte-series",
    team: "롯데",
    title: "롯데가 선발 호투와 수비 안정으로 상승세를 이어갑니다.",
  },
  KIA: {
    latestResult: "KIA는 화력전 끝에 8:7 승리를 가져왔습니다.",
    keyPlayer: "김도영",
    keyStory: "상위 타선의 출루와 장타 조합이 경기 분위기를 주도했습니다.",
    nextGame: "내일 광주에서 삼성과 18:30 경기 예정",
    publishedAt: "2026-05-13T09:20:00.000Z",
    recentRecord: "최근 5경기 4승 1패",
    sourceName: "Tiger Report",
    sourceUrl: "https://example.com/baseball/kia-offense",
    team: "KIA",
    title: "KIA가 공격적인 주루와 장타력으로 상위권 흐름을 유지했습니다.",
  },
  삼성: {
    latestResult: "삼성은 불펜 난조 속에 5:6으로 아쉽게 패했습니다.",
    keyPlayer: "구자욱",
    keyStory: "타선 생산력은 유지됐지만 경기 후반 제구 흔들림이 변수였습니다.",
    nextGame: "내일 광주에서 KIA와 18:30 경기 예정",
    publishedAt: "2026-05-13T09:25:00.000Z",
    recentRecord: "최근 5경기 2승 3패",
    sourceName: "Lions Daily",
    sourceUrl: "https://example.com/baseball/samsung-bullpen",
    team: "삼성",
    title: "삼성이 후반 불펜 과제를 안고 다음 경기를 맞습니다.",
  },
  한화: {
    latestResult: "한화는 7회 대량 득점으로 7:2 승리를 완성했습니다.",
    keyPlayer: "노시환",
    keyStory: "중심 타자 장타와 불펜 무실점이 동시에 나온 경기였습니다.",
    nextGame: "내일 대전에서 KT와 18:30 경기 예정",
    publishedAt: "2026-05-13T09:30:00.000Z",
    recentRecord: "최근 5경기 3승 2패",
    sourceName: "Eagles Wire",
    sourceUrl: "https://example.com/baseball/hanwha-power",
    team: "한화",
    title: "한화가 중후반 집중 득점으로 분위기를 끌어올렸습니다.",
  },
  KT: {
    latestResult: "KT는 타선 침묵 속에 2:4로 패했습니다.",
    keyPlayer: "강백호",
    keyStory: "출루는 만들었지만 장타 연결이 부족해 득점 효율이 떨어졌습니다.",
    nextGame: "내일 대전에서 한화와 18:30 경기 예정",
    publishedAt: "2026-05-13T09:35:00.000Z",
    recentRecord: "최근 5경기 1승 4패",
    sourceName: "Wiz Tracker",
    sourceUrl: "https://example.com/baseball/kt-offense",
    team: "KT",
    title: "KT는 타선 응집력 회복이 다음 시리즈 핵심 과제로 남았습니다.",
  },
  NC: {
    latestResult: "NC는 선발 교체 후 흐름을 넘기며 3:6으로 패했습니다.",
    keyPlayer: "박건우",
    keyStory: "초반 출발은 나쁘지 않았지만 중반 수비 실수가 겹쳤습니다.",
    nextGame: "내일 창원에서 키움과 18:30 경기 예정",
    publishedAt: "2026-05-13T09:40:00.000Z",
    recentRecord: "최근 5경기 1승 4패",
    sourceName: "Dino Club",
    sourceUrl: "https://example.com/baseball/nc-errors",
    team: "NC",
    title: "NC는 수비 안정과 선발 이닝 소화가 함께 필요한 상황입니다.",
  },
  키움: {
    latestResult: "키움은 젊은 타선이 분전했지만 4:5로 패했습니다.",
    keyPlayer: "송성문",
    keyStory: "초반 실점 이후 추격은 있었지만 불펜 부담이 끝내 남았습니다.",
    nextGame: "내일 창원에서 NC와 18:30 경기 예정",
    publishedAt: "2026-05-13T09:45:00.000Z",
    recentRecord: "최근 5경기 2승 3패",
    sourceName: "Heroes Watch",
    sourceUrl: "https://example.com/baseball/kiwoom-young-lineup",
    team: "키움",
    title: "키움은 젊은 타선의 활력과 경기 후반 운영을 함께 점검하고 있습니다.",
  },
};
