import { z } from "zod";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Default Vercel AI Gateway URL
const DEFAULT_VERCEL_AI_GATEWAY_URL = "https://ai-gateway.vercel.sh/v1";

const envSchema = z.object({
  ELEVENLABS_API_KEY: z.string().min(1, "ELEVENLABS_API_KEY is required"),
  VERCEL_AI_GATEWAY_URL: z
    .string()
    .url("VERCEL_AI_GATEWAY_URL must be a valid URL")
    .optional(),
  VERCEL_AI_GATEWAY_API_KEY: z
    .string()
    .min(1, "VERCEL_AI_GATEWAY_API_KEY is required"),
  ELEVENLABS_VOICE_ID: z.string().optional(),
});

type EnvConfigRaw = z.infer<typeof envSchema>;

export type EnvConfig = Omit<EnvConfigRaw, "VERCEL_AI_GATEWAY_URL"> & {
  VERCEL_AI_GATEWAY_URL: string;
};

let cachedConfig: EnvConfig | null = null;

export function getEnvConfig(): EnvConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const result = envSchema.safeParse({
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    VERCEL_AI_GATEWAY_URL: process.env.VERCEL_AI_GATEWAY_URL,
    VERCEL_AI_GATEWAY_API_KEY: process.env.VERCEL_AI_GATEWAY_API_KEY,
    ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID,
  });

  if (!result.success) {
    const errors = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join("\n");
    throw new Error(`Environment validation failed:\n${errors}`);
  }

  cachedConfig = {
    ...result.data,
    VERCEL_AI_GATEWAY_URL:
      result.data.VERCEL_AI_GATEWAY_URL || DEFAULT_VERCEL_AI_GATEWAY_URL,
  };
  return cachedConfig;
}

export const GEMINI_TEMPERATURE = 0.8;
