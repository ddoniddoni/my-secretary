import { getAiEnv } from "./env";
import {
  AiConfigurationError,
  AiRequestError,
  AiResponseValidationError,
} from "./errors";

export type AiJsonMessage = {
  role: "system" | "user";
  content: string;
};

export type AiJsonGenerationRequest = {
  model?: string;
  messages: AiJsonMessage[];
  temperature?: number;
};

export type AiJsonGenerationResult = {
  model: string;
  output: unknown;
  rawText: string;
};

type OpenAiChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?:
        | string
        | Array<{
            text?: string;
            type?: string;
          }>;
    };
  }>;
  model?: string;
};

export type StructuredAiClient = {
  generateJson: (
    request: AiJsonGenerationRequest,
  ) => Promise<AiJsonGenerationResult>;
};

function getResponseText(
  response: OpenAiChatCompletionResponse,
): string | null {
  const content = response.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const combined = content
      .map((item) => item.text?.trim())
      .filter((value): value is string => Boolean(value))
      .join("\n")
      .trim();

    return combined || null;
  }

  return null;
}

function extractJsonText(content: string) {
  const trimmed = content.trim();

  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return withoutFence;
}

export function createStructuredAiClient(
  fetchImplementation: typeof fetch = fetch,
): StructuredAiClient {
  let env: ReturnType<typeof getAiEnv>;

  try {
    env = getAiEnv();
  } catch (error) {
    throw new AiConfigurationError(
      error instanceof Error ? error.message : "AI environment is not ready.",
    );
  }

  return {
    async generateJson(request) {
      const response = await fetchImplementation(`${env.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: request.model ?? env.model,
          messages: request.messages,
          response_format: {
            type: "json_object",
          },
          temperature: request.temperature ?? 0.2,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new AiRequestError(
          errorText || "AI request failed.",
          response.status,
        );
      }

      const payload =
        (await response.json()) as OpenAiChatCompletionResponse | null;
      const rawText = payload ? getResponseText(payload) : null;

      if (!rawText) {
        throw new AiResponseValidationError(
          "AI response did not contain JSON content.",
        );
      }

      const normalizedText = extractJsonText(rawText);

      try {
        return {
          model: payload?.model ?? request.model ?? env.model,
          output: JSON.parse(normalizedText),
          rawText: normalizedText,
        };
      } catch (error) {
        throw new AiResponseValidationError(
          "AI response was not valid JSON.",
          error instanceof Error ? error.message : null,
        );
      }
    },
  };
}
