import { z } from "zod";

export const Item = z.object({ name: z.string(), cents: z.number() });
export type Item = z.infer<typeof Item>;
