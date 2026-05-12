import { mockBaseballStandings, mockBaseballUpdates } from "../../mocks/baseball";

import type {
  BaseballProvider,
  BaseballProviderInput,
  BaseballProviderResult,
} from "./types";

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

export function createBaseballProvider(): BaseballProvider {
  const provider = process.env.BASEBALL_PROVIDER?.trim() || "mock";

  if (provider !== "mock") {
    throw new Error(`Unsupported baseball provider: ${provider}`);
  }

  return new MockBaseballProvider();
}
