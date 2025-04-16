import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    HUGGING_FACE_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().min(1),
  },
  runtimeEnv: {
    HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  },
}); 